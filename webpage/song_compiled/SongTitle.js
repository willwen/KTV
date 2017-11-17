"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SongTitle = function (_React$Component) {
  _inherits(SongTitle, _React$Component);

  function SongTitle() {
    _classCallCheck(this, SongTitle);

    return _possibleConstructorReturn(this, (SongTitle.__proto__ || Object.getPrototypeOf(SongTitle)).apply(this, arguments));
  }

  _createClass(SongTitle, [{
    key: "render",
    value: function render() {
      var title = '';
      if (this.props.title && this.props.artist) title = this.props.title + " - " + this.props.artist;
      return React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "h1",
          { className: " col-xs-12 page-header", id: "titleLine" },
          title
        ),
        React.createElement("br", null)
      );
    }
  }]);

  return SongTitle;
}(React.Component);

exports.default = SongTitle;