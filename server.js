var url = require('url'),
    fs = require('fs-extra'),
    querystring = require('querystring'),
    express = require('express'),
    port = 8080,
    mongodb = require('mongodb'),
    xssfilters = require('xss-filters'),
    // bodyParser = require('body-parser'),
    multer = require('multer'),
    glob = require("glob"),
    aws = require('aws-sdk'),
    archiver = require('archiver'),
    escapeStringRegexp = require('escape-string-regexp');

var environment = process.env.NODE_ENV
var mongoURL;
if (environment === "production") {
    mongoURL = "mongodb://readonly:readonly@ds127872.mlab.com:27872/heroku_0kfm3lp6"
} else { //development or undefined
    mongoURL = "mongodb://localhost:27017/songs"
    //Usign Docker? Use this:
    // mongoURL= "mongodb://mongodb:27017/songs"
}

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

// https://github.com/expressjs/multer
// Multer is a node.js middleware for handling multipart/form-data
var uploadDirectory = __dirname + "/uploads";

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}
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

//Amazon SES (Simple Email Service)
var fromEmail = process.env.EMAIL
aws.config.update({ region: 'us-east-1' });

var ses = new aws.SES();

// Sending RAW email including an attachment.
function sendRawEmail(email) {
    var ses_mail = "From: ktvgod.me' <" + email + ">\n";
    ses_mail = ses_mail + "To: " + email + "\n";
    ses_mail = ses_mail + "Subject: New Song Submission\n";
    ses_mail = ses_mail + "MIME-Version: 1.0\n";
    ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
    ses_mail = ses_mail + "--NextPart\n";
    ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
    ses_mail = ses_mail + "This is the body of the email.\n\n";
    ses_mail = ses_mail + "--NextPart\n";
    // ses_mail = ses_mail + "Content-Type: audio/mp3;\n";
    ses_mail = ses_mail + "Content-Disposition: attachment; filename=\"song.zip\"\n\n";
    ses_mail = ses_mail + fs.readFileSync("1.zip").toString() + "\n\n";
    ses_mail = ses_mail + "--NextPart--";
    // var params = {
    //     Destinations: [email],
    //     FromArn: "",
    //     RawMessage: {
    //         Data: < Binary String >
    //     },
    //     ReturnPathArn: "",
    //     Source: "",
    //     SourceArn: ""
    // };

    var params = {
        RawMessage: { Data: new Buffer(ses_mail) },
        Destinations: [email],
        Source: "'ktvgod.me' <" + email + ">'"
    };

    ses.sendRawEmail(params, function(err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log("sent email! " + data)
        }
    });
};

// sendRawEmail(fromEmail);

// console.log()
// var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
// var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
var server = app.listen(process.env.PORT || port, function() {
    console.log('Listening on port %s!', server.address().port)
})

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
    res.sendFile(__dirname + '/webpage/submit/index.html')
})
app.get('/uploadComplete', function(req, res) {
    res.sendFile(__dirname + '/webpage/uploadComplete/index.html')
})




app.get('/getSong', function(req, res) {
    var id = xssfilters.inHTMLData(req.query.id); //just in case they send me some  garbage ID
    res.writeHead(200, { 'Content-type': 'application/json' });
    var lyrics = {};
    var files = ['pinyin.txt', 'cn.txt', 'eng.txt', 'times.txt'];
    files.forEach(function(item) {
        try {

            var files = glob.sync('songs/' + id + '*/' + id + ' ' + item)
            console.log(files)
            lyrics[item] = fs.readFileSync(files[0]).toString().split("\n");

        } catch (err) {
            console.log("File most likely DOES NOT exist.")
            console.log(err)
            lyrics[item] = "";
        }
    })
    glob('songs/' + id + '*/*.mp3', function(err, files) {
        if (err) {
            lyrics['songFile'] = "mp3 file not found"
            throw err
        } else {
            try {
                lyrics['songFile'] = files[0].split("songs/")[1]
            } catch (err) {
                lyrics['songFile'] = "mp3 file not found"
            }

        }

        res.end(JSON.stringify(lyrics, 'utf-8'));
    })
});

