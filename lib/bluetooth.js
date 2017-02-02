var BluetoothSerialPort = require('bluetooth-serial-port');

function listPairedDevices(cb) {
  var device = new BluetoothSerialPort.BluetoothSerialPort();
  device.listPairedDevices(function(devices) {
    cb(null, devices);
  });
}

module.exports = BluetoothSerialPort;
module.exports.listPaired = listPairedDevices;
