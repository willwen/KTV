import Constants from './Constants.jsx'
import {Tooltip} from 'react-bootstrap'
import {OverlayTrigger} from 'react-bootstrap'
// import Scroll from 'react-scroll'; // Imports all Mixins
// var Element = Scroll.Element;

export default class LyricsBody extends React.Component {
	constructor(props){
		super(props);
		this.state={
			lines : [],
			lineStyles: []
		}

		this.clearLyrics = this.clearLyrics.bind(this)
	}

	anchorClick(lineNum){
		let newTime = Constants.timestampToSeconds(this.props.lyrics.times[lineNum-1]); //minus one because lyrics start at 0 while currentLine starts at 1

		let style = this.state.lineStyles;
		//wipe color off current ones:
		//-2 because if you are on line 4, and line 5 is a new line, currentline immediately jumps to line 4.
		style[this.props.currentLine - 2] = {"color" : Constants.ConstsClass.foregroundColor}
		style[this.props.currentLine - 1] = {"color" : Constants.ConstsClass.foregroundColor}
		style[this.props.currentLine] = {"color" : Constants.ConstsClass.foregroundColor, "fontWeight": "normal"}
		style[this.props.currentLine + 1] = {"color" : Constants.ConstsClass.foregroundColor}

		style[lineNum-1] = {"color" : Constants.ConstsClass.highlightColor, "fontWeight":"bolder"}
		
		this.props.skipToTime(lineNum, newTime);
		
		this.setState({lineStyles: style})
	}

	clearLyrics(){
		this.setState({
			lines:[],
			lineStyles:[]
		})
	}
	
	incrementLineColor(lineNum){
		let style = this.state.lineStyles;
		//wipe color off current ones:
		style[this.props.currentLine - 2] = {"color" : Constants.ConstsClass.foregroundColor, "fontWeight": "normal"}
		style[this.props.currentLine - 1] = {"color" : Constants.ConstsClass.foregroundColor, "fontWeight": "normal"}
		style[this.props.currentLine] = {"color" : Constants.ConstsClass.highlightColor, "fontWeight": "bolder"}

		// style[this.props.currentLine + 1] = {"color" : Constants.ConstsClass.highlightColor, "fontWeight": "bolder"}
		
		
		this.setState({lineStyles: style})
	}

render() {
		let bodyStyle = {};  
		let lyricsBody = [];

		let lineNumberStyling = {}
		this.props.options.showLineNums ? (lineNumberStyling = {visibility: "visible"}):(lineNumberStyling = {visibility: "hidden"});

		let pinyinStyling = {};
		this.props.options.showPinyin ?	(pinyinStyling = {display: "block"}):(pinyinStyling = {display: "none"});

		let cnStyling = {};
		this.props.options.showCn ? (cnStyling = {display: "block"}) : (cnStyling = {display: "none"});

		let engStyling = {};
		this.props.options.showEng ? (engStyling = {display: "block"}) : (engStyling = {display: "none"});

		if(this.props.lyrics.pinyin.length > 0){
			bodyStyle = {"visibility" : "visible"};
			let lineNumber = 1;
			let pinyin = this.props.lyrics.pinyin;
			let cnChar = this.props.lyrics.cn;
			let eng = this.props.lyrics.eng;
			let times = this.props.lyrics.times;
			for (var i = 0; i < Math.max(pinyin.length, cnChar.length, eng.length); i++){
				var lineStyle = this.state.lineStyles[i];

				var minutes = Math.floor(times[i]/100);
				var seconds = times[i]%100;
				if (seconds < 10)
					seconds = "0" + seconds;
				//used for tooltip
				var time = minutes + ":" + seconds;

				//each lyric line takes up a row
				let tooltip;
				let overlayTrigger;				
				if((lineNumber == 1 || time != "0:00") && time!="NaN:NaN"){
					tooltip = (<Tooltip id= {time} className = "tooltip"><strong>{time}</strong></Tooltip>);
					overlayTrigger = (<OverlayTrigger placement="top" overlay={tooltip}>
								<a id = {"lineNumber"+ lineNumber}  className= "lineAnchor" onClick={this.anchorClick.bind(this, lineNumber)}>{lineNumber}</a>
							</OverlayTrigger>)
				}
				else{
					overlayTrigger = (<a id = {"lineNumber"+ lineNumber}  className= "lineAnchor">{lineNumber}</a>)
				}
				var rowDiv = 
					(<div key= {"rowNumber"+ lineNumber} className="row" style={lineStyle}>
						<div className= {Constants.ConstsClass.lyricLine +"  equal"} id= {Constants.ConstsClass.lyricLine + lineNumber}>
						<div className="col-xs-1 lineIndex vertical-center" style = {lineNumberStyling}>
							{overlayTrigger}
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
			bodyStyle = {"visibility" : "hidden"}

		this.state.lines = lyricsBody.map(line => {
			return line;
		})
		
		return (
			<div className="row">
				<div className = "gradient col-xs-12" id='lyricsBody' style = {bodyStyle}>
					{this.state.lines}
				</div>
			</div>
		);
	}

}

