import ReactDOM from 'react-dom';

import PageHeader from './react_page_header.jsx'
import SearchPanel from './react_search_panel.jsx'

import OptionsMenu from './react_options_menu.jsx'
import SongTitle from './react_song_title.jsx'
import SongLyrics from './react_song_lyrics_body.jsx'
import AudioPlayer from './react_audio_player.jsx'


export default class MainContainer extends React.Component {
	constructor(){
		super();
		this.state={
			times : [],
			currentLine: 0

		};
		this.setCurrentLine = this.setCurrentLine.bind(this);
	}
	componenetWillMount(){

	}
	componentDidMount(){

	}
	setCurrentLine(val){
		this.setState(currentLine : val);
	}

	

	render() {
		return (
			<div>
		      <div className="container">
		      	<PageHeader/>
		      	<SearchPanel/>
				<OptionsMenu/>
				<div className = "clearfix"></div>
				<SongTitle/>
				<SongLyrics/>
		      </div>
		      <AudioPlayer times={this.state.times} currentLine={this.state.currentLine} onLineChange={this.setCurrentLine}/>
		  </div>
		);
	}

	timestampToSeconds(timestamp){
		return Math.floor(timestamp/100) * 60 + timestamp%100;
	}
}

ReactDOM.render(
  <MainContainer/>,
  document.getElementById('content')
);