export default class PlaybackOptions extends React.Component {
	constructor(props){
		super(props);
		this.state =  {
			wantScrolling: true,
			showLineNums: true
		}
		this.toggleScrolling = this.toggleScrolling.bind(this);
		this.toggleLineNums = this.toggleLineNums.bind(this);
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
			</form>
		</div>
    );
  }
}
