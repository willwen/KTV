import PageHeader from "../SharedReactComponents/Header.jsx";
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
				<div>
					<PageHeader />
				</div>
				<div className="container">
					<div className="form">
						<Form />
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<MainContainer />, document.getElementById("content"));