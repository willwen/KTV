import Constants from './Constants.jsx'
import $ from 'jquery'
import scrollTo from 'jquery.scrollTo'
import AudioAnimations from './AudioAnimations.jsx'


export default class AudioPlayer extends React.Component {
  	constructor(props, context){
  		super(props, context);

  		this.togglePlayer = this.togglePlayer.bind(this);
		this.updateLine = this.updateLine.bind(this);
		this.checkTimes = this.checkTimes.bind(this);
		this.getAudioPlayer = this.getAudioPlayer.bind(this);
		this.state = {
			action : "none"
		}
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
		  			$(window).scrollTo($("#" +Constants.ConstsClass.genericLinePrefix + currentLine), {axis: 'y', interrupt: true, duration: 500, offset :{top : this.props.scrollOffset}});
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
	resetAction(){

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
			this.setState({action : "play"});
			setTimeout(function(){
				this.setState({"action": "none"})
			}.bind(this), 2000)
			this.refs.audioHTML.play()
		}
		else{
			this.setState({action : "pause"});
			setTimeout(function(){
				this.setState({"action": "none"})
			}.bind(this), 2000)
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
				<AudioAnimations action = {this.state.action}/>
			</div>

		);
	}
}