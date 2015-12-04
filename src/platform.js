import {API} from './api';
import {AccessoriesFactory} from './accessories';

let homebridge;

class HomewizardPlatform {
  constructor(log, config) {
    this.log = log;
    this.config = config;

    // Instantiate the API
    this.api = new API(this.config);
  }

  accessories(callback) {
    this.api.request({url: 'get-sensors'}).then(data => {
      const factory = new AccessoriesFactory(this.log, this.config, this.api, homebridge);
      const accessories = factory.getAccessories(data.response);
      callback(accessories);
    }).catch(error => {
      this.log('Failed to retrieve accessories from HomeWizard');
      this.log(JSON.stringify(error));
      callback(null);
    });
  }
}

export default homebridgeInstance => {
  homebridge = homebridgeInstance;
  homebridgeInstance.registerPlatform('homebridge-homewizard', 'HomeWizard', HomewizardPlatform);
};
