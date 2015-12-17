import chai from 'chai';
import sinon from 'sinon';
const expect = chai.expect;
import q from 'q'; //eslint-disable-line

import {HomeWizardPlatform, __RewireAPI__ as HomeWizardPlatformRewire} from './../src/platform';

describe('Class HomeWizardPlatform', () => {
  let logSpy = sinon.spy();
  const config = {};

  beforeEach(() => {
    logSpy = sinon.spy();
  });

  it('HomewizardPlatform class should have an accessories function', () => {
    const platformInstance = new HomeWizardPlatform(logSpy, config);
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

    HomeWizardPlatformRewire.__Rewire__('HomeWizardApi', API);
    HomeWizardPlatformRewire.__Rewire__('AccessoriesFactory', AccessoriesFactory);

    const platformInstance = new HomeWizardPlatform(logSpy, config);

    const callback = response => {
      expect(response).to.equal(accessories);
      sinon.assert.called(logSpy);
      done();
    };

    platformInstance.accessories(callback);

    HomeWizardPlatformRewire.__ResetDependency__('HomeWizardApi');
    HomeWizardPlatformRewire.__ResetDependency__('AccessoriesFactory');
  });

  it('Accessories should log and call callback with null and exception on fail', done => {
    class API {
      request() {
        const deferred = q.defer();
        deferred.reject('failed');
        return deferred.promise;
      }
    }

    HomeWizardPlatformRewire.__Rewire__('HomeWizardApi', API);

    const platformInstance = new HomeWizardPlatform(logSpy, config);

    const callback = (accessories, error) => {
      expect(accessories).to.equal(null);
      expect(error).to.equal('failed');
      sinon.assert.called(logSpy);
      done();
    };

    platformInstance.accessories(callback);

    HomeWizardPlatformRewire.__ResetDependency__('HomeWizardApi');
  });
});
