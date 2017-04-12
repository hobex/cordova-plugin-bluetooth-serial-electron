var bl = require('./bluetooth');

module.exports = function(ipc) {


  // subscribe to data
  ipc.on('bl~subscribe', function(event) {
    bl.on('data', function(data) {
      event.sender.send('bl~data', data);
    });
  });


  ipc.on('bl~list', function(event, arg) {
    bl.listPaired(function(res) {
      event.sender.send('bl~devices', res);
    });
  });

  ipc.on('bl~connect', function(event, mac) {
    bl.connectBt(mac, function(err) {
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
    bl.write(data, function(err) {
      event.sender.send('bl~written', err);
    });
  });


};
