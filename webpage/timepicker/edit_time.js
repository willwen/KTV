function edit(lineNum){
    var lineTime = document.getElementById(lineNum + 'timestamp').textContent;
    // console.log(lineTime);
    var timeString = singlePrettyPrint(lineNum).replace(/:/g, "");
    // console.log(timeString);
    var time = parseInt(timeString);
    // console.log(time)
    var seconds = timestampToSeconds(time);
    // console.log(seconds);
    skipToTime(seconds);
    for (var dx = lineNum; dx <= lineTimes.length; dx++){
    	removeTime(dx+'timestamp');
    	// lineTimes[dx] = "";
    	// console.log("lineTimes[dx] : " + lineTimes[dx]);
    }
    return lineNum;

}

function skipToTime(time){
	var sound = document.getElementById('audioPlayer');
	sound.currentTime = time;
}	

function removeTime(id) {
	var element = document.getElementById(id);
	element.parentNode.removeChild(element);
}	

function singlePrettyPrint(lineNum) {
    var string = lineTimes[lineNum-1];
    return string;
}

