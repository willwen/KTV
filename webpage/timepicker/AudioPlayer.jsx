import AudioAnimations from '../SharedReactComponents/AudioAnimations.jsx'

export default class AudioPlayer extends React.Component {
	constructor(){
		super();
		this.state = {
			action : "none"
		}
		this.toggleAudioPlayer = this.toggleAudioPlayer.bind(this);
		this.play = this.play.bind(this)
		this.pause = this.pause.bind(this)
		this.getCurrentTime = this.getCurrentTime.bind(this)
	}

	componentWillMount(){
	}

	componentDidMount(){
	 	window.addEventListener("keydown", (e) => { 
		    if (e.keyCode == 32 && e.target == document.body) {
	            this.toggleAudioPlayer(); // space bar to toggle audio player
	            e.preventDefault(); // and prevent scrolling
	        }
	        else if (e.keyCode == 37 && e.target == document.body) {//left arrow to seek backward
                    e.preventDefault(); 
                    this.refs.audioPlayer.currentTime -= 2;
            }
            else if (e.keyCode == 39 && e.target == document.body){ //right arrow to seek forward
                e.preventDefault(); 
                this.refs.audioPlayer.currentTime += 2;
            }
            //set + and - listeners for volume

			else if(e.keyCode == 187 && e.target == document.body){
				this.increaseVolume(); // increase audio player
				e.preventDefault();
			}
			else if(e.keyCode == 189 && e.target == document.body){
				this.decreaseVolume(); // decrease audio player
				e.preventDefault();
			}
        });

		// $("#jquery_jplayer_1").jPlayer({
		// 	ready: function () {
		// 		$(this).jPlayer("setMedia", {
		// 			title: "Bubble",
		// 			m4a: "http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
		// 			oga: "http://www.jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
		// 		});
		// },
		// cssSelectorAncestor: "#jp_container_1",
		// swfPath: "/js",
		// supplied: "m4a, oga",
		// useStateClassSkin: true,
		// autoBlur: false,
		// smoothPlayBar: true,
		// keyEnabled: true,
		// remainingDuration: true,
		// toggleDuration: true
		// });
	}
	componentWillUnmount(){
		URL.revokeObjectURL(this.refs.audioPlayer.src);
		console.log("deleted url reference")
	}

	toggleAudioPlayer(){
		if(this.refs.audioPlayer.paused){
			this.setState({action : "play"});
			setTimeout(function(){
				this.setState({"action": "none"})
			}.bind(this), 2000)
			this.play();
		}
		else{
			this.setState({action : "pause"});
			setTimeout(function(){
				this.setState({"action": "none"})
			}.bind(this), 2000)
			this.pause();
		}
	}

	increaseVolume(){
		this.setState({action : "vol_up"});
		setTimeout(function(){
				this.setState({"action": "none"})
		}.bind(this), 2000)
		if(this.refs.audioPlayer.volume != 1.0)
			this.refs.audioPlayer.volume = this.refs.audioPlayer.volume + .1;
	}

	decreaseVolume(){
		this.setState({action : "vol_down"});
		setTimeout(function(){
				this.setState({"action": "none"})
		}.bind(this), 2000)
		if(this.refs.audioPlayer.volume > .1)
			this.refs.audioPlayer.volume = this.refs.audioPlayer.volume - .1;	
	}

	play(){
		this.refs.audioPlayer.play()
	}

	pause(){
		this.refs.audioPlayer.pause();
	}

	getCurrentTime(){
		return this.refs.audioPlayer.currentTime;
	}
	render() {
		return (
			<div>
				

				<div className="text-center">
				    <div className="audioContainer">
				        <audio controls="true" ref="audioPlayer" id="audioPlayer" src={this.props.src}></audio>
				    </div>
				</div>
				<AudioAnimations action = {this.state.action}/>
			</div>
		);
	}
}
// <div id="jquery_jplayer_1" className="jp-jplayer"></div>
// <div id="jp_container_1" className="jp-audio" role="application" aria-label="media player">
//     <div className="jp-type-single">
//         <div className="jp-gui jp-interface">
//             <div className="jp-controls">
//                 <a className="jp-play"><i className="fa fa-play"></i></a>
//                 <a className="jp-pause"><i className="fa fa-pause"></i></a>
//                 <a className="jp-stop"><i className="fa fa-stop"></i></a>
//             </div>
//             <div className="jp-progress">
//                 <div className="jp-seek-bar">
//                     <div className="jp-play-bar"></div>
//                 </div>
//             </div>
//             <div className="jp-volume-controls">
//                 <a className="jp-mute"><i className="fa fa-volume-off"></i></a>
//                 <a className="jp-volume-max"><i className="fa fa-volume-up"></i></a>
//                 <div className="jp-volume-bar">
//                     <div className="jp-volume-bar-value"></div>
//                 </div>
//             </div>
//             <div className="jp-time-holder">
//                 <div className="jp-current-time" role="timer" aria-label="time">&nbsp;</div>
//                 <div className="jp-duration" role="timer" aria-label="duration">&nbsp;</div>
//             </div>
//         </div>
//         <div className="jp-no-solution">
//             <span>Update Required</span>
//             To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.
//         </div>
//     </div>
// </div>
