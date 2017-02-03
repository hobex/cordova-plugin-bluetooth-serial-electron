var bl = require('./bluetooth');

module.exports = function(ipc) {
  ipc.on('bl~list', function(event, arg) {
    bl.listPaired(function(err, res) {
      event.sender.send('bl~devices', res);
    });
  });

  ipc.on('bl~connect', function(event, mac) {
    bl.connect(mac, function(err, res) {
      event.sender.send('bl~connected', res);
    });
  });

  ipc.on('bl~disconnect', function(event) {
    bl.disconnect();
    event.sender.send('bl~disconnected');
  });
};
