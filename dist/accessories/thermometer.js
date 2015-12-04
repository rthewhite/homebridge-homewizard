"use strict";

// export default class HomeWizardThermometer {
//   constructor(log, config, hap, hwObject) {
//     this.config = config;
//     this.name = hwObject.name;
//     this.id = hwObject.id;
//     this.status = hwObject.status;
//   }
//
//   getTemperature(callback) {
//     request(`${this.config.url}te/graph/${this.id}/day`, (error, data) => {
//       if (error) {
//         console.log('Failed to get temperature for: ', this.name);
//         return callback(error, null);
//       } else {
//         const response = JSON.parse(data.body).response;
//         const current = response[response.length - 1];
//         return callback(null, current.te);
//       }
//     });
//   }
//
//   getServices() {
//     const temperatureSensorService = new Service.TemperatureSensor();
//     temperatureSensorService
//         .getCharacteristic(Characteristic.CurrentTemperature)
//         .on('get', this.getTemperature.bind(this));
//     temperatureSensorService
//         .getCharacteristic(Characteristic.CurrentTemperature).setProps({minValue: -100});
//
//     return [temperatureSensorService];
//   }
// }
