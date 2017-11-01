export default class LanguageOptions extends React.Component {
  constructor(props){
  	super(props);
    this.state = {
      pinyinChecked: true,
      cnChecked: true,
      enChecked:true
    }
  }

  modifyOptions(e){
  	e.preventDefault();
  }

  changePinyin(){
    this.setState({
      pinyinChecked: !this.state.pinyinChecked
    }, () => {
      this.props.togglePinyin(this.state.pinyinChecked)
      
    })
  }

  changeCn(){
    this.setState({
      cnChecked: !this.state.cnChecked
    }, () => {
      this.props.toggleCn(this.state.cnChecked)
      
    })
  }

  changeEng(){
    this.setState({
      enChecked: !this.state.enChecked
    }, () => {
      this.props.toggleEng(this.state.enChecked)
      
    })
  }

  render() {
    return (
		<div className = "displayLanguages col-xs-6">
			<form onSubmit={this.modifyOptions}>
				<span>Display Languages:</span>
				<div className="checkbox">
					<span>
            <label>
            <input id="pinyinCB" type="checkbox" 
              checked={this.state.pinyinChecked}
              onChange={this.changePinyin.bind(this)}/>
            PinYin
            </label>
          </span>
				</div><span></span>
				<div className="checkbox">
					<span><label><input id="cnCB" type="checkbox"
              checked={this.state.cnChecked}
              onChange={this.changeCn.bind(this)}/>
              Chinese Char</label></span>
				</div><span></span>
				<div className="checkbox">
					<span><label><input id="engCB" type="checkbox"
            checked={this.state.enChecked}
            onChange={this.changeEng.bind(this)}/>
          English</label></span></div>
			</form>
		</div>
    );
  }
}
