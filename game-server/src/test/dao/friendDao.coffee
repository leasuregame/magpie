require './setup'
app = require('pomelo').app
dao = app.get('dao')
should = require 'should'

describe 'Friend Data Access Object', ->
  playerId = 1
  friendId = 2
  
  describe '#create', ->
    it 'should can add a friend record', ->
      dao.friend.create data: {playerId: playerId, friendId: friendId}, (err, res) ->
        res.should.eql('')