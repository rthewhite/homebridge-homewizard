import 'babel-polyfill';
import path from 'path';
import fs from 'fs';
import q from 'q'; //eslint-disable-line
import {HomeWizardApi} from './api';
import {AccessoriesFactory} from './accessories';
import {Logger} from './logger';
import {EventManager} from './events';
import {NotificationListener} from './notificationListener';

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
    this.factory = new AccessoriesFactory(this.log, this.config, this.api, global.homebridge, this.eventManager);
    this.listener = new NotificationListener(this.log, this.config, this.api, this.eventManager);
  }

  accessories(callback) {
    q.all([
      this.api.request({url: 'get-sensors'}),
      this.api.request({url: 'gplist'})
    ]).then(data => {
      this.log('Successfully retrieved accessories from HomeWizard');
      const accessories = this.factory.getAccessories(data[0].response, data[1].response);
      callback(accessories);
    }).catch(error => {
      this.log('Failed to retrieve accessories from HomeWizard');
      this.log(error);
      callback(null, error);
    });
  }
}
