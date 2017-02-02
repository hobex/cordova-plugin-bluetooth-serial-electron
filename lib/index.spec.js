/* global describe, it */

var expect = require('chai').expect
var cordovaPluginBluetoothSerialElectron = require('./index')

describe('cordova plugin bluetooth serial electron', function () {
  it('should export a function', function () {
    expect(cordovaPluginBluetoothSerialElectron).to.be.a('function')
  })
})
