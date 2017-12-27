

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
                let path = "/song?id="+result.file_name
                return ( <li className = "list-group-item" key = {result.file_name}>
                            <a className = "anchors" href={path}>
                                <span>{result.cn_char} - {result.artist}</span>
                            </a>
                            {
                                (result.instrumentalPath ? 
                                    <a className = "anchors instrumental" href={path + "&instru=1"}>
                                        <span> Instrumental Version (Beta)</span>
                                    </a>
                                    :
                                    null
                                )
                            }
                        </li >)
            })
        }
        return (
            <div>
                <ul className = "list-group" style = {this.props.styling} id = "resultsList" > 
                    {resultItems} 
                </ul> 
            </div>

        );
    }
}