var express = require('express')
var fs = require('fs')
var app = express();

app.use(express.static('webpage'))
app.use(express.static('content'))

app.listen(process.env.PORT || 8081, function() {
    console.log('Listening on port 8081!')
})

app.get('/song', function (req, res){
	var id = req.query.id; //just in case they send me some  garbage ID
	res.writeHead(200, {'Content-type': 'application/json'});
	var lyrics = {};
	// var files = ['pinyin.txt',  'cn.txt', 'eng.txt', 'times.txt'];
	var files = ['cn.txt'];

	files.forEach(function(item){
		try{
		 	lyrics[item] = fs.readFileSync('content/' + id + ' ' + item).toString().split("\n");
		}
		catch (err){
			console.log(err)
			lyrics[item] = "Error finding file";
		}
	});
	lyrics['songFile'] = id + '/' + id +'.mp3'
	res.end(JSON.stringify(lyrics, 'utf-8'));
});