// Libraries //////////////////////////////////////////////////////////////////////////////////////////
var fs = require('fs-extra'),
    express = require('express'),
    path = require('path'), //used to resolve __dirname
    mongodb = require('mongodb'),
    axios = require ('axios'), // http request library
    qs = require('qs'), //encode data to application/x-www-form-urlencoded format
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
    mlabUser = process.env.MLAB_USER,
    mlabPass = process.env.MLAB_PASS,
    captchaSecret = process.env.CAPTCHA_SECRET,
    uploadDirectory = __dirname + "/uploads",
    zipDirectory = __dirname + "/zip"

const bucketName = "ktvuploads"
const s3SongsBucketURL = " https://s3.us-east-2.amazonaws.com/ktv.songs/"
var mongoURL
environment === "production" ?
    mongoURL = "mongodb://" + mlabUser + ":" + mlabPass + "@ds127872.mlab.com:27872/heroku_0kfm3lp6" : mongoURL = "mongodb://localhost:27017/songs"
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

//express CORS header middleware
// Add headers
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 's3.us-east-2.amazonaws.com/ktv.songs/');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // // Set to true if you need the website to include cookies in the requests sent
    // // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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
    createZipDirectory();
    res.sendFile(__dirname + '/webpage/submit/index.html')
})
app.get('/uploadComplete', function(req, res) {
    res.sendFile(__dirname + '/webpage/uploadComplete/index.html')
    // getIP();
})



// send back a song.
app.get('/getSong', function(req, res) {
    var id = xssfilters.inHTMLData(req.query.id); //just in case they send me some  garbage ID
    var instru = false;
    if (req.query.instru) {
        instru = true
        console.log("sending Instrumental")
    }
    //Grab data about that song
    var MongoClient = mongodb.MongoClient;
    MongoClient.connect(mongoURL)
        .then((db) => {
            var collection = db.collection('songs');
            var query = { "file_name": id }
            var findOnePromise = collection.findOne(query, { file_name: 1, cn_char: 1, artist: 1, PrimaryLanguage: 1, PronounciationLanguage: 1, TranslatedLanguage: 1, songPath: 1, instrumentalPath: 1 })
            findOnePromise.then((result) => {
                console.log(result)
                db.close();
                res.writeHead(200, { 'Content-type': 'application/json' });
                var songPayload = {
                    Title: result.cn_char,
                    Artist: result.artist,
                    PrimaryLanguage: result.PrimaryLanguage,
                    PrimaryLanguageLyrics: [],
                    PronounciationLanguage: result.PronounciationLanguage,
                    PronounciationLanguageLyrics: [],
                    TranslatedLanguage: result.TranslatedLanguage,
                    TranslatedLanguageLyrics: [],
                    TimestampsLyrics: [],
                    songPath: s3SongsBucketURL + result.songPath
                };
                if(instru)
                	songPayload["instrumentalPath"] = s3SongsBucketURL + result.instrumentalPath
                var fileNames = ['PronounciationLanguage.txt', 'PrimaryLanguage.txt', 'TranslatedLanguage.txt', 'Timestamps.txt'];
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
                                songPayload[path.parse(fileName).name + "Lyrics"] = fileContent;
                                resolve()
                            })
                            .catch((err) => {
                                console.log(searchGlob + " most likely DOES NOT exist.")
                                // console.log(err)
                                songPayload[path.parse(fileName).name + "Lyrics"] = "";
                                resolve();
                            })
                    }))
                })

                // //grab the mp3
                // let fetchSongPromise = (instru)=>{
                //     new Promise((resolve, reject) => {
                //         let searchGlob;
                //         searchGlob = 'songs/' + id + '*/*.mp3'    

                //         glob(searchGlob)
                //             .then((contents) => {
                //                 // songPayload['songPath'] = contents[0].split("songs/")[1];
                //                 songPayload['songPath'] = "https://s3.us-east-2.amazonaws.com/ktv.songs/Backstreet+Freestyle+-+Kendrick+Lamar.mp3"
                //                 resolve();
                //             })
                //             .catch((err) => {
                //                 console.log(searchGlob + " most likely DOES NOT exist.")
                //                 songPayload['songPath'] = "mp3 file not found";
                //                 resolve()
                //             })
                //     })
                // }
                // getFilesPromises.push(fetchSongPromise(instru))
                // if (instru) {
                //     //grab the mp3
                //     var fetchInstrumentalPromise = (instru) => {
                //         new Promise((resolve, reject) => {
                //             let searchGlob;
                //             searchGlob = 'songs/' + id + '*/Instrumental/*.mp3'

                //             glob(searchGlob)
                //                 .then((contents) => {
                //                     songPayload['instrumentalPath'] = contents[0].split("songs/")[1];
                //                     resolve();
                //                 })
                //                 .catch((err) => {
                //                     console.log(searchGlob + " most likely DOES NOT exist.")
                //                     songPayload['instrumentalPath'] = "mp3 file not found";
                //                     resolve()
                //                 })
                //         })
                //     }
                //     getFilesPromises.push(fetchInstrumentalPromise(instru))
                // }


                Promise.all(getFilesPromises).then(() => {
                        res.end(JSON.stringify(songPayload, 'utf-8'));
                    })
                    .catch(() => {
                        res.end(JSON.stringify(songPayload, 'utf-8'));
                    })

            })
        })
        .catch((err) => {
            var placeholder = {
                Title: "Error",
                Artist: "Error",
                PrimaryLanguage: "Error",
                PrimaryLanguageLyrics: ["Error"],
                PronounciationLanguage: "Error",
                PronounciationLanguageLyrics: ["Error"],
                TranslatedLanguage: "Error",
                TranslatedLanguageLyrics: ["Error"],
                TimestampsLyrics: [],
                songPath: ""
            };
            res.send(placeholder);
            if (typeof db !== 'undefined')
                db.close();
            console.log('/getSong: unable to connect to server', err);
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
            if (typeof db !== 'undefined')
                db.close();
            console.log('/artists: unable to connect to server', err);
        })
})

