import LanguageOptions from './LanguageOptions.jsx'
import PlaybackOptions from './PlaybackOptions.jsx'


export default class OptionsMenu extends React.Component {
	constructor(props){
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="optionsMenu row" id="options">
				<LanguageOptions
					primaryLanguage={this.props.primaryLanguage}
					pronounciationLanguage={this.props.pronounciationLanguage}
					translatedLanguage={this.props.translatedLanguage}
					togglePronounciation = {this.props.togglePronounciation}
					togglePrimary = {this.props.togglePrimary}
					toggleTranslated = {this.props.toggleTranslated}/>
				<PlaybackOptions
					toggleLineNums = {this.props.toggleLineNums}
					toggleScrolling = {this.props.toggleScrolling}
					toggleVisualizer = {this.props.toggleVisualizer}/>
			</div>
		);
	}
}
