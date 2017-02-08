var bl = require('./bluetooth');

module.exports = function(ipc) {


  // subscribe to data
  ipc.on('bl~subscribe', function(event) {});


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
    bt.clear(function() {
      event.sender.send('bl~cleared');
    });
  });

  ipc.on('bl~read', function(event) {

  });

  ipc.on('bl~write', function(event, data) {
    bt.write(data, function(err, bytesWritten) {
      event.sender.send('bl~written', bytesWritten);
    });
  });


};
