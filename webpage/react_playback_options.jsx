export default class PlaybackOptions extends React.Component {
	modifyOptions(e){
		e.preventDefault();
	}
  render() {
    return (
		<div className = "playbackOptions col-xs-6 collapse">
			<form onSubmit={this.modifyOptions}>
				<span>Playback Options:</span>
				<div className="checkbox">
					<span><label><input checked id="wantScrolling" type="checkbox"/>Scrolling</label></span>
				</div>
				<div className="checkbox">
					<span><label><input checked id="lineNumbers" type="checkbox"/>Line Numbers</label></span>
				</div>
			</form>
		</div>
    );
  }
}
