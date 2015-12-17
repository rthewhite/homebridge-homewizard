import 'babel-polyfill';
import {HomeWizardApi} from './api';
import {AccessoriesFactory} from './accessories';

export class HomeWizardPlatform {
  constructor(log, config) {
    this.log = log;
    this.config = config;

    // Instantiate the API
    this.api = new HomeWizardApi(this.config);

    // Instantiate the accessories factory
    this.factory = new AccessoriesFactory(this.log, this.config, this.api, GLOBAL.homebridge);
  }

  accessories(callback) {
    this.api.request({url: 'get-sensors'}).then(data => {
      this.log('Successfully retrieved accessories from HomeWizard', JSON.stringify(data.response));
      const accessories = this.factory.getAccessories(data.response);
      callback(accessories);
    }).catch(error => {
      this.log('Failed to retrieve accessories from HomeWizard', JSON.stringify(error));
      callback(null, error);
    });
  }
}
