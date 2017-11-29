// Libraries //////////////////////////////////////////////////////////////////////////////////////////
var fs = require('fs-extra'),
    express = require('express'),
    path = require('path'), //used to resolve __dirname
    mongodb = require('mongodb'),
    xssfilters = require('xss-filters'),
    // bodyParser = require('body-parser'),
    multer = require('multer'), // https://github.com/expressjs/multer ; Multer is a node.js middleware for handling multipart/form-data
    glob = require("glob-promise"), // see linux file globbing
    archiver = require('archiver'), // zip up uploads
    aws = require('aws-sdk'), // s3 and SES
    nodemailer = require('nodemailer'), // contains SES Transporter
    escapeStringRegexp = require('escape-string-regexp'); // using regex query against mongodb, make sure it is escaped first

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var port = 8080,
    environment = process.env.NODE_ENV,
    fromEmail = process.env.EMAIL,
    uploadDirectory = __dirname + "/uploads"

const bucketName = "ktvuploads"
var mongoURL
environment === "production" ?
    mongoURL = "mongodb://readonly:readonly@ds127872.mlab.com:27872/heroku_0kfm3lp6" : mongoURL = "mongodb://localhost:27017/songs"
//Usign Docker? Use this:
// mongoURL= "mongodb://mongodb:27017/songs"


//Express Setup//////////////////////////////////////////////////////////////////////////////////////////////////
var app = express();

app.use(express.static('webpage/index'))
app.use(express.static('webpage/submit'))
app.use(express.static('webpage/song'))
app.use(express.static('webpage/treesearch'))
app.use(express.static('webpage/common'))
app.use(express.static('webpage/timepicker'))
app.use(express.static('webpage/about'))
app.use(express.static('songs'))
app.use(express.static('favicons'))
app.use(express.static('dist'))
app.use(express.static('images'))

//Express Middleware //////////////////////////////////////////////////////////////////////////////////////////////
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDirectory)
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + ".mp3")
    }
})
var upload = multer({ storage: storage })

// configure the app to use bodyParser()
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json());


// Amazon SDK Setup //////////////////////////////////////////////////////////////////////////////////////////
//config region. SES is not in us-east-2
aws.config.update({ region: 'us-east-1' });
// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
    //Amazon SES (Simple Email Service)
    SES: new aws.SES({
        // AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY must be Env Variables
        apiVersion: '2010-12-01'
    })
});
// Create S3 service object
s3 = new aws.S3({ apiVersion: '2006-03-01' });



//Start Express Server //////////////////////////////////////////////////////////////////////////////////////////
var server = app.listen(process.env.PORT || port, function() {
    console.log('Listening on port %s!', server.address().port)
})


// Express Routes ////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/treefind', function(req, res) {
    res.sendFile(__dirname + '/webpage/treesearch/treesearch.html')
})
app.get('/timepicker', function(req, res) {
    res.sendFile(__dirname + '/webpage/timepicker/index.html')
})
app.get('/about', function(req, res) {
    res.sendFile(__dirname + '/webpage/about/index.html')
})
app.get('/song', function(req, res) {
    res.sendFile(__dirname + '/webpage/song/index.html')
});
app.get('/submit', function(req, res) {
    createUploadDirectory()
    res.sendFile(__dirname + '/webpage/submit/index.html')
})
app.get('/uploadComplete', function(req, res) {
    res.sendFile(__dirname + '/webpage/uploadComplete/index.html')
})



// send back a song.
app.get('/getSong', function(req, res) {
    var id = xssfilters.inHTMLData(req.query.id); //just in case they send me some  garbage ID
    res.writeHead(200, { 'Content-type': 'application/json' });
    var lyrics = {};
    var fileNames = ['pinyin.txt', 'cn.txt', 'eng.txt', 'times.txt'];
    //dont use traditional for loop or else you'll have closure problems :)
    var getFilesPromises = []
    fileNames.forEach(function(fileName) {
        getFilesPromises.push(new Promise((resolve, reject) => {
            let searchGlob = 'songs/' + id + '*/' + id + ' ' + fileName
            glob(searchGlob)
                .then((contents) => {
                    return fs.readFile(contents[0])
                })
                .then((buffer) => {
                    fileContent = buffer.toString().split("\n");
                    lyrics[fileName] = fileContent;
                    resolve()
                })
                .catch((err) => {
                    console.log(searchGlob + " most likely DOES NOT exist.")
                    // console.log(err)
                    lyrics[fileName] = "";
                    resolve();
                })
        }))
    })

    //grab the mp3
    var fetchSongPromise = new Promise((resolve, reject) => {
        let searchGlob = 'songs/' + id + '*/*.mp3'
        glob(searchGlob)
            .then((contents) => {
                lyrics['songFile'] = contents[0].split("songs/")[1];
                resolve();
            })
            .catch((err) => {
                console.log(searchGlob + " most likely DOES NOT exist.")
                lyrics['songFile'] = "mp3 file not found";
                resolve()
            })
    })
    getFilesPromises.push(fetchSongPromise)

    Promise.all(getFilesPromises).then(() => {
            res.end(JSON.stringify(lyrics, 'utf-8'));
        })
        .catch(() => {
            res.end(JSON.stringify(lyrics, 'utf-8'));
        })
});


