import 'babel-polyfill';
import {debounce} from './../utils/debounce';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardHeatLink extends HomeWizardBaseAccessory {

  model = 'HeatLink';

  setupServices() {
    // Setup services
    const heatlinkService = new this.hap.Service.Thermostat();

    heatlinkService
      .setCharacteristic(this.hap.Characteristic.TargetHeatingCoolingState, this.hap.Characteristic.TargetHeatingCoolingState.AUTO);

    heatlinkService
      .setCharacteristic(this.hap.Characteristic.TemperatureDisplayUnits, this.hap.Characteristic.TemperatureDisplayUnits.CELSIUS);

    const characteristicTemp = heatlinkService.getCharacteristic(this.hap.Characteristic.CurrentTemperature);
    // Make sure negative temps are working...
    characteristicTemp.props.minValue = -50;
    characteristicTemp.on('get', this.getCurrentTemperature.bind(this));

    heatlinkService
      .getCharacteristic(this.hap.Characteristic.TargetTemperature)
      .on('get', this.getTargetTemperature.bind(this))
      .on('set', this.setTargetTemperature.bind(this));

    heatlinkService
      .getCharacteristic(this.hap.Characteristic.CurrentHeatingCoolingState)
      .on('get', this.getCurrentHeatingCoolingState.bind(this));

    this.services.push(heatlinkService);
  }

  getCurrentTemperature(callback) {
    this.api.getStatus(this.id, 'heatlinks').then(hl => {
      this.log(`Retrieved current temperature for:${this.name} its:${hl.rte} degrees`);
      callback(null, hl.rte);
    }).catch(error => {
      this.log(`Failed to retrieve current temperature for:${this.name}`);
      this.log(error);
      callback(error);
    });
  }

  getTargetTemperature(callback) {
    this.api.getStatus(this.id, 'heatlinks').then(hl => {
      this.log(`Retrieved target temperature for:${this.name} its:${hl.rsp} degrees`);
      callback(null, hl.rsp);
    }).catch(error => {
      this.log(`Failed to retrieve target temperature for:${this.name}`);
      this.log(error);
      callback(error);
    });
  }

  getCurrentHeatingCoolingState(callback) {
    this.api.getStatus(this.id, 'heatlinks').then(hl => {
      this.log(`Retrieved current heating state for:${this.name} its:${hl.heating}`);
      const state = hl.heating === 'off'
        ? this.hap.Characteristic.CurrentHeatingCoolingState.OFF
        : this.hap.Characteristic.CurrentHeatingCoolingState.HEAT;
      callback(null, state);
    }).catch(error => {
      this.log(`Failed to retrieve current heating state for:${this.name}`);
      this.log(error);
      callback(error);
    });
  }

  @debounce(500)
  setTargetTemperature(temp, callback) {
    const value = temp.toFixed(1);
    // hl/<id>/settarget/<temperature>/<minutes>
    // for the moment we will have one hour
    const url = `hl/${this.id}/settarget/${value}/60`;

    this.api.request({url}).then(() => {
      this.log(`set target temperature for:${this.name} to:${value}`);
      callback();
    }).catch(error => {
      this.log(`Failed to set target temperature for:${this.name} to:${value}`);
      this.log(error);
      callback(error);
    });
  }
}
