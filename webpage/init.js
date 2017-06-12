$(document).ready(function(){
	addTimeUpdateListener();

	$(window).keypress(function(e) {
	    if (e.which === 32) {

			$("#audioPlayer").prop("paused") ? $("#audioPlayer").trigger("play") : $("#audioPlayer").trigger("pause");

	    }
	});
	// $(document.body).append($('<div/>', {
 //        id: 'div1',
 //        text: 'test'
 //    }));
});

var isPinYin;
var isChar;
var isEng;

function updateLyrics(){
	// 0 = no lyrics
	// 1 = just english
	// 2 = just cn char
	// 3 = just pinyin
	// 4 = english and cn char
	// 5 = cn char and pinyin
	// 6 = english and pinyin
	// 7 = all
	isEng = $('#eng').is(':checked');
	isChar = $('#cn').is(':checked');
	isPinYin = $('#pinyin').is(':checked');


	// if(!isEng && !isChar && !isPinYin){
	// 	val = 0;
	// }
	// else if(isEng && !isChar && !isPinYin){
	// 	val = 1;
	// }
	// else if(!isEng && isChar && !isPinYin){
	// 	val = 2;
	// }
	// else if(!isEng && !isChar && isPinYin){
	// 	val = 3;
	// }
	// else if(isEng && isChar && !isPinYin){
	// 	val = 4;
	// }
	// else if(!isEng && isChar && isPinYin){
	// 	val = 5;
	// }
	// else if(isEng && !isChar && isPinYin){
	// 	val = 6;
	// }
	// else if(isEng && isChar && isPinYin){
	// 	val = 7;
	// }
	// alert(val);
	httpGetAsync("song", updateDiv);
	return;
}
var times;
function updateDiv(responseObj){
	$('#lyricsBody').empty();
	var resp = JSON.parse(responseObj);
	var eng = resp.engArray;
	var cnChar = resp.cnArray;
	var pinyin = resp.pinyinArray;
	times = resp.timesArray;
	var lineNumber = 0;
	for (i in eng){
		var divBody = "<div id ='line" + lineNumber+ "'>";
		if(isPinYin)
			divBody += pinyin[i]+ "<br/>";
		if(isChar)
			divBody += cnChar[i] + "<br/>";
		if(isEng)
			divBody += eng[i] + "<br/>"
		$("#lyricsBody").append(divBody + "</div><br/>");
		lineNumber++;
	}
	// alert("done");

}
//https://stackoverflow.com/questions/247483/http-get-request-in-javascript
function httpGetAsync(path, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", path, true); // true for asynchronous 
    xmlHttp.send(null);
}
var currentLine = 0;

function updateLine(){
	if(times == undefined)
		return;
	var convertedToSeconds = Math.floor(times[currentLine]/100) * 60 + times[currentLine]%100;
	if(convertedToSeconds == 0 && currentLine != 0){
		currentLine++;
		return;
	}
	var time = Math.round($("#audioPlayer").prop("currentTime"));
	
	
	if (time >= convertedToSeconds)
	{
		$("#line" + (currentLine - 2)).css('color','#000000')
		$("#line" + (currentLine - 1)).css('color','#000000')
		$("#line" + currentLine).css('color','#66d9ef')
		// $("#line" + (currentLine + 1)).css('color','#A7C520')
		currentLine++;
	}
}

function addTimeUpdateListener(){
	var temp = $("#audioPlayer");
	temp.on('timeupdate', updateLine);
}
