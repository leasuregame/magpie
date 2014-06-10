
module.exports = (app) ->
  new Remote(app)

Remote = (@app) ->

Remote::createLoginRecord = (player, cb) ->
  @app.get('recordManager').createLoginRecord(player, cb)

Remote::createLogoutRecord = (player, cb) ->
  @app.get('recordManager').createLogoutRecord(player, cb)

