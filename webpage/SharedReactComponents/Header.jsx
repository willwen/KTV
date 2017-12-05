export default class PageHeader extends React.Component {
  render() {
    return (
    <div>
	    <nav className="navbar navbar-expand-lg">
	        <div className="container-fluid">
	            <a className="navbar-brand" href="/">
	            <img src="logo.png" alt="logo" width="50"/>
	            </a>
	            <div>
	                <ul className="navbar-nav" id="navigation">
	                    <li className="nav-item" ><a className="nav-link" href="/">Home</a></li>
	                    <li className="nav-item" ><a className="nav-link" href="/about">About</a></li>
	                    <li className="nav-item" ><a className="nav-link" href="/treefind">Find Artist</a></li>
	                    <li className="nav-item" ><a className="nav-link" href="/submit">Submit a Song</a></li>
	                    <li className="nav-item" ><a className="nav-link" href="/timepicker">Time Picker</a></li>
	                 </ul>
	            </div>
	        </div>
	    </nav>
		<div className="text-center jumbotron welcome">
			<h1>Become a Karaoke God</h1>
			<h2>A Website to Learn Foreign Songs<br/>by Will Wen</h2>
			<a href="https://github.com/willwen/KTV" target="_blank" className="fa fa-github"></a>
			<a href="https://www.linkedin.com/in/will-wen-52480559/" target="_blank" className="fa fa-linkedin"></a>
		</div>
	</div>
    );
  }
}
