import ReactDOM from 'react-dom';

import PageHeader from '../SharedReactComponents/Header.jsx'
import SearchPanel from './SearchPanel.jsx'


export default class MainContainer extends React.Component {
	constructor(){
		super();
		this.state={
		};

	}
	componentWillMount(){
	}
	componentDidMount(){

	}
	componentWillUnmount(){
	}



	

	render() {
		return (
			<div>
			  <div>
		      	<PageHeader/>
		      	<SearchPanel/>
				<div className = "clearfix"></div>
			  </div>
		  </div>
		);
	}

}

ReactDOM.render(
  <MainContainer/>,
  document.getElementById('content')
);
