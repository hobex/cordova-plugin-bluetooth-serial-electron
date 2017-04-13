var myBt = require('./bluetooth');
var debug = require('debug')('electron-cordova-bluetoothserial:ipc');

module.exports = function(ipc) {
  var bl = new myBt();
  var sender;

  bl.on('data', function(data) {
    sender.send('bl~data', data);
  });
  // subscribe to data
  ipc.on('bl~subscribe', function(event) {
    sender = event.sender;
  });


  ipc.on('bl~list', function(event, arg) {
    myBt.list(function(res) {
      event.sender.send('bl~devices', res);
    });
  });

  ipc.on('bl~connect', function(event, mac) {
    bl.open(mac, function(err) {
      event.sender.send('bl~connected', err);
    });
  });

  ipc.on('bl~isConnected', function(event) {
    var res = bl.isConnected();
    event.sender.send('bl~isConnected', res);
  });

  ipc.on('bl~disconnect', function(event) {
    bl.disconnect(function() {
      event.sender.send('bl~disconnected');
    });
  });

  ipc.on('bl~clear', function(event) {
    bl.clear(function() {
      event.sender.send('bl~cleared');
    });
  });

  ipc.on('bl~write', function(event, data) {
    debug(data);
    bl.write(data, function(err) {
      event.sender.send('bl~written', err);
    });
  });


};
