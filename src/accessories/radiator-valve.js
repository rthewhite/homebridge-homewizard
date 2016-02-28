import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardRadiatorValve extends HomeWizardBaseAccessory {

  model = 'radiator valve';

  // HW support actually only Radiator valve Smartwares SHS-53000
  // it is not possible to obtain the value of the internal temperature sensor
  // in these first version we define this accessory like a heating Thermostat
  // but the value of the current temperature is set to the target temperature

  setupServices() {
    // Setup services
    const valveService = new this.hap.Service.Thermostat();
    valveService
      .setCharacteristic(this.hap.Characteristic.CurrentHeatingCoolingState, this.hap.Characteristic.CurrentHeatingCoolingState.HEAT);
    valveService
      .setCharacteristic(this.hap.Characteristic.TargetHeatingCoolingState, this.hap.Characteristic.TargetHeatingCoolingState.AUTO);
    valveService
      .setCharacteristic(this.hap.Characteristic.TemperatureDisplayUnits, this.hap.Characteristic.TemperatureDisplayUnits.CELSIUS);
    valveService
      .getCharacteristic(this.hap.Characteristic.CurrentTemperature)
      .on('get', this.getTargetTemperature.bind(this));
    valveService
      .getCharacteristic(this.hap.Characteristic.TargetTemperature)
      .on('get', this.getTargetTemperature.bind(this))
      .on('set', this.setTargetTemperature.bind(this));

    this.services.push(valveService);
  }

  getTargetTemperature(callback) {
    this.log(JSON.stringify(this.hap));
    this.api.getStatus(this.id, 'switches').then(sw => {
      this.log(`Retrieved target temperature  for: ${this.name} - ${sw.tte}`);
      callback(null, sw.tte);
    }).catch(error => {
      this.log(`Failed to retrieve target temperature  for: ${this.name}`);
      this.log(error);
      callback(error);
    });
  }

  setTargetTemperature(temp, callback) {
    const value = temp.toFixed(1);
    const url = `sw/${this.id}/settarget/${value}`;

    this.api.request({url}).then(() => {
      this.log(`set target temperature  for: ${this.name} to: ${value}`);
      callback();
    }).catch(error => {
      this.log(`Failed to set target temperature ${this.name} to: ${value}`);
      this.log(error);
      callback(error);
    });
  }
}
