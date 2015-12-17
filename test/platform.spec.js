import chai from 'chai';
import sinon from 'sinon';
const expect = chai.expect;
import q from 'q'; //eslint-disable-line

import platform from './../src/platform';
import {HomewizardPlatform, __RewireAPI__ as HomewizardPlatformRewire} from './../src/platform';

describe('Register platform with homebridge', () => {
  it('platform should be an function', () => {
    expect(platform).to.be.a('function');
  });

  it('platform should register the homewizard platform when called', () => {
    const spy = sinon.spy();
    const homebridge = {registerPlatform: spy};

    // Initialize platform
    platform(homebridge);
    expect(spy.calledWith('homebridge-homewizard', 'HomeWizard', HomewizardPlatform)).to.equal(true);
  });
});

describe('Class HomeWizardPlatform', () => {
  let logSpy = sinon.spy();
  const config = {};

  beforeEach(() => {
    logSpy = sinon.spy();
  });

  it('HomewizardPlatform class should have an accessories function', () => {
    const platformInstance = new HomewizardPlatform(logSpy, config);
    expect(platformInstance.accessories).to.be.a('function');
  });

  it('Accessories should log and call callback with array of accessories on success', done => {
    const accessories = [{foo: 'bar'}];

    class API {
      request() {
        const deferred = q.defer();
        deferred.resolve({response: {}});
        return deferred.promise;
      }
    }

    class AccessoriesFactory {
      getAccessories() {
        return accessories;
      }
    }

    HomewizardPlatformRewire.__Rewire__('API', API);
    HomewizardPlatformRewire.__Rewire__('AccessoriesFactory', AccessoriesFactory);

    const platformInstance = new HomewizardPlatform(logSpy, config);

    const callback = response => {
      expect(response).to.equal(accessories);
      sinon.assert.called(logSpy);
      done();
    };

    platformInstance.accessories(callback);

    HomewizardPlatformRewire.__ResetDependency__('API');
    HomewizardPlatformRewire.__ResetDependency__('AccessoriesFactory');
  });

  it('Accessories should log and call callback with null and exception on fail', done => {
    class API {
      request() {
        const deferred = q.defer();
        deferred.reject('failed');
        return deferred.promise;
      }
    }

    HomewizardPlatformRewire.__Rewire__('API', API);

    const platformInstance = new HomewizardPlatform(logSpy, config);

    const callback = (accessories, error) => {
      expect(accessories).to.equal(null);
      expect(error).to.equal('failed');
      sinon.assert.called(logSpy);
      done();
    };

    platformInstance.accessories(callback);

    HomewizardPlatformRewire.__ResetDependency__('API');
  });
});
