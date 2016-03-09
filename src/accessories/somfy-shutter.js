import 'babel-polyfill';
import {debounce} from './../utils/debounce';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardSomfyShutter extends HomeWizardBaseAccessory {

  model = 'Somfy Shutter';

  cache = {
    value: undefined,
    age: 0
  };

  // only 3 actions for Somfy : Up, Down, Stop/MyFavorite
  // no feed back to know  CurrentPosition or PositionState

  setupServices() {
    // Setup services
    const somfyService = new this.hap.Service.WindowCovering();
    somfyService
      .getCharacteristic(this.hap.Characteristic.TargetPosition)
      .on('set', this.setTargetPosition.bind(this));
    somfyService
      .getCharacteristic(this.hap.Characteristic.PositionState)
      .on('get', this.getPositionState.bind(this));

    this.services.push(somfyService);
  }

  @debounce(500)
  setTargetPosition(level, callback) {
    // we action only for level 0, 50 or 100
    let value;
    switch (level) {
      case 0:
        value = 'down';
        break;
      case 50:
        value = 'stop';
        break;
      case 100:
        value = 'up';
        break;
      default:
        return callback();
    }
    // thanks to @jphorn who found the sw path for HW curtains
    const dd = this.hwObject.type === 'somfy' ? 'sf' : 'sw';

    const url = `${dd}/${this.id}/${value}`;

    // if we already just send the same request, we don't repeat
    const now = Date.now();
    if (this.cache.value === url && now - this.cache.age < 1000) {
      return callback();
    }

    this.cache = {
      value: url,
      age: now
    };

    this.api.request({url}).then(() => {
      this.log(`Set Somfy for: ${this.name} to: ${value}`);
      callback();
    }).catch(error => {
      this.log(`Failed to set Somfy ${this.name} to: ${value}`);
      this.log(error);
      callback(error);
    });
  }

  getPositionState(callback) {
    callback(null, this.hap.Characteristic.PositionState.STOPPED);
  }
}
