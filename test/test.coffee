expect    = require 'expect.js'
require('../lib/ProjectName-bundle.js')


describe "App", ->

  it "Passes Mocha Test", ->
    expect(3).to.be.a 'number'