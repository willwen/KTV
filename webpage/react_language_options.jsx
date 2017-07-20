export default class LanguageOptions extends React.Component {
  constructor(props){
  	super(props);
  }

  modifyOptions(e){
  	e.preventDefault();
  }

  changePinyin(){
  	if(this.checked)
  		console.log("checked")
  	else
  		console.log("nah");
  }
  render() {
    return (
		<div className = "displayLanguages col-xs-6">
			<form onSubmit={this.modifyOptions}>
				<span>Display Languages:</span>
				<div className="checkbox">
					<span><label><input checked id="pinyinCB" type="checkbox" onChange={this.changePinyin.bind(this)}/>PinYin</label></span>
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
