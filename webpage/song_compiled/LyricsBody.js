'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Constants = require('./Constants.jsx');

var _Constants2 = _interopRequireDefault(_Constants);

var _reactBootstrap = require('react-bootstrap');

var _reactScroll = require('react-scroll');

var _reactScroll2 = _interopRequireDefault(_reactScroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Imports all Mixins
var Element = _reactScroll2.default.Element;

var LyricsBody = function (_React$Component) {
	_inherits(LyricsBody, _React$Component);

	function LyricsBody(props) {
		_classCallCheck(this, LyricsBody);

		var _this = _possibleConstructorReturn(this, (LyricsBody.__proto__ || Object.getPrototypeOf(LyricsBody)).call(this, props));

		_this.state = {
			lines: [],
			lineStyles: []
		};

		_this.clearLyrics = _this.clearLyrics.bind(_this);
		return _this;
	}

	_createClass(LyricsBody, [{
		key: 'anchorClick',
		value: function anchorClick(lineNum) {
			var newTime = _Constants2.default.timestampToSeconds(this.props.lyrics.times[lineNum - 1]); //minus one because lyrics start at 0 while currentLine starts at 1

			var style = this.state.lineStyles;
			//wipe color off current ones:
			//-2 because if you are on line 4, and line 5 is a new line, currentline immediately jumps to line 4.
			style[this.props.currentLine - 2] = { "color": _Constants2.default.ConstsClass.foregroundColor };
			style[this.props.currentLine - 1] = { "color": _Constants2.default.ConstsClass.foregroundColor };
			style[this.props.currentLine] = { "color": _Constants2.default.ConstsClass.foregroundColor, "fontWeight": "normal" };
			style[this.props.currentLine + 1] = { "color": _Constants2.default.ConstsClass.foregroundColor };

			style[lineNum - 1] = { "color": _Constants2.default.ConstsClass.highlightColor, "fontWeight": "bolder" };

			this.props.skipToTime(lineNum, newTime);

			this.setState({ lineStyles: style });
		}
	}, {
		key: 'clearLyrics',
		value: function clearLyrics() {
			this.setState({
				lines: [],
				lineStyles: []
			});
		}
	}, {
		key: 'incrementLineColor',
		value: function incrementLineColor(lineNum) {
			var style = this.state.lineStyles;
			//wipe color off current ones:
			style[this.props.currentLine - 2] = { "color": _Constants2.default.ConstsClass.foregroundColor, "fontWeight": "normal" };
			style[this.props.currentLine - 1] = { "color": _Constants2.default.ConstsClass.foregroundColor, "fontWeight": "normal" };
			style[this.props.currentLine] = { "color": _Constants2.default.ConstsClass.highlightColor, "fontWeight": "bolder"

				// style[this.props.currentLine + 1] = {"color" : Constants.ConstsClass.highlightColor, "fontWeight": "bolder"}


			};this.setState({ lineStyles: style });
		}
	}, {
		key: 'render',
		value: function render() {
			var bodyStyle = {};
			var lyricsBody = [];

			var lineNumberStyling = {};
			this.props.options.showLineNums ? lineNumberStyling = { visibility: "visible" } : lineNumberStyling = { visibility: "hidden" };

			var pinyinStyling = {};
			this.props.options.showPinyin ? pinyinStyling = { display: "block" } : pinyinStyling = { display: "none" };

			var cnStyling = {};
			this.props.options.showCn ? cnStyling = { display: "block" } : cnStyling = { display: "none" };

			var engStyling = {};
			this.props.options.showEng ? engStyling = { display: "block" } : engStyling = { display: "none" };

			if (this.props.lyrics.pinyin.length > 0) {
				bodyStyle = { "visibility": "visible" };
				var lineNumber = 1;
				var pinyin = this.props.lyrics.pinyin;
				var cnChar = this.props.lyrics.cn;
				var eng = this.props.lyrics.eng;
				var times = this.props.lyrics.times;

				for (var i = 0; i < Math.max(pinyin.length, cnChar.length, eng.length); i++) {
					var lineStyle = this.state.lineStyles[i];

					var minutes = Math.floor(times[i] / 100);
					var seconds = times[i] % 100;
					if (seconds < 10) seconds = "0" + seconds;
					//used for tooltip
					var time = minutes + ":" + seconds;

					//each lyric line takes up a row
					var tooltip = void 0;
					var overlayTrigger = void 0;
					if ((lineNumber == 1 || time != "0:00") && time != "NaN:NaN") {
						tooltip = React.createElement(
							_reactBootstrap.Tooltip,
							{ id: time, className: 'tooltip' },
							React.createElement(
								'strong',
								null,
								time
							)
						);
						overlayTrigger = React.createElement(
							_reactBootstrap.OverlayTrigger,
							{ placement: 'top', overlay: tooltip },
							React.createElement(
								'a',
								{ id: "lineNumber" + lineNumber, className: 'lineAnchor', onClick: this.anchorClick.bind(this, lineNumber) },
								lineNumber
							)
						);
					} else {
						overlayTrigger = React.createElement(
							'a',
							{ id: "lineNumber" + lineNumber, className: 'lineAnchor' },
							lineNumber
						);
					}

					var rowDiv = React.createElement(
						Element,
						{ key: "rowNumber" + lineNumber, name: _Constants2.default.ConstsClass.genericLinePrefix + lineNumber },
						React.createElement(
							'div',
							{ className: 'row', style: lineStyle },
							React.createElement(
								'div',
								{ className: _Constants2.default.ConstsClass.lyricLine + "  equal", id: _Constants2.default.ConstsClass.lyricLine + lineNumber },
								React.createElement(
									'div',
									{ className: 'col-xs-1 lineIndex vertical-center', style: lineNumberStyling },
									overlayTrigger
								),
								React.createElement(
									'div',
									{ className: 'col-xs-10 lyricWords' },
									React.createElement(
										'div',
										null,
										React.createElement(
											'div',
											{ className: _Constants2.default.ConstsClass.pinyinLyricsLineClass, style: pinyinStyling },
											' ',
											pinyin[i]
										),
										React.createElement(
											'div',
											{ className: _Constants2.default.ConstsClass.cnCharLyricsLineClass, style: cnStyling },
											' ',
											cnChar[i]
										),
										React.createElement(
											'div',
											{ className: _Constants2.default.ConstsClass.englishLyricsLineClass, style: engStyling },
											' ',
											eng[i]
										)
									)
								)
							),
							React.createElement('br', { className: 'clearfix' })
						)
					);
					lyricsBody.push(rowDiv);
					lineNumber++;
				}
			} else bodyStyle = { "visibility": "hidden" };

			this.state.lines = lyricsBody.map(function (line) {
				return line;
			});

			return React.createElement(
				'div',
				{ className: 'row' },
				React.createElement(
					Element,
					{ className: 'col-xs-12 element', id: 'lyricsBody', style: bodyStyle },
					this.state.lines
				)
			);
		}
	}]);

	return LyricsBody;
}(React.Component);

exports.default = LyricsBody;