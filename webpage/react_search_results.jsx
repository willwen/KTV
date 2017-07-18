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
                return ( <
                    li >
                    <
                    button key = {
                        result.file_name
                    }
                    id = {
                        result.file_name
                    }
                    className = "button list-group-item list-group-item-action" > {
                        result.cn_char
                    } - {
                        result.artist
                    } <
                    /button> < /
                    li >
                )
            })
        }
        return (

            <
            div className = "row" >
            <
            ul className = "list-group"
            style = {
                this.props.styling
            }
            id = "resultsList" > {
                resultItems
            } <
            /ul> < /
            div >
        );
    }
}