'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _api = require('./api');

var _accessories = require('./accessories');

require('babel-polyfill');

var homebridge = undefined;

var HomewizardPlatform = (function () {
  function HomewizardPlatform(log, config) {
    _classCallCheck(this, HomewizardPlatform);

    this.log = log;
    this.config = config;

    // Instantiate the API
    this.api = new _api.API(this.config);
  }

  _createClass(HomewizardPlatform, [{
    key: 'accessories',
    value: function accessories(callback) {
      var _this = this;

      this.api.request({ url: 'get-sensors' }).then(function (data) {
        var factory = new _accessories.AccessoriesFactory(_this.log, _this.config, _this.api, homebridge);
        var accessories = factory.getAccessories(data.response);
        callback(accessories);
      })['catch'](function (error) {
        _this.log('Failed to retrieve accessories from HomeWizard');
        _this.log(JSON.stringify(error));
        callback(error);
      });
    }
  }]);

  return HomewizardPlatform;
})();

exports['default'] = function (homebridgeInstance) {
  homebridge = homebridgeInstance;
  homebridgeInstance.registerPlatform('homebridge-homewizard', 'HomeWizard', HomewizardPlatform);
};

module.exports = exports['default'];
