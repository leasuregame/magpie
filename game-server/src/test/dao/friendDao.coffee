require './setup'
app = require('pomelo').app
dao = app.get('dao')
should = require 'should'

describe 'Friend Data Access Object', ->
  playerId = 1
  friendId = 2
  
  describe '#create', ->
    # it 'should can add a friend record', ->
    #   dao.friend.create data: {playerId: playerId, friendId: friendId}, (err, res) ->
    #     console.log err, res, '000000'
    #     res.should.be.ok

  describe '#getFriends', ->
    it 'should can get friends', ->
      dao.friend.getFriends 1, (err, res) ->
        console.log err, res, 'get frendi .s..sa.s..ds.'
        