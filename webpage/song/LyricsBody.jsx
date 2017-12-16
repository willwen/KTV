import Constants from './Constants.jsx'
import {UncontrolledTooltip } from 'reactstrap'
// import {OverlayTrigger} from 'reactstrap'
// import Scroll from 'react-scroll'; // Imports all Mixins
// var Element = Scroll.Element;
const uuidv1 = require('uuid/v1');

export default class LyricsBody extends React.Component {
	constructor(props){
		super(props);
		this.state={
		}

		this.splitPrimaryLang = this.splitPrimaryLang.bind(this)
		this.splitPronounciationLang = this.splitPronounciationLang.bind(this)	
	}

	// when props like currentLine update
	componentWillReceiveProps(nextProps){
		let lineNumberStyling = {}
		nextProps.options.showLineNums ? (lineNumberStyling = {visibility: "visible"}):(lineNumberStyling = {visibility: "hidden"});
		this.setState({ lineNumberStyling: lineNumberStyling})

		let pronounciationStyling = {};
		nextProps.options.showPronounciation ?	(pronounciationStyling = {display: "table-row"}):(pronounciationStyling = {display: "none"});
		this.setState({ pronounciationStyling: pronounciationStyling})

		let primaryLangStyling = {};
		nextProps.options.showPrimary ? (primaryLangStyling = {display: "table-row"}) : (primaryLangStyling = {display: "none"});
		this.setState({ primaryLangStyling: primaryLangStyling})
		
		let translatedStyling = {};
		nextProps.options.showTranslated ? (translatedStyling = {display: "block"}) : (translatedStyling = {display: "none"});
		this.setState({ translatedStyling: translatedStyling})

		if(nextProps.lyrics){
			let roundedTimeStamps = nextProps.lyrics.timestamps.map((lineTimestamp)=>{
				let minutes = Math.floor(lineTimestamp/100);
				let seconds = Math.floor(lineTimestamp%100);
				if (seconds < 10)
					seconds = "0" + seconds;
				//used for tooltipe = 
				return minutes + ":" + seconds;
			})
			
			this.setState({roundedTimeStamps: roundedTimeStamps})
		}
			
	}

	

	render() {
		let bodyStyle = {};  
		let lyricsBody = [];

		if(this.props.lyrics.pronounciationLanguageLyrics.length > 0 || 
			this.props.lyrics.translatedLanguageLyrics.length > 0 || 
			this.props.lyrics.primaryLanguageLyrics.length > 0){
			bodyStyle = {"visibility" : "visible"};
			let lineNumber = 1;
			let pronounciation = this.props.lyrics.pronounciationLanguageLyrics;
			let primary = this.props.lyrics.primaryLanguageLyrics;
			let translated = this.props.lyrics.translatedLanguageLyrics;
			let times = this.props.lyrics.timestamps;

			for (var i = 0; i < Math.max(pronounciation.length, primary.length, translated.length); i++){
				// var lineStyle = this.state.lineStyles[i];



				//each lyric line takes up a row
				let tooltip;
				let overlayTrigger;
				let time = this.state.roundedTimeStamps[i];
				var rowDiv = 
					(<div key= {"rowNumber"+ lineNumber} style={
							this.props.currentLine === lineNumber ? {"color" : Constants.ConstsClass.highlightColor} : {"color" : Constants.ConstsClass.foregroundColor}}>
						<div className= {Constants.ConstsClass.lyricLine + "  row"} id= {Constants.ConstsClass.lyricLine + lineNumber}>
						<div className="col-1 lineIndex vertical-center" style = {this.state.lineNumberStyling}>
							<a id = {"lineNumber"+ lineNumber}  className= "lineAnchor" onClick={this.props.anchorClickUpdateLine.bind(this,lineNumber)} >{lineNumber}</a>
							<UncontrolledTooltip  className = "tooltip" target={"lineNumber"+ lineNumber} placement="top">{time}</UncontrolledTooltip >
						</div>
						<div className= "col-11 lyricWords" id = {Constants.ConstsClass.genericLinePrefix + lineNumber}>
							{
								this.props.primaryLanguage == "Chinese" ?
								(
									<div className = "tableOverflow">
										<table>
											<tbody>
												{ pronounciation[i] && primary[i] ? 
													(<tr className = {Constants.ConstsClass.pronounciationLyricsLineClass} style={this.state.pronounciationStyling}>
														{this.splitPronounciationLang(pronounciation[i], primary[i], lineNumber)}
														</tr>) 
													: null
												}
												{ primary[i] ? 
													(<tr className = {Constants.ConstsClass.primaryLyricsLineClass} style={this.state.primaryLangStyling}>
																	{this.splitPrimaryLang(primary[i], lineNumber)}</tr>) 
													: null
												}
											</tbody>
										</table>
									</div>

									)
									:
									(<div><div style={this.state.pronounciationStyling}> {pronounciation[i]}</div>
									<div style={this.state.primaryLangStyling}> {primary[i]}</div></div>)
							}
							<div className = {Constants.ConstsClass.translatedLyricsLineClass} style={this.state.translatedStyling}> {translated[i]}</div>
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
			<div>
				<div className = "gradient col-12" id='lyricsBody' style = {bodyStyle}>
					{
						lyricsBody.map(line => {
							return line;
						})
					}
				</div>
			</div>
		);
	}

	// split a pronounciation line by spaces
	// we use index j and take in primaryLangChars because if primaryLangChars has a space for that index, 
	// we also want pronounciationChar to be a space.
	splitPronounciationLang(pronounciationLine, primaryLine, lineNumber){
		var primaryLangChars = [...primaryLine]
		var pronounciationChars = pronounciationLine.split(' ')
		var tdArray = []
		let j = 0;
		for(let i = 0 ; i < pronounciationChars.length; i++){
			if (primaryLangChars[j] === " "){
				tdArray.push(<td key = {lineNumber + "  space " + i}> </td>)
				i--;
			}
			else{
				tdArray.push(<td key = {lineNumber + "  pronounciationChar " + i}>{pronounciationChars[i]}</td>)
			}
			j++;
		}
		return tdArray
	}

	splitPrimaryLang(primaryLine, lineNumber){
		var primaryLangChars = [...primaryLine]
		return primaryLangChars.map((primaryLangChar, index)=>{
			return <td key={lineNumber + " primaryLangChar " + index}>{primaryLangChar}</td>
		})	
	}
}