app.get('/artists', function(req, res) {
    var MongoClient = mongodb.MongoClient;
    var url = mongoURL

    MongoClient.connect(url, function(err, db) {
        if (err)
            console.log('unable to connect to server', err);
        else {
            console.log('connection established');
            var collection = db.collection('songs');
            var query = [{ $sort: { artist: -1 } }, { $group: { _id: "$artist", songs: { $push: "$$ROOT" } } }]
            try {
                collection.aggregate(query).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                    res.send(result);
                    db.close();
                });
            } catch (err) {
                console.log(err);
                var placeholder = [];
                placeholder.push({
                    _id: 9999,
                    title_pinyin: 'No Results Found',
                    cn_char: 'No Results Found',
                    file_name: '1',
                    artist: '',
                    artist_pinyin: '',
                    searchTerm: 'No Results Found'
                });
                res.send(placeholder);
                db.close();
            }
        }
    })
})


app.get('/query', function(req, res) {
    var MongoClient = mongodb.MongoClient;
    var url = mongoURL

    //dont inject me...
    var cleansedQuery = xssfilters.inHTMLData(req.query.search);
    //and dont fail a regex
    cleansedQuery = escapeStringRegexp(cleansedQuery);
    console.log(cleansedQuery);

    MongoClient.connect(url, function(err, db) {
        if (err)
            console.log('unable to connect to server', err);
        else {
            console.log('connection established');
            var collection = db.collection('songs');
            var regexValue = '\.*' + cleansedQuery + '\.';
            var query = { "searchTerm": { $regex: new RegExp(regexValue, 'i') } }
            try {
                collection.find(query, { file_name: 1, cn_char: 1, artist: 1 }).sort({ cn_char: -1 }).toArray(function(err, result) {
                    if (err) throw err;
                    // console.log(result);
                    res.send(result);
                    db.close();
                });
            } catch (err) {
                console.log(err);
                var placeholder = [];
                placeholder.push({
                    _id: 9999,
                    title_pinyin: 'No Results Found',
                    cn_char: 'No Results Found',
                    file_name: '1',
                    artist: '',
                    artist_pinyin: '',
                    searchTerm: 'No Results Found'
                });
                res.send(placeholder);
                db.close();
            }
        }
    })
});


app.post('/upload', upload.single('audioFile'), function(req, res) {
    var payload = JSON.parse(req.body.payload)
    console.log(req.file)
    var songName = payload.song
    var artist = payload.artist
    var cnLyrics = payload.cnLyrics
    var pinyinLyrics = payload.pinyinLyrics
    var engLyrics = payload.engLyrics
    var times = payload.times

    var lineSeparator = "\n=========================================================================\n"
    var fileName = Date.now() + ' ' + songName + '-' + artist + '.txt'
    fs.writeFile(uploadDirectory + "/" + fileName,
        cnLyrics + lineSeparator + pinyinLyrics + lineSeparator + engLyrics + lineSeparator + times,
        function(err) {
            if (err) {
                res.send({ redirect: "/error" })
                return console.log(err);
            }
            // zipFiles();
            res.send({ redirect: "/uploadComplete" })
        });
})



function zipFiles() {
	var archive = archiver('zip', {
	    zlib: { level: 9 } // Sets the compression level.
	});

	// good practice to catch warnings (ie stat failures and other non-blocking errors)
	archive.on('warning', function(err) {
	    if (err.code === 'ENOENT') {
	        // log warning
	    } else {
	        // throw error
	        throw err;
	    }
	});

	var output = fs.createWriteStream(__dirname + '/' + 'song.zip');

	// listen for all archive data to be written
	// 'close' event is fired only when a file descriptor is involved
	output.on('close', function() {
	    console.log(archive.pointer() + ' total bytes');
	    console.log('archiver has been finalized and the output file descriptor has closed.');
	    console.log('clearing ' + uploadDirectory)
	    fs.removeSync(uploadDirectory)
	});

	// This event is fired when the data source is drained no matter what was the data source.
	// It is not part of this library but rather from the NodeJS Stream API.
	// @see: https://nodejs.org/api/stream.html#stream_event_end
	output.on('end', function() {
	    console.log('Data has been drained');
	});

	// pipe archive data to the file
	archive.pipe(output);

	archive.directory(uploadDirectory, false);

	archive.finalize();

}


