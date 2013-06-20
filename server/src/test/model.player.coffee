Player = require '../model/player'
util = require 'util'

describe 'Player Model', ->
  describe 'static methods', ->
    it 'create', ->
      Player.create {id: 'key1', name: 'value'}, (err, result) ->
        console.log err, result

      Player.remove 'key1', (err, result) ->
        console.log err, result 
