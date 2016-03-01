import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);

import {AccessoriesFactory, __RewireAPI__ as AccessoriesFactoryRewire} from './../src/accessories';

describe('Class AccessoriesFactory ', () => {

  describe('constructor', () => {
    it('should set: log, config, api, homebridge properties', () => {
      const accessories = new AccessoriesFactory('log', 'config', 'api', 'homebridge');
      expect(accessories.log).to.equal('log');
      expect(accessories.config).to.equal('config');
      expect(accessories.api).to.equal('api');
      expect(accessories.homebridge).to.equal('homebridge');
    });

    it('should set filtered accessories', () => {
      const config = {
        filtered: ['foobar']
      };
      const accessories = new AccessoriesFactory('log', config, 'api', 'homebridge');
      expect(accessories.filtered).to.be.a('array');
      expect(accessories.filtered.length).to.equal(1);
      expect(accessories.filtered[0]).to.equal('foobar');
    });

    it('filtered accessory names should be trimmed of whitespace', () => {
      const config = {
        filtered: [' foobar ', 'foobar ', ' foobar']
      };
      const accessories = new AccessoriesFactory('log', config, 'api', 'homebridge');
      expect(accessories.filtered[0]).to.equal('foobar');
      expect(accessories.filtered[1]).to.equal('foobar');
      expect(accessories.filtered[2]).to.equal('foobar');
    });
  });

  describe('getAccessories function', () => {
    it('factory should have an getAccessories function', () => {
      const factory = new AccessoriesFactory();
      expect(factory.getAccessories).to.be.a('function');
    });

    it('getAccessories should call the internal create functions for device types', () => {
      const factory = new AccessoriesFactory();

      const switchesSpy = sinon.spy();
      const thermometersSpy = sinon.spy();
      const kakuSpy = sinon.spy();

      factory._createSwitches = switchesSpy;
      factory._createThermometers = thermometersSpy;
      factory._createKakuSensors = kakuSpy;

      const devices = {
        switches: [],
        kakusensors: [],
        thermometers: []
      };

      factory.getAccessories(devices);
      expect(switchesSpy).to.have.been.calledWith(devices.switches);
      expect(thermometersSpy).to.have.been.calledWith(devices.thermometers);
      expect(kakuSpy).to.have.been.calledWith(devices.kakusensors);
    });

    it('getAccessories should return an empty array when no devices/sensors are passed', () => {
      const factory = new AccessoriesFactory();
      const accessories = factory.getAccessories({});
      expect(accessories).to.be.a('array');
      expect(accessories.length).to.equal(0);
    });
  });

  describe('_instantiateAccessory function', () => {
    it('should put the instantiated device into the accessories array', () => {
      const logSpy = sinon.spy();
      const config = {};
      const DeviceClass = class foobar {};
      const accessoryInfo = {name: 'foobar'};
      const accessories = new AccessoriesFactory(logSpy, config, 'api', 'homebridge');

      accessories._instantiateAccessory(DeviceClass, accessoryInfo);
      expect(accessories.accessories.length).equal(1);
    });

    it('should instantiate the passed DeviceClass with the correct properties', () => {
      const log = 'log';
      const config = 'config';
      const api = 'api';
      const homebridge = 'homebridge';

      const accessoryInfo = {name: 'foobar'};
      const DeviceClass = sinon.spy();

      const accessories = new AccessoriesFactory(log, config, api, homebridge);

      accessories._instantiateAccessory(DeviceClass, accessoryInfo);

      expect(DeviceClass).to.have.been.calledWith(log, config, api, homebridge, accessoryInfo);
    });

    it('should filter out filtered accesories', () => {
      const config = {
        filtered: ['foobar']
      };
      const logSpy = sinon.spy();
      const DeviceClass = class foobar {};
      const accessoryInfo = {name: 'foobar'};
      const accessories = new AccessoriesFactory(logSpy, config, 'api', 'homebridge');

      accessories._instantiateAccessory(DeviceClass, accessoryInfo);
      expect(accessories.accessories.length).equal(0);
    });

    it('should trim name of accessory when filtering', () => {
      const config = {
        filtered: ['foobar']
      };
      const logSpy = sinon.spy();
      const DeviceClass = class foobar {};
      const accessoryInfo = {name: ' foobar '};
      const accessories = new AccessoriesFactory(logSpy, config, 'api', 'homebridge');

      accessories._instantiateAccessory(DeviceClass, accessoryInfo);
      expect(accessories.accessories.length).equal(0);
    });
  });

  describe('_createSwitches function', () => {

    it('should instantiate HomeWizardSomfyShutter for type: "somfy" ', () => {
      const somfySpy = sinon.spy();
      AccessoriesFactoryRewire.__Rewire__('HomeWizardSomfyShutter', somfySpy);

      const factory = new AccessoriesFactory(sinon.spy(), {}, {}, {});

      const instantiateSpy = sinon.spy();
      factory._instantiateAccessory = instantiateSpy;

      const switches = [{
        name: 'Somfy switch',
        type: 'somfy'
      }];

      factory._createSwitches(switches);

      expect(instantiateSpy).to.have.been.calledWith(somfySpy, switches[0]);

      AccessoriesFactoryRewire.__ResetDependency__('HomeWizardSomfyShutter', somfySpy);
    });

    it('should instantiate HomeWizardPhilipsHue for type: "hue" ', () => {
      const hueSpy = sinon.spy();
      AccessoriesFactoryRewire.__Rewire__('HomeWizardPhilipsHue', hueSpy);

      const factory = new AccessoriesFactory(sinon.spy(), {}, {}, {});

      const instantiateSpy = sinon.spy();
      factory._instantiateAccessory = instantiateSpy;

      const switches = [{
        name: 'Philips hue',
        type: 'hue'
      }];

      factory._createSwitches(switches);

      expect(instantiateSpy).to.have.been.calledWith(hueSpy, switches[0]);

      AccessoriesFactoryRewire.__ResetDependency__('HomeWizardPhilipsHue', hueSpy);
    });

    it('should instantiate HomeWizardRadiatorValve for type: "radiator" ', () => {
      const valveSpy = sinon.spy();
      AccessoriesFactoryRewire.__Rewire__('HomeWizardRadiatorValve', valveSpy);

      const factory = new AccessoriesFactory(sinon.spy(), {}, {}, {});

      const instantiateSpy = sinon.spy();
      factory._instantiateAccessory = instantiateSpy;

      const switches = [{
        name: 'Radiator valve',
        type: 'radiator'
      }];

      factory._createSwitches(switches);

      expect(instantiateSpy).to.have.been.calledWith(valveSpy, switches[0]);

      AccessoriesFactoryRewire.__ResetDependency__('HomeWizardRadiatorValve', valveSpy);
    });

    it('should instantiate HomeWizardSwitch as default case', () => {
      const defaultSpy = sinon.spy();
      AccessoriesFactoryRewire.__Rewire__('HomeWizardSwitch', defaultSpy);

      const factory = new AccessoriesFactory(sinon.spy(), {}, {}, {});

      const instantiateSpy = sinon.spy();
      factory._instantiateAccessory = instantiateSpy;

      const switches = [{
        name: 'Some other switch type',
        type: 'foobar'
      }];

      factory._createSwitches(switches);

      expect(instantiateSpy).to.have.been.calledWith(defaultSpy, switches[0]);

      AccessoriesFactoryRewire.__ResetDependency__('HomeWizardSwitch', defaultSpy);
    });
  });

  describe('_createThermometers function', () => {
    it('should instantiate HomeWizardThermometer', () => {
      const thermometerSpy = sinon.spy();
      AccessoriesFactoryRewire.__Rewire__('HomeWizardThermometer', thermometerSpy);

      const factory = new AccessoriesFactory(sinon.spy(), {}, {}, {});

      const instantiateSpy = sinon.spy();
      factory._instantiateAccessory = instantiateSpy;

      const thermometers = [{
        name: 'Thermometer 1'
      }];

      factory._createThermometers(thermometers);

      expect(instantiateSpy).to.have.been.calledWith(thermometerSpy, thermometers[0]);

      AccessoriesFactoryRewire.__ResetDependency__('HomeWizardSwitch', thermometerSpy);
    });
  });

  describe('_createKakuSensors function', () => {
    it('should instantiate HomeWizardMotionSensor for type: "motion" ', () => {
      const motionSpy = sinon.spy();
      AccessoriesFactoryRewire.__Rewire__('HomeWizardMotionSensor', motionSpy);

      const factory = new AccessoriesFactory(sinon.spy(), {}, {}, {});

      const instantiateSpy = sinon.spy();
      factory._instantiateAccessory = instantiateSpy;

      const kakusensors = [{
        name: 'Motion sensor 1',
        type: 'motion'
      }, {
        name: 'Unknown sensor',
        tpe: 'foobar'
      }];

      factory._createKakuSensors(kakusensors);

      expect(instantiateSpy).to.have.been.calledWith(motionSpy, kakusensors[0]);

      AccessoriesFactoryRewire.__ResetDependency__('HomeWizardMotionSensor', motionSpy);
    });

    it('should instantiate HomeWizardLightSensor for type: "light" ', () => {
      const lightSpy = sinon.spy();
      AccessoriesFactoryRewire.__Rewire__('HomeWizardLightSensor', lightSpy);

      const factory = new AccessoriesFactory(sinon.spy(), {}, {}, {});

      const instantiateSpy = sinon.spy();
      factory._instantiateAccessory = instantiateSpy;

      const kakusensors = [{
        name: 'Light sensor 1',
        type: 'light'
      }];

      factory._createKakuSensors(kakusensors);

      expect(instantiateSpy).to.have.been.calledWith(lightSpy, kakusensors[0]);

      AccessoriesFactoryRewire.__ResetDependency__('HomeWizardLightSensor', lightSpy);
    });

    it('should instantiate HomeWizardSmokeSensor for type: "smoke" ', () => {
      const smokeSpy = sinon.spy();
      AccessoriesFactoryRewire.__Rewire__('HomeWizardSmokeSensor', smokeSpy);

      const factory = new AccessoriesFactory(sinon.spy(), {}, {}, {});

      const instantiateSpy = sinon.spy();
      factory._instantiateAccessory = instantiateSpy;

      const kakusensors = [{
        name: 'Smoke sensor 1',
        type: 'smoke'
      }];

      factory._createKakuSensors(kakusensors);

      expect(instantiateSpy).to.have.been.calledWith(smokeSpy, kakusensors[0]);

      AccessoriesFactoryRewire.__ResetDependency__('HomeWizardLSmokeSensor', smokeSpy);
    });
  });














  // it('factory should produce accessories', () => {
  //   const logger = sinon.spy();
  //   const config = 'config';
  //   const api = 'api';
  //   const homebridge = 'homebridge';
  //
  //   const factory = new AccessoriesFactory(logger, config, api, homebridge);
  //   const devices = {
  //     switches: [{name: 'switchOne'}],
  //     thermometers: [{name: 'thermometerOne'}],
  //     kakusensors: [
  //       {
  //         name: 'motionOne',
  //         type: 'motion'
  //       }, {
  //         name: 'lightOne',
  //         type: 'light'
  //       }
  //     ]
  //   };
  //
  //   const accessories = factory.getAccessories(devices);
  //
  //   expect(accessories).to.be.a('array');
  //   expect(accessories.length).to.equal(4);
  // });
  //
  // it('accessories constructor should be called with: logger, config, api, homebridge and deviceInfo', () => {
  //   const switchSpy = sinon.spy();
  //   AccessoriesFactoryRewire.__Rewire__('HomeWizardSwitch', switchSpy);
  //
  //   const logger = sinon.spy();
  //   const config = 'config';
  //   const api = 'api';
  //   const homebridge = 'homebridge';
  //
  //   const factory = new AccessoriesFactory(logger, config, api, homebridge);
  //   const devices = {switches: [{name: 'switchOne'}]};
  //
  //   factory.getAccessories(devices);
  //
  //   expect(switchSpy).to.have.been.calledWith(logger, config, api, homebridge, devices.switches[0]);
  //
  //   AccessoriesFactoryRewire.__ResetDependency__('HomeWizardSwitch');
  // });
  //
  // it('filtered accessories should be skipped', () => {
  //   const logger = sinon.spy();
  //   const config = {
  //     filtered: ['switchOne']
  //   };
  //   const api = 'api';
  //   const homebridge = 'homebridge';
  //
  //   const factory = new AccessoriesFactory(logger, config, api, homebridge);
  //   const devices = {switches: [{name: 'switchOne'}]};
  //
  //   factory.getAccessories(devices);
  //
  //   expect(logger).to.have.been.calledWith('Skipping: switchOne because its filtered in the config');
  // });
});
