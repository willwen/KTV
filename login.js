var path = require('path'), //used to resolve __dirname
    multer = require('multer'), // https://github.com/expressjs/multer ; Multer is a node.js middleware for handling multipart/form-data
    fs = require('fs-extra'),
	express = require('express'),
	xssfilters = require('xss-filters'),
    axios = require ('axios'), // http request library
    qs = require('qs') //encode data to application/x-www-form-urlencoded format

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
router.use(express.static(path.join(__dirname ,'webpage/login')))


router.get('/login', function(req, res) {
    res.send("Work in Progress...")
})

module.exports = router;
