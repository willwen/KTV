// $(document).ready(function(){
// 	// $(document.body).append($('<div/>', {
//  //        id: 'div1',
//  //        text: 'test'
//  //    }));
//  //   $(document.body).append($('<input />', {
//  //   		type: 'checkbox',
//  //   		id: 'cb', 
//  //   		value: 'what',
//  //   		text: 'english' 
//  //   	}));

// }
// )
var val;

function updateLyrics(){
	// 0 = no lyrics
	// 1 = just english
	// 2 = just cn char
	// 3 = just pinyin
	// 4 = english and cn char
	// 5 = cn char and pinyin
	// 6 = english and pinyin
	// 7 = all
	var isEng = $('#eng').is(':checked');
	var isChar = $('#cn').is(':checked');
	var isPinYin = $('#pinyin').is(':checked');


	if(!isEng && !isChar && !isPinYin){
		val = 0;
	}
	else if(isEng && !isChar && !isPinYin){
		val = 1;
	}
	else if(!isEng && isChar && !isPinYin){
		val = 2;
	}
	else if(!isEng && !isChar && isPinYin){
		val = 3;
	}
	else if(isEng && isChar && !isPinYin){
		val = 4;
	}
	else if(!isEng && isChar && isPinYin){
		val = 5;
	}
	else if(isEng && !isChar && isPinYin){
		val = 6;
	}
	else if(isEng && isChar && isPinYin){
		val = 7;
	}
	// alert(val);
	httpGetAsync("song", updateDiv);
	return;
}
function updateDiv(responseObj){
	var resp = JSON.parse(responseObj);
	var eng = resp.engArray;
	var cnChar = resp.cnArray;
	var pinyin = resp.pinyinArray;
	// alert(eng[0]);

	for (i in eng){
		$(document.body).append("<div>"+pinyin[i]+ "<br/>" +
			cnChar[i] + "<br/>" + eng[i] + "<br/></div><br/>")
	}
	alert("done");

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
