var logger = require("electron-log");
var Serialport = require("serialport");
// Import events module
var events = require("events");
var util = require("util");
var debug = require("debug")("electron-cordova-bluetoothserial:port");
var crypto = require("crypto");

function Port() {
  this._connected = false;
  this._port = null;
  this._channel = "";
  this._serialData = [];
  events.EventEmitter.call(this);
  this._retry = 0;
  this._maxRetries = 5;
  this._devices = [];
  // init device list
  this.list();
}
util.inherits(Port, events.EventEmitter);

Port.prototype.open = function(id, cb) {
  var self = this;
  var port = "";
  self._devices.forEach(function(item) {
    if (item.id === id) {
      port = item.channel;
    }
  });

  if (!port) {
    cb(new Error("port not specified"));
    return;
  }

  // if port has changed
  if (self._channel !== port || !self._connected) {
    debug("open port " + port);
    self._port = new Serialport(port, {
      baudRate: 9600,
      parity: "none",
      stopBits: 1,
      dataBits: 8,
      autoOpen: false,
      parser: Serialport.parsers.raw,
      bufferSize: 250
    });

    self._port.on("close", function(err) {
      self._connected = false;
      self._serialData = [];
    });

    self._port.on("disconnect", function(err) {
      debug("disconnect event");
      self._connected = false;
      self._serialData = [];
    });

    // open errors will be emitted as an error event
    self._port.on("error", function(err) {
      debug(err);
      self.disconnect();
      self.emit("error", err);
    });

    self._port.on("data", function(data) {
      debug("<<");
      debug(data);
      self._serialData.push(data);
      self.emit("data", data);
    });

    self.tryOpenPort(cb);

    self._channel = port;
  } else {
    cb(null);
  }
};

Port.prototype.tryOpenPort = function(cb) {
  var self = this;
  if (self._port && self._retry < self._maxRetries) {
    setTimeout(function() {
      self._port.open(function(err) {
        if (err) {
          debug("open failed. retry " + (self._retry + 1));
          self.tryOpenPort(cb);
        } else {
          debug("port open!");
          self._retry = 0;
          self._port.flush();
          self._connected = true;
          if (cb) {
            cb(null);
          }
        }
      });
    }, self._retry * 500);
    self._retry++;
  } else {
    self._retry = 0;
    if (cb) {
      cb(new Error("Cannot open port"));
    }
  }
};

Port.prototype.list = function(cb) {
  var self = this;
  self._devices = [];
  Serialport.list(function(err, ports) {
    ports.forEach(function(port) {
      var id = crypto
        .createHash("sha1")
        .update(port.comName)
        .digest("hex");
      self._devices.push({
        name: port.comName,
        id: id,
        address: port.comName,
        channel: port.comName
      });
    });
    if (cb) {
      cb(self._devices);
    }
  });
};

Port.prototype.clear = function() {
  debug("clear");
  var self = this;
  if (self._port.isOpen()) {
    self._port.drain();
    self._port.flush();
  }
  self._serialData = [];
};

Port.prototype.disconnect = function(cb) {
  var self = this;
  debug("disconnect");
  if (self.port && self._port.isOpen()) {
    // debug("close port");
    self._port.close();
  }
  if (cb) {
    cb(null);
  }
};

Port.prototype.write = function(data, cb) {
  var self = this;
  if (!self._connected) {
    self.tryOpenPort(function(err) {
      if (err) {
        debug("not connneced");
        return cb(new Error("Not connected."));
      } else {
        self.writeData(data, cb);
      }
    });
    return;
  }
  self.writeData(data, cb);
};

Port.prototype.writeData = function(data, cb) {
  var self = this;
  debug(">>");
  debug(new Buffer(data));
  self._port.write(new Buffer(data), function(err) {
    cb(err);
  });
  self._port.drain();
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
