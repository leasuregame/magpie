base = require '../model/base'
should = require 'should'

key_1 = 'key_1'
key_2 = 'key_2'
val_1 = 'value_1'
not_stored_err = {"notStored":true}

describe 'DB base', ->
  beforeEach ->
    base.add key_1, val_1, (err, data) ->

  afterEach ->
    base.del key_1, (err, data) ->

  it '.add(), new key', ->
    base.add key_2, val_1, (err, data) ->
      should.strictEqual(undefined, err)
      data.should.be.ok

      base.del key_2, (err, data) ->
        should.strictEqual(undefined, err)
        data.should.be.ok

  it '.add(), exist key', ->
    base.add key_1, val_1, (err, data) ->
      err.should.eql not_stored_err
      data.should.not.be.ok

  
  