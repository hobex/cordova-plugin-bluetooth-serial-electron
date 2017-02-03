var logger = require('electron-log');
var BluetoothSerialPort = require('bluetooth-serial-port');
var device = new BluetoothSerialPort.BluetoothSerialPort();
var connected = false;

function listPairedDevices(cb) {
  device.listPairedDevices(function(devices) {
    cb(devices);
  });
}

function connect(mac, cb) {
  device.findSerialPortChannel(mac, function(channel) {
    logger.info("mac " + mac);
    logger.info("channel " + channel);
    device.connect(mac, channel, function() {
      connected = true;
      cb(null);
    }, function(err) {
      connected = false;
      cb(err);
    });
  }, function(err) {
    connected = false;
    cb(err);
  });

}

function disconnect(cb) {
  // close the connection when you're ready
  device.close();
  connected = false;
  cb(null);
}

function write(data, cb) {
  if (isConnected()) {
    device.write(data, function(err, bytesWritten) {
      logger.info(bytesWritten + " bytes written");
      cb(err, bytesWritten);
    });
    return;
  }
  cb(null);
}

function isConnected() {
  return device.isOpen();
}


module.exports = device;
module.exports.listPaired = listPairedDevices;
module.exports.connect = connect;
module.exports.disconnect = disconnect;
module.exports.isConnected = isConnected;
module.exports.write = write;
