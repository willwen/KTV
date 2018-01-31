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
			<div className = "max-height">
				<div className = "special-navbar">
					<PageNavbar/>
				</div>
				<div className="max-height">
					<div className = "pimg1">
						<div className = "ptext">
							<span className = "border">
								Why Karaoke Legend
							</span>
						</div>
					</div>
					<div className = "section section-dark about">
						<h2>About the Project</h2>
						<div className=" ">
							When I visited China back in 2015, Karaoke was a big
							thing there. People were killin' the songs and I
							couldn't even understand what they said!
							The purpose of this website is to provide native
							(English) translations and phonetic pronounciation
							along with the original song.
							That way, non-natives can still follow along and
							slowly learn their favorite songs.
						</div>
					</div>
					<div className = "pimg2">
						<div className = "ptext">
							<span className = "border">
								Copyright / Licensing
							</span>
						</div>
					</div>
					<div className = "section section-dark about">
						<h2>Songs</h2>
						<div className=" ">
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
							<span className = "border">
								Keep up to date at <a
							            href="https://github.com/willwen/KTV"
							            target="_blank"
							            className="fa fa-github"
							          />
							</span>
						</div>
					</div>
					<div className = "section section-dark about">
						<h2>Tech Stack</h2>
						<div className=" ">
							<i className="fa fa-database" aria-hidden="true"></i>
 							  mongodb  &lt;-&gt; <i className="fa fa-chrome" aria-hidden="true"></i> nodejs
 &lt;-&gt; <i className="fa fa-facebook" aria-hidden="true"></i> react

						</div>
						<div className=" ">
							<i className="fa fa-amazon" aria-hidden="true"></i>
							deployed on aws elastic beanstalk 

						</div>
						<div className=" ">
							files hosted on s3 buckets
						</div>
							emails sent through aws ses
						<div className=" ">
							cloudflare and domain.com
						</div>
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<MainContainer />, document.getElementById("content"));
