"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HomeWizardBaseAccessory = function HomeWizardBaseAccessory(log, config, hap, sensor) {
  _classCallCheck(this, HomeWizardBaseAccessory);

  this.log = log;
  this.config = config;
  this.hap = hap;
  this.sensor = sensor;
};

exports.HomeWizardBaseAccessory = HomeWizardBaseAccessory;
