export default class PageHeader extends React.Component {
  render() {
    return (
    	<div>
	    	<div className="header">
	    		<a href="/">
	    		<img src="logo.png" alt="logo"/>
	    		</a>
	    		<div className="nav">
	    			<a href="/"><p>Home</p></a>
	    			<a href="/treefind"><p>Find Artist</p></a>
	    			<a href="/submit">
                        <p>Submit a Song</p>
                    </a>
                    <a href="/timepicker">
                        <p>Time Picker</p>
                    </a>
	    		</div>
	    	</div>
			<div className="row">
				<div className="welcome col-xs-12 jumbotron text-center">
					<h1>Become a Karaoke God</h1>
					<h2>A Website to Learn Foreign Songs by Will Wen</h2>
					<a href="https://github.com/willwen/KTV" target="_blank" className="fa fa-github"></a>
	    			<a href="https://www.linkedin.com/in/will-wen-52480559/" target="_blank" className="fa fa-linkedin"></a>
				</div>
			</div>
		</div>
    );
  }
}
