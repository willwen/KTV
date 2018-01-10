import { FormGroup, Input, Label } from "reactstrap";
import axios from "axios";
var Recaptcha = require("react-recaptcha");

export default class Form extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			request: "pending",
			captchaAnswered: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setCaptchaToken = this.setCaptchaToken.bind(this);
		this.onCaptchaLoaded = this.onCaptchaLoaded.bind(this);
		this.onUnload = this.onUnload.bind(this);
	}

	componentDidMount() {
		// window.addEventListener("beforeunload", this.onUnload);
		console.log("ok");
		if (
			window.localStorage.getItem("timestamps") &&
			window.localStorage.getItem("timestamps").length > 1
		) {
			var timestamps = JSON.parse(
				window.localStorage.getItem("timestamps")
			);
			var timeStampString = timestamps.reduce((totalString, line) => {
				return totalString + line.replace(':', '') + "\n";
			}, "");
			this.setState({
				times: timeStampString
			});
		}
	}
	componentWillUnmount() {
		// window.removeEventListener("beforeunload", this.onUnload);
	}

	onUnload(event) {
		// the method that will be used for both add and remove event
		// window.localStorage.setItem(
		// 	"timestamps",
		// 	JSON.stringify(this.state.timestamps)
		// );
	}

	handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.id;
		this.setState({
			//braces mean eval of 'name'
			[name]: value
		});
	}

	setCaptchaToken(token) {
		this.setState({
			captcha: token,
			captchaAnswered: true
		});
	}

	onCaptchaLoaded() {
		console.log("captcha loaded");
	}

	handleSubmit(event) {
		// alert('A name was submitted: ' + JSON.stringify(this.state));
		event.preventDefault();
		var formData = new FormData();
		this.setState({ request: "transit" });
		var audioFile = document.querySelector("#audioFile");
		formData.append("audioFile", audioFile.files[0]);
		formData.append("payload", JSON.stringify(this.state));
		axios
			.post("upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			})
			.then(response => {
				this.setState({ request: "done" });
				if (response.data.redirect === "/uploadComplete") {
					// data.redirect contains the string URL to redirect to
					window.location.href = response.data.redirect;
				} else {
					alert(response.data.message);
				}
			})
			.catch(error => console.log(error));
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<div className="row">
					<div className="col-6">
						<FormGroup>
							<Label>Song Title:</Label>
							<Input
								id="song"
								type="text"
								onChange={this.handleChange}
								disabled={
									this.state.request === "pending"
										? false
										: true
								}
							/>
						</FormGroup>
					</div>
					<div className="col-6">
						<FormGroup>
							<Label>Artist Name:</Label>
							<Input
								id="artist"
								type="text"
								onChange={this.handleChange}
								disabled={
									this.state.request === "pending"
										? false
										: true
								}
							/>
						</FormGroup>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12 col-4">
						<FormGroup>
							<Label>Primary Language Lyrics:</Label>
							<Input
								id="primaryLanguageLyrics"
								type="textarea"
								onChange={this.handleChange}
								disabled={
									this.state.request === "pending"
										? false
										: true
								}
							/>
						</FormGroup>
					</div>
					<div className="col-xs-12 col-4">
						<FormGroup>
							<Label>Pronounciation Lyrics:</Label>
							<Input
								id="pronounciationLyrics"
								type="textarea"
								onChange={this.handleChange}
								disabled={
									this.state.request === "pending"
										? false
										: true
								}
							/>
						</FormGroup>
					</div>
					<div className="col-xs-12 col-4">
						<FormGroup>
							<Label>Translated Lyrics (If applicable):</Label>
							<Input
								id="translatedLyrics"
								type="textarea"
								onChange={this.handleChange}
								disabled={
									this.state.request === "pending"
										? false
										: true
								}
							/>
						</FormGroup>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<FormGroup>
							<Label>MP3 Upload</Label>
							<br />
							<Input
								id="audioFile"
								type="file"
								accept=".mp3"
								disabled={
									this.state.request === "pending"
										? false
										: true
								}
							/>
						</FormGroup>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<FormGroup>
							<Label>
								Line Timings:{" "}
								<a
									id="redirect"
									target="_blank"
									href="/timepicker"
								>
									Use Time Picker Tool
								</a>
							</Label>
							<Input
								id="times"
								type="textarea"
								onChange={this.handleChange}
								disabled={
									this.state.request === "pending"
										? false
										: true
								}
								value={this.state.times}
							/>
						</FormGroup>
					</div>
				</div>
				<Recaptcha
					sitekey="6LfZ-TsUAAAAABCx4CayOkJbV_Qm9CW9qGmBUzeS"
					render="explicit"
					onloadCallback={this.onCaptchaLoaded}
					verifyCallback={this.setCaptchaToken}
					theme="dark"
				/>
				<input
					type="submit"
					value="Submit"
					id="submit"
					disabled={
						this.state.request === "pending"
							? !this.state.captchaAnswered
							: true
					}
				/>
				<br />
				<div className="centered">
					{this.state.request === "transit" ? (
						<img height="150px" width="150px" src="loading.gif" />
					) : null}
				</div>
			</form>
		);
	}
}