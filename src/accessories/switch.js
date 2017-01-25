import 'babel-polyfill';
import {debounce} from './../utils/debounce';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardSwitch extends HomeWizardBaseAccessory {

  model = 'Switch';

  setupServices() {
    let service;

    // Determine serviceType, default is lightbulb for backwards compatibility
    let switchType = 'lightbulb';

    if (this.config.switchTypes && this.config.switchTypes[this.name]) {
      switchType = this.config.switchTypes[this.name];
    }

    switch (switchType) {
      case 'switch':
        service = new this.hap.Service.Switch();
        break;
      case 'fan':
        service = new this.hap.Service.Fan();
        break;
      case 'outlet':
        service = new this.hap.Service.Outlet();
        service.getCharacteristic(this.hap.Characteristic.OutletInUse)
        .on('get', () => {
          return true;
        });
        break;

      case 'lightbulb':
        service = new this.hap.Service.Lightbulb();
        if (this.hwObject.type === 'dimmer') {
          service
            .getCharacteristic(this.hap.Characteristic.Brightness)
            .on('set', this.setBrightness.bind(this))
            .on('get', this.getBrightness.bind(this));
        }
        break;
      default:
        this.log(`Unknown switchType: ${switchType} for: ${this.name}`);
        break;
    }

    service
      .getCharacteristic(this.hap.Characteristic.On)
      .on('set', this.setPowerState.bind(this))
      .on('get', this.getPowerState.bind(this));

    this.services.push(service);
  }

  setPowerState(state, callback) {
    // To prevent dimmers from switching to dimming mode when they are already turned on
    if (this.hwObject.type === 'dimmer' && state === true) {
      callback(); // Calling callback right away might take to long?

      this.getPowerState(currentState => {
        if (currentState !== state) {
          this._setPowerState(state);
        }
      });
    } else {
      this._setPowerState(state, callback);
    }
  }

  _setPowerState(state, callback) {
    const value = state ? 'on' : 'off';
    const url = `sw/${this.id}/${value}`;


    this.api.request({url}).then(() => {
      this.log(`Switched ${this.name} to: ${value}`);

      if (callback) {
        callback();
      }
    }).catch(error => {
      this.log(`Failed to switch ${this.name}`);
      this.log(error);

      if (callback) {
        callback(error);
      }
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

  @debounce(500)
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
