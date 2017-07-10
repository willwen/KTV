class SearchBar extends React.Component {
  render() {
    return (
		<div className="row">
			<div className = "searchDiv">
				<form className="col-xs-12 center-text">
					<input className="form-control" id="songSearchInput" name="search" placeholder="Song Search..." size="50" type="text"/>
				</form>
			</div>
		</div>
    );
  }
}
