
export default class AnchorHover extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			hover: false
		};

		this.mouseOver = this.mouseOver.bind(this);
		this.mouseOut = this.mouseOut.bind(this);
	}

	componentDidMount() {
	}

	mouseOver(){
		this.setState({
			hover: true
		})
	}

	mouseOut(){
		this.setState({
			hover: false
		})
	}

	render() {
		let mouseHoverCss = (this.state.hover) ? 
			{"borderBottom": "medium outset #9c8585"} :
			{"borderBottom":"medium solid rgba(255,255,255,0)"}
		return (<a
			className={this.props.className}
			href={this.props.href}
			onMouseOver = {this.mouseOver}
			onMouseOut = {this.mouseOut}
			style = {mouseHoverCss}
			>
			{
				this.props.image
			}
			{
				this.props.textLabel
			}

			</a>);
	}
}

