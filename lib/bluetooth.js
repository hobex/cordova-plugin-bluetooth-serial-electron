var logger = require('electron-log');
var connected = false;
var devices = [];
var Serialport = require('serialport');
var port;
var serialData = [];
// Import events module
var events = require('events');

// Create an eventEmitter object
var eventEmitter = new events.EventEmitter();


function listPairedDevices(cb) {
  devices = [];
  Serialport.list(function(err, ports) {
    ports.forEach(function(port) {
      if (port.comName.indexOf('HOBEX') > -1) {
        console.log(port);
        devices.push({
          name: port.comName,
          id: port.comName,
          address: port.comName,
          channel: port.comName,
        });
      }
    });
    cb(devices);
  });
}

function connectBt(mac, cb) {
  port = new Serialport(mac, {
    baudRate: 9600,
    parity: 'none',
    stopBits: 1,
    dataBits: 8
  });

  port.on('open', function() {
    connected = true;
    cb(null);
  });

  // open errors will be emitted as an error event
  port.on('error', function(err) {
    connected = false;
    cb(err);
  });

  port.on('data', function(data) {
    console.log(data);
    serialData.push(data);
    eventEmitter.emit('data', data);
  });
}

function disconnect(cb) {
  // close the connection when you're ready
  port.close();
  connected = false;
  cb(null);
}

function write(data, cb) {
  port.write(data, cb);
}

function isConnected() {
  return connected;
}

function read(length) {
  return serialData.splice(0, length);
}

module.exports = eventEmitter;
module.exports.listPaired = listPairedDevices;
module.exports.connectBt = connectBt;
module.exports.disconnect = disconnect;
module.exports.isConnected = isConnected;
module.exports.write = write;
module.exports.read = read;
