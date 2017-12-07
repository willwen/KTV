export default class PageHeader extends React.Component {
  render() {
    return (
    <div>
	    <nav>
	    	<div className="container-fluid">
	    		<a className="navbar-brand" href="/">
	    		<img src="logo.png" alt="logo" width="50"/>
	    		</a>
	    		<div>
		    		<ul className="nav navbar-nav" id="navigation">
		    			<li className="nav-item" ><a href="/">Home</a></li>
		    			<li className="nav-item" ><a href="/about">About</a></li>
		    			<li className="nav-item" ><a href="/treefind">Search</a></li>
		    			<li className="nav-item" ><a href="/submit">Submit a Song</a></li>
	                    <li className="nav-item" ><a href="/timepicker">Time Picker</a></li>
	                 </ul>
	    		</div>
	    	</div>
	    </nav>
		<div className="row">
			<div className="welcome col-xs-12 jumbotron text-center">
				<h1>Become a Karaoke God</h1>
				<div className="row">
				<h2>A Website to Learn Foreign Songs<br/>by Will Wen</h2>
				</div>
				<div className="row">
				<a href="https://github.com/willwen/KTV" target="_blank" className="fa fa-github"></a>
    			<a href="https://www.linkedin.com/in/will-wen-52480559/" target="_blank" className="fa fa-linkedin"></a>
    			</div>
			</div>
		</div>
	</div>
    );
  }
}
