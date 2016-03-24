import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardPreset extends HomeWizardBaseAccessory {

  model = 'Preset';

  setupServices() {
    const service = new this.hap.Service.Switch();

    this.onCharacteristic = service
      .getCharacteristic(this.hap.Characteristic.On)
      .on('set', this.setPowerState.bind(this))
      .on('get', this.getPowerState.bind(this));

    this.services.push(service);
  }

  setPowerState(state, callback) {
    const url = `preset/${this.id}`;

    if (state) {
      this.api.request({url}).then(() => {
        this.eventManager.emit('switchPreset', this.id);
        this.log(`Switched to preset ${this.name}`);
        callback();
      }).catch(error => {
        this.log(`Failed to switch to preset: ${this.name}`);
        this.log(error);
        callback(error);
      });
    } else {
      // Actual this doesn't make sence, you cant turn off presets
      // just calling the callback but nothing will happen
      callback(null); //eslint-disable-line
    }
  }

  getPowerState(callback) {
    this.api.getActivePreset().then(activePreset => {
      const state = this.id === activePreset;
      this.log(`Retrieved power state for: ${this.name}, ${state}`);
      callback(null, state);
    }).catch(error => {
      callback(error);
    });
  }

  eventListener(eventName, payload) {
    if (eventName === 'switchPreset' && payload !== this.id) {
      this.onCharacteristic.setValue(false);
    }
  }
}
