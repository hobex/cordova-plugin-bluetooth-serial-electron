var bl = require('./bluetooth');

module.exports = function(ipc) {
  ipc.on("bl~list", function(event, arg) {
    bl.listPaired(function(err, res) {
      event.sender.send("bl~devices", res);
    });
  });
};
