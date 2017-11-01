

export default class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    handleClick(id, title, artist){
        this.props.fetchSongData(id, title, artist);
    }
    render() {
        let resultItems;
        if (this.props.results) {

            resultItems = this.props.results.map(result => {
                return ( <li key = {result.file_name}>
                            <button id = {result.file_name}
                            className = "button list-group-item list-group-item-action"
                            onClick={this.handleClick.bind(this, result.file_name, result.cn_char , result.artist)}> 
                                {result.cn_char} - {result.artist} 
                            </button> 
                        </li >)
            })
        }
        return (
            <div className = "row" >
                <ul className = "list-group" style = {this.props.styling} id = "resultsList" > 
                    {resultItems} 
                </ul> 
            </div>
        );
    }
}