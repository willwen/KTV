"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LanguageOptions = function (_React$Component) {
  _inherits(LanguageOptions, _React$Component);

  function LanguageOptions(props) {
    _classCallCheck(this, LanguageOptions);

    var _this = _possibleConstructorReturn(this, (LanguageOptions.__proto__ || Object.getPrototypeOf(LanguageOptions)).call(this, props));

    _this.state = {
      pinyinChecked: true,
      cnChecked: true,
      enChecked: true
    };
    return _this;
  }

  _createClass(LanguageOptions, [{
    key: "modifyOptions",
    value: function modifyOptions(e) {
      e.preventDefault();
    }
  }, {
    key: "changePinyin",
    value: function changePinyin() {
      var _this2 = this;

      this.setState({
        pinyinChecked: !this.state.pinyinChecked
      }, function () {
        _this2.props.togglePinyin(_this2.state.pinyinChecked);
      });
    }
  }, {
    key: "changeCn",
    value: function changeCn() {
      var _this3 = this;

      this.setState({
        cnChecked: !this.state.cnChecked
      }, function () {
        _this3.props.toggleCn(_this3.state.cnChecked);
      });
    }
  }, {
    key: "changeEng",
    value: function changeEng() {
      var _this4 = this;

      this.setState({
        enChecked: !this.state.enChecked
      }, function () {
        _this4.props.toggleEng(_this4.state.enChecked);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "displayLanguages col-xs-6" },
        React.createElement(
          "form",
          { onSubmit: this.modifyOptions },
          React.createElement(
            "span",
            null,
            "Display Languages:"
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
                React.createElement("input", { id: "pinyinCB", type: "checkbox",
                  checked: this.state.pinyinChecked,
                  onChange: this.changePinyin.bind(this) }),
                "PinYin"
              )
            )
          ),
          React.createElement("span", null),
          React.createElement(
            "div",
            { className: "checkbox" },
            React.createElement(
              "span",
              null,
              React.createElement(
                "label",
                null,
                React.createElement("input", { id: "cnCB", type: "checkbox",
                  checked: this.state.cnChecked,
                  onChange: this.changeCn.bind(this) }),
                "Chinese Char"
              )
            )
          ),
          React.createElement("span", null),
          React.createElement(
            "div",
            { className: "checkbox" },
            React.createElement(
              "span",
              null,
              React.createElement(
                "label",
                null,
                React.createElement("input", { id: "engCB", type: "checkbox",
                  checked: this.state.enChecked,
                  onChange: this.changeEng.bind(this) }),
                "English"
              )
            )
          )
        )
      );
    }
  }]);

  return LanguageOptions;
}(React.Component);

exports.default = LanguageOptions;