import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardSmokeSensor extends HomeWizardBaseAccessory {

  model = 'Smoke sensor';

  setupServices() {
    // Setup services
    const smokeSensorService = new this.hap.Service.SmokeSensor();
    this.smokeDetected = smokeSensorService.getCharacteristic(this.hap.Characteristic.SmokeDetected);
    this.smokeDetected.on('get', this.getSmokeDetected.bind(this));

    this.services.push(smokeSensorService);
  }

  getSmokeDetected(callback) {
    this.api.getStatus(this.id, 'kakusensors').then(sensor => {
      const smoke = sensor.status === 'yes' && this.recentUpdate(sensor, 10)
        ? this.hap.Characteristic.SmokeDetected.SMOKE_DETECTED
        : this.hap.Characteristic.SmokeDetected.SMOKE_NOT_DETECTED;

      if (smoke === this.hap.Characteristic.SmokeDetected.SMOKE_DETECTED) {
        this.log(`Detected smoke at sensor:${this.name}`);
      }

      this.smokeDetected.setValue(smoke);
      callback(null, smoke);
    }).catch(error => {
      this.log(`Failed to retrieve smoke state for:${this.name}`);
      this.log(error);
      callback(error);
    });
  }
}
