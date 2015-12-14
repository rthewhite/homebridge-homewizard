[![travis][travis-image]][travis-url]
[![Coverage Status](https://coveralls.io/repos/rthewhite/homebridge-homewizard/badge.svg?branch=master&service=github)](https://coveralls.io/github/rthewhite/homebridge-homewizard?branch=master)
[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]

[travis-image]: https://img.shields.io/travis/rthewhite/homebridge-homewizard.svg?style=flat
[travis-url]: https://travis-ci.org/rthewhite/homebridge-homewizard
[npm-image]: https://img.shields.io/npm/v/homebridge-homewizard.svg?style=flat
[npm-url]: https://npmjs.org/package/homebridge-homewizard
[downloads-image]: https://img.shields.io/npm/dm/homebridge-homewizard.svg?style=flat
[downloads-url]: https://npmjs.org/package/homebridge-homewizard

# homebridge-homewizard
This plugin will add platform support for HomeWizard to Homebridge.
And therefore give you the ability to control all devices and sensors attached to your HomeWizard with Siri!

If you are interested in helping out, or would like to see support for something let me know!

## Current supported devices:
- Switches
- Dimmers
- Thermometers

## Install guide
First follow the instructions to install homebridge: https://github.com/nfarina/homebridge

If you have Node and NPM setup basically:
```
npm install -g homebridge
```

Once you have homebridge installed, install this plugin:

```
npm install -g homebridge-homewizard
```

Now you will have to setup your config.json for homebridge. An example
is included in this repo.

## Post install
When you have installed homebridge and homebridge-homewizard and got them running
and setup on your iOS device. All devices that homebridge-homewizard currently
supports should popup on your iOS device as accessories in Homekit.


## Developing
All help developing this plugin is welcome. Homebridge-homewizard is written in ES6 and transpiled using Babel.

### Adding device support
If you want to add support for new devices, you will need to create a new accessory class in
the accessories folder. See for example switch or thermometer, next to that you will need to make
the accessories factory in accessories.js aware of you new device type. The factory receives the entire response of the get-sensors call from the HomeWizard which lists all devices.

## Changelog
- 0.0.15 - Fixed issue where multiple api calls at the same time would fail, they are being queued now
- 0.0.12 - First stable release
