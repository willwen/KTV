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
		this.showResults = this.showResults.bind(this);
		this.requestData = this.requestData.bind(this);

	}

	sendAjaxSearch(queryText){
		axios.post("query", {'search': queryText} ).then(this.showResults).catch(error => console.log(error));;

	}
	showResults(response){
		this.setState({dbResults:response.data, resultsStyling: {display: "inline"}});
	}

	retrieveAll(e){
		e.preventDefault();
		axios.post("query", {'search': ""} ).then(this.showResults).catch(error => console.log(error));;
	}

	requestData(id, title, artist){
		this.setState({resultsStyling: {display: "none"}});
		this.props.getData(id, title, artist);
	}

    render() {
    	return (
	    	<div>
		  	<SearchBar onTextChanged = {this.sendAjaxSearch.bind(this)}/>
		  	<div className = "clearfix"></div>
			<div className = "row allSongsDiv">
				<a id="allSongsAnchor" onClick={this.retrieveAll.bind(this)}>All Songs</a>
			</div>
		  	<SearchResults results={this.state.dbResults} styling = {this.state.resultsStyling} fetchSongData={this.requestData}/>
			<div className = "clearfix"></div>
			</div>
	    );
    }
}
