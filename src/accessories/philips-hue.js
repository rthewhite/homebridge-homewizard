import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardPhilipsHue extends HomeWizardBaseAccessory {

  model = 'Philips Hue';

  status = 'off';
  color = {
    hue: 0,
    sat: 0,
    bri: 100
  };

  setupServices() {
    // Setup services
    const lightbulbService = new this.hap.Service.Lightbulb();
    this.onChar = service.getCharacteristic(this.hap.Characteristic.On);
    this.onChar
      .on('set', this.setPowerState.bind(this))
      .on('get', this.getPowerState.bind(this));

    lightbulbService
      .getCharacteristic(this.hap.Characteristic.Brightness)
      .on('set', this.setBrightness.bind(this))
      .on('get', this.getBrightness.bind(this));

    lightbulbService
      .getCharacteristic(this.hap.Characteristic.Hue)
      .on('set', this.setHue.bind(this))
      .on('get', this.getHue.bind(this));

    lightbulbService
      .getCharacteristic(this.hap.Characteristic.Saturation)
      .on('set', this.setSaturation.bind(this))
      .on('get', this.getSaturation.bind(this));

    this.services.push(lightbulbService);
  }

  setPowerState(state, callback) {
    const value = state ? 'on' : 'off';
    this.status = value;
    const url = `sw/${this.id}/${value}`;

    this.api.request({url}).then(() => {
      this.log(`Switched ${this.name} to: ${value}`);
      callback();
    }).catch(error => {
      this.log(`Failed to switch ${this.name}`);
      this.log(error);
      callback(error);
    });
  }

  getPowerState(callback) {
    this.api.getStatus(this.id, 'switches').then(sw => {
      this.status = sw.status;
      this.log(`Retrieved power state for: ${this.name} - ${this.status}`);
      callback(null, this.status);
    }).catch(error => {
      callback(error, 0);
    });
  }

  setHue(value, callback) {
    this.color.hue = Math.round(value);
    this.setCurrentValues(callback);
  }

  setSaturation(value, callback) {
    this.color.sat = Math.round(value);
    this.setCurrentValues(callback);
  }

  setBrightness(value, callback) {
    this.color.bri = Math.round(value);
    this.setCurrentValues(callback);
  }

  setCurrentValues(callback) {
    const url = `sw/${this.id}/${this.status}/${this.color.hue}/${this.color.sat}/${this.color.bri}`;

    this.api.request({url}).then(() => {
      this.log(`set ${this.name} to: ${this.status}/${this.color.hue}/${this.color.sat}/${this.color.bri}`);
      callback();
    }).catch(error => {
      this.log(`Failed to set ${this.name} to: ${this.status}/${this.color.hue}/${this.color.sat}/${this.color.bri}`);
      this.log(error);
      callback(error);
    });
  }

  getHue(callback) {
    this.api.getStatus(this.id, 'switches').then(sw => {
      this.color = sw.color;
      this.log(`Retrieved Hue for: ${this.name} - ${this.color.hue}`);
      callback(null, this.color.hue);
    }).catch(error => {
      callback(error, 0);
    });
  }

  getSaturation(callback) {
    this.api.getStatus(this.id, 'switches').then(sw => {
      this.color = sw.color;
      this.log(`Retrieved Saturation for: ${this.name} - ${this.color.sat}`);
      callback(null, this.color.sat);
    }).catch(error => {
      callback(error, 0);
    });
  }

  getBrightness(callback) {
    this.api.getStatus(this.id, 'switches').then(sw => {
      this.color = sw.color;
      this.log(`Retrieved Brightness for: ${this.name} - ${this.color.bri}`);
      callback(null, this.color.bri);
    }).catch(error => {
      callback(error, 100);
    });
  }

  identify(callback) {
    this.log(`Identify ${this.name}...`);
    const previous = this.onChar.value;
    this.onChar.setValue(1 - previous);
    setTimeout(function (me, value) {
      me.onChar.setValue(value);
    }, 1000, this, previous);
    callback();
  }
}
