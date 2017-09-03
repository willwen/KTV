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

var lyrics = `窗外的麻雀　在电线杆上多嘴
妳說这一句　很有夏天的感觉
手中的铅笔　在纸上来来回回
我用几行字形容妳是我的谁

秋刀鱼的滋味　猫跟妳都想了解
初恋的香味就这样被我们寻回
那温暖　的阳光　像刚摘的　鲜艳草莓
你說妳舍不得吃掉这一种感觉

雨下整夜　我的爱溢出就像雨水
院子落叶　跟我的思念厚厚一叠
几句是非　也无法将我的热情冷却
妳出现在我诗的每一页

雨下整夜　我的爱溢出就像雨水
窗台蝴蝶　像诗里纷飞的美丽章节
我接着写　把永远爱妳写进诗的结尾
妳是我唯一想要的了解

雨下整夜　我的爱溢出就像雨水
院子落叶　跟我的思念厚厚一叠
几句是非　也无法将我的热情冷却
妳出现在我诗的每一页

那饱满的稻穗　幸福了这个季节
而妳的脸颊像田里熟透的番茄
妳突然对我说　七里香的名字很美
我此刻却只想亲吻妳倔强的嘴

雨下整夜　我的爱溢出就像雨水
院子落叶　跟我的思念厚厚一叠
几句是非　也无法将我的热情冷却
妳出现在我诗的每一页

整夜　我的爱溢出就像雨水
窗台蝴蝶　像诗里纷飞的美丽章节
把永远爱妳写进诗的结尾
妳是我唯一想要的了解`

var charLyrics = lyrics.split("");
var charTimes = [];
var index = 0;

var english = /^[A-Za-z0-9 \n]*$/;
var newline = /\n/;

var playbackIndex = 0;
var staticTimes = []
var audioPlayerID = "audioPlayer"

//toggle play/pause on the audio player
function toggleAudioPlayer(){
	$("#" + audioPlayerID).prop("paused") ? $("#" + audioPlayerID).trigger("play") : $("#" + audioPlayerID).trigger("pause");
}