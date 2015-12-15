import chai from 'chai';
import sinon from 'sinon';

import platform from './../src/platform';
import {HomewizardPlatform} from './../src/platform';

const expect = chai.expect;

describe('Register platform with homebridge', () => {
  it('platform should be an function', () => {
    expect(platform).to.be.a('function');
  });

  it('platform should register the homewizard platform when called', () => {
    const spy = sinon.spy();
    const homebridge = {registerPlatform: spy};

    // Initialize platform
    platform(homebridge);
    expect(spy.calledWith('homebridge-homewizard', 'HomeWizard', HomewizardPlatform)).to.equal(true);
  });
});

// describe('Class HomeWizardPlatform', () => {
//   // Instantiate class before each test
//   beforeEach(() => {
//
//   });
// });
