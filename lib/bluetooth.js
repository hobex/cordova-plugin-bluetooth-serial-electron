var logger = require('electron-log');
var Serialport = require('serialport');
// Import events module
var events = require('events');
var util = require('util');
var debug = require('debug')('electron-cordova-bluetoothserial:port');
var devices = [];
var crypto = require('crypto');

function Port() {
  this._connected = false;
  this._port = null;
  this._serialData = [];

  events.EventEmitter.call(this);

}
util.inherits(Port, events.EventEmitter);


Port.prototype.open = function(id, cb) {
  var self = this;
  var port = "";
  devices.forEach(function(item) {
    if (item.id === id) {
      port = item.channel;
    }
  });
  debug('open port ' + port);
  self._port = new Serialport(port, {
    baudRate: 9600,
    parity: 'none',
    stopBits: 1,
    dataBits: 8,
    autoOpen: false,
    parser: Serialport.parsers.raw,
    bufferSize: 250
  });

  self._port.on('open', function(err) {
    debug('open');
    self._connected = true;
    cb(err);
  });

  self._port.on('close', function(err) {
    self._connected = false;
  });

  self._port.on('disconnect', function(err) {
    debug("disconnect event");
  });

  // open errors will be emitted as an error event
  self._port.on('error', function(err) {
    debug(err);
    self._connected = false;
    if (self._port.isOpen()) {
      self._port.close();
    }
    self.emit('error', err);
  });

  self._port.on('data', function(data) {
    debug("<<");
    debug(data);
    self._serialData.push(data);
    self.emit('data', data);
  });

  self._port.open();
};

Port.list = function(cb) {
  devices = [];
  Serialport.list(function(err, ports) {
    ports.forEach(function(port) {
      var id = crypto.createHash('sha1').update(port.comName).digest('hex');
      devices.push({
        name: port.comName,
        id: id,
        address: port.comName,
        channel: port.comName,
      });
    });
    cb(devices);
  });
};

Port.prototype.clear = function() {
  debug("clear");
  var self = this;
  self._serialData = [];
  self._port.flush();
};


Port.prototype.disconnect = function(cb) {
  var self = this;
  debug("disconnect");

  if (self._port.isOpen()) {
    // close the connection when you're ready
    self._port.close(function(err) {
      self._connected = false;
      cb(err);
    });
  } else {
    self._connected = false;
    cb(null);
  }
};


Port.prototype.write = function(data, cb) {
  var self = this;
  if (!self._connected ||  !self._port.isOpen()) {
    return cb(new Error("Not connected."));
  }
  debug(">>");
  debug(new Buffer(data));
  var s;
  var etx = false;
  for (var i = 0; i < data.length; i++) {
    self._port.write([data[i]]);
  }
  self._port.drain(function(err) {
    cb(err);
  });
};

Port.prototype.isConnected = function() {
  var self = this;
  return self._connected;
};

Port.prototype.read = function(length) {
  var self = this;
  return self._serialData.splice(0, length);
};


module.exports = Port;
