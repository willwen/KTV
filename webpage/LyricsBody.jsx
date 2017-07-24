import Constants from './Constants.jsx'
import $ from 'jquery'
import {Tooltip} from 'react-bootstrap'
import {OverlayTrigger} from 'react-bootstrap'

export default class LyricsBody extends React.Component {
	constructor(props){
		super(props);
	}

	anchorClick(lineNum){
		//wipe color off current ones:
		$("#" +  Constants.ConstsClass.genericLinePrefix + (this.props.currentLine - 1)).css('color','#FFF')
		$("#" + Constants.ConstsClass.genericLinePrefix + (this.props.currentLine )).css('color','#FFF')
		$("#" + Constants.ConstsClass.genericLinePrefix + (this.props.currentLine + 1)).css('color','#FFF')
		let newTime = Constants.timestampToSeconds(this.props.lyrics.times[lineNum-1]); //minus one because lyrics start at 0 while currentLine starts at 1
		this.props.skipToTime(lineNum, newTime);
		$("#" + Constants.ConstsClass.genericLinePrefix + lineNum).css('color', Constants.ConstsClass.highlightColor)
	}



	render() {
		let style = {};
		let lyricsBody = [];

		let lineNumberStyling = {}
		this.props.options.showLineNums ? 
			(lineNumberStyling = {visibility: "visible"}):(lineNumberStyling = {visibility: "hidden"});

		let pinyinStyling = {};
		this.props.options.showPinyin ?
			(pinyinStyling = {display: "block"}):(pinyinStyling = {display: "none"});

		let cnStyling = {};
		this.props.options.showCn ? (cnStyling = {display: "block"}) : (cnStyling = {display: "none"});

		let engStyling = {};
		this.props.options.showEng ? (engStyling = {display: "block"}) : (engStyling = {display: "none"});

		if(this.props.lyrics.pinyin.length > 0){
			style = {"visibility" : "visible"};
			let lineNumber = 1;
			let pinyin = this.props.lyrics.pinyin;
			let cnChar = this.props.lyrics.cn;
			let eng = this.props.lyrics.eng;
			let times = this.props.lyrics.times;
			for (var i = 0; i < Math.max(pinyin.length, cnChar.length, eng.length); i++){
				
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
						<div className="col-xs-1 lineIndex vertical-center" style = {lineNumberStyling}>
							<OverlayTrigger placement="top" overlay={tooltip}>
								<a id = {"lineNumber"+ lineNumber}  className= "lineAnchor" onClick={this.anchorClick.bind(this, lineNumber)}>{lineNumber}</a>
							</OverlayTrigger>
						</div>
						<div className= "col-xs-10 lyricWords" id = {Constants.ConstsClass.genericLinePrefix + lineNumber}>
							<div className = {Constants.ConstsClass.pinyinLyricsLineClass} style={pinyinStyling}> {pinyin[i]}</div>
							<div className = {Constants.ConstsClass.cnCharLyricsLineClass} style={cnStyling}> {cnChar[i]}</div>
							<div className = {Constants.ConstsClass.englishLyricsLineClass} style={engStyling}> {eng[i]}</div>
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
		
		return (
			<div className="row">
				<div className = "gradient col-xs-12" id='lyricsBody' style = {style}>
					{lines}
				</div>
			</div>
		);
	}
}

