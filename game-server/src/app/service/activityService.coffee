async = require 'async'
configData = require '../../config/data'
appUtil = require '../util/appUtil'
utility = require '../common/utility'

SYSTEM = -1

module.exports = (app) ->
  new Service(app)

class Service
  constructor: (@app) ->

  login: (playerId) ->
    if appUtil.isActivityTime @app, 'login'
      loginConfigData = @app.get('sharedConf')?.activity?.login
      if loginConfigData
        data = loginConfigData.data
        data.validDate = utility.dateFormat(new Date(), 'yyyy-MM-dd') 
        @app.get('sysService').sendReward playerId, loginConfigData.data

  resetRechargeFlag: (player) ->
    if appUtil.isActivityTime @app, 'resetRechargeFlag'
      player.resetRechargeFlag()
      player.save()