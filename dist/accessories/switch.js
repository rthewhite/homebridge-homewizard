module.exports = class HomeWizardSwitch {
  constructor(Service, Characteristic, hwObject) {
    this.Service = Service;
    this.Characteristic = Characteristic;

    console.log(hwObject);
  }

  launchEvent(value, callback) {
    console.log('switching.....');

    callback();
  }

  getServices() {
    const services = [];

    const informationService = new this.Service.AccessoryInformation();
    informationService.setCharacteristic(this.Characteristic.Manufacturer, 'HomeWizard').setCharacteristic(this.Characteristic.Model, 'HomeWizard').setCharacteristic(this.Characteristic.SerialNumber, 'bla die bla');
    services.push(informationService);

    const switchService = new this.Service.Switch();
    switchService.getCharacteristic(this.Characteristic.On).on('set', this.launchEvent.bind(this));
    services.push(switchService);

    return services;
  }
};
