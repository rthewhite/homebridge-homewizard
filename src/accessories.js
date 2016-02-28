import 'babel-polyfill';
import {HomeWizardSwitch} from './accessories/switch';
import {HomeWizardThermometer} from './accessories/thermometer';
import {HomeWizardMotionSensor} from './accessories/motion-sensor';
import {HomeWizardLightSensor} from './accessories/light-sensor';
import {HomeWizardSomfyShutter} from './accessories/somfy-shutter';
import {HomeWizardPhilipsHue} from './accessories/philips-hue';
import {HomeWizardRadiatorValve} from './accessories/radiator-valve';

export class AccessoriesFactory {
  accessories = [];
  filtered = [];

  constructor(log, config, api, homebridge) {
    this.log = log;
    this.config = config;
    this.api = api;
    this.homebridge = homebridge;

    if (config && config.filtered) {
      for (const filter of config.filtered) {
        this.filtered.push(filter.trim());
      }
    }
  }

  createSwitches(devices) {
    if (devices.switches) {
      for (const switchDevice of devices.switches) {
        switch (switchDevice.type) {
          case 'somfy':
            this._instantiateAccessory(HomeWizardSomfyShutter, switchDevice);
            break;
          case 'hue':
            this._instantiateAccessory(HomeWizardPhilipsHue, switchDevice);
            break;
          case 'radiator':
            this._instantiateAccessory(HomeWizardRadiatorValve, switchDevice);
            break;
          default:
            this._instantiateAccessory(HomeWizardSwitch, switchDevice);
        }
      }
    }
  }

  getAccessories(devices) {
    // To be sure start with empty array
    this.accessories = [];

    // Create switches
    this.createSwitches(devices);

    // Create thermometers
    if (devices.thermometers) {
      for (const thermometer of devices.thermometers) {
        this._instantiateAccessory(HomeWizardThermometer, thermometer);
      }
    }

    // Create kaku sensors
    if (devices.kakusensors) {
      for (const kakusensor of devices.kakusensors) {
        if (kakusensor.type === 'motion') {
          this._instantiateAccessory(HomeWizardMotionSensor, kakusensor);
        } else if (kakusensor.type === 'light') {
          this._instantiateAccessory(HomeWizardLightSensor, kakusensor);
        }
      }
    }

    return this.accessories;
  }

  // Instantiates a new object of the given DeviceClass
  _instantiateAccessory(DeviceClass, deviceInfo) {
    if (this.filtered.indexOf(deviceInfo.name.trim()) === -1) {
      const accessory = new DeviceClass(this.log, this.config, this.api, this.homebridge, deviceInfo);
      this.accessories.push(accessory);
    } else {
      this.log(`Skipping: ${deviceInfo.name} because its filtered in the config`);
    }
  }
}
