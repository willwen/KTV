import Constants from './Constants.jsx'
import {Tooltip} from 'react-bootstrap'
import {OverlayTrigger} from 'react-bootstrap'
// import Scroll from 'react-scroll'; // Imports all Mixins
// var Element = Scroll.Element;
const uuidv1 = require('uuid/v1');

export default class LyricsBody extends React.Component {
	constructor(props){
		super(props);
		this.state={
		}
		this.clearLyrics = this.clearLyrics.bind(this)
		this.splitCnChar = this.splitCnChar.bind(this)
		this.splitPinyin = this.splitPinyin.bind(this)	
	}

	anchorClick(lineNum){
		let newTime = Constants.timestampToSeconds(this.props.lyrics.times[lineNum-1]); //minus one because lyrics start at 0 while currentLine starts at 1
		this.props.skipToTime(lineNum, newTime);
	}

	clearLyrics(){ //whipes all to foregroundColor
		// this.setState({
		// 	lineStyles:[]
		// })
		console.log("will whipe all foreground Color")
	}
	
	incrementLineColor(lineNum){
		// let style = this.state.lineStyles;
		// //wipe color off current ones:
		// style[this.props.currentLine - 2] = {"color" : Constants.ConstsClass.foregroundColor}
		// style[this.props.currentLine - 1] = {"color" : Constants.ConstsClass.foregroundColor}
		// //Temporarily try NO BOLD
		// style[this.props.currentLine] = {"color" : Constants.ConstsClass.highlightColor}
		
		// this.setState({lineStyles: style})
	}

	render() {
		let bodyStyle = {};  
		let lyricsBody = [];

		let lineNumberStyling = {}
		this.props.options.showLineNums ? (lineNumberStyling = {visibility: "visible"}):(lineNumberStyling = {visibility: "hidden"});

		let pinyinStyling = {};
		this.props.options.showPinyin ?	(pinyinStyling = {display: "table-row"}):(pinyinStyling = {display: "none"});

		let cnStyling = {};
		this.props.options.showCn ? (cnStyling = {display: "table-row"}) : (cnStyling = {display: "none"});

		let engStyling = {};
		this.props.options.showEng ? (engStyling = {display: "block"}) : (engStyling = {display: "none"});

		if(this.props.lyrics.pinyin.length > 0 || this.props.lyrics.eng.length > 0 || this.props.lyrics.cn.length > 0){
			bodyStyle = {"visibility" : "visible"};
			let lineNumber = 1;
			let pinyin = this.props.lyrics.pinyin;
			let cnChar = this.props.lyrics.cn;
			let eng = this.props.lyrics.eng;
			let times = this.props.lyrics.times;
			for (var i = 0; i < Math.max(pinyin.length, cnChar.length, eng.length); i++){
				// var lineStyle = this.state.lineStyles[i];

				var minutes = Math.floor(times[i]/100);
				var seconds = Math.floor(times[i]%100);
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
					(<div key= {"rowNumber"+ lineNumber} className="row" style={
							this.props.currentLine === lineNumber ? {"color" : Constants.ConstsClass.highlightColor} : {"color" : Constants.ConstsClass.foregroundColor}}>
						<div className= {Constants.ConstsClass.lyricLine +"  equal"} id= {Constants.ConstsClass.lyricLine + lineNumber}>
						<div className="col-xs-1 lineIndex vertical-center" style = {lineNumberStyling}>
							{overlayTrigger}
						</div>
						<div className= "col-xs-10 lyricWords" id = {Constants.ConstsClass.genericLinePrefix + lineNumber}>
							<div className = "row">
							<table>
								<tbody>
									{ pinyin[i] && cnChar[i] ? (<tr className = {Constants.ConstsClass.pinyinLyricsLineClass} style={pinyinStyling}>
													{this.splitPinyin(pinyin[i], cnChar[i])}
													</tr>) : null
									}
									{ cnChar[i] ? (<tr className = {Constants.ConstsClass.cnCharLyricsLineClass} style={cnStyling}>
														{this.splitCnChar(cnChar[i])}</tr>) : null
									}
								</tbody>
							</table>
							</div>
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

	
		return (
			<div className="row">
				<div className = "gradient col-xs-12" id='lyricsBody' style = {bodyStyle}>
					{
						lyricsBody.map(line => {
							return line;
						})
					}
				</div>
			</div>
		);
	}

	// split a pinyin line by spaces
	// we use index j and take in cnChars because if cnChars has a space for that index, 
	// we also want pinyinChar to be a space.
	splitPinyin(pinyinLine, charLine){
		var cnChars = [...charLine]
		var pinyinChars = pinyinLine.split(' ')
		var tdArray = []
		let j = 0;
		for(let i = 0 ; i < pinyinChars.length; i++){
			if (cnChars[j] === " "){
				tdArray.push(<td > </td>)
				i--;
			}
			else{
				tdArray.push(<td >{pinyinChars[i]}</td>)
			}
			j++;
		}
		return tdArray
	}

	splitCnChar(charLine){
		var cnChars = [...charLine]
		return cnChars.map((cnChar, index)=>{
			return <td >{cnChar}</td>
		})	
	}
}

