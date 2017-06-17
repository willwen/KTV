var url = require('url'),
    fs = require('fs'),
    querystring = require('querystring'),
    express = require('express'),
	port = 8080,
	mongodb = require('mongodb'),
	bodyParser = require('body-parser');

// var mongoURL = "mongodb://localhost:27017/songs"
var mongoURL = "mongodb://readonly:readonly@ds127872.mlab.com:27872/heroku_0kfm3lp6"
var app = express();

app.use(express.static('webpage'))
app.use(express.static('songs'))

app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(process.env.PORT || 8080, function() {
    console.log('Listening on port 8080!')
})

app.get('/song', function (req, res){
	var id = req.query.id
	res.writeHead(200, {'Content-type': 'application/json'});
	var engArray = fs.readFileSync('songs/'+ id + '/' + id +' eng.txt').toString().split("\n");
	var cnArray = fs.readFileSync('songs/'+ id + '/' + id +' cn.txt').toString().split("\n");
	var pinyinArray = fs.readFileSync('songs/'+ id + '/' + id +' pinyin.txt').toString().split("\n");
	var timesArray = fs.readFileSync('songs/'+ id + '/' + id +' times.txt').toString().split("\n");
	var songPath = id + '/' + id +'.mp3'
	var lyrics = {engArray, cnArray, pinyinArray, timesArray,songPath};
	res.end(JSON.stringify(lyrics, 'utf-8'));
});

app.post('/query', function (req,res){
	var MongoClient = mongodb.MongoClient;
	var url = mongoURL

	console.log(req.body.search);

	MongoClient.connect(url, function(err, db){
		if(err)
			console.log('unable to connect to server', err);
		else{
			console.log('connection established');
			var collection = db.collection('songs');
			var regexValue='\.*'+req.body.search+'\.';
			var query = {"searchTerm" : {$regex: new RegExp(regexValue, 'i')}}
			collection.find(query).toArray(function(err, result) {
				    if (err) throw err;
			   		console.log(result);
				    res.send(result);
				    db.close();
		  	});
		}
	})
});