import LanguageOptions from './react_language_options.jsx'
import PlaybackOptions from './react_playback_options.jsx'

export default class OptionsMenu extends React.Component {
  render() {
    return (
		<div className="row optionsMenu collapse" id="options">
			<LanguageOptions/>
			<PlaybackOptions/>
		</div>
    );
  }
}
