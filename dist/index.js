const request = require('request');

class HomewizardSwitch {
  constructor(log, config) {
    console.log('Initialize a HomewizardSwitch', log, config);
  }
}

let Service, Characteristic;
module.exports = homebridge => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerPlatform('homebridge-homewizard', 'HomeWizard', HomewizardSwitch);
};
