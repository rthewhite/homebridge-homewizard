'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var API = (function () {
  function API(config) {
    _classCallCheck(this, API);

    this.config = config;
  }

  _createClass(API, [{
    key: 'request',
    value: function request(options) {

      if (!options.method) {
        options.method = 'GET';
      }

      // Transform url to full uri for request
      options.uri = this.config.url + '/' + this.config.password + '/' + options.url;

      // Homewizard responses are always json
      options.json = true;

      return (0, _requestPromise2['default'])(options);
    }
  }]);

  return API;
})();

exports.API = API;
