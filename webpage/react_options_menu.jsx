class OptionsMenu extends React.Component {
  render() {
    return (
		<div className="row optionsMenu collapse" id="options">
			<LanguageOptions/>
			<PlaybackOptions/>
		</div>
    );
  }
}
