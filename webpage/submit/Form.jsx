import {HelpBlock,FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import axios from 'axios'

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "request":"pending"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.id;
    this.setState({
      [name]:value
    })
  }

  handleSubmit(event) {
    // alert('A name was submitted: ' + JSON.stringify(this.state));
    event.preventDefault();
    var formData = new FormData();
    this.setState({request:"transit"})
    var audioFile = document.querySelector('#audioFile')
    formData.append("audioFile", audioFile.files[0])
    formData.append("payload", JSON.stringify(this.state))
    axios.post("upload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response)=>{
      this.setState({request:"done"})
      if (response.data.redirect === "/uploadComplete") {
            // data.redirect contains the string URL to redirect to
            window.location.href = response.data.redirect;
      }
      else{
        alert(response.data.message)
      }
    }).catch(error => console.log(error));;

  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className ="col-xs-3">
               <FormGroup bsSize="small" controlId="song">
                  <ControlLabel>Song Title:</ControlLabel>
                  <FormControl type="text" placeholder="歌曲名" onChange={this.handleChange} disabled={this.state.request==="pending"? false:true} />
                </FormGroup>
            </div>
            <div className ="col-xs-3">
         <FormGroup bsSize="small" controlId="artist">
            <ControlLabel>Artist Name:</ControlLabel>
            <FormControl type="text" placeholder="艺术家" onChange={this.handleChange} disabled={this.state.request==="pending"? false:true} />
          </FormGroup>
          </div>
          </div>

        <div className="row">
          <div className="col-xs-4">
            <FormGroup  bsSize="large" controlId="cnLyrics">
              <ControlLabel>Chinese Character Lyrics:</ControlLabel>
              <FormControl componentClass="textarea" placeholder="中文歌词" onChange={this.handleChange} disabled={this.state.request==="pending"? false:true}/>
              <HelpBlock>Insert the Chinese Lyrics here.</HelpBlock>
            </FormGroup>
          </div>
          <div className="col-xs-4">
            <FormGroup  bsSize="large" controlId="pinyinLyrics">
              <ControlLabel>Pinyin Lyrics:</ControlLabel>
              <FormControl componentClass="textarea" placeholder="拼音" onChange={this.handleChange} disabled={this.state.request==="pending"? false:true}/>
              <HelpBlock>Insert the Pinyin of the Chinese Characters here.</HelpBlock>
            </FormGroup>
          </div>
          <div className="col-xs-4">
            <FormGroup  bsSize="large" controlId="engLyrics">
              <ControlLabel>English Translation:</ControlLabel>
              <FormControl componentClass="textarea" placeholder="英文翻译" onChange={this.handleChange} disabled={this.state.request==="pending"? false:true}/>
              <HelpBlock>Insert the English Translation of the Lyrics here.</HelpBlock>
            </FormGroup>
          </div>
        </div>
        <FormGroup controlId="audioFile">
          <ControlLabel>MP3 Upload</ControlLabel>
          <FormControl type="file" accept=".mp3" disabled={this.state.request==="pending"? false:true}/>
        </FormGroup>

        <FormGroup  bsSize="large" controlId="times">
          <ControlLabel>Line Timings:</ControlLabel>
          <FormControl componentClass="textarea" placeholder="时间轴" onChange={this.handleChange} disabled={this.state.request==="pending"? false:true}/>
          <HelpBlock>Insert the Timings of Line Transitions of the Lyrics here.</HelpBlock>
        </FormGroup>

        <input type="submit" value="Submit" id="submit" disabled={this.state.request==="pending"? false:true} />

        <div className = "centered">
            {this.state.request === "transit" ?
              (<img height="150px" width = "150px" src= "loading.gif"></img>):null
            }
        </div>
      </form>
    );
  }
}
