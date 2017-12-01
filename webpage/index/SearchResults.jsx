

export default class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    
    render() {
        let resultItems;
        if (this.props.results) {

            resultItems = this.props.results.map(result => {
                let path = "/song?id="+result.file_name+"&title="+result.cn_char+"&artist="+result.artist
                return ( <li key = {result.file_name}>
                            <a className = "list-group-item list-group-item-action" href={path}>
                                {result.cn_char} - {result.artist} 
                            </a> 
                        </li >)
            })
        }
        return (
            <div className="container">
                <div className = "row" >
                    <ol className = "list-group" style = {this.props.styling} id = "resultsList" > 
                        {resultItems} 
                    </ol> 
                </div>
            </div>
        );
    }
}