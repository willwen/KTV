'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Header = require('../SharedReactComponents/Header.jsx');

var _Header2 = _interopRequireDefault(_Header);

var _OptionsMenu = require('./OptionsMenu.jsx');

var _OptionsMenu2 = _interopRequireDefault(_OptionsMenu);

var _SongTitle = require('./SongTitle.jsx');

var _SongTitle2 = _interopRequireDefault(_SongTitle);

var _LyricsBody = require('./LyricsBody.jsx');

var _LyricsBody2 = _interopRequireDefault(_LyricsBody);

var _Visualizer = require('./Visualizer.jsx');

var _Visualizer2 = _interopRequireDefault(_Visualizer);

var _AudioPlayer = require('./AudioPlayer.jsx');

var _AudioPlayer2 = _interopRequireDefault(_AudioPlayer);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainContainer = function (_React$Component) {
	_inherits(MainContainer, _React$Component);

	function MainContainer() {
		_classCallCheck(this, MainContainer);

		var _this = _possibleConstructorReturn(this, (MainContainer.__proto__ || Object.getPrototypeOf(MainContainer)).call(this));

		_this.state = {
			currentTitle: '',
			currentArtist: '',
			currentLine: 0,
			areOptionsInflated: true, //opposite is collapsed
			lyrics: {
				pinyin: [],
				cn: [],
				eng: [],
				times: []
			},
			songPath: '',
			scrollingOffset: -400,
			options: {
				showPinyin: true,
				showCn: true,
				showEng: true,
				allowScrolling: true,
				showLineNums: true,
				showVisualizer: true
			}
		};
		_this.setCurrentLine = _this.setCurrentLine.bind(_this);
		_this.getSongLyrics = _this.getSongLyrics.bind(_this);
		_this.handleNewLyrics = _this.handleNewLyrics.bind(_this);
		_this.togglePinyin = _this.togglePinyin.bind(_this);
		_this.toggleEng = _this.toggleEng.bind(_this);
		_this.toggleCn = _this.toggleCn.bind(_this);
		_this.toggleScrolling = _this.toggleScrolling.bind(_this);
		_this.toggleLineNums = _this.toggleLineNums.bind(_this);
		_this.toggleVisualizer = _this.toggleVisualizer.bind(_this);
		_this.scaleScrolling = _this.scaleScrolling.bind(_this);
		_this.skipToLine = _this.skipToLine.bind(_this);
		_this.changeLineColor = _this.changeLineColor.bind(_this);
		// this.renderFrame = this.renderFrame.bind(this);
		_this.setCanvas = _this.setCanvas.bind(_this);
		_this.getParameterByName = _this.getParameterByName.bind(_this);
		return _this;
	}

	_createClass(MainContainer, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.scaleScrolling();
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var id = this.getParameterByName('id');
			var title = this.getParameterByName('title');
			var artist = this.getParameterByName('artist');
			this.getSongLyrics(id, title, artist);

			//enable all tooltips
			var audioPlayer = this.refs.audioPlayer;
			window.addEventListener("keydown", function (e) {
				if (e.keyCode == 32 && e.target == document.body) {
					audioPlayer.togglePlayer(); // space bar to toggle audio player
					e.preventDefault(); // and prevent scrolling
				}
				//set + and - listeners for volume

				else if (e.keyCode == 187 && e.target == document.body) {
						audioPlayer.increaseVolume(); // increase audio player
						e.preventDefault();
					} else if (e.keyCode == 189 && e.target == document.body) {
						audioPlayer.decreaseVolume(); // decrease audio player
						e.preventDefault();
					}
			});

			window.addEventListener("resize", this.scaleScrolling);
			this.setCanvas();
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			window.removeEventListener("resize", this.scaleScrolling);
		}
	}, {
		key: 'setCanvas',
		value: function setCanvas() {
			var audio = this.refs.audioPlayer.refs.audioHTML;
			var AudioContext = window.AudioContext || window.webkitAudioContext; // Safari and old versions of Chrome
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
					// if(barHeight!=0){
					// 	console.log("not zero:")
					// 	console.log(barHeight)
					// }
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
			// this.refs.audioPlayer.togglePlayer(); // start by playing
			renderFrame();
		}
		//Thank you https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/901144

	}, {
		key: 'getParameterByName',
		value: function getParameterByName(name, url) {
			if (!url) url = window.location.href;
			name = name.replace(/[\[\]]/g, "\\$&");
			var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			    results = regex.exec(url);
			if (!results) return null;
			if (!results[2]) return '';
			return decodeURIComponent(results[2].replace(/\+/g, " "));
		}
	}, {
		key: 'scaleScrolling',
		value: function scaleScrolling() {
			// var winWidth =  window.innerWidth;
			var winHeight = window.innerHeight;
			this.setState({ scrollingOffset: Math.round(winHeight * .35) });
		}
	}, {
		key: 'setCurrentLine',
		value: function setCurrentLine(val) {
			this.setState({ currentLine: val });
		}
	}, {
		key: 'getSongLyrics',
		value: function getSongLyrics(id, title, artist) {
			_axios2.default.get("getSong", { params: { 'id': id } }).then(this.handleNewLyrics).catch(function (error) {
				return console.log(error);
			});
			this.setState({ currentTitle: title, currentArtist: artist, currentLine: 0 });
		}
		//called when a user clicks on a new song

	}, {
		key: 'handleNewLyrics',
		value: function handleNewLyrics(response) {
			this.setState({
				currentLine: 0,
				lyrics: {
					cn: response.data['cn.txt'],
					eng: response.data['eng.txt'],
					pinyin: response.data['pinyin.txt'],
					times: response.data['times.txt']
				},
				songPath: response.data['songFile'],
				areOptionsInflated: true //!this.state.areOptionsInflated
			});
			this.refs.audioPlayer.setSong(this.state.songPath);
			this.refs.lyricsBody.clearLyrics();
		}
	}, {
		key: 'skipToLine',
		value: function skipToLine(lineToSet, timeToSet) {
			this.refs.audioPlayer.setCurrentTime(timeToSet);
			this.setState({ currentLine: lineToSet });
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				null,
				React.createElement('canvas', { className: 'canvas', ref: 'canvas' }),
				React.createElement(
					'div',
					{ className: 'container' },
					React.createElement(_Header2.default, null),
					React.createElement(_OptionsMenu2.default, {
						options: this.state.options,
						open: this.state.areOptionsInflated,
						togglePinyin: this.togglePinyin,
						toggleCn: this.toggleCn,
						toggleEng: this.toggleEng,
						toggleLineNums: this.toggleLineNums,
						toggleScrolling: this.toggleScrolling,
						toggleVisualizer: this.toggleVisualizer
					}),
					React.createElement('div', { className: 'clearfix' }),
					React.createElement(_SongTitle2.default, {
						title: this.state.currentTitle,
						artist: this.state.currentArtist }),
					React.createElement(_LyricsBody2.default, { ref: 'lyricsBody', currentLine: this.state.currentLine,
						lyrics: this.state.lyrics,
						skipToTime: this.skipToLine,
						options: this.state.options })
				),
				React.createElement(_AudioPlayer2.default, { ref: 'audioPlayer',
					times: this.state.lyrics.times,
					updateCurrentLine: this.setCurrentLine,
					currentLine: this.state.currentLine,
					scrollOffset: this.state.scrollingOffset,
					allowScrolling: this.state.options.allowScrolling,
					changeLineColor: this.changeLineColor })
			);
		}
	}, {
		key: 'changeLineColor',
		value: function changeLineColor(currentLine) {
			this.refs.lyricsBody.incrementLineColor(currentLine);
		}

		//toggles:

	}, {
		key: 'toggleScrolling',
		value: function toggleScrolling() {
			var temp = this.state.options;
			temp['allowScrolling'] = !this.state.options.allowScrolling;
			this.setState({
				options: temp
			});
		}
	}, {
		key: 'toggleLineNums',
		value: function toggleLineNums() {
			var temp = this.state.options;
			temp['showLineNums'] = !this.state.options.showLineNums;
			this.setState({
				options: temp
			});
		}
	}, {
		key: 'toggleVisualizer',
		value: function toggleVisualizer() {
			var temp = this.state.options;
			temp['showVisualizer'] = !this.state.options.showVisualizer;
			this.setState({
				options: temp
			});
		}
	}, {
		key: 'togglePinyin',
		value: function togglePinyin(isChecked) {
			var temp = this.state.options;
			temp['showPinyin'] = !this.state.options.showPinyin;
			this.setState({
				options: temp
			});
		}
	}, {
		key: 'toggleCn',
		value: function toggleCn(isChecked) {
			var temp = this.state.options;
			temp['showCn'] = !this.state.options.showCn;
			this.setState({
				options: temp
			});
		}
	}, {
		key: 'toggleEng',
		value: function toggleEng(isChecked) {
			//shallow merging
			var temp = this.state.options;
			temp['showEng'] = !this.state.options.showEng;
			this.setState({
				options: temp
			});
		}
	}]);

	return MainContainer;
}(React.Component);

exports.default = MainContainer;