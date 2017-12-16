export default class UploadContainer extends React.Component {
	constructor(){
		super();
		this.state = {
		}
		this.lyricsChanged = this.lyricsChanged.bind(this);
		this.audioSourceChanged = this.audioSourceChanged.bind(this);
	}
	componentWillMount(){
	  	
	}
	componentDidMount(){

	}
	componentWillUnmount(){
	
	}

	lyricsChanged(e){
		this.refs.lyricsSource.disabled = true
		var file = this.refs.lyricsSource.files[0]
		var reader = new FileReader();
        reader.readAsText(file);

        reader.onload = (progressEvent) => {
            // console.log(this.result);
            this.props.setLyrics(progressEvent.target.result.split('\n'));
        };
	}

	audioSourceChanged(){
		var fileType = this.refs.audioSource;
        
        fileType.disabled = true;
        var sound = this.refs.audioPlayer;
        this.props.setAudioSource(URL.createObjectURL(fileType.files[0]));
		window.addEventListener("keydown", (e) => { //this event only fires when file uploaded
            if (e.keyCode == 13 && e.target == document.body) { //enter
                e.preventDefault(); // and prevent enter default
                this.props.recordTime();
            }
        });	
	}
	

	render() {
		return (
			<div className="dotted-border">
			    <div className="row" id="description">
			        <p>
			            This Time Picker Tool helps record the timestamp for each line of a song. <br/>
			            Press <strong>[Enter]</strong> at the start of each line; a timestamp is generated to the line's right.<br/>
			            Once you upload the corresponding files, the page will be filled with the lyrics and the player with the song. <br/>
			            Click on the timestamp to edit <strong>all</strong> previously recorded timestamps.<br/>
			            Hit the <strong>Pretty Print</strong> Button after all times have been recorded, and copy it into Submit a Song.
			        </p>
			    </div>
			    <div className="row text-center">
			        <div className="col-6">
			            Upload a .txt file for the lyrics of the song.<br/>
			            <label htmlFor="lyricsSource" className="btn btn-outline-secondary"> Upload Lyrics</label>
			            <input type="file"
			            	id="lyricsSource"
			            	ref="lyricsSource"
			            	accept=".txt"
			            	onChange={(e)=>this.lyricsChanged(e)} />
			        </div>
			        <div className="col-6">
			            Upload a .mp3 file for the audio of the song.<br/>
			            <label htmlFor="audioSource" className="btn btn-outline-secondary"> Upload MP3</label>
			            <input type="file" id="audioSource" ref="audioSource" accept=".mp3" onChange={this.audioSourceChanged}/>
			        </div>
			    </div>
			</div>
			        
		);
	}

}