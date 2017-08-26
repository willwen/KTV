export default class PageHeader extends React.Component {
  render() {
    return (
		<div className="row">
			<div className="welcome col-xs-12 jumbotron text-center">
				<h1>Become a Karaoke God</h1>
				<a href="https://github.com/willwen/KTV"><strong>Work in Progress</strong></a> <span> by Will Wen.</span>
				<div>Press Space to Play/Pause, (+/-) for volume control</div>
			</div>
		</div>
    );
  }
}
