'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _accessoriesSwitch = require('./accessories/switch');

var _accessoriesThermometer = require('./accessories/thermometer');

var AccessoriesFactory = (function () {
  function AccessoriesFactory(log, config, api, homebridge) {
    if (api === undefined) api = {};

    _classCallCheck(this, AccessoriesFactory);

    this.accessories = [];

    this.log = log;
    this.config = config;
    this.api = api;
    this.homebridge = homebridge;
  }

  _createClass(AccessoriesFactory, [{
    key: 'getAccessories',
    value: function getAccessories(devices) {
      // To be sure start with empty array
      this.accessories = [];

      // Create switches
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = devices.switches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var switchDevice = _step.value;

          this._instantiateAccessory(_accessoriesSwitch.HomeWizardSwitch, switchDevice);
        }

        // Create thermometers
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

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = devices.thermometers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var thermometer = _step2.value;

          this._instantiateAccessory(_accessoriesThermometer.HomeWizardThermometer, thermometer);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return this.accessories;
    }

    // Instantiates a new object of the given DeviceClass
  }, {
    key: '_instantiateAccessory',
    value: function _instantiateAccessory(DeviceClass, deviceInfo) {
      var accessory = new DeviceClass(this.log, this.config, this.api, this.homebridge, deviceInfo);
      this.accessories.push(accessory);
    }
  }]);

  return AccessoriesFactory;
})();

exports.AccessoriesFactory = AccessoriesFactory;
