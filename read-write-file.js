var fs = require('fs');


function addSpacesChineseCharactersFile() {
	var result = '';
	var filename = "songs/1\ 平凡之路/1\ PrimaryLanguage.txt";

	var readable = fs.createReadStream(filename, {
	    encoding: 'utf8',
	    fd: null,
	});
	readable.on('readable', function() {
	    var chunk;
	    while ((chunk = readable.read(1))  !== null) {
	        if (chunk === '\n') chunk = chunk;
	        else if (chunk === ' ') chunk = '';
	        else chunk = chunk + " ";
	        result = result + chunk;

	    }

	    fs.writeFile(filename, result, function(err) {
	        if (err) {
	            return console.log(err);
	        } else console.log("The chinese file was saved!");
	    });

	});
}


function addSpacesBetweenPinyin(){

	var pinyinfile = 'songs/6\ 再见/6\ PronounciationLanguage.txt';
	var arrayPinYinLines = fs.readFileSync(pinyinfile).toString().split("\n");
	var arrayPinYin = []; 
	for (l in arrayPinYinLines){
		arrayPinYin = arrayPinYin.concat(arrayPinYinLines[l].toString().split(" "));
	}
	var newpinyin = ''; 
	var pinyinresult = '';
	for(i in arrayPinYin) {
	    newpinyin = separatePinyinInSyllables(arrayPinYin[i]);
	    pinyinresult = pinyinresult + newpinyin + " ";
	}
	    fs.writeFile(pinyinfile, pinyinresult, function(err) {
	        if (err) {
	            return console.log(err);
	        } else console.log("The pinyin file was saved!");
	    });
}


//https://gist.github.com/pierophp/bb84754e5de43b4f406aaf0bda8a007e 
function separatePinyinInSyllables (pinyin) {

  var vowels = 'aāáǎàeēéěèiīíǐìoōóǒòuūúǔù';

  return pinyin
      .replace(new RegExp('([' + vowels + '])([^' + vowels + 'nr[A-Za-z0-9]\s])'), '$1 $2')
      .replace(new RegExp('(\w)([csz]h)'), '$1 $2')
      .replace(new RegExp('(n)([^' + vowels + 'vg\w\s])'), '$1 $2') 
      .replace(new RegExp('([' + vowels + 'v])([^' + vowels + '\w\s])([' + vowels + 'v])'), '$1 $2$3')
      .replace(new RegExp('([' + vowels + 'v])(n)(g)([' + vowels + 'v])'), '$1$2 $3$4')
      .replace(new RegExp('([gr])([^' + vowels + '\w\s])'), '$1 $2')
      .replace(new RegExp('([^e\w\s])(r)'), '$1 $2');
  
}