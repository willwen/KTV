import ReactDOM from 'react-dom';

import PageHeader from './react_page_header.jsx'
import SearchPanel from './react_search_panel.jsx'

import OptionsMenu from './react_options_menu.jsx'
import SongTitle from './react_song_title.jsx'
import SongLyrics from './react_song_lyrics_body.jsx'
import AudioPlayer from './react_audio_player.jsx'

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
			songPath: ''
		};
		this.setCurrentLine = this.setCurrentLine.bind(this);
		this.getData = this.getData.bind(this);
		this.updateData = this.updateData.bind(this);
		// this.componentDidMount = this.componentDidMount.bind(this);
	}
	componenetWillMount(){

	}
	componentDidMount(){
		//enable all tooltips
	    // $('[data-toggle="tooltip"]').tooltip();
	    let audioPlayer = this.refs.audioPlayer;
    	window.addEventListener("keydown", function(e) {
		  if(e.keyCode == 32 && e.target == document.body) {
			audioPlayer.togglePlayer(); // space bar to toggle audio player
			e.preventDefault(); // and prevent scrolling
		  }
		});
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
			pinyin : response.data['pinyin.txt'],
			cn : response.data['cn.txt'],
			eng : response.data['eng.txt'],
			times : response.data['times.txt'],
			songPath : response.data['songPath']
		})

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
		      	<SearchPanel getData={this.getData}/>
				<OptionsMenu/>
				<div className = "clearfix"></div>
				<SongTitle title = {this.state.currentTitle} artist = {this.state.currentArtist}/>
				<SongLyrics currentLine={this.state.currentLine}
					times = {this.state.times}
					pinyin = {this.state.pinyin}
					cnChar = {this.state.cn} 
					eng = {this.state.eng} 
					skipToTime={this.skipToLine.bind(this)}/>
		      </div>
		      <AudioPlayer ref="audioPlayer" times={this.state.times}
		      	updateCurrentLine = {this.setCurrentLine}
		      	currentLine = {this.state.currentLine}
		      	onLineChange = {this.setCurrentLine}/>
		  </div>
		);
	}
}

ReactDOM.render(
  <MainContainer/>,
  document.getElementById('content')
);