import 'babel-polyfill';
import request from 'request-promise';
import q from 'q'; //eslint-disable-line id-length

export class HomeWizardApi {
  queue = [];
  running = [];
  limit = 3;

  cache = {}
  cacheTimes = {}
  cacheDuration = {
    getStatus: 1000,
    getSensors: 900000, // half an hour, get sensors is currently only used for battery status
    getSwlist: 1000
  }

  constructor(config, log) {
    this.config = config;
    this.log = log;
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

  request(options) {
    const queueSlot = this._queueSlot();

    return queueSlot.then(() => {
      if (!options.method) {
        options.method = 'GET';
      }

      options.followRedirect = true;
      options.followAllRedirects = true;
      options.resolveWithFullResponse = true;

      // Transform url to full uri for request
      options.uri = this.config.url;

      if (this.config.port) {
        options.uri += `:${this.config.port}`;
      }
      options.uri += `/${this.config.password}/${options.url}`;

      // Homewizard responses are always json
      options.json = true;

      return request(options).then(response => {
        this._queueResolve();

        if (this.config && this.config.debug) {
          this.log(response);
        }

        return response.body;
      });
    });
  }

  getStatus(accessoryId, accessoryType) {
    const now = Date.now();

    if (!this.cache.getStatus || now - this.cacheTimes.getStatus > this.cacheDuration.getStatus) {
      this.cacheTimes.getStatus = now;
      this.cache.getStatus = this.request({url: 'get-status'});
    }

    return this.cache.getStatus.then(data => {
      const accessory = this._getAccessoryByIdAndType(accessoryId, accessoryType, data.response);

      if (!accessory) {
        throw new Error(`Requested get status for id: ${accessoryId} and type: ${accessoryType}, but now accessory found`);
      }

      return accessory;
    });
  }

  getSensors(accessoryId, accessoryType) {
    const now = Date.now();

    if (!this.cache.getSensors || now - this.cacheTimes.getSensors > this.cacheDuration.getSensors) {
      this.cacheTimes.getSensors = now;
      this.cache.getSensors = this.request({url: 'get-sensors'});
    }

    return this.cache.getSensors.then(data => {
      const accessory = this._getAccessoryByIdAndType(accessoryId, accessoryType, data.response);

      if (!accessory) {
        throw new Error(`Requested get sensors for id: ${accessoryId} and type: ${accessoryType}, but now accessory found`);
      }

      return accessory;
    });
  }

  getSwlist(accessoryId) {
    const now = Date.now();

    if (!this.cache.getSwlist || now - this.cacheTimes.getSwlist > this.cacheDuration.getSwlist) {
      this.cacheTimes.getSwlist = now;
      this.cache.getSwlist = this.request({url: 'swlist'});
    }

    return this.cache.getSwlist.then(data => {
      const accessory = this._getAccessoryById(accessoryId, data.response);

      if (!accessory) {
        throw new Error(`Requested get swlist for id: ${accessoryId}, but now accessory found`);
      }

      return accessory;
    });
  }

  clearCache() {
    this.cacheTimes = {};
    this.cache = {};
  }

  _getAccessoryByIdAndType(accessoryId, accessoryType, items) {
    if (items[accessoryType]) {
      return this._getAccessoryById(accessoryId, items[accessoryType]);
    }
  }

  _getAccessoryById(id, accessories) {
    return accessories.find(accessory => {
      return accessory.id === id;
    });
  }
}
