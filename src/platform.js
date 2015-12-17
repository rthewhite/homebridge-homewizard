require('babel-polyfill');
import {API} from './api';
import {AccessoriesFactory} from './accessories';

let homebridge;

export class HomewizardPlatform {
  constructor(log, config) {
    this.log = log;
    this.config = config;

    // Instantiate the API
    this.api = new API(this.config);

    // Instantiate the accessories factory
    this.factory = new AccessoriesFactory(this.log, this.config, this.api, homebridge);
  }

  accessories(callback) {
    this.api.request({url: 'get-sensors'}).then(data => {
      this.log('Successfully retrieved accessories from HomeWizard', JSON.stringify(data.response));
      callback(this.factory.getAccessories(data.response));
    }).catch(error => {
      this.log('Failed to retrieve accessories from HomeWizard', JSON.stringify(error));
      callback(null, error);
    });
  }
}

export default homebridgeInstance => {
  homebridge = homebridgeInstance;
  homebridgeInstance.registerPlatform('homebridge-homewizard', 'HomeWizard', HomewizardPlatform);
};
