import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardLightSensor extends HomeWizardBaseAccessory {

  model = 'Light sensor';
  currentAmbientLightLevel;
  setupServices() {
    // Setup services
    const lightSensorService = new this.hap.Service.LightSensor();
    this.currentAmbientLightLevel = lightSensorService.getCharacteristic(this.hap.Characteristic.CurrentAmbientLightLevel);
    this.currentAmbientLightLevel.on('get', this.getCurrentAmbientLightLevel.bind(this));

      // Add battery status to services
    lightSensorService
      .addCharacteristic(new this.hap.Characteristic.StatusLowBattery()) //eslint-disable-line
      .on('get', this.getLowBatteryStatus.bind(this));

    this.services.push(lightSensorService);
  }

  getCurrentAmbientLightLevel(callback) {
    this.api.getStatus(this.id, 'kakusensors').then(sensor => {
      // HomeWizard only sends back yes or no
      // Means day or night? Translating this to ambient light level for Homekit
      const lightLevel = sensor.status === 'yes' ? 100 : 0.01;
      this.log(`Retrieved ambient light level for: ${this.name} - ${lightLevel}`);

      this.currentAmbientLightLevel.setValue(lightLevel);
      callback(null, lightLevel);
    }).catch(error => {
      this.log(`Failed to retrieve ambient light level for: ${this.name}`);
      this.log(error);
      callback(error);
    });
  }

  getLowBatteryStatus(callback) {
    this.api.getSensors(this.id, 'kakusensors').then(sensor => {
      const lowBattery = sensor.lowBattery === 'yes';

      if (lowBattery) {
        this.log(`Low battery level for motion sensor: ${this.name}`);
      }

      callback(null, lowBattery);
    }).catch(error => {
      this.log(`Failed to retrieve battery level for motion sensor: ${this.name}`);
      this.log(error);
      callback(error);
    });
  }
}
