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
