"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Visualizer = function (_React$Component) {
	_inherits(Visualizer, _React$Component);

	function Visualizer() {
		_classCallCheck(this, Visualizer);

		return _possibleConstructorReturn(this, (Visualizer.__proto__ || Object.getPrototypeOf(Visualizer)).apply(this, arguments));
	}

	_createClass(Visualizer, [{
		key: "setCanvas",

		// constructor(){
		// 	super()
		// 	this.setCanvas = this.setCanvas.bind(this);
		// }

		value: function setCanvas() {
			var audio = this.props.audioSrc;
			var context = new AudioContext();
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

			var barWidth = WIDTH / bufferLength * 2.5;
			var barHeight;
			var x = 0;
			var heightScale = HEIGHT / 255;

			function renderFrame() {
				requestAnimationFrame(renderFrame);

				var x = 0;

				//analyser.getByteFrequencyData returns a normalized array of values between 0 and 255.
				analyser.getByteFrequencyData(dataArray);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				// ctx.fillStyle = "rgba(0,0,0,0)";

				for (var i = 0; i < bufferLength; i++) {

					barHeight = dataArray[i];

					var r = barHeight + 25 * (i / bufferLength);
					var g = 250 * (i / bufferLength);
					var b = 240;

					ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ", .25)";
					ctx.fillRect(x, HEIGHT - barHeight * heightScale, barWidth, barHeight * heightScale);
					//add a top border line
					ctx.beginPath();
					ctx.moveTo(x, HEIGHT - barHeight * heightScale);
					ctx.lineTo(x + barWidth, HEIGHT - barHeight * heightScale);
					ctx.closePath();
					ctx.stroke();
					x += barWidth + 1;
				}
			}
			this.refs.audioPlayer.togglePlayer(); // start by playing
			renderFrame();
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement("canvas", { ref: "canvas", className: "canvas" });
		}
	}]);

	return Visualizer;
}(React.Component);

exports.default = Visualizer;