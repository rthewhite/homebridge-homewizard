import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardSomfyShutter extends HomeWizardBaseAccessory {

  model = 'Window covering';

  cache = {
    value: undefined,
    age: 0
  };

  // only 3 actions for Somfy : Up, Down, Stop/MyFavorite
  // no feed back to know  CurrentPosition or PositionState

  setupServices() {
    // Setup services
    const coveringService = new this.hap.Service.WindowCovering();
    coveringService
      .getCharacteristic(this.hap.Characteristic.TargetPosition)
      .on('set', this.setTargetPosition.bind(this));
    coveringService
      .getCharacteristic(this.hap.Characteristic.PositionState)
      .on('get', this.getPositionState.bind(this));

    this.services.push(coveringService);
  }

  setTargetPosition(level, callback) {
    // we action only for level 0, 100 and in a middle interval
    let value;
    const WIDTH = 10;
    if (level === 0) {
      value = 'down';
    } else if (level === 100) {
      value = 'up';
    } else if (level > 50 - WIDTH && level < 50 + WIDTH) {
      value = 'stop';
    } else {
      return callback();
    }

    const url = `sw/${this.id}/${value}`;

    // if we already just send the same request, we don't repeat
    const now = Date.now();
    if (this.cache.value === url && now - this.cache.age < 3000) {
      return callback();
    }

    this.cache = {
      value: url,
      age: now
    };

    this.api.request({url}).then(() => {
      this.log(`Set WindowCovering ${this.name} to:${value}`);
      callback();
    }).catch(error => {
      this.log(`Failed to set WindowCovering ${this.name} to:${value}`);
      this.log(error);
      callback(error);
    });
  }

  getPositionState(callback) {
    callback(null, this.hap.Characteristic.PositionState.STOPPED);
  }
}
