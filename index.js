var url = require('url'),
    fs = require('fs'),
    querystring = require('querystring'),
    express = require('express'),
	port = 8080,
	mongodb = require('mongodb'),
	xssfilters = require('xss-filters'),
	bodyParser = require('body-parser');

// var mongoURL = "mongodb://localhost:27017/songs"
var mongoURL = "mongodb://readonly:readonly@ds127872.mlab.com:27872/heroku_0kfm3lp6"
var app = express();

app.use(express.static('webpage'))
app.use(express.static('songs'))
app.use(express.static('favicons'))


app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(process.env.PORT || 8080, function() {
    console.log('Listening on port 8080!')
})

app.get('/song', function (req, res){
	var id = xssfilters.inHTMLData(req.query.id); //just in case they send me some  garbage ID
	res.writeHead(200, {'Content-type': 'application/json'});
	var lyrics = {};
	var files = ['pinyin.txt',  'cn.txt', 'eng.txt', 'times.txt'];
	files.forEach(function(item){
		try{
		 	lyrics[item] = fs.readFileSync('songs/'+ id + '/' + id + ' ' + item).toString().split("\n");
		}
		catch (err){
			console.log(err)
			lyrics[item] = "Error finding file";
		}

	})

	lyrics['songPath'] = id + '/' + id +'.mp3'
	res.end(JSON.stringify(lyrics, 'utf-8'));
});

app.post('/query', function (req,res){
	var MongoClient = mongodb.MongoClient;
	var url = mongoURL

	//dont inject me...
	var cleansedQuery = xssfilters.inHTMLData(req.body.search);
	console.log(cleansedQuery);

	MongoClient.connect(url, function(err, db){
		if(err)
			console.log('unable to connect to server', err);
		else{
			console.log('connection established');
			var collection = db.collection('songs');
			var regexValue='\.*'+ cleansedQuery +'\.';
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