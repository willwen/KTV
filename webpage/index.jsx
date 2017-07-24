import ReactDOM from 'react-dom';

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
				showLineNums: true
			}
		};
		this.setCurrentLine = this.setCurrentLine.bind(this);
		this.getSongLyrics = this.getSongLyrics.bind(this);
		this.handleNewLyrics = this.handleNewLyrics.bind(this);
		this.togglePinyin = this.togglePinyin.bind(this);
		this.toggleEng = this.toggleEng.bind(this);
		this.toggleCn = this.toggleCn.bind(this); 
		this.scaleScrolling = this.scaleScrolling.bind(this);
		this.skipToLine = this.skipToLine.bind(this);
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
		});
		
  	  	window.addEventListener("resize", this.scaleScrolling);
	}
	componentWillUnmount(){
		window.removeEventListener("resize", this.scaleScrolling);
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
	}



	skipToLine(lineToSet, timeToSet){
		this.refs.audioPlayer.setCurrentTime(timeToSet);
		this.setState({currentLine : lineToSet});
	}


	render() {
		return (
			<div>
		      <div className="container">
		      	<PageHeader/>
		      	<SearchPanel getSongLyrics={this.getSongLyrics}/>
				<OptionsMenu
					options = {this.state.options}
					open = {this.state.areOptionsInflated}
				/>
				<div className = "clearfix"></div>
				<SongTitle 
					title = {this.state.currentTitle}
					artist = {this.state.currentArtist}/>
				<LyricsBody currentLine={this.state.currentLine}
					lyrics = {this.state.lyrics}
					skipToTime={this.skipToLine}
					options={this.state.options}/>
		      </div>
		      <AudioPlayer ref="audioPlayer"
		      	times={this.state.lyrics.times}
		      	updateCurrentLine = {this.setCurrentLine}
		      	currentLine = {this.state.currentLine}
		      	scrollOffset = {this.state.scrollingOffset}
		      	allowScrolling = {this.state.options.allowScrolling}/>
		  </div>
		);
	}

	//toggles:
	toggleScrolling(){
	  	this.setState({
	  		options:{
	  			allowScrolling : !this.state.allowScrolling
	  		}
	  	});
	}
	toggleLineNums(){
	  	this.setState({
	  		options: {
	  			showLineNums : !this.state.showLineNums
	  		}
	  	});
	}
		togglePinyin(isChecked){
	  	this.setState({
	  		options: {
	  			showPinyin : !this.state.showPinyin
	  		}
	  	});
	}
	toggleCn(isChecked){
	  	this.setState({
	  		options: {
	  			showCn : !this.state.showCn
	  		}
	  	});
	}
	toggleEng(isChecked){
	  	this.setState({
	  		options: {
	  			showEng :  !this.state.showEng
	  		}
	  	});
	}
}

ReactDOM.render(
  <MainContainer/>,
  document.getElementById('content')
);