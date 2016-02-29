import 'babel-polyfill';
import {HomeWizardBaseAccessory} from './accessory';

export class HomeWizardRadiatorValve extends HomeWizardBaseAccessory {

  // HW support actually only Radiator valve Smartwares SHS-53000
  manufacturer = 'Smartwares';
  model = 'SHS-53000';

  thermometer = {
    id: -1,
    name: 'Unknown'
  };

  /* Attention :
     it is not possible to obtain the value of the internal temperature sensor
     of the valve, you have the possibility in the configuration file
     to map a real thermometer to each valve
     using an additional entry names "valves" with an hashTable
     like "valves": {"ValveX":"ThermometerForX", "ValveY":"ThermometerForY"}
     and you will have a true Thermostat
  */

  setupServices() {
    // Setup services
    const valveService = new this.hap.Service.Thermostat();

    valveService
      .setCharacteristic(this.hap.Characteristic.CurrentHeatingCoolingState, this.hap.Characteristic.CurrentHeatingCoolingState.HEAT);

    valveService
      .setCharacteristic(this.hap.Characteristic.TargetHeatingCoolingState, this.hap.Characteristic.TargetHeatingCoolingState.AUTO);

    valveService
      .setCharacteristic(this.hap.Characteristic.TemperatureDisplayUnits, this.hap.Characteristic.TemperatureDisplayUnits.CELSIUS);

    const characteristicTemp = valveService.getCharacteristic(this.hap.Characteristic.CurrentTemperature);
    // Make sure negative temps are working...
    characteristicTemp.props.minValue = -50;
    characteristicTemp.on('get', this.getCurrentTemperature.bind(this));

    valveService
      .getCharacteristic(this.hap.Characteristic.TargetTemperature)
      .on('get', this.getTargetTemperature.bind(this))
      .on('set', this.setTargetTemperature.bind(this));

    this.services.push(valveService);
    this._lookForThermometerInConfig();
  }

  _lookForThermometerInConfig() {
    if (this.thermometer.id !== -1) {
      return;
    }
    this.thermometer.id = 0;
    if (!this.config.valves) {
      this.log(`No entry valves found in config`);
      return;
    }
    if (!(this.name in this.config.valves)) {
      this.log(`No entry valve found in config for:${this.name}`);
      return;
    }
    const thermoName = this.config.valves[this.name];
    const url = 'telist';
    this.api.request({url}).then(data => {
      for (const thermo of data.response) {
        if (thermo.name === thermoName) {
          this.thermometer.id = thermo.id;
          this.thermometer.name = thermo.name;
          this.log(`Found thermometer for:${this.name} from:${this.thermometer.name} id:${this.thermometer.id}`);
          return;
        }
      }
      this.log(`No thermometer:${thermoName} found in config for:${this.name}`);
    }).catch(error => {
      this.log(`Failed telist`);
      this.log(error);
    });
  }

  getCurrentTemperature(callback) {
    if (this.thermometer.id > 0) {
      // from the currentTemperature of the thermometer
      this.api.getStatus(this.thermometer.id, 'thermometers').then(th => {
        this.log(`Retrieved temperature for:${this.name} from:${this.thermometer.name} its:${th.te} degrees`);
        callback(null, th.te);
      }).catch(error => {
        this.log(`Failed to retrieve temperature for:${this.name} from:${this.thermometer.name}`);
        this.log(error);
        callback(error);
      });
    } else {
      // equals the target value of the valve
      this.api.getStatus(this.id, 'switches').then(sw => {
        this.log(`Retrieved default temperature from target for:${this.name} its:${sw.tte} degrees`);
        callback(null, sw.tte);
      }).catch(error => {
        this.log(`Failed to retrieve target temperature for:${this.name} `);
        this.log(error);
        callback(error);
      });
    }
  }

  getTargetTemperature(callback) {
    this.api.getStatus(this.id, 'switches').then(sw => {
      this.log(`Retrieved target temperature for:${this.name} its:${sw.tte}`);
      callback(null, sw.tte);
    }).catch(error => {
      this.log(`Failed to retrieve target temperature for:${this.name}`);
      this.log(error);
      callback(error);
    });
  }

  setTargetTemperature(temp, callback) {
    const value = temp.toFixed(1);
    const url = `sw/${this.id}/settarget/${value}`;

    this.api.request({url}).then(() => {
      this.log(`set target temperature for:${this.name} to:${value}`);
      callback();
    }).catch(error => {
      this.log(`Failed to set target temperature for:${this.name} to:${value}`);
      this.log(error);
      callback(error);
    });
  }
}
