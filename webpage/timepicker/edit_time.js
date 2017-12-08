function editTime(lineNum){

    var timestampLine = document.getElementById(lineNum + 'timestamp')
    // var timestamp = timestampLine.textContent;
    // console.log(timestamp);

    var x = document.createElement("INPUT");
    x.setAttribute("type", "text");
    x.setAttribute("id", lineNum + "_textbox");
    x.setAttribute("value", timestampLine.textContent);

    timestampLine.appendChild(x);

    // $("#"+lineNum+"timestamp").click(function() {
    // $input = $("#"+lineNum+"timestamp");
    // $field = $('<input type="text" id="txt_"'+ lineNum + ' maxlength="4" size="4"/>').attr({
    //     id: $input.id,
    //     name: $input.name,
    //     value: $input.text()
    // });
    // $input.after($field).remove();
    // });

    // $("#"+lineNum+"timestamp").click( function() {
    //         $(this).hide(); //hide text
    //         $("#" + lineNum + "_textbox").show(); //show textbox
    //     });

    // $("#" + lineNum + "_textbox").blur( function() {
    //     var that = $(this);
    //     $("#"+lineNum+"timestamp").text(that.val()).show(); //updated text value and show text
    //     that.hide(); //hide textbox
    // });

}



// function edit(lineNum){
//     var lineTime = document.getElementById(lineNum + 'timestamp').textContent;
//     // console.log(lineTime);
//     var timeString = singlePrettyPrint(lineNum).replace(/:/g, "");
//     // console.log(timeString);
//     var time = parseInt(timeString);
//     // console.log(time)
//     var seconds = timestampToSeconds(time);
//     // console.log(seconds);
//     skipToTime(seconds);
//     for (var dx = lineNum; dx <= lineTimes.length; dx++){
//     	removeTime(dx+'timestamp');
//     	// lineTimes[dx] = "";
//     	// console.log("lineTimes[dx] : " + lineTimes[dx]);
//     }
//     return lineNum;

// }

// function skipToTime(time){
// 	var sound = document.getElementById('audioPlayer');
// 	sound.currentTime = time;
// }	

// function removeTime(id) {
// 	var element = document.getElementById(id);
// 	element.parentNode.removeChild(element);
// }	

// function singlePrettyPrint(lineNum) {
//     var string = lineTimes[lineNum-1];
//     return string;
// }

