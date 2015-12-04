import request from 'request';

import {HomeWizardSwitch} from './accessories/switch';

let hap;

class HomewizardPlatform {
  constructor(log, config) {
    this.log = log;
    this.config = config;
  }

  accessories(callback) {
    const accessories = [];

    request(`${this.config.url}get-sensors`, (error, data) => {
      if (error) {
        this.log('Failed to retrieve sensors/accessories from HomeWizard');
        return callback(error);
      }

      const sensors = JSON.parse(data.body).response;

      // Handle the switches for now
      for (const switchSensor of sensors.switches) {
        console.log(HomeWizardSwitch);
        accessories.push(new HomeWizardSwitch(this.log, this.config, hap, switchSensor));
      }

      // Handle temprature sensors
      // for (const tempSensor of sensors.thermometers) {
      //   accessories.push(new HomeWizardTemperatureSensor(this.config, tempSensor));
      // }

      callback(accessories);
    });
  }
}

export default homebridge => {
  hap = homebridge.hap;
  homebridge.registerPlatform('homebridge-homewizard', 'HomeWizard', HomewizardPlatform);
};
