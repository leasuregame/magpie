playerManager = require('pomelo').app.get('playerManager')
area = require '../../../domain/area/area'
logger = require('pomelo-logger').getLogger(__filename)

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

