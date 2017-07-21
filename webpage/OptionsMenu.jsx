import LanguageOptions from './LanguageOptions.jsx'
import PlaybackOptions from './PlaybackOptions.jsx'
import {Collapse} from 'react-bootstrap'
export default class OptionsMenu extends React.Component {
	constructor(props){
		super(props);
		this.state = {};
		this.toggleCollapse = this.toggleCollapse.bind(this);
	}
	toggleCollapse(){
		console.log("attempted toggle")
		this.setState({ open: !this.state.open });
	}

	render() {
		return (
			<Collapse in ={this.state.open}>
			<div className="row optionsMenu" id="options">
				<LanguageOptions togglePinyin = {this.props.togglePinyin}
					toggleCn = {this.props.toggleCn}
					toggleEng = {this.props.toggleEng}/>
				<PlaybackOptions
					toggleScrolling = {this.props.toggleScrolling}
					toggleLineNums = {this.props.toggleLineNums}/>
			</div>
			</Collapse>
		);
	}
}
