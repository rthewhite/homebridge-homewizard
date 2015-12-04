'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _accessoriesSwitch = require('./accessories/switch');

var hap = undefined;

var HomewizardPlatform = (function () {
  function HomewizardPlatform(log, config) {
    _classCallCheck(this, HomewizardPlatform);

    this.log = log;
    this.config = config;
  }

  _createClass(HomewizardPlatform, [{
    key: 'accessories',
    value: function accessories(callback) {
      var _this = this;

      var accessories = [];

      (0, _request2['default'])(this.config.url + 'get-sensors', function (error, data) {
        if (error) {
          _this.log('Failed to retrieve sensors/accessories from HomeWizard');
          return callback(error);
        }

        var sensors = JSON.parse(data.body).response;

        // Handle the switches for now
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = sensors.switches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var switchSensor = _step.value;

            console.log(_accessoriesSwitch.HomeWizardSwitch);
            accessories.push(new _accessoriesSwitch.HomeWizardSwitch(_this.log, _this.config, hap, switchSensor));
          }

          // Handle temprature sensors
          // for (const tempSensor of sensors.thermometers) {
          //   accessories.push(new HomeWizardTemperatureSensor(this.config, tempSensor));
          // }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        callback(accessories);
      });
    }
  }]);

  return HomewizardPlatform;
})();

exports['default'] = function (homebridge) {
  hap = homebridge.hap;
  homebridge.registerPlatform('homebridge-homewizard', 'HomeWizard', HomewizardPlatform);
};

module.exports = exports['default'];
