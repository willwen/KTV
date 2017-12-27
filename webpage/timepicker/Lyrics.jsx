import $ from 'jquery'

export default class Lyrics extends React.Component {
    constructor() {
        super();
        this.state = {
            values: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.updateValue = this.updateValue.bind(this)
    }
    componentWillMount() {

    }
    componentDidMount() {

    }
    componentWillUnmount() {

    }

    handleChange(e, index) {
        const timestampFormat = /[0-9]:[0-5][0-9]/;
        if (timestampFormat.exec(e.target.value)) {
            this.props.updateTimestamp(index, e.target.value);
            $("#lineID" + index).css("background-color", "white");
        } else {
            $("#lineID" + index).css("background-color", "red");
        }
    }

   	updateValue(event, index){
		let values = this.state.values;
		values[index] = event.target.value;
		this.setState({values: values});
	}

    render() {
        return (
            <div className = "container dotted-border" id = "lyrics" > 
            	{this.props.lyrics.map((line, index) => {
                    let realLineNum = index + 1;
                    let className = (this.props.arrayIndex == index) ? "line row currentLine" : "line row";
                    this.state.values = this.props.timestamps;
                    return ( 
                    	<div key = {index} className = {className} >
                        	<div className = "lineNumber col-3" > { realLineNum } </div>  
                        	<div id = { realLineNum } className = "lineText col-8" > 
                        		{(this.props.arrayIndex == index) ? "→  " : "" }{line} 
                        	</div> 
                        	<div id = { realLineNum + 'timestamp' } className = "timestamp col-1" > 
	                        	<input className = "timestampInput"
							        	id = {'lineID' + index}
							        	type="text"
							        	value= {this.state.values[index] ? this.state.values[index] : ''}
							        	onBlur={(e)  => this.handleChange(e, index)}
							        	onChange={(e) => this.updateValue(e,index)}
							        	maxLength="4"
							        	size="4">
	        					</input> 
                            </div> 
                        </div>
                    )
                })} 
            </div>
        );
    }
}

