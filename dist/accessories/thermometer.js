'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var _accessory = require('./accessory');

var HomeWizardThermometer = (function (_HomeWizardBaseAccessory) {
  _inherits(HomeWizardThermometer, _HomeWizardBaseAccessory);

  function HomeWizardThermometer() {
    _classCallCheck(this, HomeWizardThermometer);

    _get(Object.getPrototypeOf(HomeWizardThermometer.prototype), 'constructor', this).apply(this, arguments);

    this.model = 'Thermometer';
  }

  _createClass(HomeWizardThermometer, [{
    key: 'setupServices',
    value: function setupServices() {
      var temperatureSensorService = new this.hap.Service.TemperatureSensor();
      temperatureSensorService.getCharacteristic(this.hap.Characteristic.CurrentTemperature).on('get', this.getTemperature.bind(this));

      this.services.push(temperatureSensorService);

      var humiditySensorService = new this.hap.Service.HumiditySensor();
      humiditySensorService.getCharacteristic(this.hap.Characteristic.CurrentRelativeHumidity).on('get', this.getHumidity.bind(this));

      this.services.push(humiditySensorService);
    }
  }, {
    key: 'getValues',
    value: function getValues(callback) {
      var _this = this;

      return this.api.request({ url: 'te/graph/' + this.id + '/day' }).then(function (data) {
        return data.response[data.response.length - 1];
      })['catch'](function (error) {
        _this.log('Failed to retrieve temperature/humidity for: ' + _this.name);
        _this.log(JSON.stringify(error));
        callback(error, null);
      });
    }
  }, {
    key: 'getHumidity',
    value: function getHumidity(callback) {
      var _this2 = this;

      this.getValues(callback).then(function (currentValues) {
        _this2.log('Retrieved humidity for: ' + _this2.name + ' its ' + currentValues.hu + ' %');
        callback(null, currentValues.hu);
      });
    }
  }, {
    key: 'getTemperature',
    value: function getTemperature(callback) {
      var _this3 = this;

      this.getValues(callback).then(function (currentValues) {
        _this3.log('Retrieved temperature for: ' + _this3.name + ' its ' + currentValues.te + ' degrees');
        callback(null, currentValues.te);
      });
    }
  }]);

  return HomeWizardThermometer;
})(_accessory.HomeWizardBaseAccessory);

exports.HomeWizardThermometer = HomeWizardThermometer;
