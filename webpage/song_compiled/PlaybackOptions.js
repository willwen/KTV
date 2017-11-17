"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlaybackOptions = function (_React$Component) {
	_inherits(PlaybackOptions, _React$Component);

	function PlaybackOptions(props) {
		_classCallCheck(this, PlaybackOptions);

		var _this = _possibleConstructorReturn(this, (PlaybackOptions.__proto__ || Object.getPrototypeOf(PlaybackOptions)).call(this, props));

		_this.state = {
			wantScrolling: true,
			showLineNums: true,
			showVisualizer: true
		};
		_this.toggleScrolling = _this.toggleScrolling.bind(_this);
		_this.toggleLineNums = _this.toggleLineNums.bind(_this);
		_this.toggleVisualizer = _this.toggleVisualizer.bind(_this);
		return _this;
	}

	_createClass(PlaybackOptions, [{
		key: "toggleScrolling",
		value: function toggleScrolling() {
			var _this2 = this;

			this.setState({
				wantScrolling: !this.state.wantScrolling
			}, function () {
				return _this2.props.toggleScrolling();
			});
		}
	}, {
		key: "toggleLineNums",
		value: function toggleLineNums() {
			var _this3 = this;

			this.setState({
				showLineNums: !this.state.showLineNums
			}, function () {
				return _this3.props.toggleLineNums();
			});
		}
	}, {
		key: "toggleVisualizer",
		value: function toggleVisualizer() {
			var _this4 = this;

			this.setState({
				showVisualizer: !this.state.showVisualizer
			}, function () {
				return _this4.props.showVisualizer();
			});
		}
	}, {
		key: "modifyOptions",
		value: function modifyOptions(e) {
			e.preventDefault();
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ className: "playbackOptions col-xs-6" },
				React.createElement(
					"form",
					{ onSubmit: this.modifyOptions },
					React.createElement(
						"span",
						null,
						"Playback Options:"
					),
					React.createElement(
						"div",
						{ className: "checkbox" },
						React.createElement(
							"span",
							null,
							React.createElement(
								"label",
								null,
								React.createElement("input", { checked: this.state.wantScrolling, onChange: this.toggleScrolling, id: "wantScrolling", type: "checkbox" }),
								"Scrolling"
							)
						)
					),
					React.createElement(
						"div",
						{ className: "checkbox" },
						React.createElement(
							"span",
							null,
							React.createElement(
								"label",
								null,
								React.createElement("input", { checked: this.state.showLineNums, onChange: this.toggleLineNums, id: "lineNumbers", type: "checkbox" }),
								"Line Numbers"
							)
						)
					),
					React.createElement(
						"div",
						{ className: "checkbox" },
						React.createElement(
							"span",
							null,
							React.createElement(
								"label",
								null,
								React.createElement("input", { checked: this.state.showVisualizer, onChange: this.toggleVisualizer, id: "visualizer", type: "checkbox", disabled: "true" }),
								"Visualizer"
							)
						)
					)
				)
			);
		}
	}]);

	return PlaybackOptions;
}(React.Component);

exports.default = PlaybackOptions;