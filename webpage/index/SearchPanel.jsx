import SearchBar from './SearchBar.jsx'
import SearchResults from './SearchResults.jsx'
import axios from 'axios'

export default class SearchPanel extends React.Component {
	constructor (){
		super();
		this.state = {
			dbResults : [],
            resultsStyling: {
                display: "hidden"
            }
		}
		this.showSearchResults = this.showSearchResults.bind(this);

	}

	componentDidMount(){
		this.sendAjaxSearch("");
	}

	sendAjaxSearch(queryText){
		axios.get("query", {params: {'search': queryText}} ).then(this.showSearchResults).catch(error => console.log(error));;

	}
	showSearchResults(response){
		this.setState({dbResults:response.data, resultsStyling: {display: "inline"}});
	}

	retrieveAll(e){
		e.preventDefault();
		axios.get("query", {params: {'search': ""}} ).then(this.showSearchResults).catch(error => console.log(error));;
	}

    render() {
    	return (
	    	<div>
		  	<SearchBar onTextChanged = {this.sendAjaxSearch.bind(this)}/>
		  	<div className = "clearfix"></div>
			<div className = "row allSongsDiv">
				<a id="allSongsAnchor" onClick={this.retrieveAll.bind(this)}>All Songs</a>
			</div>
		  	<SearchResults results={this.state.dbResults} styling = {this.state.resultsStyling} />
			<div className = "clearfix"></div>
			</div>
	    );
    }
}
