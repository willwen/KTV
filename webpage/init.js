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

	$("#" + wantScrollCheckBoxID).change(function(){
		if(this.checked)
			wantScroll = true;
		else
			wantScroll = false;
	});

	$("#" + wantLineNumbersCheckBoxID).change(function(){
		if(this.checked)
			$("." + lineNumberID).css("visibility", "visible");
		else
			$("." + lineNumberID).css("visibility", "hidden");
	});
}


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

var wantScroll = true;
//when received a response from server, update div with payload
function updateDiv(responseObj){
	$("#" + lyricsBodyID).empty();

	var pinyin = responseObj['pinyin.txt'];
	var cnChar = responseObj['cn.txt'];
	var eng = responseObj['eng.txt'];
	times = responseObj['times.txt'];

	//show lyrics container
	$("#" + lyricsContainerID).css("visibility", "visible");
	var lineNumber = 1;
	for (i = 0; i < Math.max(pinyin.length, cnChar.length, eng.length); i++){
		//each lyric line takes up a row
		var rowDiv = $("<div></div>" , {class: 'row'});
		//the line number takes the left side of that row
			var lineNumberDiv = $("<div></div>" , {class: 'col-xs-1 lineIndex'});
				var lineNumberAnchor = $("<a></a>", {id : 'lineNumber'+ lineNumber}).text(lineNumber);

				lineNumberDiv.append(lineNumberAnchor);			
			rowDiv.append(lineNumberDiv);
			//the lyrics take up the right side
			var lyricsDiv = $("<div></div>" , {class: 'col-xs-11', id: genericLinePrefix + lineNumber});
				//create three divs for the three languages and append them to the lyrics
				var pinyinLine = $("<div></div>" , {class: pinyinLyricsLineClass + "col-xs-12"}).text(pinyin[i]);
				var cnLine = $("<div></div>" , {class: cnCharLyricsLineClass + "col-xs-12"}).text(cnChar[i]);
				var engLine = $("<div></div>" , {class: englishLyricsLineClass + "col-xs-12"}).text(eng[i]);
				lyricsDiv.append(pinyinLine);
				lyricsDiv.append(cnLine);
				lyricsDiv.append(engLine);
			rowDiv.append(lyricsDiv);

		$("#" + lyricsBodyID).append(rowDiv);
		var lineBreak = $("<br/>")
		$("#" + lyricsBodyID).append(lineBreak);
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
			$("#" + optionsID).collapse('show');
			//reset song line
			currentLine = 0;
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
		$("#" + genericLinePrefix + (currentLine - 2)).css('color','#FFF')
		$("#" + genericLinePrefix + (currentLine - 1)).css('color','#FFF')
		$("#" + genericLinePrefix + currentLine).css('color','#a6e22e')
		// $("#line" + (currentLine + 1)).css('color','#A7C520')
		//docs: https://github.com/flesler/jquery.scrollTo
		if(wantScroll)
  			$(window).scrollTo($("#" + genericLinePrefix + currentLine), {axis: 'y', interrupt: true, duration: 1000, offset :{top :-400}});
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