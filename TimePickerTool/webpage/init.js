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
     	// temp.innerHTML = time;
	    ele.append(temp);

		index++;
		e.preventDefault(); // and prevent scrolling
	  }
	});

	$("#audioPlayer").on('timeupdate', function(){
		if(english.test(charLyrics[index])){
			charTimes[index] = 0;
			index++;
			console.log("deteched english , updated");
		}
		if(staticTimes){
			if((this.currentTime >= (staticTimes[playbackIndex]-0.6)) || staticTimes[playbackIndex]==0){
				$("#" + (playbackIndex-1)).removeAttr( 'style' );
				$("#" + playbackIndex).css("color", "blue")
				// console.log(this.currentTime + ">=" + (staticTimes[playbackIndex]-0.4)+ " aka char#" + playbackIndex)
				playbackIndex++;
			}

		}
	});
	var count = 0;
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
});

var lyrics = `徘徊着的 在路上的
你要走吗 via via
易碎的 骄傲着
那也曾是我的模样
沸腾着的 不安着的
你要去哪 via via
谜一样的 沉默着的
故事你真的在听吗

我曾经跨过山和大海
也穿过人山人海
我曾经拥有着一切
转眼都飘散如烟
我曾经失落失望失掉所有方向
直到看见平凡才是唯一的答案`

var charLyrics = lyrics.split("");
var charTimes = [];
var index = 0;

var english = /^[A-Za-z0-9 \n]*$/;
var newline = /\n/;

var playbackIndex = 0;
var staticTimes = [11.820964, 12.272076, 12.680091, 12.868268, 0, 13.321589, 13.788317, 14.115166, 14.288791, 0, 17.715872, 18.063907, 18.437981, 18.609151, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23.447083, 23.786179, 24.120882, 0, 24.821939, 25.216991, 25.577796]
  var audioPlayerID = "audioPlayer"
//toggle play/pause on the audio player
function toggleAudioPlayer(){
	$("#" + audioPlayerID).prop("paused") ? $("#" + audioPlayerID).trigger("play") : $("#" + audioPlayerID).trigger("pause");
}