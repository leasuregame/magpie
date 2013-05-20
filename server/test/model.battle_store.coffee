store = require '../model/battle_store'
should = require 'should'

describe 'battle store', ->
  it 'invalid key, whitespace', ->
    store.setData 'a b c', 'value', (err, data) ->
      console.log arguments
      err.should.be.instanceOf(Error)
      should.strictEqual undefined, data

  it '.setData()', ->
    store.setData 'test_key', 'test_value', (err, data) ->
      should.strictEqual undefined, err
      data.should.be.ok

  it '.getData()', ->
    store.getData 'test_key', (err, data) ->
      should.strictEqual undefined, err
      data.should.be.equal 'test_value'

  it '.getData(), not exist key', ->
    store.getData 'not_exist_key', (err, data) ->
      should.strictEqual undefined, err
      data.should.not.be.ok

  it '.delData()', ->
    store.delData 'test_key', (err, data) ->
      should.strictEqual undefined, err
      data.should.be.ok

    store.getData 'test_key', (err, data) ->
      should.strictEqual undefined, err
      data.should.not.be.ok

  it '.delData(), not exist key', ->
    store.delData 'not_exist_key', (err, data) ->
      should.strictEqual undefined, err
      data.should.not.be.ok      

  it '.setData(), .getData() and .delData()', ->
    store.setData 'test_key1', {test: 'value'}, (err, data) ->
      should.strictEqual(undefined, err)
      data.should.be.ok

    store.getData 'test_key1', (err, data) ->
      should.strictEqual undefined, err
      data.should.be.a 'string'
      JSON.parse(data).should.be.eql {test: 'value'}

    store.delData 'test_key1', (err, data) ->
      should.strictEqual undefined, err
      data.should.be.ok

    store.getData 'test_key1', (err, data) ->
      should.strictEqual undefined, err
      data.should.not.be.ok            


