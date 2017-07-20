import LanguageOptions from './react_language_options.jsx'
import PlaybackOptions from './react_playback_options.jsx'
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
				<LanguageOptions/>
				<PlaybackOptions/>
			</div>
			</Collapse>
		);
	}
}