app.get('/language', function(req, res) {
    var MongoClient = mongodb.MongoClient;
    MongoClient.connect(mongoURL)
        .then((db) => {
            var collection = db.collection('songs');
            var query = [{ $sort: { PrimaryLanguage: -1 } }, { $group: { _id: "$PrimaryLanguage", artist: { $push: "$$ROOT" } } }]
            var cursor = collection.aggregate(query);
            cursor.toArray()
                .then((result) => {
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
            if (typeof db !== 'undefined')
                db.close();
            console.log('/artists: unable to connect to server', err);
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
            var cursor = collection.find(query, { file_name: 1, cn_char: 1, artist: 1, instrumentalPath: 1}).sort({ cn_char: 1 })
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
            if (typeof db !== 'undefined')
                db.close();
            console.log('/query: unable to connect to server', err);
        })

});


app.post('/upload', upload.single('audioFile'), function(req, res) {

    var payload = JSON.parse(req.body.payload)
    var userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var captcha = xssfilters.inHTMLData(payload.captcha)
    var songName = xssfilters.inHTMLData(payload.song)
    var artist = xssfilters.inHTMLData(payload.artist)
    var primaryLanguageLyrics = xssfilters.inHTMLData(payload.primaryLanguageLyrics)
    var pronounciationLyrics = xssfilters.inHTMLData(payload.pronounciationLyrics)
    var translatedLyrics = xssfilters.inHTMLData(payload.translatedLyrics)
    var times = xssfilters.inHTMLData(payload.times)

    verifyCaptcha(captcha, userIP)
        .then((response)=>{
            console.log("Captcha Response: " + response.statusText)
            
            var lineSeparator = "\n=========================================================================\n"
            var submitDate = Date.now()
            var fileName = submitDate + ' ' + songName + '-' + artist + '.txt'

            var primaryLanguageFile = fs.writeFile(uploadDirectory + "/" + "PrimaryLanguage " + fileName, primaryLanguageLyrics)
            var pronounciationLanguageFile = fs.writeFile(uploadDirectory + "/" + "PronounciationLanguage " + fileName, pronounciationLyrics)
            var translationLanguageFile = fs.writeFile(uploadDirectory + "/" + "TranslatedLanguage " + fileName, translatedLyrics)
            var timesFile = fs.writeFile(uploadDirectory + "/" + "Timestamps " + fileName, times)

            Promise.all([primaryLanguageFile, pronounciationLanguageFile, translationLanguageFile, timesFile])
                .then(() => {
                    res.send({ redirect: "/uploadComplete" })
                    return zipFiles(songName, artist, submitDate)
                })
                .then((absoluteFilePath) => {
                    console.log("uploading to S3")
                    return uploadToS3(absoluteFilePath)
                })
                .then((s3URL) => {
                    console.log("sending Email")
                    return sendRawEmail(fromEmail, songName, artist, s3URL)
                })
                .then(() => {
                    console.log("Emptying Upload Dir")
                    return fs.emptyDir(uploadDirectory)
                })
                .then(() => {
                    console.log("Emptying zipDirectory")
                    return fs.emptyDir(zipDirectory)
                })
                .catch((err) => {
                    console.log(err)
                    if (!res.headersSent)
                        res.send({ message: "We encountered a problem. Please contact and send Will Wen these files directly." })
                    return;
                })
        })
        .catch((err)=>{
            if (!res.headersSent)
                res.send({ message: "Your Captcha was incorrect. Please retry submitting" })
            })
})

////////////////////////////////////////////////////////////////////////////////////////
//Verify Captcha User inputted against Google Server.
//return a promise
function verifyCaptcha(captcha, userIP){
    const endpoint = "https://www.google.com/recaptcha/api/siteverify"
    var payload = {secret: captchaSecret, response: captcha, remoteip: userIP}
    return axios.post(endpoint, qs.stringify(payload))
}

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
        var fileName = submitDate + ".zip"
        var absoluteFilePath = zipDirectory + "/" + fileName
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
        try {
            if (!fs.existsSync(uploadDirectory)) {
                fs.mkdirSync(uploadDirectory);
                console.log("created " + uploadDirectory)
            }
            resolve()
        } catch (err) {
            console.log(err)
            reject(err);
        }
    })
}

function createZipDirectory() {
    return new Promise((resolve, reject) => {
        try {
            if (!fs.existsSync(zipDirectory)) {
                fs.mkdirSync(zipDirectory);
                console.log("created " + zipDirectory)
            }
            resolve()
        } catch (err) {
            console.log(err)
            reject(err);
        }
    })
}

///////////////////////////////////////////////////////////
//getting client's IP address
///https://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
// function getIP(){
//     var ip;
//     if (req.headers['x-forwarded-for']) {
//         ip = req.headers['x-forwarded-for'].split(",")[0];
//     } else if (req.connection && req.connection.remoteAddress) {
//         ip = req.connection.remoteAddress;
//     } else {
//         ip = req.ip;
//     }
//     console.log("client IP is" + ip);
// }

///////////////////////////////////////////////////////////
// Process Cleanup on signal interrupt
//https://stackoverflow.com/questions/10021373/what-is-the-windows-equivalent-of-process-onsigint-in-node-js
if (process.platform === "win32") {
    var rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function() {
        process.emit("SIGINT");
    });
}

process.on("SIGINT", function() {
    server.close();
    console.log("Closed Server, Process Exiting.")
    //graceful shutdown
    process.exit();
});



