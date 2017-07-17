var fs = require ('fs'),
	mongo = require ('mongodb').MongoClient,
	Binary = require ('mongodb').Binary;

var songContents = fs.readFileSync('songs/3/3.mp3');

mongo.connect("mongodb://localhost:27017/songs", function(err,db){
	if(err) console.log(err);
	db.collection('songs').update(
		{"file_name" : '3'}, {$set: {songContent : Binary(songContents)}}, function(err, res ){
	  	  if (err) throw err;
		    console.log(res);
		    db.close();
		}
	)

})