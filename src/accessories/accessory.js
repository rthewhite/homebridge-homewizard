import 'babel-polyfill';

export class HomeWizardBaseAccessory {
  services = [];
  manufacturer = 'HomeWizard';

  constructor(options) {
    this.log = options.log;
    this.config = options.config;
    this.api = options.api;
    this.homebridge = options.homebridge;
    this.hap = options.homebridge.hap;
    this.id = options.hwObject.id;
    this.name = options.hwObject.name;
    this.eventManager = options.eventManager;
    this.hwObject = options.hwObject;

    // Register with eventListener
    this.eventManager.registerEventlistener(this);
  }

  _setupInformationService() {
    const informationService = new this.hap.Service.AccessoryInformation();
    informationService
      .setCharacteristic(this.hap.Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(this.hap.Characteristic.Model, this.model)
      .setCharacteristic(this.hap.Characteristic.SerialNumber, this.serialNumber);
    this.services.push(informationService);
  }

  getServices() {
    this._setupInformationService();
    if (this.setupServices) {
      this.setupServices();
    }
    return this.services;
  }
}
