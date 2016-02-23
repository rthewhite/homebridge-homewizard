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
- Motion sensors
- Light sensors
- Somfy shutters (thanks to: ygageot)

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

## Config
Below is an example configuration for Homebridge. To run the HomeWizard plugin you need to add the
platform object in the platforms array like below. The accessories array, has not functionality
regarding the HomeWizard plugin and is used by Homebridge for other plugins etc.

Options:
- platform: should always be HomeWizard
- url: The url to your HomeWizard
- password: The password of your HomeWizard
- filtered(optional): Array of accessories that will be ignored by the plugin. If you have a switch in your
HomeWizard you don't want to expose to Siri. Put the name in here and it will be ignored.
- debug(optional): when set to true enables some extra logging regarding the http requests, usefull for debugging

```
{
  "bridge": {
      "name": "Homebridge - DEV",
      "username": "CC:22:3D:E3:CE:40",
      "port": 51826,
      "pin": "031-45-156"
  },
  "description": "Example configuration for Homebridge using the HomeWizard platform.",
  "accessories": [],
  "platforms": [{
      "platform": "HomeWizard",
      "url": "http://192.168.1.155",
      "password": "<yourhomewizardpassword>",
      "filtered": ["deviceName"],
      "debug": false
   }]
}
```

## Know issues
- When there are special characters being used in the password this might lead to problems connecting to the HomeWizard because of encoding issue.

## FAQ
- How do i update to a newer version of the plugin?
Run the following command, with sudo if needed on your platform:
```
npm update Homebridge-homewizard -g
```

- I'm having issues, now what?
Please make sure you are always running on the latest version of the plugin, use the above update command.
If you still have issues, please file a issue on Github explaining the issue you are running into.


## Developing
All help developing this plugin is welcome. Homebridge-homewizard is written in ES6 and transpiled using Babel.
Code styles are evaluated using Eslint to make sure all codes looks the same. If you need help to setup let me know.

### Adding device support
If you want to add support for new devices, you will need to create a new accessory class in
the accessories folder. See for example switch or thermometer, next to that you will need to make
the accessories factory in accessories.js aware of you new device type. The factory receives the entire response of the get-sensors call from the HomeWizard which lists all devices.

# Changelog
- 0.0.27 - Support added for Somfy shutters, thanks to: ygageot!
- 0.0.25 - Added support for klik aan klik uit motion sensors and light sensors
- 0.0.18 - Added possibility to filter out accessories based on name
- 0.0.15 - Fixed issue where multiple api calls at the same time would fail, they are being queued now
- 0.0.12 - First stable release
