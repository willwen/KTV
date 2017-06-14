$(document).ready(function(){
	//set a hook that runs every time a audio player steps
	addTimeUpdateListener();

	//set space bar listener to pause/play audio
	$(window).keypress(function(e) {
	    if (e.which === 32) {
	    	toggleAudioPlayer();
	    }
	});

	$('#searchbar').keyup(function(){
		// alert($(this).val());
     	httpGetAsync("query", queryResult);
    });
});

function queryResult(responseObj){
	alert(JSON.parse(responseObj));

}
//toggle play/pause on the audio player
function toggleAudioPlayer(){
	$("#audioPlayer").prop("paused") ? $("#audioPlayer").trigger("play") : $("#audioPlayer").trigger("pause");
}

//send a AJAX request to server
function updateLyrics(){
	httpGetAsync("song", updateDiv);
	return;
}

//function to skip audio player to certain time period
function skipToTime(lineNumber){
	return '$("#audioPlayer").prop("currentTime",' + timestampToSeconds(times[lineNumber]) + ')';

}
//global array to that maps line number (the index of the array)
//to the timestamp of the song
var times;

//when received a response from server, update div with payload
function updateDiv(responseObj){
	$('#lyricsBody').empty();
	var isEng = $('#eng').is(':checked');
	var isChar = $('#cn').is(':checked');
	var isPinYin = $('#pinyin').is(':checked');
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
		if(isChar){
			divBody += '<span id = "char' + lineNumber + '"">'
				+ cnChar[i] + "</span>" +"<br/>";
		}
		if(isEng)
			divBody += eng[i] + "<br/>"
		$("#lyricsBody").append(divBody + "</div><br/>");
		if(isChar){
			$("#char" + lineNumber).dblclick(function (){
				skipToTime(i);
				$("#audioPlayer").trigger("play"); 
			});
			$("#char" + lineNumber).hover(function (){
				Math.floor(times[i]/100) + ':' + times[i]%100;
			});
		}
		lineNumber++;
	}
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
	var convertedToSeconds = timestampToSeconds(times[currentLine]);
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

function timestampToSeconds(timestamp){
	return Math.floor(timestamp/100) * 60 + timestamp%100;
}