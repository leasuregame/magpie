async = require 'async'
playerManager = require '../../../manager/playerManager'
table = require '../../../manager/table'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::deposit = (msg, session, next) ->
  playerId = session.get('playerId')

  data = 
    playerId: playerId
    money: smg.money
    

