
class AudioPlayer extends React.Component {
  	constructor(props, context){
  		super(props, context);
  		this.highlightLine = this.highlightLine.bind(this);
  		this.state={
  			currentTime : 0
  		};
  	}

  	//set a hook that runs every time a audio player steps
	highlightLine(){
		console.log("updating line");
		console.log(this.props.times);
		var times = this.props.times;
		var currentLine = this.props.currentLine;

		if(times == undefined)
			return;

		var convertedToSeconds = timestampToSeconds(times[currentLine]);
		if(convertedToSeconds == 0 && currentLine != 0){
			this.props.onLineChange(currentLine+1);
			return;
		}
		var time = Math.round($("#" + audioPlayerID).prop("currentTime"));
		
		if (time >= convertedToSeconds)
		{
			$("#" + genericLinePrefix + (currentLine - 1)).css('color', foregroundColor);
			$("#" + genericLinePrefix + (currentLine )).css('color', foregroundColor);
			$("#" + genericLinePrefix + (currentLine + 1)).css('color', highlightColor);

			//docs: https://github.com/flesler/jquery.scrollTo
			console.log("scrolling val: " + scrollingOffset);
			currentLine++;

			if(wantScroll)
	  			$(window).scrollTo($("#" + genericLinePrefix + currentLine), {axis: 'y', interrupt: true, duration: 1000, offset :{top :scrollingOffset}});
		}
	}
	componentDidMount(){
	}

	render() {
		return (
			<div className="audioContainer">
				<audio controls="true" id="audioPlayer" onTimeUpdate={this.highlightLine}></audio>
			</div> 
		);
	}
}


