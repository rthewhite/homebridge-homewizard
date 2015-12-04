'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var Service = undefined;
var Characteristic = undefined;

var HomeWizardSwitch = (function () {
  function HomeWizardSwitch(log, config, hap, hwObject) {
    _classCallCheck(this, HomeWizardSwitch);

    this.log = log;
    this.config = config;
    this.name = hwObject.name;
    this.id = hwObject.id;

    Service = hap.Service;
    Characteristic = hap.Characteristic;
  }

  _createClass(HomeWizardSwitch, [{
    key: 'setPowerState',
    value: function setPowerState(state, callback) {
      var _this = this;

      var url = this.config.url + 'sw/' + this.id + '/off';
      if (state) {
        url = this.config.url + 'sw/' + this.id + '/on';
      }

      (0, _request2['default'])(url, function (error) {
        if (error) {
          _this.log('Failed to switch: ' + _this.id, error);
          _this.log(JSON.stringify(error));
          return callback(error);
        }

        return callback();
      });
    }
  }, {
    key: 'getServices',
    value: function getServices() {
      var services = [];

      var informationService = new Service.AccessoryInformation();
      informationService.setCharacteristic(Characteristic.Manufacturer, 'HomeWizard').setCharacteristic(Characteristic.Model, 'HomeWizard').setCharacteristic(Characteristic.SerialNumber, 'bla die bla');
      services.push(informationService);

      var lightbulbService = new Service.Lightbulb();
      lightbulbService.getCharacteristic(Characteristic.On).on('set', this.setPowerState.bind(this));
      services.push(lightbulbService);

      return services;
    }
  }]);

  return HomeWizardSwitch;
})();

exports.HomeWizardSwitch = HomeWizardSwitch;
