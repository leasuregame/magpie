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

  it '.del(), exist key', ->
    base.del key_2, (err, data) ->
      should.strictEqual(undefined, err)
      data.should.be.ok

  it '.del(), not exist key', ->
    base.del 'not_exist_key', (err, data) ->
      should.strictEqual(undefined, err)
      data.should.not.be.ok

  it '.add(), exist key', ->
    base.add key_1, val_1, (err, data) ->
      err.should.eql not_stored_err
      data.should.not.be.ok

  it '.set(), new key', ->
    base.set key_2, val_1, (err, data) ->
      should.strictEqual undefined, err
      data.should.be.ok

    base.del key_2, (err, data) ->
      should.strictEqual(undefined, err)
      data.should.be.ok

  it '.set(), exist key', ->
    base.set key_2, 'new value', (err, data) ->
      should.strictEqual undefined, err
      data.should.be.ok

    base.get key_2, (err, data) ->
      should.strictEqual undefined, err
      data.should.be.equal 'new value'

    base.del key_2, (err, data) ->
      should.strictEqual(undefined, err)
      data.should.be.ok

  it '.get(), not exsit key', ->
    base.get 'not_exsit_key', (err, data) ->
      should.strictEqual(undefined, err)
      data.should.not.be.ok

  it 'get()', ->
    base.get key_1, (err, data) ->
      should.strictEqual(undefined, err)
      data.should.be.equal val_1

  it '.set(), json', ->
    base.set key_2, {a: 1, b: 2}, (err, data) ->
      should.strictEqual(undefined, err)
      data.should.be.ok

    base.get key_2, (err, data) ->
      should.strictEqual undefined, err
      data.should.be.equal '{"a":1,"b":2}'

    base.del key_2, (err, data) ->
      should.strictEqual(undefined, err)
      data.should.be.ok

  it '.getJson()', ->
    base.set key_2, {a: 1, b: 2}, (err, data) ->
      should.strictEqual(undefined, err)
      data.should.be.ok

    base.getJson key_2, (err, data) ->
      should.strictEqual undefined, err
      data.should.eql {a: 1, b: 2}

    base.del key_2, (err, data) ->
      should.strictEqual(undefined, err)
      data.should.be.ok
  