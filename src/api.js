import 'babel-polyfill';
import request from 'request-promise';
import q from 'q'; //eslint-disable-line id-length

export class HomeWizardApi {
  queue = [];
  running = [];
  limit = 3;

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

        // Only log full response if in debug mode
        return response.body;
      });
    });
  }
}
