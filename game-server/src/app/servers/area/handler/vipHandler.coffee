playerManager = require '../../../manager/playerManager'
table = require '../../../manager/table'
utility = require '../../../common/utility'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::buyVip = (msg, session, next) ->
  