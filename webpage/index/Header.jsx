export default class PageHeader extends React.Component {
  render() {
    return (
    	<div>
	    	<div className="header">
	    		<img src="logo.png" alt="logo"/>
	    		<div className="nav">
	    			<a href="/"><p>Home</p></a>
	    			<a href="/treefind"><p>Tree Find</p></a>
	    		</div>
	    	</div>
			<div className="row">
				<div className="welcome col-xs-12 jumbotron text-center">
					<h1>Become a Karaoke God</h1>
					<a href="https://github.com/willwen/KTV" target="_blank" className="fa fa-github"></a>
	    			<a href="https://www.linkedin.com/in/will-wen-52480559/" className="fa fa-linkedin"></a>
					<div>Press Space to Play/Pause, (+/-) for volume control</div>
				</div>
			</div>
		</div>
    );
  }
}
