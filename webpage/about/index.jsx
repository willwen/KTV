import PageHeader from '../SharedReactComponents/Header.jsx'
import ReactDOM from 'react-dom';


export default class MainContainer extends React.Component {
	constructor(){
		super();
	
		// this.getParameterByName = this.getParameterByName.bind(this)
	}
	componentWillMount(){
	  	
	}
	componentDidMount(){
		

	}
	componentWillUnmount(){
	
	}



	
	render() {
		return (
			<div className="container">
			<div className = "row">
		      <PageHeader/>
		      </div>
		      <h3>About the Project</h3>
		      <h4>
		      <div className = "row">
		      	When I visited China back in 2015, Karaoke was a big thing there. People were killin' the songs and I couldn't even understand what they said!<br/>
		      	The purpose of this website is to provide native (English) translations and phonetic pronounciation along with the original song.<br/>
		      	That way, non-natives can still follow along and slowly learn their favorite songs.
		      </div>
		      </h4>
		      <h3>Copyright / Licensing</h3>
		      <h4>
		      <div className = "row">
		      	I do not own any of the songs present on this website. All music rights belong to their respective owners. 
		      	<br/>
				"Copyright Disclaimer Under Section 107 of the Copyright Act 1976, allowance is made for "fair use" for purposes such as criticism, comment, news reporting, teaching, scholarship, and research. Fair use is a use permitted by copyright statute that might otherwise be infringing. Non-profit, educational or personal use tips the balance in favor of fair"
		      </div>
		      </h4>
		      
		  </div>
		);
	}

}

ReactDOM.render(
  <MainContainer/>,
  document.getElementById('content')
);
