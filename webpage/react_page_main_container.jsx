class MainContainer extends React.Component {
	constructor(){
		super();
		this.state={
			times : ["1", "2"],
			currentLine: 0

		};
		this.setCurrentLine = this.setCurrentLine.bind(this)
		console.log("set state");
	}
	componenetWillMount(){

	}
	componentDidMount(){
		console.log("mounted!");
	}
	setCurrentLine(val){
		this.setState(currentLine : val);
	}
	render() {
		return (
			<div>
		      <div className="container">
		      	<PageHeader/>
		      	<SearchBar/>
		      	<div className = "clearfix"></div>
				<div className = "row allSongsDiv">
					<a id="allSongsAnchor">All Songs</a>
				</div>
		      	<SearchResults/>
				<div className = "clearfix"></div>
				<OptionsMenu/>
				<div className = "clearfix"></div>
				<SongTitle/>
				<SongLyrics/>
		      </div>
		      <AudioPlayer times={this.state.times} currentLine={this.state.currentLine} onLineChange={this.setCurrentLine}/>
		  </div>
		);
	}
}

ReactDOM.render(
  <MainContainer/>,
  document.getElementById('content')
);