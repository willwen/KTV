import Constants from './Constants.jsx'
import $ from 'jquery'
import scrollTo from 'jquery.scrollTo'

export default class AudioPlayer extends React.Component {
  	constructor(props, context){
  		super(props, context);
  		this.state={
  		};
		this.updateLine = this.updateLine.bind(this);
		this.checkTimes = this.checkTimes.bind(this);
	}
	componentDidMount(){
		this.refs.audioHTML.ontimeupdate = this.checkTimes;
	}

	checkTimes(){
		if(this.props.times.length !=0){
			let times = this.props.times;
			let currentLine = this.props.currentLine;
			console.log(currentLine);
			let convertedToSeconds = Constants.timestampToSeconds(times[currentLine]);
			let time = Math.round(this.refs.audioHTML.currentTime);

			if(convertedToSeconds == 0 && currentLine != 0){
				this.props.updateCurrentLine(currentLine + 1);
				return;
			}

			if (time >= convertedToSeconds)
			{
				var t0 = performance.now();
				this.updateLine(currentLine);
				var t1 = performance.now();
				console.log("Call to colorLines took " + (t1 - t0) + " milliseconds.")
				//docs: https://github.com/flesler/jquery.scrollTo
				// console.log("scrolling val: " + scrollingOffset);
				this.props.updateCurrentLine(currentLine + 1);
				if(this.props.allowScrolling)
		  			$(window).scrollTo($("#" +Constants.ConstsClass.genericLinePrefix + currentLine), {axis: 'y', interrupt: true, duration: 1000, offset :{top : this.props.scrollOffset}});
			}
		}


		
	}

	setCurrentTime(newTime){
		this.refs.audioHTML.currentTime = newTime;
		this.refs.audioHTML.play();
	}

	setSong(songSource){
		this.refs.audioHTML.src = songSource;
	}

	togglePlayer(){
		this.refs.audioHTML.paused ? this.refs.audioHTML.play() : this.refs.audioHTML.pause();
	}

	updateLine(currentLine){
		$("#" + Constants.ConstsClass.genericLinePrefix + (currentLine - 1)).css('color', Constants.ConstsClass.foregroundColor);
		$("#" + Constants.ConstsClass.genericLinePrefix + (currentLine )).css('color', Constants.ConstsClass.foregroundColor);
		$("#" + Constants.ConstsClass.genericLinePrefix + (currentLine + 1)).css('color', Constants.ConstsClass.highlightColor);	
	}

	render() {
		return (
			<div className="audioContainer">
				<audio controls="true" ref="audioHTML" id="audioPlayer" ></audio>
			</div> 
		);
	}
}


