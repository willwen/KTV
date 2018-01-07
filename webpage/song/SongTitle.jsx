export default class SongTitle extends React.Component {
  render() {
    let title = "";
    if (this.props.title && this.props.artist)
      title = this.props.title + " - " + this.props.artist;
    return (
      <div className="row">
        <div className="col">
          <h1 className="page-header" id="titleLine">
            {title}
          </h1>
          <br />
        </div>
      </div>
    );
  }
}
