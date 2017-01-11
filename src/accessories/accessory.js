import 'babel-polyfill';

export class HomeWizardBaseAccessory {
  services = [];
  manufacturer = 'HomeWizard';

  constructor(options) {
    this.log = options.log;
    this.config = options.config;
    this.api = options.api;
    this.homebridge = options.homebridge;
    this.hap = options.homebridge.hap;
    this.id = options.hwObject.id;
    this.name = options.hwObject.name;
    this.eventManager = options.eventManager;
    this.hwObject = options.hwObject;

    // Register with eventListener
    this.eventManager.registerEventlistener(this);
  }

  _setupInformationService() {
    const informationService = new this.hap.Service.AccessoryInformation();
    informationService
      .setCharacteristic(this.hap.Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(this.hap.Characteristic.Model, this.model)
      .setCharacteristic(this.hap.Characteristic.SerialNumber, this.serialNumber);
    this.services.push(informationService);
  }

  // with one state sensors like doorbells, motion-sensors,... HW keep the status in the API with yes a long time
  // and we need to consider a shorter duration
  recentDetection(sensor) {
    const DELAY_MAX = 1; // in minutes
    const hhmm = sensor.timestamp.split(':');
    const now = new Date();
    return sensor.status === 'yes' && ((now.getHours() * 60 + now.getMinutes()) - (hhmm[0] * 60 + hhmm[1] * 1)) <= DELAY_MAX;
  }

  getServices() {
    this._setupInformationService();
    if (this.setupServices) {
      this.setupServices();
    }
    return this.services;
  }

  refreshAllGetters() {
    for (let serv of this.services) {
      for (let char of serv.characteristics) {
        if (char._events.get) {
          char._events.get.call(this, function(err) {
            if (err) {
              return;
            }
          })
        }
      }
    }
  }
}
