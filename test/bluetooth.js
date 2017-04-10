var expect = require('chai').expect;
var bt = require('./../lib/bluetooth');

describe('Bluetooth - serialport', function() {
  describe("List", function() {

    it('should return hobex serial ports', function(done) {
      bt.listPaired(function(devices) {
        console.log(devices);
        done();
      });
    });
  });


  describe("Spire", function() {
    it("should connect", function(done) {
      bt.connectBt("/dev/cu.HOBEX-10008299-SerialPo", function(err) {
        if (err) {
          console.log(err);
          return done(err);
        }
        var b = new Buffer("41134", "binary");
        bt.write(b, function(err) {
          setTimeout(function() {
            bt.disconnect(function(err) {
              done();
            });
          }, 1000);

        });
      });
    });
  });

});
