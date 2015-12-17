import 'babel-polyfill';
import {HomeWizardSwitch} from './accessories/switch';
import {HomeWizardThermometer} from './accessories/thermometer';

export class AccessoriesFactory {
  accessories = [];

  constructor(log, config, api, homebridge) {
    this.log = log;
    this.config = config;
    this.api = api;
    this.homebridge = homebridge;
  }

  getAccessories(devices) {
    // To be sure start with empty array
    this.accessories = [];

    // Create switches
    if (devices.switches) {
      for (const switchDevice of devices.switches) {
        this._instantiateAccessory(HomeWizardSwitch, switchDevice);
      }
    }

    // Create thermometers
    if (devices.thermometers) {
      for (const thermometer of devices.thermometers) {
        this._instantiateAccessory(HomeWizardThermometer, thermometer);
      }
    }

    return this.accessories;
  }

  // Instantiates a new object of the given DeviceClass
  _instantiateAccessory(DeviceClass, deviceInfo) {
    const accessory = new DeviceClass(this.log, this.config, this.api, this.homebridge, deviceInfo);
    this.accessories.push(accessory);
  }
}
