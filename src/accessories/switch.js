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

  // Sadly there is no individual call to get a sensor status
  // so retrieve all and find this one
  getCurrentValues() {
    return this.api.request({url: 'swlist'}).then(data => {
      return data.response.find(sw => {
        return sw.id === this.id;
      });
    });
  }

  setPowerState(state, callback) {
    const value = state ? 'on' : 'off';
    const url = `sw/${this.id}/${value}`;

    this.api.request({url}).then(() => {
      this.log(`Switched ${this.name} to: ${value}`);
      callback();
    }).catch(error => {
      this.log(`Failed to switch ${this.name}`);
      this.log(JSON.stringify(error));
      callback(error);
    });
  }

  getPowerState(callback) {
    this.getCurrentValues().then(sw => {
      const state = sw.status === 'on' ? 1 : 0;
      this.log(`Retrieved power state for: ${this.name} - ${state}`);
      callback(null, state);
    }).catch(error => {
      callback(error, 0);
    });
  }

  setBrightness(value, callback) {
    this.api.request({url: `sw/dim/${this.id}/${value}`}).then(() => {
      this.log(`Set brightness for: ${this.name} to: ${value}`);
      callback();
    }).catch(error => {
      callback(error);
    });
  }

  getBrightness(callback) {
    this.getCurrentValues().then(sw => {
      callback(null, sw.dimlevel);
    }).catch(error => {
      callback(error);
    });
  }
}
