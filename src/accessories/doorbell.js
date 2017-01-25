import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardDoorbell extends HomeWizardBaseAccessory {

  model = 'Doorbell';

  setupServices() {
    // Setup services
    const doorbellService = new this.hap.Service.Switch();
    this.programmableSwitchEvent = doorbellService.getCharacteristic(this.hap.Characteristic.On);
    this.programmableSwitchEvent.on('get', this.getProgrammableSwitchEvent.bind(this));

    this.services.push(doorbellService);
  }

  getProgrammableSwitchEvent(callback) {
    this.api.getStatus(this.id, 'kakusensors').then(sensor => {

      const pressed = this.recentDetection(sensor);

      if (pressed) {
        this.log(`Retreived button pressed on: ${this.name}`);
        setTimeout(function (me) {
          me.programmableSwitchEvent.setValue(false);
        }, 2000, this);
      }

      this.programmableSwitchEvent.setValue(pressed);
      callback(null, pressed);
    }).catch(error => {
      this.log(`Failed to retrieve doorbell switch event for:${this.name}`);
      this.log(error);
      callback(error);
    });
  }
}
