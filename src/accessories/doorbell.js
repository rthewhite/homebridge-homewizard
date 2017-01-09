import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardDoorbell extends HomeWizardBaseAccessory {

  model = 'Doorbell';

  setupServices() {
    // Setup services
    const doorbellService = new this.hap.Service.Doorbell();
    doorbellService
      .getCharacteristic(this.hap.Characteristic.ProgrammableSwitchEvent)
      .on('get', this.getSwitchEvent.bind(this));

    this.services.push(doorbellService);
  }

  getSwitchEvent(callback) {
    this.api.getStatus(this.id, 'kakusensors').then(sensor => {
      const pressed = sensor.status === 'no' ? 0 : 1;

      if (pressed === 1) {
        this.log(`Button pressed on doorbell:${this.name}`);
      }

      callback(null, pressed);
    }).catch(error => {
      this.log(`Failed to retrieve doorbell switch event for:${this.name}`);
      this.log(error);
      callback(error);
    });
  }
}
