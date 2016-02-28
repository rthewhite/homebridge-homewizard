import 'babel-polyfill';
import {HomeWizardApi} from './api';
import {AccessoriesFactory} from './accessories';

export class HomeWizardPlatform {
  constructor(log, config) {
    this.config = config;
    this.log = log;

    // Instantiate the API
    this.api = new HomeWizardApi(this.config, this.log);

    // Instantiate the accessories factory
    this.factory = new AccessoriesFactory(this.log, this.config, this.api, GLOBAL.homebridge);
  }

  accessories(callback) {
    this.api.request({url: 'get-sensors'}).then(data => {
      this.log('Successfully retrieved accessories from HomeWizard');
      const accessories = this.factory.getAccessories(data.response);
      callback(accessories);
    }).catch(error => {
      this.log('Failed to retrieve accessories from HomeWizard');
      this.log(error);
      callback(null, error);
    });
  }
}
