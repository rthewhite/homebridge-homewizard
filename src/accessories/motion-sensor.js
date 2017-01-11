import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardMotionSensor extends HomeWizardBaseAccessory {

  model = 'Motion sensor';

  setupServices() {
    // Setup services
    const motionSensorService = new this.hap.Service.MotionSensor();
    this.motionDetected = motionSensorService.getCharacteristic(this.hap.Characteristic.MotionDetected);
    this.motionDetected.on('get', this.getMotionState.bind(this));

      // Add battery status to services
    motionSensorService
      .addCharacteristic(new this.hap.Characteristic.StatusLowBattery()) //eslint-disable-line
      .on('get', this.getLowBatteryStatus.bind(this));

    this.services.push(motionSensorService);
  }

  getMotionState(callback) {
    this.api.getStatus(this.id, 'kakusensors').then(sensor => {
      const motion = this.recentDetection(sensor);

      if (motion) {
        this.log(`Retrieved detected motion for: ${this.name}`);
      }

      this.motionDetected.setValue(motion);
      callback(null, motion);
    }).catch(error => {
      this.log(`Failed to retrieve motion state for: ${this.name}`);
      this.log(error);
      callback(error);
    });
  }

  getLowBatteryStatus(callback) {
    this.api.getSensors(this.id, 'kakusensors').then(thermometer => {
      const lowBattery = thermometer.lowBattery === 'yes';

      if (lowBattery) {
        this.log(`Retrieved low battery level for: ${this.name}`);
      }

      callback(null, lowBattery);
    }).catch(error => {
      this.log(`Failed to retrieve battery state for: ${this.name}`);
      this.log(error);
      callback(error);
    });
  }
}
