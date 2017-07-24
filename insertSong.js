var fs = require ('fs'),
	mongo = require ('mongodb').MongoClient,
	Binary = require ('mongodb').Binary;

var files= [
			{fileName: ".mp3",
			fieldName: "songContent"},
			{fileName: " cn.txt",
			fieldName: "cnCharLyrics"}, 
			{fileName: " pinyin.txt",
			fieldName: "pinyinLyrics"},
			{fileName: " eng.txt",
			fieldName: "engLyrics"},
			{fileName: " times.txt",
			fieldName: "times"}]
mongo.connect("mongodb://localhost:27017/songs", function(err,db){
	for (i = 1 ; i < 10; i++){
		try{
			files.forEach(function (f){
				var binaryStream = fs.readFileSync(`songs/${i}/${i}${f.fileName}`);
				var temp = {};
				temp[f.fieldName] = Binary(binaryStream);
				db.collection('songs').update(
					{"file_name" : i.toString()}, {$set: temp}, function(err, res ){
				  	  if (err) throw err;
					    console.log(res);
					}
				);
			

			});
		}
		
		catch (err){
			console.log(err)
			continue;
		}


	}
    db.close();


})