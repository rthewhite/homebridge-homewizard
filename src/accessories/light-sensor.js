import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardLightSensor extends HomeWizardBaseAccessory {

  model = 'Light sensor';

  setupServices() {
    // Setup services
    const lightSensorService = new this.hap.Service.LightSensor();
    lightSensorService
      .getCharacteristic(this.hap.Characteristic.CurrentAmbientLightLevel)
      .on('get', this.getCurrentAmbientLightLevel.bind(this));

      // Add battery status to services
    lightSensorService
      .addCharacteristic(new this.hap.Characteristic.StatusLowBattery()) //eslint-disable-line
      .on('get', this.getLowBatteryStatus.bind(this));

    this.services.push(lightSensorService);
  }

  // Sadly there is no individual call to get a sensor status
  // so retrieve all and find this one
  getCurrentValues() {
    return this.api.request({url: 'get-status'}).then(data => {
      return data.response.kakusensors.find(sw => {
        return sw.id === this.id;
      });
    });
  }

  getCurrentAmbientLightLevel(callback) {
    this.getCurrentValues().then(sensor => {
      // HomeWizard only sends back yes or no
      // Means day or night? Translating this to ambient light level for Homekit
      const lightLevel = sensor.status === 'yes' ? 100 : 0.01;
      this.log(`Get ambient light level for: ${this.name} - ${lightLevel}`);

      callback(null, lightLevel);
    });
  }

  getLowBatteryStatus(callback) {
    this.api.request({url: 'get-sensors'}).then(data => {
      const sensor = data.response.kakusensors.find(kakusensor => {
        return kakusensor.id === this.id;
      });

      const lowBattery = sensor.lowBattery === 'yes';

      if (lowBattery) {
        this.log(`Low battery level for motion sensor: ${this.name}`);
      }

      callback(null, lowBattery);
    });
  }
}
