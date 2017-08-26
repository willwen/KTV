import ReactDOM from 'react-dom';

import Visualizer from './Visualizer.jsx'
import PageHeader from './Header.jsx'
import SearchPanel from './SearchPanel.jsx'

import OptionsMenu from './OptionsMenu.jsx'
import SongTitle from './SongTitle.jsx'
import LyricsBody from './LyricsBody.jsx'
import AudioPlayer from './AudioPlayer.jsx'

import axios from 'axios'
import $ from 'jquery'

export default class MainContainer extends React.Component {
	constructor(){
		super();
		this.state={
			currentTitle: '',
			currentArtist: '',
			currentLine: 0,
			areOptionsInflated: false, //opposite is collapsed
			lyrics: {
				pinyin : [],
				cn: [],
				eng: [],
				times : []
			},
			songPath: '',
			scrollingOffset: -400,
			options: {
				showPinyin: true,
				showCn: true,
				showEng: true,
				allowScrolling : true,
				showLineNums: true,
				showVisualizer: true
			}
		};
		this.setCurrentLine = this.setCurrentLine.bind(this);
		this.getSongLyrics = this.getSongLyrics.bind(this);
		this.handleNewLyrics = this.handleNewLyrics.bind(this);
		this.togglePinyin = this.togglePinyin.bind(this);
		this.toggleEng = this.toggleEng.bind(this);
		this.toggleCn = this.toggleCn.bind(this); 
		this.toggleScrolling = this.toggleScrolling.bind(this);
	  	this.toggleLineNums = this.toggleLineNums.bind(this);
	  	this.toggleVisualizer = this.toggleVisualizer.bind(this);
		this.scaleScrolling = this.scaleScrolling.bind(this);
		this.skipToLine = this.skipToLine.bind(this);
		this.changeLineColor = this.changeLineColor.bind(this)
		// this.renderFrame = this.renderFrame.bind(this);
	}
	componentWillMount(){
	  	this.scaleScrolling();
	}
	componentDidMount(){
		//enable all tooltips
	    let audioPlayer = this.refs.audioPlayer;
    	window.addEventListener("keydown", function(e) {
			if(e.keyCode == 32 && e.target == document.body) {
				audioPlayer.togglePlayer(); // space bar to toggle audio player
				e.preventDefault(); // and prevent scrolling
			}
			//set + and - listeners for volume

			else if(e.keyCode == 187 && e.target == document.body){
				audioPlayer.increaseVolume(); // increase audio player
				e.preventDefault();
			}
			else if(e.keyCode == 189 && e.target == document.body){
				audioPlayer.decreaseVolume(); // decrease audio player
				e.preventDefault();
			}
		});
		
  	  	window.addEventListener("resize", this.scaleScrolling);
	}
	componentWillUnmount(){
		window.removeEventListener("resize", this.scaleScrolling);
	}



	setCanvas(){
		var audio = this.refs.audioPlayer.refs.audioHTML;
		var context = new AudioContext()
	    var src = context.createMediaElementSource(audio);
	    var analyser = context.createAnalyser();

	    var canvas = this.refs.canvas;
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	    var ctx = canvas.getContext("2d");

	    src.connect(analyser);
	    analyser.connect(context.destination);

	    analyser.fftSize = 256;

	    var bufferLength = analyser.frequencyBinCount;

	    var dataArray = new Uint8Array(bufferLength);

	    var WIDTH = canvas.width; 
	    var HEIGHT = canvas.height;

	    var barWidth = (WIDTH / bufferLength) * 2.5;
	    var barHeight;
	    var x = 0;
	    var heightScale = HEIGHT/255;

		function renderFrame() {
			requestAnimationFrame(renderFrame);

			var x = 0;

			//analyser.getByteFrequencyData returns a normalized array of values between 0 and 255.
			analyser.getByteFrequencyData(dataArray);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			// ctx.fillStyle = "rgba(0,0,0,0)";

			for (var i = 0; i < bufferLength; i++) {


				barHeight = dataArray[i];

				var r = barHeight + (25 * (i/bufferLength));
				var g = 250 * (i/bufferLength);
				var b = 240;

				ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ", .25)";
				ctx.fillRect(x, HEIGHT - (barHeight * heightScale), barWidth, (barHeight * heightScale));
				//add a top border line
				ctx.beginPath();
				ctx.moveTo(x, HEIGHT - (barHeight * heightScale))
				ctx.lineTo((x + barWidth), HEIGHT - (barHeight * heightScale));
				ctx.closePath();
				ctx.stroke();
				x += barWidth + 1;
      		}
		}
		this.refs.audioPlayer.togglePlayer(); // start by playing
	    renderFrame();
	}

