import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);

import q from 'q'; //eslint-disable-line

import {HomeWizardApi, __RewireAPI__ as HomeWizardApiRewire} from './../src/api';

describe('Class HomeWizardApi', () => {

  describe('constructor', () => {
    it('should throw an error if no url passed in the config', () => {
      const create = () => {
        const api = new HomeWizardApi({  //eslint-disable-line
          password: 'foobar'
        });
      };
      expect(create).to.throw('No url to HomeWizard found in config');
    });

    it('should throw an error if no password passed in the config', () => {
      const create = () => {
        const api = new HomeWizardApi({  //eslint-disable-line
          url: 'foobar'
        });
      };
      expect(create).to.throw('No password found in config');
    });

    it('should prepare the baseurl correctly', () => {
      const config = {
        url: 'apilocation',
        password: 'foobar'
      };

      const api = new HomeWizardApi(config);
      expect(api.baseUrl).to.equal('apilocation/foobar/');
    });

    it('should add the port if specified in the config', () => {
      const config = {
        url: 'apilocation',
        port: '8080',
        password: 'foobar'
      };

      const api = new HomeWizardApi(config);
      expect(api.baseUrl).to.equal('apilocation:8080/foobar/');
    });
  });

  describe('interface', () => {
    let api;
    const config = {
      url: 'apilocation',
      password: 'foobar'
    };

    beforeEach(() => {
      api = new HomeWizardApi(config);
    });

    it('should have an request function', () => {
      expect(api.request).to.be.a('function');
    });

    it('should have an getStatus function', () => {
      expect(api.request).to.be.a('function');
    });

    it('should have an getSensors function', () => {
      expect(api.getSensors).to.be.a('function');
    });

    it('should have an clearCache function', () => {
      expect(api.clearCache).to.be.a('function');
    });
  });

  describe('request function', () => {
    it('should throw an error when not passing an url', () => {
      const config = {
        url: 'apilocation',
        password: 'foobar'
      };
      const api = new HomeWizardApi(config);

      const request = () => {
        api.request({});
      };

      expect(request).to.throw('Api request function called without url');
    });

    it('should use the queue to schedule request', () => {
      const requestSpy = sinon.spy();
      HomeWizardApiRewire.__Rewire__('request', requestSpy);

      const config = {
        url: 'apilocation',
        password: 'foobar'
      };
      const api = new HomeWizardApi(config);

      // Stub out the queue functions
      const queueStub = sinon.stub().returns(q.defer().promise);
      api._queueSlot = queueStub;

      api.request({url: 'blaat'});
      expect(queueStub).to.have.been.called; //eslint-disable-line

      HomeWizardApiRewire.__ResetDependency__('request', requestSpy);
    });

    it('should call _queueResolve when successfull response comes in', done => {
      const requestStub = sinon.stub().returns(q.resolve({}));
      HomeWizardApiRewire.__Rewire__('request', requestStub);

      const config = {
        url: 'apilocation',
        password: 'foobar'
      };
      const api = new HomeWizardApi(config);

      // Stub out the queue functions
      const queueSlotStub = sinon.stub().returns(q.resolve());
      const queueResolve = sinon.spy();

      api._queueSlot = queueSlotStub;
      api._queueResolve = queueResolve;

      api.request({url: 'blaat'}).then(() => {
        // If one of these assertions fails, it will throw an timeout error
        // don't know how to properly fix that right now....
        expect(requestStub).to.have.been.called; //eslint-disable-line
        expect(queueSlotStub).to.have.been.called; //eslint-disable-line
        expect(queueResolve).to.have.been.called; //eslint-disable-line
        HomeWizardApiRewire.__ResetDependency__('request', requestStub);
        done();
      });
    });

    it('should call _queueResolve when error response comes in', done => {
      const requestStub = sinon.stub().returns(q.reject({}));
      HomeWizardApiRewire.__Rewire__('request', requestStub);

      const config = {
        url: 'apilocation',
        password: 'foobar'
      };
      const api = new HomeWizardApi(config);

      // Stub out the queue functions
      const queueSlotStub = sinon.stub().returns(q.resolve());
      const queueResolve = sinon.spy();

      api._queueSlot = queueSlotStub;
      api._queueResolve = queueResolve;

      api.request({url: 'blaat'}).catch(() => {
        // If one of these assertions fails, it will throw an timeout error
        // don't know how to properly fix that right now....
        expect(requestStub).to.have.been.called; //eslint-disable-line
        expect(queueSlotStub).to.have.been.called; //eslint-disable-line
        expect(queueResolve).to.have.been.called; //eslint-disable-line
        HomeWizardApiRewire.__ResetDependency__('request', requestStub);

        done();
      });
    });

    it('should call request lib function with correct options', done => {
      const requestStub = sinon.stub().returns(q.resolve({}));
      HomeWizardApiRewire.__Rewire__('request', requestStub);

      const config = {
        url: 'apilocation',
        password: 'foobar'
      };
      const api = new HomeWizardApi(config);

      // Stub out the queue functions
      const queueSlotStub = sinon.stub().returns(q.resolve());
      const queueResolve = sinon.spy();

      api._queueSlot = queueSlotStub;
      api._queueResolve = queueResolve;

      api.request({url: 'blaat'}).finally(() => {
        // If one of these assertions fails, it will throw an timeout error
        // don't know how to properly fix that right now....
        expect(requestStub.lastCall.args[0].uri).to.equal('apilocation/foobar/blaat');
        expect(requestStub.lastCall.args[0].method).to.equal('GET');
        expect(queueSlotStub).to.have.been.called; //eslint-disable-line
        expect(queueResolve).to.have.been.called; //eslint-disable-line
        HomeWizardApiRewire.__ResetDependency__('request', requestStub);
        done();
      });
    });
  });

  describe('clearCache function', () => {
    let api;
    const config = {
      url: 'apilocation',
      password: 'foobar'
    };

    beforeEach(() => {
      api = new HomeWizardApi(config);
    });

    it('should clear the cache', () => {
      api.cache = {foo: 'bar'};
      api.clearCache();

      expect(api.cache.foo).to.equal(undefined);
    });

    it('should clear the cachetimes', () => {
      api.cacheTimes = {foo: 'bar'};
      api.clearCache();

      expect(api.cacheTimes.foo).to.equal(undefined);
    });
  });

  describe('getStatus, getSensors functions', () => {
    let api;
    let loadFromCacheSpy;
    const config = {
      url: 'apilocation',
      password: 'foobar'
    };

    beforeEach(() => {
      loadFromCacheSpy = sinon.spy();
      api = new HomeWizardApi(config);
      api._loadFromCache = loadFromCacheSpy;
    });

    it('getStatus should call _loadFromCache', () => {
      api.getStatus();
      expect(loadFromCacheSpy).to.be.called; //eslint-disable-line
    });

    it('getSensors should call _loadFromCache', () => {
      api.getSensors();
      expect(loadFromCacheSpy).to.be.called; //eslint-disable-line
    });

  });

  describe('_loadFromCache function', () => {
    let api;
    const config = {
      url: 'apilocation',
      password: 'foobar'
    };

    beforeEach(() => {
      api = new HomeWizardApi(config);
    });

    it('should make the request and put the promise in cache, if its not in the cache', () => {
      const response = {
        response: [{id: 1, name: 'foobar'}]
      };

      const requestSpy = sinon.stub().returns(q.resolve(response));

      api.request = requestSpy;

      api._loadFromCache('get-url', 1000, 1);

      expect(requestSpy).to.be.called; //eslint-disable-line
      expect(api.cache['get-url']).to.be.defined; //eslint-disable-line
      expect(api.cacheTimes['get-url']).to.be.defined; //eslint-disable-line
    });

    it('should take promise from the cache if cache is valid', () => {
      const response = {
        response: [{id: 1, name: 'foobar'}]
      };

      const requestSpy = sinon.stub().returns(q.resolve(response));

      api.request = requestSpy;
      api.cache = {
        'get-url': q.resolve(response)
      };
      api.cacheTimes = {
        'get-url': Date.now()
      };

      api._loadFromCache('get-url', 1000, 1);

      expect(requestSpy).to.not.be.called; //eslint-disable-line
    });

    it('should note take promise from the cache if cache is invalid', () => {
      const response = {
        response: [{id: 1, name: 'foobar'}]
      };

      const requestSpy = sinon.stub().returns(q.resolve(response));

      api.request = requestSpy;
      api.cache = {
        'get-url': q.resolve(response)
      };
      api.cacheTimes = {
        'get-url': Date.now() - 1000
      };

      api._loadFromCache('get-url', 100, 1);

      expect(requestSpy).to.be.called; //eslint-disable-line
    });

    it('should call _getAccessoryById if no accessoryType is passed', done => {
      const response = {
        response: [{id: 1, name: 'foobar'}]
      };

      const requestSpy = sinon.stub().returns(q.resolve(response));
      api.request = requestSpy;

      const getAccessoryByIdSpy = sinon.stub().returns(response.response[0]);
      api._getAccessoryById = getAccessoryByIdSpy;

      // If these test fail, it will result in a timeout no idea to fix it right now
      api._loadFromCache('get-url', 1000, 1).then(accessory => {
        expect(getAccessoryByIdSpy).to.be.calledWith(1, response.response);
        expect(accessory).to.equal(response.response[0]);
        done();
      });
    });

    it('should call _getAccessoryByIdAndType if accessoryType is passed', done => {
      const response = {
        response: {
          switches: [{id: 1, name: 'foobar'}]
        }
      };

      const requestSpy = sinon.stub().returns(q.resolve(response));
      api.request = requestSpy;

      const getAccessoryByIdAndTypeSpy = sinon.stub().returns(response.response.switches[0]);
      api._getAccessoryByIdAndType = getAccessoryByIdAndTypeSpy;

      // If these test fail, it will result in a timeout no idea to fix it right now
      api._loadFromCache('get-url', 1000, 1, 'switches').then(accessory => {
        expect(getAccessoryByIdAndTypeSpy).to.be.calledWith(1, 'switches', response.response);
        expect(accessory).to.equal(response.response.switches[0]);
        done();
      });
    });

    it('should throw an error when no accessory is found', done => {
      const response = {
        response: [{id: 1, name: 'foobar'}]
      };

      const requestSpy = sinon.stub().returns(q.resolve(response));
      api.request = requestSpy;

      const getAccessoryByIdSpy = sinon.stub().returns(undefined);
      api._getAccessoryById = getAccessoryByIdSpy;

      // If this test fails, it will result in a timeout no idea to fix it right now
      api._loadFromCache('get-url', 1000, 2).catch(() => {
        done();
      });
    });
  });

  describe('_queueResolve function', () => {
    let api;
    const config = {
      url: 'apilocation',
      password: 'foobar'
    };

    beforeEach(() => {
      api = new HomeWizardApi(config);
    });

    it('should be able to be called when queue is empty', () => {
      api._queueResolve();

      expect(api.queue.length).to.equal(0);
      expect(api.running.length).to.equal(0);
    });

    it('should pop an item from the queue', () => {
      api.limit = 3;

      api._queueSlot();
      api._queueSlot();
      api._queueSlot();
      api._queueSlot();

      expect(api.running.length).to.equal(3);
      expect(api.queue.length).to.equal(1);

      api._queueResolve();

      expect(api.queue.length).to.equal(0);
    });

    it('should resolve next queslot if there are items in the queue', done => {
      api.limit = 3;

      api._queueSlot();
      api._queueSlot();
      api._queueSlot();
      api._queueSlot().then(() => {
        expect(api.running.length).to.equal(3);
        expect(api.queue.length).to.equal(0);

        done();
      });

      expect(api.running.length).to.equal(3);
      expect(api.queue.length).to.equal(1);

      api._queueResolve();

      expect(api.queue.length).to.equal(0);
    });
  });

  describe('_queueSlot function', () => {
    let api;
    const config = {
      url: 'apilocation',
      password: 'foobar'
    };

    beforeEach(() => {
      api = new HomeWizardApi(config);
    });

    it('should return a promise', () => {
      const slot = api._queueSlot();
      expect(slot.then).to.be.a('function');
    });

    it('should resolve directly when queue limit is not hit', done => {
      const slot = api._queueSlot();
      slot.then(done);
    });

    it('should be put in the queue when limit is hit', () => {
      api.limit = 3;

      api._queueSlot();
      api._queueSlot();
      api._queueSlot();
      api._queueSlot();

      expect(api.running.length).to.equal(3);
      expect(api.queue.length).to.equal(1);
    });
  });

  describe('_getAccessoryById function', () => {
    let api;
    const config = {
      url: 'apilocation',
      password: 'foobar'
    };

    beforeEach(() => {
      api = new HomeWizardApi(config);
    });

    it('should find the accessory', () => {
      const accessories = [{
        id: 1,
        name: 'foobar 1'
      }, {
        id: 2,
        name: 'foobar 2'
      }, {
        id: 3,
        name: 'foobar 3'
      }];

      let accessory = api._getAccessoryById(1, accessories);
      expect(accessory.name).to.equal('foobar 1');

      accessory = api._getAccessoryById(3, accessories);
      expect(accessory.name).to.equal('foobar 3');
    });
  });

  describe('_getAccessoryByIdAndType function', () => {
    let api;
    const config = {
      url: 'apilocation',
      password: 'foobar'
    };

    beforeEach(() => {
      api = new HomeWizardApi(config);
    });

    it('should thrown an error if unknown accessory type is passed', () => {
      const test = () => {
        api._getAccessoryByIdAndType(1, 'foobar', {});
      };

      expect(test).to.throw('Unknown accessoryType passed');
    });

    it('should find the accessory', () => {
      const accessories = {
        switches: [{
          id: 1,
          name: 'foobar 1'
        }, {
          id: 2,
          name: 'foobar 2'
        }, {
          id: 3,
          name: 'foobar 3'
        }]
      };

      let accessory = api._getAccessoryByIdAndType(1, 'switches', accessories);
      expect(accessory.name).to.equal('foobar 1');

      accessory = api._getAccessoryByIdAndType(3, 'switches', accessories);
      expect(accessory.name).to.equal('foobar 3');
    });
  });


  //
  // it('Default method should be GET when not passing an method', done => {
  //   const request = options => {
  //     expect(options.method).to.equal('GET');
  //     HomeWizardApiRewire.__ResetDependency__('request');
  //     done();
  //   };
  //   HomeWizardApiRewire.__Rewire__('request', request);
  //
  //   const api = new HomeWizardApi(config);
  //   api.request({
  //     url: 'foobar'
  //   });
  // });
  //
  // it('When supplying a method it shouldnt be changed', done => {
  //   const request = options => {
  //     expect(options.method).to.equal('POST');
  //     HomeWizardApiRewire.__ResetDependency__('request');
  //     done();
  //   };
  //   HomeWizardApiRewire.__Rewire__('request', request);
  //
  //   const api = new HomeWizardApi(config);
  //   api.request({
  //     url: 'foobar',
  //     method: 'POST'
  //   });
  // });
  //
  // it('Request type is always json', done => {
  //   const request = options => {
  //     expect(options.json).to.equal(true);
  //     HomeWizardApiRewire.__ResetDependency__('request');
  //     done();
  //   };
  //   HomeWizardApiRewire.__Rewire__('request', request);
  //
  //   const api = new HomeWizardApi(config);
  //   api.request({
  //     url: 'foobar'
  //   });
  // });
  //

});
