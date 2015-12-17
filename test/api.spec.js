import chai from 'chai';
const expect = chai.expect;
import q from 'q'; //eslint-disable-line

import {HomeWizardApi, __RewireAPI__ as HomeWizardApiRewire} from './../src/api';

describe('Class HomeWizardApi', () => {
  const config = {
    url: 'apilocation',
    password: 'foobar'
  };

  it('HomeWizardApi should have a request function', () => {
    const api = new HomeWizardApi(config);
    expect(api.request).to.be.a('function');
  });

  it('Url should be properly transformed to URI including url and password from config', done => {
    const request = options => {
      expect(options.uri).to.equal('apilocation/foobar/endpoint');
      HomeWizardApiRewire.__ResetDependency__('request');
      done();
    };
    HomeWizardApiRewire.__Rewire__('request', request);

    const api = new HomeWizardApi(config);
    api.request({
      url: 'endpoint'
    });
  });

  it('Default method should be GET when not passing an method', done => {
    const request = options => {
      expect(options.method).to.equal('GET');
      HomeWizardApiRewire.__ResetDependency__('request');
      done();
    };
    HomeWizardApiRewire.__Rewire__('request', request);

    const api = new HomeWizardApi(config);
    api.request({
      url: 'foobar'
    });
  });

  it('When supplying a method it shouldnt be changed', done => {
    const request = options => {
      expect(options.method).to.equal('POST');
      HomeWizardApiRewire.__ResetDependency__('request');
      done();
    };
    HomeWizardApiRewire.__Rewire__('request', request);

    const api = new HomeWizardApi(config);
    api.request({
      url: 'foobar',
      method: 'POST'
    });
  });

  it('Request type is always json', done => {
    const request = options => {
      expect(options.json).to.equal(true);
      HomeWizardApiRewire.__ResetDependency__('request');
      done();
    };
    HomeWizardApiRewire.__Rewire__('request', request);

    const api = new HomeWizardApi(config);
    api.request({
      url: 'foobar'
    });
  });

  it('Requests should be queued when there are more than 3 simultaneous requests', () => {
    const request = () => {
      return q.defer().promise;
    };
    HomeWizardApiRewire.__Rewire__('request', request);

    const api = new HomeWizardApi(config);
    api.request();
    api.request();
    api.request();
    api.request();

    expect(api.running.length).to.equal(3);
    expect(api.queue.length).to.equal(1);

    HomeWizardApiRewire.__ResetDependency__('request');
  });

  it('When a queue slot frees up, next in the queue should be executed', done => {
    const request = () => {
      const deferred = q.defer();

      setTimeout(() => {
        deferred.resolve('foobar');
      }, 100);

      return deferred.promise;
    };

    HomeWizardApiRewire.__Rewire__('request', request);

    const api = new HomeWizardApi(config);
    api.request({});
    api.request({});
    api.request({});

    expect(api.running.length).to.equal(3);
    expect(api.queue.length).to.equal(0);

    api.request({}).then(() => {
      expect(api.running.length).to.equal(0);
      expect(api.queue.length).to.equal(0);
      done();
    });

    expect(api.queue.length).to.equal(1);
  });
});
