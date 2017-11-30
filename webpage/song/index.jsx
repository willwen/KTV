import ReactDOM from 'react-dom';

import Visualizer from './Visualizer.jsx'
import PageHeader from '../SharedReactComponents/Header.jsx'

import OptionsMenu from './OptionsMenu.jsx'
import SongTitle from './SongTitle.jsx'
import LyricsBody from './LyricsBody.jsx'
import AudioPlayer from './AudioPlayer.jsx'

import axios from 'axios'

export default class MainContainer extends React.Component {
	constructor(){
		super();
		this.state={
			currentTitle: '',
			currentArtist: '',
			currentLine: 0,
			areOptionsInflated: true, //opposite is collapsed
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
		this.incrementLine = this.incrementLine.bind(this);
		this.getSongLyrics = this.getSongLyrics.bind(this);
		this.handleNewLyrics = this.handleNewLyrics.bind(this);
		this.togglePinyin = this.togglePinyin.bind(this);
		this.toggleEng = this.toggleEng.bind(this);
		this.toggleCn = this.toggleCn.bind(this); 
		this.toggleScrolling = this.toggleScrolling.bind(this);
	  	this.toggleLineNums = this.toggleLineNums.bind(this);
	  	this.toggleVisualizer = this.toggleVisualizer.bind(this);
		
		this.skipToLine = this.skipToLine.bind(this);

		//window resizing, update the canvas and scrolling offset.
		this.onWindowResized = this.onWindowResized.bind(this);
		this.scaleScrolling = this.scaleScrolling.bind(this);
		this.scaleCanvas = this.scaleCanvas.bind(this);

		this.setCanvas = this.setCanvas.bind(this)
		this.getParameterByName = this.getParameterByName.bind(this)
	}
	componentWillMount(){
	  	this.scaleScrolling();
	}
	componentDidMount(){
		var id = this.getParameterByName('id');
		var title = this.getParameterByName('title');
		var artist = this.getParameterByName('artist')
		this.getSongLyrics(id, title, artist);

		window.addEventListener("resize", this.onWindowResized);
  		this.setCanvas();

	}
	componentWillUnmount(){
		window.removeEventListener("resize", this.onWindowResized);
	}

	onWindowResized(event){
		this.scaleScrolling();
		this.scaleCanvas();
	}

	scaleCanvas(){
		var canvas = this.refs.canvas;
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	}

	setCanvas(){
		var audio = this.refs.audioPlayer.refs.audioHTML;
		var AudioContext = window.AudioContext || window.webkitAudioContext;  // Safari and old versions of Chrome
		var context = new AudioContext();
		var src = context.createMediaElementSource(audio);
		var analyser = context.createAnalyser();

		var canvas = this.refs.canvas;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		var ctx = canvas.getContext("2d");

		src.connect(analyser);
		analyser.connect(context.destination);

		var isMobile = false; //initiate as false
		// https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery
		// device detection
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
			|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))
			isMobile = true;
		if(isMobile){
			analyser.fftSize = 64;
			console.log("assumed on mobile")
		}
		else{
			console.log("assumed on desktop")
			var width = window.innerWidth
			if (width < 768) {
				// do something for small screens
				analyser.fftSize = 64;
			}
			else if (width >= 768 &&  width <= 992) {
				// do something for medium screens
				analyser.fftSize = 128;
			}
			else {
				// do something for huge screens
				analyser.fftSize = 256;
			}
		}
		var bufferLength = analyser.frequencyBinCount;
		var dataArray = new Uint8Array(bufferLength);

		function renderFrame() {
			let WIDTH = canvas.width; 
			let HEIGHT = canvas.height;

			let barWidth = (WIDTH / bufferLength) * 2.5;
			let x = 0;
			let heightScale = HEIGHT/255;
			requestAnimationFrame(renderFrame);

			//analyser.getByteFrequencyData returns a normalized array of values between 0 and 255.
			analyser.getByteFrequencyData(dataArray);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			// ctx.fillStyle = "rgba(0,0,0,0)";

			for (var i = 0; i < bufferLength; i++) {
				let barHeight = dataArray[i];
				let percentage = i/bufferLength
				let r = barHeight + (25 * percentage);
				let g = 250 * percentage;
				let b = 256;
				ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ", .8)";
				// x	The x-coordinate of the upper-left corner of the rectangle
				// y	The y-coordinate of the upper-left corner of the rectangle
				// width	The width of the rectangle, in pixels
				// height	The height of the rectangle, in pixels
				let product = barHeight * heightScale
				let diff = HEIGHT - product
				ctx.fillRect(x, diff, barWidth, product);
				//add a top border line
				ctx.beginPath();
				ctx.moveTo(x, diff)
				ctx.lineTo((x + barWidth), diff);
				ctx.closePath();
				ctx.stroke();
				x += barWidth + 1;
			}
		}

	    renderFrame();
	}

	//Thank you https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/901144
	getParameterByName(name, url) {
	    if (!url) url = window.location.href;
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	scaleScrolling(){
	   // var winWidth =  window.innerWidth;
	   var winHeight = window.innerHeight;
	   this.setState({scrollingOffset: (-1 * Math.round(winHeight * .20))});
	}

	incrementLine(){
		let nextLine = this.state.currentLine + 1;
		this.setState({currentLine : nextLine});
	}

	getSongLyrics(id, title, artist){
		axios.get("getSong", {params: {'id': id}} )
			.then((response)=>{
				this.handleNewLyrics(response)
			})
			.catch((error) => {
				console.log(error)
			});
		this.setState({currentTitle: title , currentArtist: artist});

	}
	//called when a user clicks on a new song
	handleNewLyrics(response){
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
	}

	

	skipToLine(lineToSet, timeToSet){
		this.setState({currentLine : lineToSet});
		this.refs.audioPlayer.setCurrentTime(timeToSet);
		
	}


	render() {
		return (
			<div>
			  <canvas className = "canvas" ref="canvas"></canvas>
		      <div>
		      	
		      	<PageHeader/>
		      	<div className="container">
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
		      </div>
		      <AudioPlayer ref="audioPlayer"
		      	currentSong = {this.state.songPath}
		      	times={this.state.lyrics.times}
		      	incrementLine = {this.incrementLine}
		      	currentLine = {this.state.currentLine}
		      	scrollOffset = {this.state.scrollingOffset}
		      	allowScrolling = {this.state.options.allowScrolling}
				/>
		  </div>
		);
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
