"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
function timestampToSeconds(timestamp) {
	return Math.floor(timestamp / 100) * 60 + timestamp % 100;
}

var ConstsClass = {
	searchBarID: "songSearchInput",
	resultsListID: "resultsList",

	allSongsAnchorID: "allSongsAnchor",

	titleLineID: "titleLine",

	//Checkboxes:
	//langauges
	pinyinCheckBoxID: "pinyinCB",
	cnCharCheckBoxID: "cnCB",
	englishCheckBoxID: "engCB",
	//options:
	optionsID: "options",
	wantScrollCheckBoxID: "wantScrolling",
	wantLineNumbersCheckBoxID: "lineNumbers",

	lyricsBodyID: "lyricsBody",
	//whole line of lyric with line number
	lyricLine: "lyricLine",

	//lyricLeft
	lineNumberID: "lineIndex",

	//lyricRight Lines: pinyin, cn, english
	pinyinLyricsLineClass: "pinyinLine",
	cnCharLyricsLineClass: "cnLine",
	englishLyricsLineClass: "engLine",

	genericLinePrefix: "line",

	audioPlayerID: "audioPlayer",

	//colors
	foregroundColor: "rgba(255,255,255,0.5)",
	highlightColor: "rgb(255, 238, 6)"

};
exports.default = { ConstsClass: ConstsClass, timestampToSeconds: timestampToSeconds };