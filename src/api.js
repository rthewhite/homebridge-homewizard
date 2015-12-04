import request from 'request-promise';

export class API {
  constructor(config) {
    this.config = config;
  }

  request(options) {

    if (!options.method) {
      options.method = 'GET';
    }

    // Transform url to full uri for request
    options.uri = `${this.config.url}/${this.config.password}/${options.url}`;

    // Homewizard responses are always json
    options.json = true;

    return request(options);
  }
}
