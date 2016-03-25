import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardScene extends HomeWizardBaseAccessory {

  model = 'Scene';

  setupServices() {
    const service = new this.hap.Service.Switch();

    service
      .getCharacteristic(this.hap.Characteristic.On)
      .on('set', this.setPowerState.bind(this))
      .on('get', this.getPowerState.bind(this));

    this.services.push(service);
  }

  setPowerState(state, callback) {
    const value = state ? 'on' : 'off';
    const url = `gp/${this.id}/${value}`;

    this.api.request({url}).then(() => {
      this.log(`Switched scene ${this.name} to: ${value}`);
      callback();
    }).catch(error => {
      this.log(`Failed to switch scene ${this.name}`);
      this.log(error);
      callback(error);
    });
  }

  getPowerState(callback) {
    this.api.request({url: `gp/get/${this.id}`}).then(data => {
      let state = true;

      data.response.forEach(item => {
        if (!item.onstatus) {
          state = false;
        }
      });

      this.log(`Retrieved power state for: ${this.name} - ${state}`);
      callback(null, state);
    }).catch(error => {
      this.log(`Failed to retrieve power state for scene: ${this.name}`);
      this.log(error);
      callback(error);
    });
  }
}
