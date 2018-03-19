import PageNavbar from "../SharedReactComponents/PageNavbar.jsx";

import Form from "./Form.jsx";
import ReactDOM from "react-dom";
import axios from "axios";

export default class MainContainer extends React.Component {
	constructor() {
		super();
	}
	componentWillMount() {}
	componentDidMount() {}
	componentWillUnmount() {}

	render() {
		return (
			<div>
				<PageNavbar/>
				<div className="container offset-navbar">
					<div className="form">
						<Form />
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<MainContainer />, document.getElementById("content"));