import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardSwitch extends HomeWizardBaseAccessory {

  model = 'Switch';

  setupServices() {
    // Setup services
    const lightbulbService = new this.hap.Service.Lightbulb();
    lightbulbService
      .getCharacteristic(this.hap.Characteristic.On)
      .on('set', this.setPowerState.bind(this))
      .on('get', this.getPowerState.bind(this));

    if (this.hwObject.type === 'dimmer') {
      lightbulbService
        .getCharacteristic(this.hap.Characteristic.Brightness)
        .on('set', this.setBrightness.bind(this))
        .on('get', this.getBrightness.bind(this));
    }

    this.services.push(lightbulbService);
  }

  setPowerState(state, callback) {
    const value = state ? 'on' : 'off';
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
      const state = sw.status === 'on' ? 1 : 0;
      this.log(`Retrieved power state for: ${this.name} - ${state}`);
      callback(null, state);
    }).catch(error => {
      this.log(`Failed to retrieve power state for: ${this.name}`);
      this.log(error);
      callback(error);
    });
  }

  setBrightness(value, callback) {
    this.api.request({url: `sw/dim/${this.id}/${value}`}).then(() => {
      this.log(`Set brightness for: ${this.name} to: ${value}`);
      callback();
    }).catch(error => {
      this.log(`Failed to set brightness for: ${this.name}`);
      this.log(error);
      callback(error);
    });
  }

  getBrightness(callback) {
    this.api.getStatus(this.id, 'switches').then(sw => {
      this.log(`Retrieved brightness for: ${this.name} - ${sw.dimlevel}`);
      callback(null, sw.dimlevel);
    }).catch(error => {
      this.log(`Failed to retrieve brightness for: ${this.name}`);
      this.log(error);
      callback(error);
    });
  }
}
