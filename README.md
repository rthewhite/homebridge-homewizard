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
