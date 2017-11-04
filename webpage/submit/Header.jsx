export default class PageHeader extends React.Component {
  render() {
    return (
    	<div>
	    	<div className="header">
	    		<img src="logo.png" alt="logo"/>
	    		<div className="nav">
	    			<a href="/"><p>Home</p></a>
	    			<a href="/treefind"><p>Find Artist</p></a>
	    			<a href="/submit">
                        <p>Submit a Song</p>
                    </a>
	    		</div>

	    	</div>
	    	<div className="welcome col-xs-12 jumbotron text-center">
	    		<h1>Submit a Song to KTV God</h1>
	    	</div>
		</div>
    );
  }
}
