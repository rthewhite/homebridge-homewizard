import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardThermometer extends HomeWizardBaseAccessory {

  model = 'Thermometer';

  setupServices() {
    const temperatureSensorService = new this.hap.Service.TemperatureSensor();
    temperatureSensorService
       .getCharacteristic(this.hap.Characteristic.CurrentTemperature)
       .on('get', this.getTemperature.bind(this));

    this.services.push(temperatureSensorService);

    const humiditySensorService = new this.hap.Service.HumiditySensor();
    humiditySensorService
      .getCharacteristic(this.hap.Characteristic.CurrentRelativeHumidity)
      .on('get', this.getHumidity.bind(this));

    this.services.push(humiditySensorService);
  }

  getValues(callback) {
    return this.api.request({url: `te/graph/${this.id}/day`}).then(data => {
      return data.response[data.response.length - 1];
    }).catch(error => {
      this.log(`Failed to retrieve temperature/humidity for: ${this.name}`);
      this.log(JSON.stringify(error));
      callback(error, null);
    });
  }

  getHumidity(callback) {
    this.getValues(callback).then(currentValues => {
      this.log(`Retrieved humidity for: ${this.name} its ${currentValues.hu} %`);
      callback(null, currentValues.hu);
    });
  }

  getTemperature(callback) {
    this.getValues(callback).then(currentValues => {
      this.log(`Retrieved temperature for: ${this.name} its ${currentValues.te} degrees`);
      callback(null, currentValues.te);
    });
  }
}
