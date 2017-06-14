var url = require('url'),
    fs = require('fs'),
    querystring = require('querystring'),
    express = require('express'),
	port = 8080,
	mongodb = require('mongodb');

var app = express();

app.use(express.static('webpage'))
app.use(express.static('songs'))


app.listen(process.env.PORT || 8080, function() {
    console.log('Listening on port 8080!')
})

app.get('/song', function (req, res){
	res.writeHead(200, {'Content-type': 'application/json'});
	var engArray = fs.readFileSync('eng1.txt').toString().split("\n");
	var cnArray = fs.readFileSync('cn1.txt').toString().split("\n");
	var pinyinArray = fs.readFileSync('pinyin1.txt').toString().split("\n");
	var timesArray = fs.readFileSync('times1.txt').toString().split("\n");

	var lyrics = {engArray, cnArray, pinyinArray, timesArray};
	res.end(JSON.stringify(lyrics, 'utf-8'));
});

app.get('/query', function (req,res){
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/songs'
	MongoClient.connect(url, function(err, db){
		if(err)
			console.log('unable to connect to server', err);
		else{
			console.log('connection established');
			var collection = db.collection('songs');
			collection.find({}).toArray(function(err, result) {
			    if (err) throw err;
			    console.log(result);
			    res.send(result);
			    db.close();
		  	});
		}
	})
});