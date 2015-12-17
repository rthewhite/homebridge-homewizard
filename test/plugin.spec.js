import chai from 'chai';
import sinon from 'sinon';
const expect = chai.expect;

import {HomeWizardPlatform} from './../src/platform';
import plugin from './../src/plugin';

describe('Plugin function', () => {
  it('plugin should export an function', () => {
    expect(plugin).to.be.a('function');
  });

  it('when plug function is called it should register the homewizard platform', () => {
    const spy = sinon.spy();
    const homebridge = {registerPlatform: spy};

    // Initialize platform
    plugin(homebridge);
    expect(spy.calledWith('homebridge-homewizard', 'HomeWizard', HomeWizardPlatform)).to.equal(true);
  });

  it('platform should expose homebridge globally', () => {
    const homebridge = {registerPlatform: () => {}};
    plugin(homebridge);
    expect(GLOBAL.homebridge).to.equal(homebridge);
  });
});
