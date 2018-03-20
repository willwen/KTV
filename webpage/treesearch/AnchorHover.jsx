// import $ from 'jquery'

export default class AnchorHover extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			hover: false
		};

		this.mouseOver = this.mouseOver.bind(this);
		this.mouseOut = this.mouseOut.bind(this);

		this.hideAllBelow = this.hideAllBelow.bind(this);
		this.showChildren = this.showChildren.bind(this);
		this.highlightSelf = this.highlightSelf.bind(this);
		this.scrollBottom = this.scrollBottom.bind(this);
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

	hideAllBelow(){
		// hide all panels BELOW this level
        for (var i = this.props.level + 1; i <= this.props.maxLevel; i++) {
            $("." + i + "_level").each(function() {
                $(this).parent().collapse({ toggle: false })
                $(this).parent().collapse("hide");
            })
        }
	}
	showChildren(){

        // show this node's child
        $("#" + this.props.child.id).collapse("show");
	}

          
	highlightSelf(){
		// clear all highlight color at or below this level
        for (var i = this.props.level; i <= this.props.maxLevel; i++) {
            $("." + i + "_level").each(function() {
                $(this).children().each(function() {
                    $(this).css("background-color", "")
                })
            })
        }
        // highlight myself
        $(this).css("background-color", "#00000080");
	}

	scrollBottom(){
	    $("html, body").animate({scrollTop: $(document).height()}, 1000);
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
			onClick = { ()=>{
				this.hideAllBelow();
				this.showChildren();
				this.highlightSelf();
				this.scrollBottom();
			}
			}>
			{
				this.props.image
			}
			{
				this.props.textLabel
			}

			</a>);
	}
}

