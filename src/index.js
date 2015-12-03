"use strict";
const request = require('request');
let Service, Characteristic;

class HomeWizardSwitch {
  constructor(config, hwObject) {
    this.config = config;
    this.name = hwObject.name;
    this.id = hwObject.id;
    this.status = hwObject.status;
  }

  setPowerState(state, callback) {
    let url = `${this.config.url}sw/${this.id}/off`;
    if (state) {
      url = `${this.config.url}sw/${this.id}/on`;
    }


    request(url, (error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Switched: ' + this.name);
      }
      callback();
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

class HomeWizardTemperatureSensor {
  constructor(config, hwObject) {
    this.config = config;
    this.name = hwObject.name;
    this.id = hwObject.id;
    this.status = hwObject.status;
  }

  getTemperature(callback) {
    request(`${this.config.url}te/graph/${this.id}/day`, (error, data) => {
      if (error) {
        console.log('Failed to get temperature for: ', this.name);
        return callback(error, null);
      } else {
        const response = JSON.parse(data.body).response;
        const current = response[response.length - 1];
        return callback(null, current.te);
      }
    });
  }

  getServices() {
    const temperatureSensorService = new Service.TemperatureSensor();
    temperatureSensorService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this.getTemperature.bind(this));
    temperatureSensorService
        .getCharacteristic(Characteristic.CurrentTemperature).setProps({minValue: -100});

    return [temperatureSensorService];
  }
}


class HomewizardPlatform {
  constructor(log, config) {
    this.log = log;
    this.config = config;

  }

  accessories(callback) {
    const accessories = [];

    request(`${this.config.url}get-sensors`, (error, data) => {
      if (error) {
        console.log('Failed to retrieve sensors/accessories from HomeWizard');
      } else {
        const sensors = JSON.parse(data.body).response;

        // Handle the switches for now
        for (const switchSensor of sensors.switches) {
          accessories.push(new HomeWizardSwitch(this.config, switchSensor));
        }

        // Handle temprature sensors
        for (const tempSensor of sensors.thermometers) {
          accessories.push(new HomeWizardTemperatureSensor(this.config, tempSensor));
        }
      }
      callback(accessories);
    });

  }
}


module.exports = homebridge => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerPlatform('homebridge-homewizard', 'HomeWizard', HomewizardPlatform);
};
