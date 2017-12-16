import Constants from './Constants.jsx'
import AudioAnimations from '../SharedReactComponents/AudioAnimations.jsx'
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
		this.calcSeekedLineNumber = this.calcSeekedLineNumber.bind(this)
		this.setCurrentTime = this.setCurrentTime.bind(this)

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
	}
	
	// when props like currentLine update
	componentWillReceiveProps(nextProps){
		let nextLine = nextProps.currentLine
		let timestamps = nextProps.timestamps
		let nextTimestamp = Constants.timestampToSeconds(timestamps[nextLine])
		if(nextTimestamp == 0 && nextProps.currentLine == 0){ // fixes a bug if the first time is 0, it isnt highlighted
			this.props.incrementLine()
		}
		else{
			this.setState({nextTimestamp: nextTimestamp})
			// console.log(nextTimestamp)
		}		
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
					$(window).finish();
					$(window).scrollTo($("#" +Constants.ConstsClass.genericLinePrefix + currentLine), {axis: 'y', interrupt: true, duration: 500, offset :{top : this.props.scrollOffset}});
				}
			}
		}		
	}


	increaseVolume(){
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


	setCurrentTime(newLine){
		let newTime = Constants.timestampToSeconds(this.props.timestamps[newLine-1]); //minus one because lyrics start at 0 while currentLine starts at 1
		console.log(newTime)
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


	calcSeekedLineNumber(){
		let newSeekedTime = this.refs.audioHTML.currentTime
		for (var i = 0 ; i < this.props.timestamps.length ; i++){
			if(newSeekedTime < this.props.timestamps[i])
				break;
		}
		//user seeked to line number... (i-1)
		console.log("seeking to ", i)
		this.props.userSeeked(i)
	}

	render() {
		return (
			<div>
				{this.props.addInstrumental ? 
					(<div className="audioContainer">
						<audio controls="true" ref="audioHTMLinstru" id="instrumentalAudioPlayer" src={this.props.instrumentalPath} controls controlsList="nodownload noremoteplayback"></audio>
					</div>)
					:
					null
				}
				<div className="audioContainer">
					<audio crossOrigin = "anonymous"
						controls="true"
						ref="audioHTML"
						id="audioPlayer"
						src={this.props.currentSong}
						controls
						controlsList="nodownload"
						
					/>
				</div> 
				<AudioAnimations action = {this.state.action}/>
				<Visualizer audioPlayer = {this.refs.audioHTML} showVisualizer = {this.props.showVisualizer}/>
			</div>

		);
	}
}
// onSeeked={this.calcSeekedLineNumber}
