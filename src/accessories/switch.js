import request from 'request';

let Service;
let Characteristic;

export class HomeWizardSwitch {
  constructor(log, config, hap, hwObject) {
    this.log = log;
    this.config = config;
    this.name = hwObject.name;
    this.id = hwObject.id;

    Service = hap.Service;
    Characteristic = hap.Characteristic;
  }

  setPowerState(state, callback) {
    let url = `${this.config.url}sw/${this.id}/off`;
    if (state) {
      url = `${this.config.url}sw/${this.id}/on`;
    }

    request(url, error => {
      if (error) {
        this.log(`Failed to switch: ${this.id}`, error);
        this.log(JSON.stringify(error));
        return callback(error);
      }

      return callback();
    });
  }


  getServices() {
    const services = [];

    const informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, 'HomeWizard')
      .setCharacteristic(Characteristic.Model, 'HomeWizard')
      .setCharacteristic(Characteristic.SerialNumber, 'bla die bla');
    services.push(informationService);

    const lightbulbService = new Service.Lightbulb();
    lightbulbService
      .getCharacteristic(Characteristic.On)
      .on('set', this.setPowerState.bind(this));
    services.push(lightbulbService);

    return services;
  }
}
