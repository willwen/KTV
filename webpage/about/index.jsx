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
				<div>
					<PageHeader />
				</div>
				<div className="container">
					<div className = "pimg1">
						<div className = "ptext">
							<span className = "border">
								Hangzhou 2015
							</span>
						</div>
					</div>
					<div className = "section section-light">
						<h2>About the Project</h2>
						<div className="row about">
							When I visited China back in 2015, Karaoke was a big
							thing there. People were killin' the songs and I
							couldn't even understand what they said!<br />
							The purpose of this website is to provide native
							(English) translations and phonetic pronounciation
							along with the original song.<br />
							That way, non-natives can still follow along and
							slowly learn their favorite songs.
						</div>
					</div>
					<div className = "pimg2">
						<div className = "ptext">
							<span className = "border trans">
								hey2
							</span>
						</div>
					</div>
					<div className = "section section-dark">
						<h2>Copyright / Licensing</h2>
						<div className="row about">
							I do not own any of the songs present on this
							website. All music rights belong to their respective
							owners. <br />
							"Copyright Disclaimer Under Section 107 of the
							Copyright Act 1976, allowance is made for "fair use"
							for purposes such as criticism, comment, news
							reporting, teaching, scholarship, and research. Fair
							use is a use permitted by copyright statute that
							might otherwise be infringing. Non-profit,
							educational or personal use tips the balance in
							favor of fair"
						</div>
					</div>
					<div className = "pimg3">
						<div className = "ptext">
							<span className = "border trans">
								hey3
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<MainContainer />, document.getElementById("content"));
