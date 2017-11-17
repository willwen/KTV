"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AudioAnimations = function (_React$Component) {
  _inherits(AudioAnimations, _React$Component);

  function AudioAnimations(props, context) {
    _classCallCheck(this, AudioAnimations);

    return _possibleConstructorReturn(this, (AudioAnimations.__proto__ || Object.getPrototypeOf(AudioAnimations)).call(this, props, context));
  }

  _createClass(AudioAnimations, [{
    key: "render",
    value: function render() {
      var popup = void 0;
      if (this.props.action == "none") {
        popup = null;
      } else {
        popup = React.createElement(
          "div",
          { id: this.props.action, className: "centered" },
          React.createElement("img", { className: "transition", height: "300px", width: "300px", src: this.props.action + ".png" })
        );
      }
      return popup;
    }
  }]);

  return AudioAnimations;
}(React.Component);

exports.default = AudioAnimations;