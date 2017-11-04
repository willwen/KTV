export default class AudioAnimations extends React.Component {
	constructor(props, context){
  		super(props, context);
  	}
  		
	render() {
		let popup;
		if(this.props.action=="none"){
  			popup = (null)
  		}
  		else{
  			popup =  (<div id = {this.props.action} className = "centered">
						<img className = "transition" height = "300px" width = "300px" src= {this.props.action + ".png"}></img>
			 		</div>)
  		}
    	return popup
	}
}


	