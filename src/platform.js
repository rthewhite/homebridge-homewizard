import 'babel-polyfill';
import path from 'path';
import fs from 'fs';
import {HomeWizardApi} from './api';
import {AccessoriesFactory} from './accessories';
import {Logger} from './logger';
import {EventManager} from './events';

export class HomeWizardPlatform {
  constructor(log, config = {}) {
    this.config = config;
    this.log = log;

    // we display package name and running version
    const pkgname = path.join(__dirname, '/../package.json');
    fs.readFile(pkgname, 'utf8', function(err, contents) {
      if (err) {
        throw err;
      }
      const pkg = JSON.parse(contents);
      log(`Running : ${pkg.name} ${pkg.version}`);
    });

    this.api = new HomeWizardApi(this.config, this.log);
    this.logger = new Logger(this.log);
    this.eventManager = new EventManager(this.logger);
    this.factory = new AccessoriesFactory(this.log, this.config, this.api, GLOBAL.homebridge, this.eventManager);

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
