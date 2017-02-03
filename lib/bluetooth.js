var BluetoothSerialPort = require('bluetooth-serial-port');
var device = new BluetoothSerialPort.BluetoothSerialPort();

function listPairedDevices(cb) {
  device.listPairedDevices(function(devices) {
    cb(null, devices);
  });
}

function connect(mac, cb) {
  device.connect(mac, function() {
    cb(null, true);
  }, function() {
    cb(null, false);
  });
}

function disconnect(cb) {
  device.disconnect(cb, cb);
}

module.exports = BluetoothSerialPort;
module.exports.listPaired = listPairedDevices;
module.exports.connect = connect;
module.exports.disconnect = disconnect;
