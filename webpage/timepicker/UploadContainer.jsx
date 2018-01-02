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
		this.refs.lyricsSource.disabled = true;
		var file = this.refs.lyricsSource.files[0];
		var reader = new FileReader();
        reader.readAsText(file);

        reader.onload = (progressEvent) => {
            // console.log(this.result);
            this.props.setLyrics(progressEvent.target.result.split('\n'));
        };
	}

	audioSourceChanged(){
        this.refs.audioSource.disabled = true;
        var sound = this.refs.audioPlayer;
        this.props.setAudioSource(URL.createObjectURL(this.refs.audioSource.files[0]));
		window.addEventListener("keydown", (e) => { //this event only fires when file uploaded
            if (e.keyCode == 13 && e.target == document.body) { //enter
                e.preventDefault(); // and prevent enter default
                this.props.recordTime();
            }
            //add AudioPlayer here (componentDidMount) in order to prevent pressing play/pause/vol up down if the audio hasnt loaded yet
        });	
	}

	//add AudioPlayer other methods here to support ^
	

	render() {
		return (
			<div className="dotted-border">
			    <div className="row" id="description">
	                <p> This Time Picker Tool helps record the timestamp for each line of a song. </p>
	                <p> Once you upload the corresponding files, the page will be filled with the lyrics and the player with the song. </p>
	                <p> Press <span className="keys">[Enter]</span> at the start of each line; a timestamp is generated to the line's right.</p>
	                <p> Use <span className="keys">[ - ]</span> and <span className="keys">[ + ]</span> to control volume. 
	                    Use <span className="keys">[left arrow]</span> and <span className="keys">[right arrow]</span> to seek by 2 seconds. </p>
	                <p> Click on the timestamp to edit previously recorded timestamps. </p>
	                <p> Hit the Pretty Print button after all times have been recorded, and copy it into Submit a Song. </p>
	            </div>
			    <div className="row text-center">
			        <div className="col-6">
			            Upload a .txt file for the lyrics of the song.<br/>
			            <input type="file"
			            	id="lyricsSource"
			            	ref="lyricsSource"
			            	className='btn'
			            	accept=".txt"
			            	onChange={(e)=>this.lyricsChanged(e)} />
			        </div>
			        <div className="col-6">
			            Upload a .mp3 file for the audio of the song.<br/>
			            <input type="file" id="audioSource" ref="audioSource" className='btn' accept=".mp3" onChange={this.audioSourceChanged}/>
			        </div>
			    </div>
			</div>
			        
		);
	}

}