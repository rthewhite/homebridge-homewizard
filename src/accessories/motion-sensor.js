import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardMotionSensor extends HomeWizardBaseAccessory {

  model = 'Motion sensor';

  setupServices() {
    // Setup services
    const motionSensorService = new this.hap.Service.MotionSensor();
    motionSensorService
      .getCharacteristic(this.hap.Characteristic.MotionDetected)
      .on('get', this.getMotionState.bind(this));

      // Add battery status to services
    motionSensorService
      .addCharacteristic(new this.hap.Characteristic.StatusLowBattery()) //eslint-disable-line
      .on('get', this.getLowBatteryStatus.bind(this));

    this.services.push(motionSensorService);
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

  getMotionState(callback) {
    this.getCurrentValues().then(sensor => {
      const motion = sensor.status === 'yes';

      if (motion) {
        this.log(`Detected motion at sensor: ${this.name}`);
      }

      callback(null, motion);
    });
  }

  getLowBatteryStatus(callback) {
    this.api.request({url: 'get-sensors'}).then(data => {
      const thermometer = data.response.kakusensors.find(sensor => {
        return sensor.id === this.id;
      });

      const lowBattery = thermometer.lowBattery === 'yes';

      if (lowBattery) {
        this.log(`Low battery level for motion sensor: ${this.name}`);
      }

      callback(null, lowBattery);
    });
  }
}
