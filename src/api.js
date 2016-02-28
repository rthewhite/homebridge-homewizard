import 'babel-polyfill';
import request from 'request-promise';
import q from 'q'; //eslint-disable-line id-length

export class HomeWizardApi {
  queue = [];
  running = [];
  limit = 3;

  cache = {}
  cacheTimes = {}

  constructor(config, log) {
    this.config = config;
    this.log = log;

    if (!config.url) {
      throw new Error('No url to HomeWizard found in config');
    }

    if (!config.password) {
      throw new Error('No password found in config');
    }

    this.baseUrl = config.url;

    if (config.port) {
      this.baseUrl += `:${config.port}`;
    }

    this.baseUrl += `/${config.password}/`;
  }

  request(options) {
    const requestOptions = {
      method: 'GET',
      followRedirect: true,
      followAllRedirects: true,
      resolveWithFullResponse: true,
      json: true,
      uri: this.baseUrl
    };

    if (!options.url) {
      throw new Error('Api request function called without url');
    }
    requestOptions.uri += options.url;

    return this._queueSlot().then(() => {
      const requestPromise = request(requestOptions);

      requestPromise.finally(() => {
        this._queueResolve();
      });

      return requestPromise.then(response => {
        return response.body;
      });
    });
  }

  getStatus(accessoryId, accessoryType) {
    return this._loadFromCache('get-status', 1000, accessoryId, accessoryType);
  }

  getSensors(accessoryId, accessoryType) {
    return this._loadFromCache('get-sensors', 900000, accessoryId, accessoryType);
  }

  getSwlist(accessoryId) {
    return this._loadFromCache('swlist', 1000, accessoryId);
  }

  clearCache() {
    this.cacheTimes = {};
    this.cache = {};
  }

  _loadFromCache(url, cacheDuration, accessoryId, accessoryType) {
    const now = Date.now();

    if (!this.cache[url] || now - this.cacheTimes[url] > cacheDuration) {
      this.cacheTimes[url] = now;
      this.cache[url] = this.request({url});
    }

    return this.cache[url].then(data => {
      let accessory;

      if (accessoryType) {
        accessory = this._getAccessoryByIdAndType(accessoryId, accessoryType, data.response);
      } else {
        accessory = this._getAccessoryById(accessoryId, data.response);
      }

      if (!accessory) {
        throw new Error(`Requested url: ${url} for id: ${accessoryId}, but no accessory found`);
      }

      return accessory;
    });
  }

  // Called when a promise from the queue resolves
  _queueResolve() {
    // Just popping an item. We just need to queue to shrink,
    // so items in the queue aren't always the non resolved promises!
    this.running.pop();

    if (this.queue.length > 0 && this.running.length < this.limit) {
      const next = this.queue.shift();
      this.running.push(next);
      next.resolve();
    }
  }

  _queueSlot() {
    const deferred = q.defer();

    if (this.running.length < this.limit) {
      this.running.push(deferred);
      deferred.resolve();
    } else {
      this.queue.push(deferred);
    }

    return deferred.promise;
  }

  _getAccessoryByIdAndType(accessoryId, accessoryType, items) {
    if (!items[accessoryType]) {
      throw new Error('Unknown accessoryType passed');
    }

    return this._getAccessoryById(accessoryId, items[accessoryType]);
  }

  _getAccessoryById(id, accessories) {
    return accessories.find(accessory => {
      return accessory.id === id;
    });
  }
}
