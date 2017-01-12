import chai from 'chai';
import sinon from 'sinon';
const expect = chai.expect;

import {HomeWizardBaseAccessory} from './../../src/accessories/accessory';

const AccessoryInformation = () => {
  const setCharacteristic = () => {
    return {setCharacteristic};
  };

  return {setCharacteristic};
};


const log = 'log';
const config = 'config';
const api = 'api';
const homebridge = {
  hap: {
    Characteristic: {
      Manufacturer: 'manufacturer',
      Model: 'model',
      SerialNumber: 'serialNumber'
    },
    Service: {
      AccessoryInformation
    }
  }
};
const hwObject = {
  id: 1,
  name: 'myObject'
};

const eventManager = {
  registerEventlistener() {}
};

describe('Class HomeWizardBaseAccessory', () => {
  it('Accessory base class should set properties on the class', () => {
    const accessory = new HomeWizardBaseAccessory({
      log,
      config,
      api,
      homebridge,
      eventManager,
      hwObject
    });

    expect(accessory.log).to.equal(log);
    expect(accessory.config).to.equal(config);
    expect(accessory.api).to.equal(api);
    expect(accessory.homebridge).to.equal(homebridge);
    expect(accessory.hap).to.equal(homebridge.hap);
    expect(accessory.id).to.equal(hwObject.id);
    expect(accessory.name).to.equal(hwObject.name);
    expect(accessory.hwObject).to.equal(hwObject);
    expect(accessory.eventManager).to.equal(eventManager);
  });

  it('Accessory base class should expose a getServices function', () => {
    const accessory = new HomeWizardBaseAccessory({log, config, api, homebridge, eventManager, hwObject});
    expect(accessory.getServices).to.be.a('function');
  });

  it('getServices should return an array with informationService in it', () => {
    const accessory = new HomeWizardBaseAccessory({log, config, api, homebridge, eventManager, hwObject});
    const services = accessory.getServices();

    expect(services).to.be.a('array');
    expect(services.length).to.equal(1);
  });

  it('If accessory has setupServices it should be called when getServices is called', () => {
    const accessory = new HomeWizardBaseAccessory({log, config, api, homebridge, eventManager, hwObject});
    accessory.setupServices = sinon.spy();
    accessory.getServices();
    expect(accessory.setupServices.called).to.equal(true);
  });
});
