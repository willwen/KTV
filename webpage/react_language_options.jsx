class LanguageOptions extends React.Component {
  modifyOptions(e){
  	e.preventDefault();
  }
  render() {
    return (
		<div className = "displayLanguages col-xs-6 collapse">
			<form onSubmit={this.modifyOptions}>
				<span>Display Languages:</span>
				<div className="checkbox">
					<span><label><input checked id="pinyinCB" type="checkbox"/>PinYin</label></span>
				</div><span></span>
				<div className="checkbox">
					<span><label><input checked id="cnCB" type="checkbox"/>Chinese Char</label></span>
				</div><span></span>
				<div className="checkbox">
					<span><label><input checked id="engCB" type="checkbox"/>English</label></span></div>
			</form>
		</div>
    );
  }
}
