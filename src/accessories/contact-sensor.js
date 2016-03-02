import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardContactSensor extends HomeWizardBaseAccessory {

  model = 'Contact sensor';

  setupServices() {
    // Setup services
    const contactSensorService = new this.hap.Service.ContactSensor();
    contactSensorService
      .getCharacteristic(this.hap.Characteristic.ContactSensorState)
      .on('get', this.getContactSensorState.bind(this));

    this.services.push(contactSensorService);
  }

  getContactSensorState(callback) {
    this.api.getStatus(this.id, 'kakusensors').then(sensor => {
      const contact = sensor.status === null
        ? this.hap.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
        : this.hap.Characteristic.ContactSensorState.CONTACT_DETECTED;

      switch (contact) {
        case this.hap.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED:
          this.log(`Non detected contact at sensor:${this.name}`);
          break;
        case this.hap.Characteristic.ContactSensorState.CONTACT_DETECTED:
          this.log(`Detected contact at sensor:${this.name}`);
          break;
        default:
          break;
      }
      callback(null, contact);
    }).catch(error => {
      this.log(`Failed to retrieve contact state for:${this.name}`);
      this.log(error);
      callback(error);
    });
  }
}
