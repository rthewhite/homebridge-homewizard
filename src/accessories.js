import 'babel-polyfill';
import {HomeWizardSwitch} from './accessories/switch';
import {HomeWizardThermometer} from './accessories/thermometer';
import {HomeWizardMotionSensor} from './accessories/motion-sensor';
import {HomeWizardLightSensor} from './accessories/light-sensor';
import {HomeWizardSomfyShutter} from './accessories/somfy-shutter';
import {HomeWizardPhilipsHue} from './accessories/philips-hue';
import {HomeWizardRadiatorValve} from './accessories/radiator-valve';
import {HomeWizardSmokeSensor} from './accessories/smoke-sensor';
import {HomeWizardContactSensor} from './accessories/contact-sensor';
import {HomeWizardHeatLink} from './accessories/heatlink';

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

  getAccessories(devices) {
    // To be sure start with empty array
    this.accessories = [];

    this._createSwitches(devices.switches);
    this._createThermometers(devices.thermometers);
    this._createKakuSensors(devices.kakusensors);
    this._createHeatLinks(devices.heatlinks);

    return this.accessories;
  }

  _createSwitches(switches = []) {
    for (const switchDevice of switches) {
      switch (switchDevice.type) {
        case 'somfy':
        case 'brel':
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

  _createKakuSensors(kakusensors = []) {
    for (const kakusensor of kakusensors) {
      switch (kakusensor.type) {
        case 'motion':
          this._instantiateAccessory(HomeWizardMotionSensor, kakusensor);
          break;
        case 'light':
          this._instantiateAccessory(HomeWizardLightSensor, kakusensor);
          break;
        case 'smoke':
          this._instantiateAccessory(HomeWizardSmokeSensor, kakusensor);
          break;
        case 'contact':
          this._instantiateAccessory(HomeWizardContactSensor, kakusensor);
          break;
        default:
          break;
      }
    }
  }

  _createThermometers(thermometers = []) {
    for (const thermometer of thermometers) {
      this._instantiateAccessory(HomeWizardThermometer, thermometer);
    }
  }

  _createHeatLinks(heatlinks = []) {
    for (const heatlink of heatlinks) {
      this._instantiateAccessory(HomeWizardHeatLink, heatlink);
    }
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
