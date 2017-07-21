import ReactDOM from 'react-dom';

import PageHeader from './Header.jsx'
import SearchPanel from './SearchPanel.jsx'

import OptionsMenu from './OptionsMenu.jsx'
import SongTitle from './SongTitle.jsx'
import SongLyrics from './LyricsBody.jsx'
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
			pinyin : [],
			cn: [],
			eng: [],
			times : [],
			songPath: '',
			scrollingOffset: -400,
			allowScrolling : true,
			showLineNums: true,
			showPinyin: true,
			showCn: true,
			showEng: true,
		};
		this.setCurrentLine = this.setCurrentLine.bind(this);
		this.getData = this.getData.bind(this);
		this.updateData = this.updateData.bind(this);
	}

	toggleScrolling(){
	  	this.setState({
	  		allowScrolling : !this.state.allowScrolling
	  	})
	}
	toggleLineNums(){
	  	this.setState({
	  		showLineNums : !this.state.showLineNums
	  	})
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
	componentWillMount(){
		this.scaleScrolling = this.scaleScrolling.bind(this);
	  	this.scaleScrolling();
	}

	scaleScrolling(){
	   var winWidth =  $(window).width();
	   var winHeight = $(window).height();
	   console.log("window height: " + $(window).height());
	   this.setState({scrollingOffset: (-1 * Math.round(winHeight * .35))});
	}

	setCurrentLine(val){
		this.setState({currentLine : val});
	}

	getData(id, title, artist){
		// console.log(id);
		axios.get("song", {params: {'id': id}} ).then(this.updateData).catch(error => console.log(error));
		this.setState({currentTitle: title , currentArtist: artist , currentLine : 0 });

	}
	updateData(response){
		console.log(response);
		this.setState({
			currentLine: 0,
			pinyin : response.data['pinyin.txt'],
			cn : response.data['cn.txt'],
			eng : response.data['eng.txt'],
			times : response.data['times.txt'],
			songPath : response.data['songPath']
		})
		this.refs.optionsMenu.toggleCollapse();
		this.refs.audioPlayer.setSong(this.state.songPath);
	}



	skipToLine(lineToSet, timeToSet){
		this.refs.audioPlayer.setCurrentTime(timeToSet);
		this.setState({currentLine : lineToSet});
	}
	togglePinyin(isChecked){
	  	this.setState({
	  		showPinyin : !this.state.showPinyin
	  	})
	}
	toggleCn(isChecked){
	  	this.setState({
	  		showCn :  !this.state.showCn
	  	})
	}
	toggleEng(isChecked){
	  	this.setState({
	  		showEng :  !this.state.showEng
	  	})
	}

	render() {
		return (
			<div>
		      <div className="container">
		      	<PageHeader/>
		      	<SearchPanel getData={this.getData}/>
				<OptionsMenu ref="optionsMenu" 
					togglePinyin = {this.togglePinyin.bind(this)}
					toggleCn = {this.toggleCn.bind(this)}
					toggleEng = {this.toggleEng.bind(this)}
					toggleScrolling = {this.toggleScrolling.bind(this)}
					toggleLineNums = {this.toggleLineNums.bind(this)}/>
				<div className = "clearfix"></div>
				<SongTitle title = {this.state.currentTitle} artist = {this.state.currentArtist}/>
				<SongLyrics currentLine={this.state.currentLine}
					times = {this.state.times}
					pinyin = {this.state.pinyin}
					cnChar = {this.state.cn} 
					eng = {this.state.eng} 
					skipToTime={this.skipToLine.bind(this)}
					showLineNums = {this.state.showLineNums}
					showPinyin = {this.state.showPinyin}
					showCn = {this.state.showCn}
					showEng = {this.state.showEng}/>
		      </div>
		      <AudioPlayer ref="audioPlayer" times={this.state.times}
		      	updateCurrentLine = {this.setCurrentLine}
		      	currentLine = {this.state.currentLine}
		      	onLineChange = {this.setCurrentLine}
		      	scrollOffset = {this.state.scrollingOffset}
		      	allowScrolling = {this.state.allowScrolling}/>
		  </div>
		);
	}
}

ReactDOM.render(
  <MainContainer/>,
  document.getElementById('content')
);