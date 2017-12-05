export default class SongTitle extends React.Component {
  render() {
  	let title = '';
  	if(this.props.title && this.props.artist)
  		title = this.props.title + " - " +  this.props.artist
    return (
		<div>
			<h1 className=" col-xs-12 page-header" id="titleLine">
				{title}
			</h1><br/>
		</div>
    );
  }
}
