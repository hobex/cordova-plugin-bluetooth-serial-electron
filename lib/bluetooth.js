var logger = require('electron-log');
var btSerial = new(require('bluetooth-serial-port')).BluetoothSerialPort();
var connected = false;
var devices = [];
var bluetooth = require('node-bluetooth');

// create bluetooth device instance
var btDevice = new bluetooth.DeviceINQ();
var btConnection = null;

function listPairedDevices(cb) {
  devices = [];
  btDevice.listPairedDevices(function(pairedDevices) {
    pairedDevices.forEach(function(device) {
      console.log(device);
      device.services.forEach(function(service) {
        if (service.name === "Wireless iAP") {
          devices.push({
            name: device.name,
            id: device.address,
            address: device.address,
            channel: service.channel
          });
        }
      });
    });
    cb(devices);
  });
}

function connectBt(device, cb) {
  console.log(device);
  btDevice.findSerialPortChannel(device.address, function(channel) {
    bluetooth.connect(device.address, channel, function(err, connection) {
      if (err) {
        console.log(err);
        connected = false;
        cb(err);
        return;
      }
      logger.info("connected");
      btConnection = connection;
      connected = true;
      cb(null);
    });
  });

}

function disconnect(cb) {
  // close the connection when you're ready
  connected = false;
  btConnection = null;
  cb(null);
}

function write(data, cb) {
  if (isConnected()) {
    btConnection.write(data);
  }
  cb(null);
}

function isConnected() {
  return btConnection !== null;
}


module.exports = btSerial;
module.exports.listPaired = listPairedDevices;
module.exports.connectBt = connectBt;
// module.exports.disconnect = disconnect;
// module.exports.isConnected = isConnected;
module.exports.write = write;
