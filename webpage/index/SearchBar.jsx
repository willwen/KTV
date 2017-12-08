export default class SearchBar extends React.Component {

	constructor(){
		super();
		this.state = {
		}
		this.searchSongs = this.searchSongs.bind(this);
	}

	searchSongs(){
		this.props.onTextChanged(this.refs.textBox.value);
	}
	
	render() {
		return (
<<<<<<< Updated upstream
			<div className = "row">
				<div className = "searchDiv input-group">
						<input className="text-center form-control" id="songSearchInput" ref="textBox" 
=======
			<div>
				<div className = " col-xs-offset-3 col-xs-6 searchDiv">
					<form>
						<input className="form-control" id="songSearchInput" ref="textBox" 
>>>>>>> Stashed changes
							name="search" placeholder="Song Search..."  type="text"
							onKeyUp={this.searchSongs}/>
				</div>
			</div>
		);
	}
}
