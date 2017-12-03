import Constants from './Constants.jsx'
import AudioAnimations from './AudioAnimations.jsx'
// import {scroller} from 'react-scroll'; //Imports scroller mixin, can use as scroller.scrollTo()
import $ from 'jquery'		
import scrollTo from 'jquery.scrollTo'
import Visualizer from './Visualizer.jsx'

export default class AudioPlayer extends React.Component {
  	constructor(props, context){
  		super(props, context);

  		this.togglePlayer = this.togglePlayer.bind(this);
		this.checkTimes = this.checkTimes.bind(this);
		this.play = this.play.bind(this)
		this.pause = this.pause.bind(this)
		this.changeTime = this.changeTime.bind(this)

		this.state = {
			action : "none",
			nextTimestamp: "0"
		}
	}
	componentDidMount(){
		this.refs.audioHTML.ontimeupdate = this.checkTimes;
		this.refs.audioHTML.volume = .5;
		//lambda function because they dont have their own this binding
		window.addEventListener("keydown", (e) => {
			if(e.keyCode == 32 && e.target == document.body) {
				this.togglePlayer(); // space bar to toggle audio player
				e.preventDefault(); // and prevent scrolling
			}
			//set + and - listeners for volume

			else if(e.keyCode == 187 && e.target == document.body){
				this.increaseVolume(); // increase audio player
				e.preventDefault();
			}
			else if(e.keyCode == 189 && e.target == document.body){
				this.decreaseVolume(); // decrease audio player
				e.preventDefault();
			}
		});
		let times = this.props.timestamps;
		this.setState({nextTimestamp: Constants.timestampToSeconds(times[this.props.currentLine])})
		var AudioContext = window.AudioContext || window.webkitAudioContext;  // Safari and old versions of Chrome
		var context = new AudioContext();
		var src = context.createMediaElementSource(this.refs.audioHTML);
		this.setState({"src": src})
	}
	// when props like currentLine update
	componentWillReceiveProps(nextProps){
		if(nextProps.timestamps)
			this.setState({nextTimestamp: Constants.timestampToSeconds(nextProps.timestamps[nextProps.currentLine])})
	}


	checkTimes(){
		if(this.props.timestamps.length !=0){
			let currentLine = this.props.currentLine
			let nextLineTime = this.state.nextTimestamp;
			//round is vital to get realistic that "preemptive" scrolling feel
			let currentTime = Math.round(this.refs.audioHTML.currentTime);
			let counter = 1
			while(nextLineTime == 0){//if the next line is empty
				nextLineTime = Constants.timestampToSeconds(this.props.timestamps[currentLine + counter]);
				counter++;
			}

			if (currentTime >= nextLineTime)
			{
				// var t0 = performance.now();
				// this.updateLine(currentLine);
				// var t1 = performance.now();

				// console.log("scrolling val: " + this.props.scrollOffset);
				this.props.incrementLine();
				if(this.props.allowScrolling){
					$(window).scrollTo($("#" +Constants.ConstsClass.genericLinePrefix + currentLine), {axis: 'y', interrupt: true, duration: 500, offset :{top : this.props.scrollOffset}});
				}
			}
		}		
	}


	increaseVolume(){
		var that = this
		this.setState({action : "vol_up"});
		setTimeout(function(){
				this.setState({"action": "none"})
		}.bind(this), 2000)
		if(this.refs.audioHTML.volume != 1.0)
			this.refs.audioHTML.volume = this.refs.audioHTML.volume + .1;
	}

	decreaseVolume(){
		this.setState({action : "vol_down"});
		setTimeout(function(){
				this.setState({"action": "none"})
		}.bind(this), 2000)
		if(this.refs.audioHTML.volume > .1)
			this.refs.audioHTML.volume = this.refs.audioHTML.volume - .1;	
	}


	setCurrentTime(newTime){
		this.changeTime(newTime);
		this.play();
	}

	togglePlayer(){
		if(this.refs.audioHTML.paused){
			this.setState({action : "play"});
			setTimeout(function(){
				this.setState({"action": "none"})
			}.bind(this), 2000)
			this.play();
		}
		else{
			this.setState({action : "pause"});
			setTimeout(function(){
				this.setState({"action": "none"})
			}.bind(this), 2000)
			this.pause();
		}
	}

	changeTime(newTime){
		this.refs.audioHTML.currentTime = newTime;
		if(this.props.instrumentalPath)
			this.refs.audioHTMLinstru.currentTime = newTime;
	}

	play(){
		this.refs.audioHTML.play()
		if(this.props.instrumentalPath)
			this.refs.audioHTMLinstru.play()
	}

	pause(){
		this.refs.audioHTML.pause();
		if(this.props.instrumentalPath)
			this.refs.audioHTMLinstru.pause()
	}

	render() {
		return (
			<div>
				

				{this.props.instru ? 
					(<div className="audioContainer">
						<audio controls="true" ref="audioHTMLinstru" id="instrumentalAudioPlayer" src={this.props.instrumentalPath} controls controlsList="nodownload noremoteplayback"></audio>
					</div>)
					:
					null
				}
				<div className="audioContainer">
					<audio controls="true" ref="audioHTML" id="audioPlayer" src={this.props.currentSong} controls controlsList="nodownload"></audio>
				</div> 
				<AudioAnimations action = {this.state.action}/>
				<Visualizer audioPlayer = {this.refs.audioHTML}/>
			</div>

		);
	}
}