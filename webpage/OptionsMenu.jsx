import LanguageOptions from './LanguageOptions.jsx'
import PlaybackOptions from './PlaybackOptions.jsx'
import {Collapse} from 'react-bootstrap'
export default class OptionsMenu extends React.Component {
	constructor(props){
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Collapse in ={this.props.open}>
			<div className="row optionsMenu" id="options">
				<LanguageOptions togglePinyin = {this.props.options.togglePinyin}
					toggleCn = {this.props.options.toggleCn}
					toggleEng = {this.props.options.toggleEng}/>
				<PlaybackOptions
					toggleScrolling = {this.props.options.toggleScrolling}
					toggleLineNums = {this.props.options.toggleLineNums}/>
			</div>
			</Collapse>
		);
	}
}
