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
			<div>
				<div className = " col-xs-offset-3 col-xs-6 searchDiv">
					<form>
						<input className="text-center form-control" id="songSearchInput" ref="textBox" 
							name="search" placeholder="Song Search..."  type="text"
							onKeyUp={this.searchSongs}/>
					</form>
				</div>
			</div>
		);
	}
}
