import ConstsClass from './const.js'
import $ from 'jquery'

export default class AudioPlayer extends React.Component {
  	constructor(props, context){
  		super(props, context);
  		this.state={
  		};
		this.updateLine = this.updateLine.bind(this);
		this.checkTimes = this.checkTimes.bind(this);
	}
	componentDidMount(){
		console.log("set listener");
		this.refs.audioHTML.ontimeupdate = this.checkTimes;
	}

	checkTimes(){
		console.log("checking times")
		if(this.props.times.length !=0){
			let times = this.props.times;
			let currentLine = this.props.currentLine;
			let convertedToSeconds = ConstsClass.timestampToSeconds(times[currentLine]);
			let time = this.refs.audioHTML.currentTime;
			if (time >= convertedToSeconds)
			{
				
				this.updateLine();
				//docs: https://github.com/flesler/jquery.scrollTo
				// console.log("scrolling val: " + scrollingOffset);
				this.props.updateCurrentLine(currentLine + 1);
				// if(wantScroll)
		  		// 	$(window).scrollTo($("#" + genericLinePrefix + currentLine), {axis: 'y', interrupt: true, duration: 1000, offset :{top :scrollingOffset}});
			}
		}


		
	}

	setCurrentTime(newTime){
		this.refs.audioHTML.currentTime = newTime;
		this.refs.audioHTML.play();
	}

	togglePlayer(){
		this.refs.audioHTML.paused ? this.refs.audioHTML.play() : this.refs.audioHTML.pause();
	}

	updateLine(){
		console.log("updating line");
		$("#" + ConstsClass.genericLinePrefix + (currentLine - 1)).css('color', foregroundColor);
		$("#" + ConstsClass.genericLinePrefix + (currentLine )).css('color', foregroundColor);
		$("#" + ConstsClass.genericLinePrefix + (currentLine + 1)).css('color', highlightColor);
	}


	setSong(songSource){
		this.refs.audioHTML.src = songSource;
	}


	render() {
		return (
			<div className="audioContainer">
				<audio controls="true" ref="audioHTML" id="audioPlayer" ></audio>
			</div> 
		);
	}
}


