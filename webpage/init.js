$(document).ready(function(){
	//set a hook that runs every time a audio player steps
	addTimeUpdateListener();

	//set space bar listener to pause/play audio
	$(window).keypress(function(e) {
	    if (e.which === 32) {
	    	toggleAudioPlayer();
	    }
	});

	$('#songSearchInput').keyup(function(){
		// alert($(this).val());
		$('#resultsList').css('display', 'inline')
		httpPostAsync("query", {search: $('#songSearchInput').val()}, showResults);
    });
    $('#songSearchInput').focusout(function(){
		// $('#resultsList').css('display', 'none')
	});

});

function simpleSearch(){
    var input, filter, ul, li, a, i;
    input = document.getElementById("songSearchInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";

        }
    }
}

function queryResult(responseObj){
	alert(JSON.parse(responseObj));

}
//toggle play/pause on the audio player
function toggleAudioPlayer(){
	$("#audioPlayer").prop("paused") ? $("#audioPlayer").trigger("play") : $("#audioPlayer").trigger("pause");
}

function updateAudioPlayer(sourceUrl){
	$("#audioPlayer").attr("src", sourceUrl);
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
	// var resp = JSON.parse(responseObj);
	var eng = responseObj.engArray;
	var cnChar = responseObj.cnArray;
	var pinyin = responseObj.pinyinArray;
	times = responseObj.timesArray;
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
	updateAudioPlayer(responseObj.songPath);
}

function showResults(responseObj){
	$("#resultsList").empty();
	responseObj.forEach(function(element){
		var html = '<li><button class = "button well" id = ' + element.file_name + '>'
		+ element.cn_char +' - '+ element.artist + '</span></button></li>';
		$("#resultsList").append(html);
		$("#" + element.file_name).click(function(){
			httpGetAsync('song', {id: element.file_name}, updateDiv);
			return false;
		});
	})



}
//https://stackoverflow.com/questions/247483/http-get-request-in-javascript
function httpGetAsync(path, data, callback){
	$.ajax({
	  url: path,
	  data: data,
	  success: callback
	});
}

function httpPostAsync(path, data, callback){
	$.ajax({
	  type: "POST",
	  url: path,
	  data: data,
	  success: callback
	});
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