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

  getHumidity(callback) {
    this.api.getStatus(this.id, 'thermometers').then(currentValues => {
      this.log(`Retrieved humidity for: ${this.name} its ${currentValues.hu} %`);
      callback(null, currentValues.hu);
    }).catch(error => {
      this.log(`Failed to retrieve humidity for: ${this.name}`);
      this.log(error);
      callback(error);
    });
  }

  getTemperature(callback) {
    this.api.getStatus(this.id, 'thermometers').then(currentValues => {
      this.log(`Retrieved temperature for: ${this.name} its ${currentValues.te} degrees`);
      callback(null, currentValues.te);
    }).catch(error => {
      this.log(`Failed to retrieve temperature for: ${this.name}`);
      this.log(error);
      callback(error);
    });
  }

  getLowBatteryStatus(callback) {
    this.api.getSensors(this.id, 'thermometers').then(thermometer => {
      const lowBattery = thermometer.lowBattery === 'yes';

      if (lowBattery) {
        this.log(`Low battery level for thermometer: ${this.name}`);
      }

      callback(null, lowBattery);
    }).catch(error => {
      this.log(`Failed to retrieve battery state for: ${this.name}`);
      this.log(error);
      callback(error);
    });
  }
}
