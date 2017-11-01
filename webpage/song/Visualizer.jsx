export default class Visualizer extends React.Component {
	// constructor(){
	// 	super()
	// 	this.setCanvas = this.setCanvas.bind(this);
	// }

	setCanvas(){
		var audio = this.props.audioSrc;
		var context = new AudioContext()
	    var src = context.createMediaElementSource(audio);
	    var analyser = context.createAnalyser();

	    var canvas = this.refs.canvas;
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	    var ctx = canvas.getContext("2d");

	    src.connect(analyser);
	    analyser.connect(context.destination);

	    analyser.fftSize = 256;

	    var bufferLength = analyser.frequencyBinCount;

	    var dataArray = new Uint8Array(bufferLength);

	    var WIDTH = canvas.width; 
	    var HEIGHT = canvas.height;

	    var barWidth = (WIDTH / bufferLength) * 2.5;
	    var barHeight;
	    var x = 0;
	    var heightScale = HEIGHT/255;

		function renderFrame() {
			requestAnimationFrame(renderFrame);

			var x = 0;

			//analyser.getByteFrequencyData returns a normalized array of values between 0 and 255.
			analyser.getByteFrequencyData(dataArray);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			// ctx.fillStyle = "rgba(0,0,0,0)";

			for (var i = 0; i < bufferLength; i++) {


				barHeight = dataArray[i];

				var r = barHeight + (25 * (i/bufferLength));
				var g = 250 * (i/bufferLength);
				var b = 240;

				ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ", .25)";
				ctx.fillRect(x, HEIGHT - (barHeight * heightScale), barWidth, (barHeight * heightScale));
				//add a top border line
				ctx.beginPath();
				ctx.moveTo(x, HEIGHT - (barHeight * heightScale))
				ctx.lineTo((x + barWidth), HEIGHT - (barHeight * heightScale));
				ctx.closePath();
				ctx.stroke();
				x += barWidth + 1;
      		}
		}
		this.refs.audioPlayer.togglePlayer(); // start by playing
	    renderFrame();
	}

	render(){
		return (<canvas ref="canvas" className = "canvas"></canvas>)
	}
}
