$(document).ready(function(){
	window.addEventListener("keydown", function(e) {
	  if(e.keyCode == 32 && e.target == document.body) {
		toggleAudioPlayer(); // space bar to toggle audio player
		e.preventDefault(); // and prevent scrolling
	  }
	});

	window.addEventListener("keydown", function(e) {
	  if(e.keyCode == 8 && e.target == document.body) { //backspace
	  	var time = $("#audioPlayer").prop("currentTime");
		console.log(time);
		charTimes[index] = time;
		var ele = $('#' + index);
		var temp = $('<span></span>').text(time);
	    ele.append(temp);
		index++;

		e.preventDefault(); // and prevent backspace default
	  }
	});

	// $("#audioPlayer").on('timeupdate', function(){
	// 	if(english.test(charLyrics[index])){
	// 		charTimes[index] = 0;
	// 		index++;
	// 		console.log("deteched english , updated");
	// 	}
	// 	if(staticTimes){
	// 		if((this.currentTime >= (staticTimes[playbackIndex]-0.6)) || staticTimes[playbackIndex]==0){
	// 			$("#" + (playbackIndex-1)).removeAttr( 'style' );
	// 			$("#" + playbackIndex).css("color", "blue")
	// 			// console.log(this.currentTime + ">=" + (staticTimes[playbackIndex]-0.4)+ " aka char#" + playbackIndex)
	// 			playbackIndex++;
	// 		}

	// 	}
	// });
	$.get('/song', {'id':'1'}, function(data){
		var count = 0;
		var lyrics = data["cn.txt"];
		var charLyrics = lyrics.split("\n");
		for (var c in charLyrics) {
			var newElement;
			if(newline.test(charLyrics[c])){
		   	 	newElement = document.createElement('div');

			}
			else{
		   	  newElement = document.createElement('span');
		      newElement.innerHTML = charLyrics[c];


			}
			newElement.id = count;
		    document.body.appendChild(newElement);
		    count++;
		}
	})
	
});

var charTimes = [];

var english = /^[A-Za-z0-9 \n]*$/;
var newline = /\n/;

var playbackIndex = 0;
var staticTimes = []
var audioPlayerID = "audioPlayer"

//toggle play/pause on the audio player
function toggleAudioPlayer(){
	$("#" + audioPlayerID).prop("paused") ? $("#" + audioPlayerID).trigger("play") : $("#" + audioPlayerID).trigger("pause");
}