function timestampToSeconds(timestamp) {
	return Math.floor(timestamp / 100) * 60 + timestamp % 100;
}

const ConstsClass = {
	searchBarID: "songSearchInput",
	resultsListID: "resultsList",

	allSongsAnchorID: "allSongsAnchor",

	titleLineID: "titleLine",

	//Checkboxes:
	//langauges
	pronounciationCheckBoxID: "pronounciationCB",
	primaryCheckBoxID: "primaryCB",
	translatedCheckBoxID: "translatedCB",
	//options:
	optionsID: "options",
	wantScrollCheckBoxID: "wantScrolling",
	wantLineNumbersCheckBoxID: "lineNumbers",

	lyricsBodyID: "lyricsBody",
	//whole line of lyric with line number
	lyricLine: "lyricLine",

	//lyricLeft
	lineNumberID: "lineIndex",

	//lyricRight Lines: pronounciation, primary, translated
	pronounciationLyricsLineClass: "pronounciationLine",
	primaryLyricsLineClass: "primaryLine",
	translatedLyricsLineClass: "translatedLine",

	genericLinePrefix: "line",

	audioPlayerID: "audioPlayer",

	//colors
	foregroundColor: "rgba(255,255,255,0.5)",
	highlightColor: "rgb(255, 238, 6)"
};
export default { ConstsClass, timestampToSeconds };
