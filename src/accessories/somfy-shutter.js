import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardSomfyShutter extends HomeWizardBaseAccessory {

  model = 'Window covering';

  // estimation of the duration to close or open completely the covering
  // used to estimate the positionState
  OPERATING_TIME = 20000;
  // at startup we think it is stopped and open
  targetPosition = 100;
  cache = {
    value: 'stop',
    age: Date.now()
  };

  // only 3 actions for Somfy : Up, Down, Stop/MyFavorite
  // no feed back to know exactly CurrentPosition and PositionState

  setupServices() {
    // Setup services
    const coveringService = new this.hap.Service.WindowCovering();
    coveringService
    .getCharacteristic(this.hap.Characteristic.CurrentPosition)
    .on('get', this.getCurrentPosition.bind(this));
    coveringService
      .getCharacteristic(this.hap.Characteristic.TargetPosition)
      .on('set', this.setTargetPosition.bind(this));
    coveringService
      .getCharacteristic(this.hap.Characteristic.PositionState)
      .on('get', this.getPositionState.bind(this));

    this.services.push(coveringService);
  }

  getCurrentPosition(callback) {
    let currentPosition = this.targetPosition;
    const delay = Date.now() - this.cache.age;
    if (delay < this.OPERATING_TIME) {
      const ratio = (Date.now() - this.cache.age) / this.OPERATING_TIME;
      if (this.cache.value === 'up') {
        currentPosition = 100 * ratio;
      } else if (this.cache.value === 'down') {
        currentPosition = 100 * (1 - ratio);
      }
    }
    this.log(`Retrieved currentPosition WindowCovering for: ${this.name} is:${currentPosition}`);
    callback(null, currentPosition);
  }

  setTargetPosition(level, callback) {
    this.targetPosition = level;
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

    // if we already just send the same request, we don't repeat
    const now = Date.now();
    if (this.cache.value === value && now - this.cache.age < 3000) {
      return callback();
    }

    let url = `sw/${this.id}/${value}`;

    // for ASUN devices without stop button, we rebroadcast the last command up or down
    if (this.hwObject.type === 'asun') {
      if (value === 'stop') {
        if (this.cache.value === 'stop') {
          return callback();
        }
        url = `sw/${this.id}/${this.cache.value}`;
      }
    }

    this.api.request({url}).then(() => {
      this.log(`Set WindowCovering ${this.name} to:${value}`);
      callback();
    }).catch(error => {
      this.log(`Failed to set WindowCovering ${this.name} to:${value}`);
      this.log(error);
      callback(error);
    });

    this.cache.value = value;
    this.cache.age = now;
  }

  getPositionState(callback) {
    let positionState = this.hap.Characteristic.PositionState.STOPPED;
    const delay = Date.now() - this.cache.age;
    if (delay < this.OPERATING_TIME) {
      if (this.cache.value === 'up') {
        positionState = this.hap.Characteristic.PositionState.INCREASING;
      } else if (this.cache.value === 'down') {
        positionState = this.hap.Characteristic.PositionState.DECREASING;
      }
    }
    this.log(`Retrieved positionState WindowCovering for: ${this.name} is:${positionState}`);
    callback(null, positionState);
  }
}
