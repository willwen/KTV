'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LanguageOptions = require('./LanguageOptions.jsx');

var _LanguageOptions2 = _interopRequireDefault(_LanguageOptions);

var _PlaybackOptions = require('./PlaybackOptions.jsx');

var _PlaybackOptions2 = _interopRequireDefault(_PlaybackOptions);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OptionsMenu = function (_React$Component) {
	_inherits(OptionsMenu, _React$Component);

	function OptionsMenu(props) {
		_classCallCheck(this, OptionsMenu);

		var _this = _possibleConstructorReturn(this, (OptionsMenu.__proto__ || Object.getPrototypeOf(OptionsMenu)).call(this, props));

		_this.state = {};
		return _this;
	}

	_createClass(OptionsMenu, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				_reactBootstrap.Collapse,
				{ 'in': this.props.open },
				React.createElement(
					'div',
					{ className: 'row optionsMenu', id: 'options' },
					React.createElement(_LanguageOptions2.default, {
						togglePinyin: this.props.togglePinyin,
						toggleCn: this.props.toggleCn,
						toggleEng: this.props.toggleEng }),
					React.createElement(_PlaybackOptions2.default, {
						toggleLineNums: this.props.toggleLineNums,
						toggleScrolling: this.props.toggleScrolling,
						toggleVisualizer: this.props.toggleVisualizer
					})
				)
			);
		}
	}]);

	return OptionsMenu;
}(React.Component);

exports.default = OptionsMenu;