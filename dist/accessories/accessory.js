'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var HomeWizardBaseAccessory = (function () {
  function HomeWizardBaseAccessory(log, config, api, homebridge, hwObject) {
    _classCallCheck(this, HomeWizardBaseAccessory);

    this.services = [];
    this.manufacturer = 'HomeWizard';

    this.log = log;
    this.config = config;
    this.api = api;
    this.homebridge = homebridge;
    this.hap = homebridge.hap;
    this.id = hwObject.id;
    this.name = hwObject.name;
    this.hwObject = hwObject;
  }

  _createClass(HomeWizardBaseAccessory, [{
    key: '_setupInformationService',
    value: function _setupInformationService() {
      var informationService = new this.hap.Service.AccessoryInformation();
      informationService.setCharacteristic(this.hap.Characteristic.Manufacturer, this.manufacturer).setCharacteristic(this.hap.Characteristic.Model, this.model).setCharacteristic(this.hap.Characteristic.SerialNumber, this.serialNumber);
      this.services.push(informationService);
    }
  }, {
    key: 'getServices',
    value: function getServices() {
      this._setupInformationService();
      if (this.setupServices) {
        this.setupServices();
      }
      return this.services;
    }
  }]);

  return HomeWizardBaseAccessory;
})();

exports.HomeWizardBaseAccessory = HomeWizardBaseAccessory;
