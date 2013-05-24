storage = require('../model/storage')()
should = require 'should'

describe 'storage for mamcached', ->
  it '.load(), invalid parameter type: key must be an Array', ->
    storage.load 'test_key', (err, data) ->
      err.should.eql({code: -1, msg: '系统错误。'})
      should.strictEqual undefined, data

  it '.load(), not exsit keys', ->
    storage.load ['test_key'], (err, data) ->
      # 没有调用该回调函数
      throw new Error('not called.')

  it '.save()', ->
    storage.save 'test_key', 'test_value', (err, data) ->
      should.strictEqual undefined, err
      console.log data
      data.should.be.ok
      throw new Error('not called.')

  it '.laod()', ->
    storage.save 'test_key', 'test_value', (err, data) ->
    storage.load ['test_key'], (err, data) ->
      # 没有调用该回调函数
      throw new Error('not called.')
