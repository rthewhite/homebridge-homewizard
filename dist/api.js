'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

//eslint-disable-line id-length

var API = (function () {
  function API(config) {
    _classCallCheck(this, API);

    this.queue = [];
    this.running = [];
    this.limit = 3;

    this.config = config;
  }

  // Called when a promise from the queue resolves

  _createClass(API, [{
    key: '_queueResolve',
    value: function _queueResolve() {
      // Just popping an item. We just need to queue to shrink,
      // so items in the queue aren't always the non resolved promises!
      this.running.pop();

      if (this.queue.length > 0 && this.running.length < this.limit) {
        var next = this.queue.shift();
        this.running.push(next);
        next.resolve();
      }
    }
  }, {
    key: '_queueSlot',
    value: function _queueSlot() {
      var deferred = _q2['default'].defer();

      if (this.running.length < this.limit) {
        this.running.push(deferred);
        deferred.resolve();
      } else {
        this.queue.push(deferred);
      }

      return deferred.promise;
    }
  }, {
    key: 'request',
    value: function request(options) {
      var _this = this;

      var queueSlot = this._queueSlot();

      return queueSlot.then(function () {
        if (!options.method) {
          options.method = 'GET';
        }

        // Transform url to full uri for request
        options.uri = _this.config.url + '/' + _this.config.password + '/' + options.url;

        // Homewizard responses are always json
        options.json = true;

        return (0, _requestPromise2['default'])(options);
      }).then(function (response) {
        _this._queueResolve();
        return response;
      });
    }
  }]);

  return API;
})();

exports.API = API;