	scaleScrolling(){
	   var winWidth =  $(window).width();
	   var winHeight = $(window).height();
	   this.setState({scrollingOffset: (-1 * Math.round(winHeight * .35))});
	}

	setCurrentLine(val){
		this.setState({currentLine : val});
	}

	getSongLyrics(id, title, artist){
		axios.get("song", {params: {'id': id}} ).then(this.handleNewLyrics).catch(error => console.log(error));
		this.setState({currentTitle: title , currentArtist: artist , currentLine : 0 });

	}
	//called when a user clicks on a new song
	handleNewLyrics(response){
		console.log(response);
		this.setState({
			currentLine: 0,
			lyrics: {
				cn : response.data['cn.txt'],
				eng : response.data['eng.txt'],
				pinyin : response.data['pinyin.txt'],
				times : response.data['times.txt']
			},
			songPath : response.data['songFile'],
			areOptionsInflated: true//!this.state.areOptionsInflated
		});
		this.refs.audioPlayer.setSong(this.state.songPath);
		this.setCanvas();
	}

	

	skipToLine(lineToSet, timeToSet){
		this.refs.audioPlayer.setCurrentTime(timeToSet);
		this.setState({currentLine : lineToSet});
	}


	render() {
		return (
			<div>
			  <canvas className = "canvas" ref="canvas"></canvas>
		      <div className="container">
		      	
		      	<PageHeader/>
		      	<SearchPanel getSongLyrics={this.getSongLyrics}/>
				<OptionsMenu
					options = {this.state.options}
					open = {this.state.areOptionsInflated}
					togglePinyin = {this.togglePinyin}
					toggleCn = {this.toggleCn}
					toggleEng = {this.toggleEng}
					toggleLineNums = {this.toggleLineNums}
					toggleScrolling = {this.toggleScrolling}
					toggleVisualizer = {this.toggleVisualizer}
				/>
				<div className = "clearfix"></div>
				<SongTitle 
					title = {this.state.currentTitle}
					artist = {this.state.currentArtist}/>

				<LyricsBody ref = "lyricsBody" currentLine={this.state.currentLine}
					lyrics = {this.state.lyrics}
					skipToTime={this.skipToLine}
					options={this.state.options}/>
		      </div>
		      <AudioPlayer ref="audioPlayer"
		      	times={this.state.lyrics.times}
		      	updateCurrentLine = {this.setCurrentLine}
		      	currentLine = {this.state.currentLine}
		      	scrollOffset = {this.state.scrollingOffset}
		      	allowScrolling = {this.state.options.allowScrolling}
		      	changeLineColor = {this.changeLineColor}/>
		  </div>
		);
	}

	changeLineColor(currentLine){
		this.refs.lyricsBody.incrementLineColor(currentLine);
	}

	//toggles:
	toggleScrolling(){
		let temp = this.state.options;
		temp['allowScrolling'] = !this.state.options.allowScrolling
	  	this.setState({
  			options : temp
	  	});
	}
	toggleLineNums(){
		let temp = this.state.options;
		temp['showLineNums'] = !this.state.options.showLineNums
	  	this.setState({
  			options : temp
	  	});
	}
	toggleVisualizer(){
		let temp = this.state.options;
		temp['showVisualizer'] = !this.state.options.showVisualizer
	  	this.setState({
  			options : temp
	  	});
	}

	togglePinyin(isChecked){
		let temp = this.state.options;
		temp['showPinyin'] = !this.state.options.showPinyin
	  	this.setState({
  			options : temp
	  	});
	}
	toggleCn(isChecked){
		let temp = this.state.options;
		temp['showCn'] = !this.state.options.showCn
	  	this.setState({
	  		options : temp
	  	});
	}
	toggleEng(isChecked){
		//shallow merging
		let temp = this.state.options;
		temp['showEng'] = !this.state.options.showEng
	  	this.setState({
	  		options : temp
	  	});
	}
}

ReactDOM.render(
  <MainContainer/>,
  document.getElementById('content')
);