"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var NytApi = /*#__PURE__*/function () {
  function NytApi() {
    _classCallCheck(this, NytApi);

    _defineProperty(this, "API_URL_BASE", "https://api.nytimes.com/svc/search/v2/articlesearch.json");

    _defineProperty(this, "API_KEY", "QT3L7SGkXlo5eJqpAsnf76L21p6I8tqO");
  }

  _createClass(NytApi, [{
    key: "search",
    value: function search(term) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      axios.get(this.API_URL_BASE, {
        params: _objectSpread({
          "api-key": this.API_KEY,
          q: term
        }, options)
      }).then(this.handleResponse).catch(this.handleError);
    }
  }, {
    key: "handleResponse",
    value: function handleResponse(response) {
      // pass results back to main.js via custom event
      var value = response.data.response.docs;
      var event = new CustomEvent("got-results", {
        detail: value
      });
      document.querySelector("body").dispatchEvent(event);
    }
  }, {
    key: "handleError",
    value: function handleError(error) {}
  }]);

  return NytApi;
}();
//# sourceMappingURL=nyt-api.js.map
