export default class PrettyPrint extends React.Component {
	constructor() {
		super();
		this.state = {};
	}

	componentWillMount() {}
	componentDidMount() {}
	componentWillUnmount() {}

	render() {
		return (
			<div className="container dotted-border text-center">
				<div className="row">
					When you are finished with the song, copy these times and
					paste them into Submit a Song's Timestamp box:
				</div>
				<div className="row">
					<div className="col-6 text-center">
						<button
							type="button"
							className="btn btn-success"
							onClick={this.props.transferOver}
						>
							Transfer to <a>Submit a Song</a>
						</button>
					</div>
					<div className="col-6 text-center">
						<button
							type="button"
							className="btn btn-warning"
							onClick={this.props.clearLocalStorage}
						>
							Clear Lines
						</button>
					</div>
				</div>
				<div className="row">
					<div id="timesOutput" className="col-12">
						{this.props.timestamps.map((time, index) => {
							if (time.length == 0) {
								return <br key={"timestamp " + index} />;
							}
							return (
								<div key={"timestamp " + index} className="row">
									{time.replace(/:/g, "")}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}