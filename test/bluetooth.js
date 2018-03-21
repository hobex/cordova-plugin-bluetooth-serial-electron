var expect = require('chai').expect;
var bt = require('./../lib/bluetooth');

describe('Bluetooth - serialport', function() {
  describe("List", function() {

    it('should return hobex serial ports', function(done) {
      this.timeout(30000);
      bt.list(function(devices) {
        console.log(devices);
        done();
      });
    });
  });


  describe("Spire", function() {
    it("should connect", function(done) {
      this.timeout(15000);
      var l = new bt();
      l.open("6626cc2db0925f29db7d8db50169c3cdcc91f27a", function(err) {
        if (err) {
          console.log(err);
          return done(err);
        }
        console.log("connected");
        // TX: 02 31 35 31 03 36 (bytes)
        // 2,49,53,49,3,54
        // var b = [0x05, 0x02, 0x31, 0x35, 0x31, 0x03, 0x36];
        var b = [0x05, 0x02, 0x49, 0x53, 0x49, 0x03, 0x54];
        l.write(b, function(err) {
          setTimeout(function() {
            l.disconnect(function(err) {
              done();
            });
          }, 10000);

        });
      });
    });
  });

});
