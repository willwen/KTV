export default class PlaybackOptions extends React.Component {
	constructor(props){
		super(props);
		this.state =  {
			wantScrolling: true,
			showLineNums: true,
			showVisualizer: true
		}
		this.toggleScrolling = this.toggleScrolling.bind(this);
		this.toggleLineNums = this.toggleLineNums.bind(this);
		this.toggleVisualizer = this.toggleVisualizer.bind(this);
	}
	toggleScrolling(){
		this.setState({
			wantScrolling: !this.state.wantScrolling
		}, ()=> this.props.toggleScrolling());
	}
	toggleLineNums(){
		this.setState({
			showLineNums: !this.state.showLineNums
		}, ()=> this.props.toggleLineNums());
	}
	toggleVisualizer(){
		this.setState({
			showVisualizer: !this.state.showVisualizer
		}, ()=> this.props.toggleVisualizer());
	}
	modifyOptions(e){
		e.preventDefault();
	}
  render() {
    return (
		<div className = "playbackOptions col-xs-6">
			<form onSubmit={this.modifyOptions}>
				<span>Playback Options:</span>
				<div className="checkbox">
					<span><label><input checked={this.state.wantScrolling} onChange={this.toggleScrolling} id="wantScrolling" type="checkbox"/>Scrolling</label></span>
				</div>
				<div className="checkbox">
					<span><label><input checked={this.state.showLineNums} onChange={this.toggleLineNums} id="lineNumbers" type="checkbox"/>Line Numbers</label></span>
				</div>
				<div className="checkbox">
					<span><label><input checked={this.state.showVisualizer} onChange={this.toggleVisualizer} id="visualizer" type="checkbox"/>Visualizer</label></span>
				</div>
			</form>
		</div>
    );
  }
}
