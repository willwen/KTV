import PageNavbar from "../SharedReactComponents/PageNavbar.jsx";
import PageHeader from "../SharedReactComponents/Header.jsx";
import ReactDOM from "react-dom";

export default class MainContainer extends React.Component {
	constructor() {
		super();

		// this.getParameterByName = this.getParameterByName.bind(this)
	}
	componentWillMount() {}
	componentDidMount() {}
	componentWillUnmount() {}

	render() {
		return (
			<div>
				
				<PageNavbar/>
				<div className="container">
					<div className="fb-login-button" data-width="400" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="true" data-auto-logout-link="true" data-use-continue-as="true"></div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<MainContainer/>, document.getElementById("content"));
