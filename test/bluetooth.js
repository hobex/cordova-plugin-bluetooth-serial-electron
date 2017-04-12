var expect = require('chai').expect;
var bt = require('./../lib/bluetooth');

describe('Bluetooth - serialport', function() {
  describe("List", function() {

    it('should return hobex serial ports', function(done) {
      bt.list(function(devices) {
        console.log(devices);
        done();
      });
    });
  });


  describe("Spire", function() {
    it("should connect", function(done) {
      var l = new bt();
      l.open("/dev/cu.HOBEX-10008299-SerialPo", function(err) {
        if (err) {
          console.log(err);
          return done(err);
        }
        console.log("connected");
        var b = new Buffer("41134", "binary");
        l.write(b, function(err) {
          setTimeout(function() {
            l.disconnect(function(err) {
              done();
            });
          }, 1000);

        });
      });
    });
  });

});
