export default class Visualizer extends React.Component {
	constructor(){
		super();

		this.state = {
			canvasWidth: window.innerWidth,
	    	canvasHeight : window.innerHeight,
			src: null,
			fftSize: 64
		}
		this.scaleCanvas = this.scaleCanvas.bind(this);
		this.initAudioAnalyzer = this.initAudioAnalyzer.bind(this);
		this.getAudioFFT = this.getAudioFFT.bind(this);
		this.renderFrame = this.renderFrame.bind(this);

		let AudioContext = window.AudioContext || window.webkitAudioContext;  // Safari and old versions of Chrome
		this.state.audioContext = new AudioContext();
	}
	componentDidMount(){
		// this.initAudioAnalyzer();
		window.addEventListener("resize", this.scaleCanvas);
		this.scaleCanvas();
	}

	componentWillUnmount(){
		window.removeEventListener("resize", this.scaleCanvas);
	}

	componentDidUpdate(){
		if(this.props.audioPlayer){
			if(!this.state.src){
				this.initAudioAnalyzer();
			}
			this.getAudioFFT()
			this.renderFrame();
		}
	}


	scaleCanvas(){
		this.setState({
			canvasWidth: window.innerWidth,
	    	canvasHeight : window.innerHeight
	    })

		var isMobile = false; //initiate as false
		// https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery
		// device detection
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
			|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))
			isMobile = true;
		if(isMobile){
			this.state.fftSize = 64;
			//console.log("Assumed on mobile")
		}
		else{
			//console.log("Assumed on desktop")
			var width = window.innerWidth
			if (width < 768) {
				// do something for small screens
				this.state.fftSize = 64;
			}
			else if (width >= 768 &&  width <= 992) {
				// do something for medium screens
				this.state.fftSize = 128;
			}
			else {
				// do something for huge screens
				this.state.fftSize = 256;
			}
		}
		if(this.state.analyser){
			this.state.analyser.fftSize = this.state.fftSize
			this.state.bufferLength = this.state.analyser.frequencyBinCount;

		}
	}

	initAudioAnalyzer(){
		let audio = this.props.audioPlayer;
		//Only need to run this once when the HTML has a valid src
		this.state.src = this.state.audioContext.createMediaElementSource(audio);
		this.state.analyser = this.state.audioContext.createAnalyser();
		this.state.ctx = this.refs.canvas.getContext("2d");
		this.state.src.connect(this.state.analyser);
		this.state.analyser.connect(this.state.audioContext.destination);
		this.state.analyser.fftSize = this.state.fftSize
		this.state.bufferLength = this.state.analyser.frequencyBinCount;

	}


	getAudioFFT(){
		this.state.dataArray = new Uint8Array(this.state.bufferLength);
	}

	renderFrame() {
		let WIDTH = this.state.canvasWidth; 
		let HEIGHT = this.state.canvasHeight;
		let bufferLength = this.state.bufferLength;
		let dataArray = this.state.dataArray;

		let barWidth = (WIDTH / bufferLength) * 2.5;
		let x = 0;
		let heightScale = HEIGHT/255;
		requestAnimationFrame(this.renderFrame);

		//analyser.getByteFrequencyData returns a normalized array of values between 0 and 255.
		this.state.analyser.getByteFrequencyData(dataArray);
		let ctx = this.state.ctx
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		// ctx.fillStyle = "rgba(0,0,0,0)";

		for (var i = 0; i < bufferLength; i++) {
			let barHeight = dataArray[i];
			let percentage = i/bufferLength
			let r = barHeight + (25 * percentage);
			let g = 250 * percentage;
			let b = 256;
			ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ", .8)";
			// x	The x-coordinate of the upper-left corner of the rectangle
			// y	The y-coordinate of the upper-left corner of the rectangle
			// width	The width of the rectangle, in pixels
			// height	The height of the rectangle, in pixels
			let product = barHeight * heightScale
			let diff = HEIGHT - product
			ctx.fillRect(x, diff, barWidth, product);
			//add a top border line
			ctx.beginPath();
			ctx.moveTo(x, diff)
			ctx.lineTo((x + barWidth), diff);
			ctx.closePath();
			ctx.stroke();
			x += barWidth + 1;
		}
	}

	    



	render(){
		return (<canvas ref="canvas" className = "canvas" width = {this.state.canvasWidth} height = {this.state.canvasHeight}></canvas>)
	}
}
