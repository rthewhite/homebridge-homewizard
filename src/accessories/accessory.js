export class HomeWizardBaseAccessory {

  services = [];

  manufacturer = 'HomeWizard';

  constructor(log, config, api, homebridge, hwObject) {
    this.log = log;
    this.config = config;
    this.api = api;
    this.homebridge = homebridge;
    this.hap = homebridge.hap;
    this.id = hwObject.id;
    this.name = hwObject.name;
    this.hwObject = hwObject;
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
