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
				<LanguageOptions 
					togglePinyin = {this.props.togglePinyin}
					toggleCn = {this.props.toggleCn}
					toggleEng = {this.props.toggleEng}/>
				<PlaybackOptions
					toggleLineNums = {this.props.toggleLineNums}
					toggleScrolling = {this.props.toggleScrolling}
					/>
			</div>
			</Collapse>
		);
	}
}
