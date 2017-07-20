import Constants from './const.js'
import $ from 'jquery'
import {Tooltip} from 'react-bootstrap'
import {OverlayTrigger} from 'react-bootstrap'

export default class SongLyrics extends React.Component {
	constructor(props){
		super(props);
	}

	anchorClick(lineNum){
		//wipe color off current ones:
		$("#" +  Constants.ConstsClass.genericLinePrefix + (this.props.currentLine - 1)).css('color','#FFF')
		$("#" + Constants.ConstsClass.genericLinePrefix + (this.props.currentLine )).css('color','#FFF')
		$("#" + Constants.ConstsClass.genericLinePrefix + (this.props.currentLine + 1)).css('color','#FFF')
		let newTime = Constants.timestampToSeconds(this.props.times[lineNum-1]); //minus one because lyrics start at 0 while currentLine starts at 1
		this.props.skipToTime(lineNum, newTime);
	}
	componentDidUpdate(){
		// $('[data-toggle="tooltip"]').tooltip();
	}


	render() {
		let style = {};
		let lyricsBody = [];

		if(this.props.pinyin.length > 0){
			style = {"visibility" : "visible"};
			let lineNumber = 1;
			let pinyin = this.props.pinyin;
			let cnChar = this.props.cnChar;
			let eng = this.props.eng;

			for (var i = 0; i < Math.max(pinyin.length, cnChar.length, eng.length); i++){
				var times = this.props.times;
				var minutes = Math.floor(times[i]/100);
				var seconds = times[i]%100;
				if (seconds < 10)
					seconds = "0" + seconds;
				//used for tooltip
				var time = minutes + ":" + seconds;

				//each lyric line takes up a row
				var tooltip = (<Tooltip id= {time} className = "tooltip"><strong>{time}</strong></Tooltip>);
				var rowDiv = 
					(<div key= {"rowNumber"+ lineNumber} className="row">
						<div className= " lyricLine equal">
						<div className="col-xs-1 lineIndex vertical-center">
							<OverlayTrigger placement="top" overlay={tooltip}>
								<a id = {"lineNumber"+ lineNumber}  className= "lineAnchor" onClick={this.anchorClick.bind(this, lineNumber)}>{lineNumber}</a>
							</OverlayTrigger>
						</div>
						<div className= "col-xs-10 lyricWords" id = {Constants.ConstsClass.genericLinePrefix + lineNumber}>
							<div className = {Constants.ConstsClass.pinyinLyricsLineClass}> {pinyin[i]}</div>
							<div className = {Constants.ConstsClass.cnCharLyricsLineClass}> {cnChar[i]}</div>
							<div className = {Constants.ConstsClass.englishLyricsLineClass}> {eng[i]}</div>
						</div>
						</div>
						<br className = "clearfix"></br>
					</div>);
				lyricsBody.push(rowDiv);
				lineNumber++;
			}
		}
		else
			style = {"visibility" : "hidden"}

		let lines = lyricsBody.map(line => {
			return line;
		})
		// updateAudioPlayer(responseObj.songPath);
		// hideResultsList();

		return (
			<div className="row">
				<div className = "gradient col-xs-12" id='lyricsBody' style = {style}>
					{lines}
				</div>
			</div>
		);
	}
}

