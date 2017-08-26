import Constants from './Constants.jsx'
import $ from 'jquery'
import scrollTo from 'jquery.scrollTo'
import ReactSVG from 'react-svg'
export default class AudioPlayer extends React.Component {
  	constructor(props, context){
  		super(props, context);

  		this.togglePlayer = this.togglePlayer.bind(this);
		this.updateLine = this.updateLine.bind(this);
		this.checkTimes = this.checkTimes.bind(this);
		this.getAudioPlayer = this.getAudioPlayer.bind(this);
	}
	componentDidMount(){
		this.refs.audioHTML.ontimeupdate = this.checkTimes;
	}

	checkTimes(){
		if(this.props.times.length !=0){
			let times = this.props.times;
			let currentLine = this.props.currentLine;
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
				//docs: https://github.com/flesler/jquery.scrollTo
				// console.log("scrolling val: " + scrollingOffset);
				this.props.updateCurrentLine(currentLine + 1);
				if(this.props.allowScrolling)
		  			$(window).scrollTo($("#" +Constants.ConstsClass.genericLinePrefix + currentLine), {axis: 'y', interrupt: true, duration: 1000, offset :{top : this.props.scrollOffset}});
			}
		}


		
	}

	increaseVolume(){
		if(this.refs.audioHTML.volume != 1.0)
			this.refs.audioHTML.volume = this.refs.audioHTML.volume + .1;
	}

	decreaseVolume(){
		if(this.refs.audioHTML.volume > .1)
			this.refs.audioHTML.volume = this.refs.audioHTML.volume - .1;	
	}

	setCurrentTime(newTime){
		this.refs.audioHTML.currentTime = newTime;
		this.refs.audioHTML.play();
	}

	setSong(songSource){
		this.refs.audioHTML.src = songSource;
	}

	getAudioPlayer(){
		return this.refs.audioHTML;
	}

	togglePlayer(){
		if(this.refs.audioHTML.paused){
			// $("#circle").attr("class", "play");
			// $("#from_pause_to_play")[0].beginElement();
			this.refs.audioHTML.play()
		}
		else{
			// $("#circle").attr("class", "");
			// $("#from_play_to_pause")[0].beginElement();
		    this.refs.audioHTML.pause();
		}
	}

	updateLine(currentLine){
		this.props.changeLineColor(currentLine);
	}

	render() {
		return (
			<div>

				<div className="audioContainer">
					<audio controls="true" ref="audioHTML" id="audioPlayer" ></audio>
				</div> 
			</div>
		);
	}
}


/**
	<ReactSVG
	path="playPause.svg"
	callback={svg => console.log(svg)}
	className="example"
	style = {{
		"position":"absolute",
		top: "0px"
		// "paddingTop": "10vh",
		// margin: "0px auto",
		// display: "block"
	}}
		/>
**/