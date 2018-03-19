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
				<div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<MainContainer />, document.getElementById("content"));
