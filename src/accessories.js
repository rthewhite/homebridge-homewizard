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
import {HomeWizardDoorbell} from './accessories/doorbell';
import {HomeWizardHeatLink} from './accessories/heatlink';
import {HomeWizardPreset} from './accessories/preset';
import {HomeWizardScene} from './accessories/scene';

export class AccessoriesFactory {
  accessories = [];
  filtered = [];

  constructor(log, config, api, homebridge, eventManager) {
    this.log = log;
    this.config = config;
    this.api = api;
    this.homebridge = homebridge;
    this.eventManager = eventManager;

    if (config && config.filtered) {
      for (const filter of config.filtered) {
        this.filtered.push(filter.trim());
      }
    }
  }

  getAccessories(devices, scenes) {
    // To be sure start with empty array
    this.accessories = [];

    if (this.config && this.config.createPresetSwitches !== false) {
      this._createPresets(this.config.presetNames);
    }

    if (this.config && this.config.createSceneSwitches !== false) {
      this._createScenes(scenes);
    }

    if(devices) {
      this._createSwitches(devices.switches);
      this._createThermometers(devices.thermometers);
      this._createKakuSensors(devices.kakusensors);
      this._createHeatLinks(devices.heatlinks);
    }
    return this.accessories;
  }

  _createSwitches(switches = []) {
    for (const switchDevice of switches) {
      switch (switchDevice.type) {
        case 'somfy':
        case 'brel':
        case 'asun':
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
        case 'doorbell':
          this._instantiateAccessory(HomeWizardDoorbell, kakusensor);
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

  _createPresets(presetNames = {}) {
    this._instantiateAccessory(HomeWizardPreset, {
      name: presetNames.home || 'Home Preset',
      id: 0
    });

    this._instantiateAccessory(HomeWizardPreset, {
      name: presetNames.away || 'Away Preset',
      id: 1
    });

    this._instantiateAccessory(HomeWizardPreset, {
      name: presetNames.sleep || 'Sleep Preset',
      id: 2
    });

    this._instantiateAccessory(HomeWizardPreset, {
      name: presetNames.holiday || 'Holiday Preset',
      id: 3
    });
  }

  _createScenes(scenes) {
    if (scenes) {
      scenes.forEach(scene => {
        this._instantiateAccessory(HomeWizardScene, scene);
      });
    }
  }

  // Instantiates a new object of the given DeviceClass
  _instantiateAccessory(DeviceClass, deviceInfo) {
    if (this.filtered.indexOf(deviceInfo.name.trim()) === -1) {
      const accessory = new DeviceClass({
        log: this.log,
        config: this.config,
        api: this.api,
        homebridge: this.homebridge,
        eventManager: this.eventManager,
        hwObject: deviceInfo
      });
      this.accessories.push(accessory);
    } else {
      this.log(`Skipping: ${deviceInfo.name} because its filtered in the config`);
    }
  }
}
