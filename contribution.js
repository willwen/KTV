var archiver = require('archiver'), // zip up uploads
    aws = require('aws-sdk'), // s3 and SES
    nodemailer = require('nodemailer'), // contains SES Transporter
    path = require('path'), //used to resolve __dirname
    multer = require('multer'), // https://github.com/expressjs/multer ; Multer is a node.js middleware for handling multipart/form-data
    fs = require('fs-extra'),
	express = require('express'),
	xssfilters = require('xss-filters'),
    axios = require ('axios'), // http request library
    qs = require('qs') //encode data to application/x-www-form-urlencoded format

var fromEmail = process.env.EMAIL,
    uploadDirectory = path.join(__dirname, "uploads"),
    zipDirectory = path.join(__dirname, "/zip"),
    captchaSecret = process.env.CAPTCHA_SECRET


const bucketName = require('./constants.js').bucketName
const s3SongsBucketURL = require('./constants.js').s3SongsBucketURL

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


var router = express.Router();

//express middleware
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDirectory)
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + ".mp3")
    }
})
var upload = multer({ storage: storage })

router.use(express.static(path.join(__dirname ,'dist')))
router.use(express.static(path.join(__dirname ,'images')))
router.use(express.static(path.join(__dirname ,'webpage/common')))
router.use(express.static(path.join(__dirname ,'webpage/submit')))


router.get('/submit', function(req, res) {
    createUploadDirectory()
    createZipDirectory();
    res.sendFile(__dirname + '/webpage/submit/index.html')
})
router.get('/uploadComplete', function(req, res) {
    res.sendFile(__dirname + '/webpage/uploadComplete/index.html')
    // getIP();
})


router.post('/upload', upload.single('audioFile'), function(req, res) {

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
        .then((response) => {
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
                    res.send({ redirect: "/contribution/uploadComplete" })
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
        .catch((err) => {
            if (!res.headersSent)
                res.send({ message: "Your Captcha was incorrect. Please retry submitting" })
        })
})

////////////////////////////////////////////////////////////////////////////////////////
//Verify Captcha User inputted against Google Server.
//return a promise
function verifyCaptcha(captcha, userIP) {
    const endpoint = "https://www.google.com/recaptcha/api/siteverify"
    var payload = { secret: captchaSecret, response: captcha, remoteip: userIP }
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
module.exports = router;
