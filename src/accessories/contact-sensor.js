import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardContactSensor extends HomeWizardBaseAccessory {

  model = 'Contact sensor';
  contactSensorState;

  setupServices() {
    // Setup services
    const contactSensorService = new this.hap.Service.ContactSensor();
    this.contactSensorState = contactSensorService.getCharacteristic(this.hap.Characteristic.ContactSensorState);
    this.contactSensorState.on('get', this.getContactSensorState.bind(this));

    this.services.push(contactSensorService);
  }

  getContactSensorState(callback) {
    this.api.getStatus(this.id, 'kakusensors').then(sensor => {
      const contact = sensor.status === 'yes'
      ? this.hap.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
      : this.hap.Characteristic.ContactSensorState.CONTACT_DETECTED;

      switch (contact) {
        case this.hap.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED:
          this.log(`Retrieved contact opened for: ${this.name}`);
          break;
        case this.hap.Characteristic.ContactSensorState.CONTACT_DETECTED:
          this.log(`Retrieved contact closed for: ${this.name}`);
          break;
        default:
          break;
      }
      this.contactSensorState.setValue(contact);
      callback(null, contact);
    }).catch(error => {
      this.log(`Failed to retrieve contact state for:${this.name}`);
      this.log(error);
      callback(error);
    });
  }
}
