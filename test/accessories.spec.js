import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);

import {AccessoriesFactory, __RewireAPI__ as AccessoriesFactoryRewire} from './../src/accessories';

describe('Class AccessoriesFactory ', () => {

  it('factory should have an getAccessories function', () => {
    const factory = new AccessoriesFactory();
    expect(factory.getAccessories).to.be.a('function');
  });

  it('getAccessories should return an empty array when no devices/sensors are passed', () => {
    const factory = new AccessoriesFactory();
    expect(factory.getAccessories({})).to.be.a('array');
  });

  it('factory should produce accessories', () => {
    const logger = sinon.spy();
    const config = 'config';
    const api = 'api';
    const homebridge = 'homebridge';

    const factory = new AccessoriesFactory(logger, config, api, homebridge);
    const devices = {
      switches: [{name: 'switchOne'}],
      thermometers: [{name: 'thermometerOne'}]
    };

    const accessories = factory.getAccessories(devices);

    expect(accessories).to.be.a('array');
    expect(accessories.length).to.equal(2);
  });

  it('accessories constructor should be called with: logger, config, api, homebridge and deviceInfo', () => {
    const switchSpy = sinon.spy();
    AccessoriesFactoryRewire.__Rewire__('HomeWizardSwitch', switchSpy);

    const logger = sinon.spy();
    const config = 'config';
    const api = 'api';
    const homebridge = 'homebridge';

    const factory = new AccessoriesFactory(logger, config, api, homebridge);
    const devices = {switches: [{name: 'switchOne'}]};

    factory.getAccessories(devices);

    expect(switchSpy).to.have.been.calledWith(logger, config, api, homebridge, devices.switches[0]);

    AccessoriesFactoryRewire.__ResetDependency__('HomeWizardSwitch');
  });

  it('filtered accessories should be skipped', () => {
    const logger = sinon.spy();
    const config = {
      filtered: ['switchOne']
    };
    const api = 'api';
    const homebridge = 'homebridge';

    const factory = new AccessoriesFactory(logger, config, api, homebridge);
    const devices = {switches: [{name: 'switchOne'}]};

    factory.getAccessories(devices);

    expect(logger).to.have.been.calledWith('Skipping: switchOne because its filtered in the config');
  });
});
