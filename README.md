# Cordova Plugin Bluetooth Serial Electron

[![NPM version][npm-image]][downloads-url] [![NPM downloads][downloads-image]][downloads-url] [![Build status][travis-image]][travis-url] [![Test coverage][coveralls-image]][coveralls-url]

>

## Installation

```sh
npm install cordova-plugin-bluetooth-serial-electron --save
npm rebuild --runtime=electron --target=1.4.3 --disturl=https://atom.io/download/atom-shell --build-from-source
```

## Usage

You need to install the electron branch of my cordova-plugin-bluetooth-serial fork

```
npm install https://github.com/hobex/BluetoothSerial.git#electron --save
```

After that, require the module in your electron main and require the ipc to the module.

```javascript
var ipc = require('electron').ipcMain;
var cordovaPluginBluetoothSerialElectron = require('cordova-plugin-bluetooth-serial-electron')(ipc)
```

## License

MIT license

[coveralls-image]: https://img.shields.io/coveralls/rondoe/cordova-plugin-bluetooth-serial-electron.svg?style=flat
[coveralls-url]: https://coveralls.io/r/rondoe/cordova-plugin-bluetooth-serial-electron?branch=master
[downloads-image]: https://img.shields.io/npm/dm/cordova-plugin-bluetooth-serial-electron.svg?style=flat
[downloads-url]: https://npmjs.org/package/cordova-plugin-bluetooth-serial-electron
[npm-image]: https://img.shields.io/npm/v/cordova-plugin-bluetooth-serial-electron.svg?style=flat
[npm-url]: https://npmjs.org/package/cordova-plugin-bluetooth-serial-electron
[travis-image]: https://img.shields.io/travis/rondoe/cordova-plugin-bluetooth-serial-electron.svg?style=flat
[travis-url]: https://travis-ci.org/rondoe/cordova-plugin-bluetooth-serial-electron
