storage = require('../model/storage')()
should = require 'should'
KEY = '_KEY_'


# describe 'storage for mamcached', ->
#   it '.load(), invalid parameter type: key must be an Array', ->
#     storage.load KEY, (err, data) ->
#       err.should.eql({code: -1, msg: '系统错误。'})
#       should.strictEqual undefined, data

#   it '.load(), not exsit keys', ->
#     storage.load [KEY], (err, data) ->
#       should.strictEqual null, err


#   it '.save()', ->
#     storage.save KEY, 'test_value', (err, data) ->
#       should.strictEqual undefined, err
#       console.log data
#       data.should.be.ok
#       throw new Error('not called.')

#   it '.laod()', ->
#     storage.add KEY, 'test_value', (err, data) ->
#     storage.load [KEY], (err, data) ->
#       should.strictEqual null, err
#       data.should.be.equal 'test_value'

