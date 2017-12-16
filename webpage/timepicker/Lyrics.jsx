
export default class Lyrics extends React.Component {
	constructor(){
		super();
		this.state = {
		}
		this.handleChange = this.handleChange.bind(this)	
	}
	componentWillMount(){
	  	
	}
	componentDidMount(){
	   
	}
	componentWillUnmount(){
	
	}

	handleChange(event, index){
		this.props.updateTimestamp(index, event.target.value)
	}
	
	render() {
		return (

            <div className="container dotted-border" id="lyrics">
	            {
	            	this.props.lyrics.map((line, index) =>{
	            		let realLineNum = index + 1;
	            		let className = (this.props.arrayIndex == index) ? "line row currentLine" : "line row";
		            	return (<div key = {index} className = {className}>
		            		<div className = "lineNumber col-3">{realLineNum}</div>
		            		<div id = {realLineNum} className = "lineText col-8">
		            			{(this.props.arrayIndex == index)? "→  " : ""}
		            			{line}
	            			</div>
		            		<div id = {realLineNum + 'timestamp'} className = "timestamp col-1">
		            		<input className = "timestampInput"
		            			type="number"
		            			value= {this.props.timestamps[index] ? this.props.timestamps[index] : 0}
		            			onChange={(e)=>this.handleChange(e, index)}
		            			maxLength="4"
		            			size="4"></input>
		            		</div>
		            	</div>)

		           	})
	            }
            </div>
		);
	}
}