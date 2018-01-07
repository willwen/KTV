import ReactDOM from "react-dom";

import PageHeader from "../SharedReactComponents/Header.jsx";

import OptionsMenu from "./OptionsMenu.jsx";
import SongTitle from "./SongTitle.jsx";
import LyricsBody from "./LyricsBody.jsx";
import AudioPlayer from "./AudioPlayer.jsx";

import axios from "axios";

export default class MainContainer extends React.Component {
	constructor() {
		super();
		this.state = {
			currentLine: 0,
			scrollingOffset: -400,
			currentTitle: "",
			currentArtist: "",
			primaryLanguage: "",
			pronounciationLanguage: "",
			translatedLanguage: "",
			addInstrumental: 0,
			instrumentalPath: "",
			lyrics: {
				primaryLanguageLyrics: [],
				translatedLanguageLyrics: [],
				pronounciationLanguageLyrics: [],
				timestamps: []
			},
			options: {
				showPronounciation: true,
				showPrimary: true,
				showTranslated: true,
				allowScrolling: true,
				showLineNums: true,
				showVisualizer: true
			}
		};
		this.incrementLine = this.incrementLine.bind(this);
		this.getSongLyrics = this.getSongLyrics.bind(this);
		this.handleNewLyrics = this.handleNewLyrics.bind(this);
		this.anchorClickUpdateLine = this.anchorClickUpdateLine.bind(this);
		this.userSeeked = this.userSeeked.bind(this);

		this.togglePronounciation = this.togglePronounciation.bind(this);
		this.toggleTranslated = this.toggleTranslated.bind(this);
		this.togglePrimary = this.togglePrimary.bind(this);
		this.toggleScrolling = this.toggleScrolling.bind(this);
		this.toggleLineNums = this.toggleLineNums.bind(this);
		this.toggleVisualizer = this.toggleVisualizer.bind(this);

		//window resizing, update the scrolling offset.
		this.onWindowResized = this.onWindowResized.bind(this);
		this.scaleScrolling = this.scaleScrolling.bind(this);
		this.getParameterByName = this.getParameterByName.bind(this);
	}
	componentWillMount() {
		this.scaleScrolling();
	}
	componentDidMount() {
		var id = this.getParameterByName("id");
		var instru = parseInt(this.getParameterByName("instru"));
		//Not sure why, but calling set State here doesnt change the state...., so I am
		//setting state in ajax callback instead.
		this.getSongLyrics(id, instru);

		window.addEventListener("resize", this.onWindowResized);
	}
	componentWillUnmount() {
		window.removeEventListener("resize", this.onWindowResized);
	}

	onWindowResized(event) {
		this.scaleScrolling();
	}

	//Thank you https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/901144
	getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return "";
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	getSongLyrics(id, instru) {
		let params;
		if (instru) {
			params = { params: { id: id, instru: 1 } };
		} else {
			params = { params: { id: id } };
		}

		axios
			.get("getSong", params)
			.then(response => {
				this.handleNewLyrics(response);
			})
			.catch(error => {
				console.log(error);
			});
	}

	//called when a user clicks on a new song
	handleNewLyrics(response) {
		this.setState({
			currentLine: 0,
			currentTitle: response.data.Title,
			currentArtist: response.data.Artist,
			primaryLanguage: response.data.PrimaryLanguage,
			pronounciationLanguage: response.data.PronounciationLanguage,
			translatedLanguage: response.data.TranslatedLanguage,
			lyrics: {
				primaryLanguageLyrics: response.data.PrimaryLanguageLyrics,
				translatedLanguageLyrics:
					response.data.TranslatedLanguageLyrics,
				pronounciationLanguageLyrics:
					response.data.PronounciationLanguageLyrics,
				timestamps: response.data.TimestampsLyrics
			},
			songPath: response.data.songPath
		});
		if (response.data.instrumentalPath)
			this.setState({
				addInstrumental: 1,
				instrumentalPath: response.data.instrumentalPath
			});
	}

	scaleScrolling() {
		// var winWidth =  window.innerWidth;
		var winHeight = window.innerHeight;
		this.setState({ scrollingOffset: -1 * Math.round(winHeight * 0.2) });
	}

	anchorClickUpdateLine(lineToSet) {
		this.setState({ currentLine: lineToSet });
		this.refs.audioPlayer.setCurrentTime(lineToSet);
	}

	userSeeked(lineNumber) {
		this.setState({ currentLine: lineNumber });
	}

	incrementLine() {
		let lineNumber = this.state.currentLine;
		this.setState({ currentLine: lineNumber + 1 });
	}

	render() {
		return (
			<div>
				<div>
					<PageHeader />
					<div className="container">
						<OptionsMenu
							primaryLanguage={this.state.primaryLanguage}
							pronounciationLanguage={
								this.state.pronounciationLanguage
							}
							translatedLanguage={this.state.translatedLanguage}
							options={this.state.options}
							togglePronounciation={this.togglePronounciation}
							togglePrimary={this.togglePrimary}
							toggleTranslated={this.toggleTranslated}
							toggleLineNums={this.toggleLineNums}
							toggleScrolling={this.toggleScrolling}
							toggleVisualizer={this.toggleVisualizer}
						/>
						<div className="clearfix" />
						<SongTitle
							title={this.state.currentTitle}
							artist={this.state.currentArtist}
						/>

						<LyricsBody
							ref="lyricsBody"
							currentLine={this.state.currentLine}
							lyrics={this.state.lyrics}
							anchorClickUpdateLine={this.anchorClickUpdateLine}
							options={this.state.options}
							primaryLanguage={this.state.primaryLanguage}
						/>
					</div>
				</div>
				<AudioPlayer
					ref="audioPlayer"
					currentSong={this.state.songPath}
					timestamps={this.state.lyrics.timestamps}
					addInstrumental={this.state.addInstrumental}
					instrumentalPath={this.state.instrumentalPath}
					incrementLine={this.incrementLine}
					currentLine={this.state.currentLine}
					scrollOffset={this.state.scrollingOffset}
					allowScrolling={this.state.options.allowScrolling}
					showVisualizer={this.state.options.showVisualizer}
					userSeeked={this.userSeeked}
				/>
			</div>
		);
	}

	//toggles:
	toggleScrolling() {
		let temp = this.state.options;
		temp["allowScrolling"] = !this.state.options.allowScrolling;
		this.setState({
			options: temp
		});
	}
	toggleLineNums() {
		let temp = this.state.options;
		temp["showLineNums"] = !this.state.options.showLineNums;
		this.setState({
			options: temp
		});
	}
	toggleVisualizer() {
		let temp = this.state.options;
		temp["showVisualizer"] = !this.state.options.showVisualizer;
		this.setState({
			options: temp
		});
	}

	togglePronounciation(isChecked) {
		let temp = this.state.options;
		temp["showPronounciation"] = !this.state.options.showPronounciation;
		this.setState({
			options: temp
		});
	}
	togglePrimary(isChecked) {
		let temp = this.state.options;
		temp["showPrimary"] = !this.state.options.showPrimary;
		this.setState({
			options: temp
		});
	}
	toggleTranslated(isChecked) {
		//shallow merging
		let temp = this.state.options;
		temp["showTranslated"] = !this.state.options.showTranslated;
		this.setState({
			options: temp
		});
	}
}

ReactDOM.render(<MainContainer />, document.getElementById("content"));
