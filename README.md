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

## Notice
I have switched platform and no longer have a HomeWizard in my possession. I believe the plugin is currently quite feature complete and works correctly so feel free to keep using it and off course pull requests are always welcome!

If you have any issues i will try to help you out the best way i can.

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
- Window Covering (Somfy, HomeWizard, ASUN) (thanks to: ygageot)
- Philips HUE (thanks to: ygageot)
- Radiator Valves (thanks to: ygageot)
- Smoke sensors (thanks to: ygageot)
- Contact sensors (thanks to: ygageot)
- Heatlink (thanks to: ygageot)
- HomeWizard scenes
- HomeWizard presets
- Doorbells (thanks to: ygageot)

## Install guide
First follow the instructions to install homebridge: https://github.com/nfarina/homebridge

If you have Node and NPM setup basically:
```bash
npm install -g homebridge
```

Once you have homebridge installed, install this plugin:

```bash
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
- valves(optional): object mapping valve name to thermometer name, the valves supported by the HW don't have an temperature meter in them. By using a thermometer in the same room you can use them as a thermostat, if you don't specify a thermometer the currentTemperature reported by the valve will be the same as the set target temperature.
- heatlinks(optional): integer value with the duration (minutes) for your change of the target temperature with HeatLink. The default value is 60 minutes. If you choose 0 it will be an infinite duration.
- switchTypes(optional): by default the plugin will assume that switches are lightbulbs, which is the case for
a lot of people. This will cause Siri to turn of all switches when you see turn of the lights. If you have
switches that are not lights, here you can specify their type and Siri will treat them accordingly.
Available types are: fan, outlet, switch, lightbulb.
- createPresetSwitches (optional): create switches for the HomeWizard presets. Default is true.
- presetNames (optional): names used to create the preset switches. If not set in the config the default names will be used like in the example config.
- pushServer (optional): periodicly the plugin will request the HW statuses and refreh all in HomeKit. By default it is done every minute, you can change it with a parameter period (default 1 minute)
  If you have doorbells, contact sensors, smoke sensors,... and need to inform HomeKit IMMEDIATLY, you will need to ask in the plugin the activation of  http and/or udp server with free ports in your network to listen, to add in your HW app an IP virtual switch configured for emitting "http://ip_address_of_plugin_host:choosen_http_port" for open or close event and in HW tasks fire this virtual switch when event occurs, if you prefer udp you will broadcast any message to the choosen udp port. The advantage of http choice is the possibility to check it with browser or from external host. By default these servers are not activated because you must choose unused ports.
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
      "filtered": ["accessoryName"],
      "debug": false,
      "valves": {
        "livingroom radiator": "livingroom thermometer"
      },
      "heatlinks" : 0,
      "switchTypes": {
        "accessoryName": "fan",
        "accessoryName": "outlet",
        "accessoryName": "switch",
        "accessoryName": "lightbulb"
      },
      "createPresetSwitches": true,
      "presetNames": {
        "home": "Home Preset",
        "away": "Away Preset",
        "sleep": "Sleep Preset",
        "holiday": "Holiday Preset"
      },
      "createSceneSwitches": true,
      "pushServer": {"http": 8087, "udp": 33333, "period": 5}
   }]
}
```

## Known issues
- When there are special characters being used in the password this might lead to problems connecting to the HomeWizard because of an encoding issue.

## FAQ
- How do I update to a newer version of the plugin?
Run the following command, with sudo if needed on your platform:
```bash
npm update homebridge-homewizard -g
```

- I'm having issues, now what?
Please make sure you are always running the latest version of the plugin by using the update command above.
If you still have issues, please file an issue on Github explaining the issue you are running into.


## Developing
All help developing this plugin is welcome. Homebridge-homewizard is written in ES6 and transpiled using Babel.
Code styles are evaluated using Eslint to make sure all code looks the same. If you need help to setup, let me know.

### Adding device support
If you want to add support for new devices, you will need to create a new accessory class in
the accessories folder. See for example [switch](src/accessories/switch.js) or [thermometer](src/accessories/thermometer.js). Next to that you will need to make
the accessories factory in `accessories.js` aware of you new device type. The factory receives the entire response of the get-sensors call from the HomeWizard which lists all devices.

# Changelog
- 0.0.59 - Doorbell like a Doorbell with identify action
- 0.0.58 - Identity activation for lights and switches
- 0.0.57 - Fix issue where dimmers would go in dim mode when you turn them on again
- 0.0.56 - Doorbell like a switch
- 0.0.55 - eslint reactivation and push request activated by default
- 0.0.54 - bump version
- 0.0.53 - Push mode and doorbell support
- 0.0.52 - Added api call response logging for debug level
- 0.0.51 - Fix issue when there are no scenes
- 0.0.50 - Optimization for Asun sensor support, thanks to ygageot!
- 0.0.49 - HomeWizard scene support
- 0.0.47 - HomeWizard preset support
- 0.0.46 - Asun module support, thanks to ygageot!
- 0.0.44 - Added support for different switchTypes, see example config
- 0.0.43 - Fix for contact sensors
- 0.0.39 - HomeWizard curtains support, thanks to ygageot!
- 0.0.37 - Initial Heatlink support, thanks to ygageot!
- 0.0.33 - Contact sensor support, thanks to ygageot!
- 0.0.32 - Smoke sensor support, thanks to: ygageot!
- 0.0.31 - Radiator valve support, thanks to: ygageot!
- 0.0.30 - Code cleanup, enabled unit-testing
- 0.0.29 - Performance improvements, caching and re-using api calls to HW
- 0.0.28 - Support for Philips Hue, thanks to: ygageot!
- 0.0.27 - Support added for Somfy shutters, thanks to: ygageot!
- 0.0.25 - Added support for klik aan klik uit motion sensors and light sensors
- 0.0.18 - Added possibility to filter out accessories based on name
- 0.0.15 - Fixed issue where multiple api calls at the same time would fail, they are being queued now
- 0.0.12 - First stable release