app.get('/artists', function(req, res) {
    var MongoClient = mongodb.MongoClient;
    MongoClient.connect(mongoURL)
        .then((db) => {
            var collection = db.collection('songs');
            var query = [{ $sort: { artist: -1 } }, { $group: { _id: "$artist", songs: { $push: "$$ROOT" } } }]
            var cursor = collection.aggregate(query);
            cursor.toArray()
                .then((result) => {
                    res.send(result);
                    db.close();
                })

        })
        .catch((err) => {
            console.log(err);
            var placeholder = [{
                _id: 9999,
                title_pinyin: 'No Results Found',
                cn_char: 'No Results Found',
                file_name: '1',
                artist: '',
                artist_pinyin: '',
                searchTerm: 'No Results Found'
            }];
            res.send(placeholder);
            db.close();
        })
})


app.get('/query', function(req, res) {
    var MongoClient = mongodb.MongoClient;
    //dont inject me...
    var cleansedQuery = xssfilters.inHTMLData(req.query.search);
    //and dont fail a regex
    cleansedQuery = escapeStringRegexp(cleansedQuery);

    MongoClient.connect(mongoURL)
        .then((db) => {
            var collection = db.collection('songs');
            var regexValue = '\.*' + cleansedQuery + '\.';
            var query = { "searchTerm": { $regex: new RegExp(regexValue, 'i') } }
            var cursor = collection.find(query, { file_name: 1, cn_char: 1, artist: 1 }).sort({ cn_char: -1 })
            cursor.toArray().then((result) => {
                res.send(result);
                db.close();
            })
        })
        .catch((err) => {
            var placeholder = [{
                _id: 9999,
                title_pinyin: 'No Results Found',
                cn_char: 'No Results Found',
                file_name: '1',
                artist: '',
                artist_pinyin: '',
                searchTerm: 'No Results Found'
            }];
            res.send(placeholder);
            db.close();
            console.log('unable to connect to server', err);
        })

});


app.post('/upload', upload.single('audioFile'), function(req, res) {
    var payload = JSON.parse(req.body.payload)
    //logthe mp3 file
    console.log(req.file)
    var songName = payload.song
    var artist = payload.artist
    var cnLyrics = payload.cnLyrics
    var pinyinLyrics = payload.pinyinLyrics
    var engLyrics = payload.engLyrics
    var times = payload.times

    var lineSeparator = "\n=========================================================================\n"
    var submitDate = Date.now()
    var fileName = submitDate + ' ' + songName + '-' + artist + '.txt'
    var fileContent = cnLyrics + lineSeparator + pinyinLyrics + lineSeparator + engLyrics + lineSeparator + times
    fs.writeFile(uploadDirectory + "/" + fileName, fileContent)
        .then(() => {
            res.send({ redirect: "/uploadComplete" })
            return zipFiles(songName, artist, submitDate)
        })
        .catch(() => {
            res.send({ message: "We encountered a problem. Please contact and send Will Wen these files directly." })
            return console.log(err);
        })
        .then((absoluteFilePath) => {
            return uploadToS3(absoluteFilePath)
        })
        .then((s3URL) => {
            return sendRawEmail(fromEmail, songName, artist, s3URL)
        })
        .then(() => {
            return fs.remove(uploadDirectory)
        })
        .then(() => {
            return createUploadDirectory()
        })
        .catch((err) => {
            console.log(err)
        })
})

// Zip up file ////////////////////////////////////////////////////////////////////////////////////////

function zipFiles(songName, artist, submitDate) {
    return new Promise((resolve, reject) => {
        var archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level. 9 is best compression
        });

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                // log warning
            } else {
                // throw error
                reject(err);
            }
        });
        var fileName = songName + " " + artist + " " + submitDate + ".zip"
        var absoluteFilePath = uploadDirectory + '/' + fileName
        var output = fs.createWriteStream(absoluteFilePath);

        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function() {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            resolve(absoluteFilePath)
        });

        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        output.on('end', function() {
            reject('Data has been drained');
        });

        // pipe archive data to the file
        archive.pipe(output);

        archive.directory(uploadDirectory, false);

        archive.finalize();
    })
}


function uploadToS3(absoluteFilePath) {
    return new Promise((resolve, reject) => {
        // call S3 to retrieve upload file to specified bucket
        var uploadParams = { Bucket: bucketName, Key: '', Body: '' };
        var fileStream = fs.createReadStream(absoluteFilePath);
        fileStream.on('error', function(err) {
            reject(err);
        });
        uploadParams.Body = fileStream;
        uploadParams.Key = path.basename(absoluteFilePath);

        // call S3 to retrieve upload file to specified bucket
        s3.upload(uploadParams, function(err, data) {
            if (err) {
                reject(err);
            }
            if (data) {
                console.log("uploaded to S3 @ " + data.Location)
                resolve(data.Location);
            }
        });
    })

}

// Sending RAW email including an attachment.
function sendRawEmail(email, songName, artist, s3URL) {
    return new Promise((resolve, reject) => {
        // send some mail
        transporter.sendMail({
            from: email,
            to: email,
            subject: 'New KTV Song ' + songName + '-' + artist,
            text: songName + '-' + artist + ' was submitted @ ' + new Date() + "\n" + "View at:\n" + s3URL,
            ses: { // optional extra arguments for SendRawEmail
            }
        }, (err, info) => {
            if (err) {
                reject(err)
            }
            console.log(info.envelope);
            console.log(info.messageId);
            resolve(info.envelope)
        });
    })
};

function createUploadDirectory() {
    return new Promise((resolve, reject) => {
        try{
            if (!fs.existsSync(uploadDirectory)) {
                fs.mkdirSync(uploadDirectory);
                console.log("created " + uploadDirectory)
            }
            resolve()
        }
        catch (err){
            reject(err);
        }
    })
}