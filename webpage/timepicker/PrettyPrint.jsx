
export default class PrettyPrint extends React.Component {
	constructor(){
		super();
		this.state = {

		}
	}

	componentWillMount(){
	  	
	}
	componentDidMount(){
	   
	}
	componentWillUnmount(){
	
	}


	render() {
		return (
            <div className="container dotted-border text-center">
            	<div>When you are finished with the song, copy these times and paste them into Submit a Song's Timestamp box:</div>
                <div id="timesOutput" className="col-12">
                	{
                		this.props.timestamps.map((time, index) =>{
                			if(time.length == 0){
                				return (<br key = {"timestamp " + index}/>)	
                			}
		            		return (<div key = {"timestamp " + index} className = "row">{time}</div>)

			           	})
                	}
                </div>
            </div>

		);
	}
}