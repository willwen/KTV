// Libraries //////////////////////////////////////////////////////////////////////////////////////////
var fs = require('fs-extra'),
    express = require('express'),
    path = require('path'), //used to resolve __dirname
    mongodb = require('mongodb'),
    xssfilters = require('xss-filters'),
    // bodyParser = require('body-parser'),
    glob = require("glob-promise"), // see linux file globbing
    escapeStringRegexp = require('escape-string-regexp'); // using regex query against mongodb, make sure it is escaped first

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var port = 8080,
    environment = process.env.NODE_ENV,
    mlabUser = process.env.MLAB_USER,
    mlabPass = process.env.MLAB_PASS

const bucketName = require('./constants.js').bucketName
const s3SongsBucketURL = require('./constants.js').s3SongsBucketURL

var mongoURL;
environment === "production" ?
    mongoURL = "mongodb://" + mlabUser + ":" + mlabPass + "@ds127872.mlab.com:27872/heroku_0kfm3lp6" : mongoURL = "mongodb://localhost:27017/songs"
//Usign Docker? Use this:
// mongoURL= "mongodb://mongodb:27017/songs"


//Express Setup//////////////////////////////////////////////////////////////////////////////////////////////////
var app = express();

app.use(express.static(path.join(__dirname ,'webpage/index')))
app.use(express.static(path.join(__dirname ,'webpage/submit')))
app.use(express.static(path.join(__dirname ,'webpage/song')))
app.use(express.static(path.join(__dirname ,'webpage/treesearch')))
app.use(express.static(path.join(__dirname ,'webpage/common')))
app.use(express.static(path.join(__dirname ,'webpage/timepicker')))
app.use(express.static(path.join(__dirname ,'webpage/about')))
app.use(express.static(path.join(__dirname ,'songs')))
app.use(express.static(path.join(__dirname ,'favicons')))
app.use(express.static(path.join(__dirname ,'dist')))
app.use(express.static(path.join(__dirname ,'images')))
app.use('/contribution', require('./contribution.js'))
app.use('/login', require('./login.js'))
//Express Middleware //////////////////////////////////////////////////////////////////////////////////////////////

// configure the app to use bodyParser()
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json());


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


//Start Express Server //////////////////////////////////////////////////////////////////////////////////////////
var server = app.listen(process.env.PORT || port, function() {
    console.log('Listening on port %s!', server.address().port)
})


// Express Routes ////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/treefind', function(req, res) {
    res.sendFile(__dirname + '/webpage/treesearch/index.html')
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



