
export default class AudioPlayer extends React.Component {
  	constructor(props, context){
  		super(props, context);
  		this.state={
  			currentTime : 0
  		};
		this.updateLine = this.updateLine.bind(this);

	}

	updateLine(){
		console.log("updating line");
		if(this.prop.times == undefined){
			console.log("times undefined");
			return;
		}

		var convertedToSeconds = timestampToSeconds(this.state.times[this.state.currentLine]);
		// if(convertedToSeconds == 0 && this.state.currentLine != 0){
		// 	this.setState({currentLine: currentLine+1});
		// 	return;
		// }
		// var time = Math.round($("#" + audioPlayerID).prop("currentTime"));
		
		// if (time >= convertedToSeconds)
		// {
		// 	$("#" + genericLinePrefix + (currentLine - 1)).css('color', foregroundColor);
		// 	$("#" + genericLinePrefix + (currentLine )).css('color', foregroundColor);
		// 	$("#" + genericLinePrefix + (currentLine + 1)).css('color', highlightColor);

		// 	//docs: https://github.com/flesler/jquery.scrollTo
		// 	console.log("scrolling val: " + scrollingOffset);
		// 	currentLine++;

		// 	if(wantScroll)
	 //  			$(window).scrollTo($("#" + genericLinePrefix + currentLine), {axis: 'y', interrupt: true, duration: 1000, offset :{top :scrollingOffset}});
		// }
	}

	componentDidMount(){
	}
	//onTimeUpdate={this.highlightLine}
	render() {
		return (
			<div className="audioContainer">
				<audio controls="true" ref="audioHTML" id="audioPlayer" ></audio>
			</div> 
		);
	}
}


