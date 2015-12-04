# homebridge-homewizard
This plugin will add platform support for HomeWizard to Homebridge.
And therefore give you the ability to control all devices and sensors attached to your HomeWizard with Siri!

This plugin is still under development. Supported devices are listed below.

If you are interested in helping out, or would like to see support for something let me know!

## Current supported devices:
- Switches
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
All help developing this plugin is welcome. Currently the plugin is in a very alpha stage with limited
support. There aren't any unit tests and there is only support for switches and thermometers.

homebridge-homewizard is written in ES6 and transpiled using Babel. Things that are on the TODO list:

- setup Travis CI
- upgrade to Babel 6
- Add unit tests
- Implement more devices
- Add battery status to thermometers
- Improve documentation

### Adding device support
If you want to add support for new devices, you will need to create a new accessory class in
the accessories folder. See for example switch or thermometer, next to that you will need to make
the accessories factory in accessories.js aware of you new device type. The factory receives the entire
response of the get-sensors call from the HomeWizard which lists all devices.
