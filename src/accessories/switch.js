import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardSwitch extends HomeWizardBaseAccessory {

  model = 'Switch';

  setupServices() {
    // Setup services
    const lightbulbService = new this.hap.Service.Lightbulb();
    lightbulbService
      .getCharacteristic(this.hap.Characteristic.On)
      .on('set', this.setPowerState.bind(this));
    this.services.push(lightbulbService);
  }

  getPowerState(callback) {
    // Sadly there is no individual call to get a sensor status
    // so retrieve all and find this one
    this.api.request('swlist').then(data => {
      let state;

      for (const sw of data.reponse) {
        if (sw.id === this.id) {
          state = sw.state === 'on' ? 1 : 0;
          break;
        }
      }

      callback(null, state);
    }).catch(error => {
      callback(error, 0);
    });
  }

  setPowerState(state, callback) {
    const value = state ? 'on' : 'off';
    const url = `sw/${this.id}/${value}`;

    this.api.request({url}).then(() => {
      this.log(`Switched ${this.name} to: ${value}`);
      callback();
    }).catch(error => {
      callback(error);
    });
  }
}
