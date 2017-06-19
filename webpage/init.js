$(document).ready(function(){
	//set a hook that runs every time a audio player steps
	addTimeUpdateListener();

	window.addEventListener("keydown", function(e) {
	  if(e.keyCode == 32 && e.target == document.body) {
		toggleAudioPlayer(); // space bar to toggle audio player
		e.preventDefault(); // and prevent scrolling
	  }
	});


	$("#" + searchBarID).keyup(function(){
		$("#" + resultsListID).css("display", "inline");
		httpPostAsync("query", {search: $("#" + searchBarID).val()}, showResults);
    });

    setCheckBoxListeners();

});

function setCheckBoxListeners(){

	$("#" + pinyinCheckBoxID).change(function(){
		var pinyin_cb = this;
		$("." + pinyinLyricsLineClass).each(function(i, obj){
			if(pinyin_cb.checked)
				$(obj).show();
			else
				$(obj).hide();
		});
	});

	$("#" + cnCharCheckBoxID).change(function(){
		var cn_cb = this;
		$("." + cnCharLyricsLineClass).each(function(i, obj){
			if(cn_cb.checked)
				$(obj).show();
			else
				$(obj).hide();
		});
	});
	$("#" + englishCheckBoxID).change(function(){
	var en_cb = this;
	$("." + englishLyricsLineClass).each(function(i, obj){
		if(en_cb.checked)
			$(obj).show();
		else
			$(obj).hide();
	});
});
}
// //set space bar listener to pause/play audio
// function addSpaceBarPlayPauseHook(){
// 	$(window).keypress(function(e) {
// 	    if (e.which === 32) {
// 	    	toggleAudioPlayer();
// 	    }
// 	});

// }

//toggle play/pause on the audio player
function toggleAudioPlayer(){
	$("#" + audioPlayerID).prop("paused") ? $("#" + audioPlayerID).trigger("play") : $("#" + audioPlayerID).trigger("pause");
}

function updateAudioPlayer(sourceUrl){
	$("#" + audioPlayerID).attr("src", sourceUrl);
	return;
}

//function to skip audio player to certain time period
function skipToTime(lineNumber){
	return "$('#" + audioPlayerID + "').prop('currentTime'," + timestampToSeconds(times[lineNumber]) + ")";
}

//global array to that maps line number (the index of the array)
//to the timestamp of the song
var times;

//when received a response from server, update div with payload
function updateDiv(responseObj){
	$("#" + lyricsBodyID).empty();
	var isEng = $("#" + englishCheckBoxID).is(":checked");
	var isChar = $("#" + cnCharCheckBoxID).is(":checked");
	var isPinYin = $("#" + pinyinCheckBoxID).is(":checked");

	var eng = responseObj.engArray;
	var cnChar = responseObj.cnArray;
	var pinyin = responseObj.pinyinArray;
	times = responseObj.timesArray;

	var lineNumber = 0;
	for (i in eng){
		var divBody = "<div id ='"+ genericLinePrefix + lineNumber + "'>";
		divBody += "<div class= '" + pinyinLyricsLineClass + "'>" + pinyin[i]+ "</div>";
		divBody += "<div class = '" + cnCharLyricsLineClass + "'>" + cnChar[i] + "</div>";
		divBody += "<div class = '" +englishLyricsLineClass + "'>" + eng[i] + "</div>";

		
		$("#" + lyricsBodyID).append(divBody + "</div><br/>");
		// if(isChar){
		// 	$("#char" + lineNumber).dblclick(function (){
		// 		skipToTime(i);
		// 		$("#audioPlayer").trigger("play"); 
		// 	});
		// 	$("#char" + lineNumber).hover(function (){
		// 		Math.floor(times[i]/100) + ':' + times[i]%100;
		// 	});
		// }
		lineNumber++;
	}
	updateAudioPlayer(responseObj.songPath);
	hideResultsList();
}
function hideResultsList(){
	$("#" + resultsListID).css('display', 'none')
}
function showResults(responseObj){
	$("#" + resultsListID).empty();
	responseObj.forEach(function(element){
		var html = "<li><button class = 'button list-group-item list-group-item-action' id = " + element.file_name + ">"
		+ element.cn_char +" - "+ element.artist + "</span></button></li>";
		$("#" + resultsListID).append(html);
		$("#" + element.file_name).click(function(){
			$("#" + titleLineID).text(element.cn_char + " - " + element.artist);
			httpGetAsync("song", {id: element.file_name}, updateDiv);
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
	var time = Math.round($("#" + audioPlayerID).prop("currentTime"));
	
	if (time >= convertedToSeconds)
	{
		$("#" + genericLinePrefix + (currentLine - 2)).css('color','#000000')
		$("#" + genericLinePrefix + (currentLine - 1)).css('color','#000000')
		$("#" + genericLinePrefix + currentLine).css('color','#66d9ef')
		// $("#line" + (currentLine + 1)).css('color','#A7C520')
		currentLine++;
	}
}

function addTimeUpdateListener(){
	var temp = $("#" + audioPlayerID);
	temp.on('timeupdate', updateLine);
}

function timestampToSeconds(timestamp){
	return Math.floor(timestamp/100) * 60 + timestamp%100;
}