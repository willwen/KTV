'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Constants = require('./Constants.jsx');

var _Constants2 = _interopRequireDefault(_Constants);

var _AudioAnimations = require('./AudioAnimations.jsx');

var _AudioAnimations2 = _interopRequireDefault(_AudioAnimations);

var _reactScroll = require('react-scroll');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Imports scroller mixin, can use as scroller.scrollTo()

var AudioPlayer = function (_React$Component) {
	_inherits(AudioPlayer, _React$Component);

	function AudioPlayer(props, context) {
		_classCallCheck(this, AudioPlayer);

		var _this = _possibleConstructorReturn(this, (AudioPlayer.__proto__ || Object.getPrototypeOf(AudioPlayer)).call(this, props, context));

		_this.togglePlayer = _this.togglePlayer.bind(_this);
		_this.updateLine = _this.updateLine.bind(_this);
		_this.checkTimes = _this.checkTimes.bind(_this);
		_this.getAudioPlayer = _this.getAudioPlayer.bind(_this);
		_this.state = {
			action: "none"
		};
		return _this;
	}

	_createClass(AudioPlayer, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.refs.audioHTML.ontimeupdate = this.checkTimes;
		}
	}, {
		key: 'checkTimes',
		value: function checkTimes() {
			if (this.props.times.length != 0) {
				var times = this.props.times;
				var currentLine = this.props.currentLine;
				var convertedToSeconds = _Constants2.default.timestampToSeconds(times[currentLine]);
				var time = Math.round(this.refs.audioHTML.currentTime);

				if (convertedToSeconds == 0 && currentLine != 0) {
					this.props.updateCurrentLine(currentLine + 1);
					return;
				}

				if (time >= convertedToSeconds) {
					// var t0 = performance.now();
					this.updateLine(currentLine);
					// var t1 = performance.now();

					// console.log("scrolling val: " + scrollingOffset);
					this.props.updateCurrentLine(currentLine + 1);
					if (this.props.allowScrolling) {
						// console.log("offset: " + this.props.scrollOffset*2)
						_reactScroll.scroller.scrollTo(_Constants2.default.ConstsClass.genericLinePrefix + (currentLine + 1), {
							duration: 500,
							delay: 0,
							smooth: true,
							// ,
							// containerId: document
							// ,
							offset: this.props.scrollOffset * 2
						});
						// $(window).scrollTo($("#" +Constants.ConstsClass.genericLinePrefix + currentLine), {axis: 'y', interrupt: true, duration: 500, offset :{top : this.props.scrollOffset}});
					}
				}
			}
		}
	}, {
		key: 'increaseVolume',
		value: function increaseVolume() {
			var that = this;
			this.setState({ action: "vol_up" });
			setTimeout(function () {
				this.setState({ "action": "none" });
			}.bind(this), 2000);
			if (this.refs.audioHTML.volume != 1.0) this.refs.audioHTML.volume = this.refs.audioHTML.volume + .1;
		}
	}, {
		key: 'decreaseVolume',
		value: function decreaseVolume() {
			this.setState({ action: "vol_down" });
			setTimeout(function () {
				this.setState({ "action": "none" });
			}.bind(this), 2000);
			if (this.refs.audioHTML.volume > .1) this.refs.audioHTML.volume = this.refs.audioHTML.volume - .1;
		}
	}, {
		key: 'resetAction',
		value: function resetAction() {}
	}, {
		key: 'setCurrentTime',
		value: function setCurrentTime(newTime) {
			this.refs.audioHTML.currentTime = newTime;
			this.refs.audioHTML.play();
		}
	}, {
		key: 'setSong',
		value: function setSong(songSource) {
			this.refs.audioHTML.src = songSource;
		}
	}, {
		key: 'getAudioPlayer',
		value: function getAudioPlayer() {
			return this.refs.audioHTML;
		}
	}, {
		key: 'togglePlayer',
		value: function togglePlayer() {
			if (this.refs.audioHTML.paused) {
				this.setState({ action: "play" });
				setTimeout(function () {
					this.setState({ "action": "none" });
				}.bind(this), 2000);
				this.refs.audioHTML.play();
			} else {
				this.setState({ action: "pause" });
				setTimeout(function () {
					this.setState({ "action": "none" });
				}.bind(this), 2000);
				this.refs.audioHTML.pause();
			}
		}
	}, {
		key: 'updateLine',
		value: function updateLine(currentLine) {
			this.props.changeLineColor(currentLine);
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				null,
				React.createElement(
					'div',
					{ className: 'audioContainer' },
					React.createElement('audio', { controls: 'true', ref: 'audioHTML', id: 'audioPlayer' })
				),
				React.createElement(_AudioAnimations2.default, { action: this.state.action })
			);
		}
	}]);

	return AudioPlayer;
}(React.Component);

exports.default = AudioPlayer;