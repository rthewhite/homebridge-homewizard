import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardDoorbell extends HomeWizardBaseAccessory {

  model = 'Doorbell';

  setupServices() {
    // Setup services
    const doorbellService = new this.hap.Service.Doorbell();
    this.programmableSwitchEvent = doorbellService.getCharacteristic(this.hap.Characteristic.ProgrammableSwitchEvent);
    this.programmableSwitchEvent.on('get', this.getProgrammableSwitchEvent.bind(this));

    this.services.push(doorbellService);
  }

  getProgrammableSwitchEvent(callback) {
    this.api.getStatus(this.id, 'kakusensors').then(sensor => {

      const pressed = this.recentDetection(sensor);
      const event = pressed ? 1 : 0;

      if (pressed) {
        this.log(`Retreived doorbell pressed on: ${this.name}`);
        setTimeout(function (me) {
          me.programmableSwitchEvent.setValue(0);
        }, 2000, this);
      }

      this.programmableSwitchEvent.setValue(event);
      callback(null, pressed);
    }).catch(error => {
      this.log(`Failed to retrieve doorbell switch event for:${this.name}`);
      this.log(error);
      callback(error);
    });
  }

  identify(callback) {
    this.log(`Identify ${this.name}...`);
    const previous = this.programmableSwitchEvent.value;
    this.programmableSwitchEvent.setValue(1 - previous);
    setTimeout(function (me, value) {
      me.programmableSwitchEvent.setValue(value);
    }, 1000, this, previous);
    callback();
  }
}
