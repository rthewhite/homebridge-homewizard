import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardThermometer extends HomeWizardBaseAccessory {

  model = 'Thermometer';

  setupServices() {
    // Temperature service
    const temperatureSensorService = new this.hap.Service.TemperatureSensor();
    const characteristic = temperatureSensorService.getCharacteristic(this.hap.Characteristic.CurrentTemperature);

    // Make sure negative temps are working...
    characteristic.props.minValue = -50;
    characteristic.on('get', this.getTemperature.bind(this));

    // Humidity service
    const humiditySensorService = new this.hap.Service.HumiditySensor();

    humiditySensorService
      .getCharacteristic(this.hap.Characteristic.CurrentRelativeHumidity)
      .on('get', this.getHumidity.bind(this));

    // Add battery status to services
    temperatureSensorService
      .addCharacteristic(new this.hap.Characteristic.StatusLowBattery()) //eslint-disable-line
      .on('get', this.getLowBatteryStatus.bind(this));

    humiditySensorService
      .addCharacteristic(new this.hap.Characteristic.StatusLowBattery()) //eslint-disable-line
      .on('get', this.getLowBatteryStatus.bind(this));

    // Add services
    this.services.push(temperatureSensorService);
    this.services.push(humiditySensorService);
  }

  getValues(callback) {
    return this.api.request({url: 'get-status'}).then(data => {
      return data.response.thermometers.find(sensor => {
        return sensor.id === this.id;
      });
    }).catch(error => {
      this.log(`Failed to retrieve temperature/humidity for: ${this.name}`);
      this.log(error);
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

  getLowBatteryStatus(callback) {
    this.api.request({url: 'get-sensors'}).then(data => {
      const thermometer = data.response.thermometers.find(sensor => {
        return sensor.id === this.id;
      });

      const lowBattery = thermometer.lowBattery === 'yes';

      if (lowBattery) {
        this.log(`Low battery level for thermometer: ${this.name}`);
      }

      callback(null, lowBattery);
    });
  }
}
