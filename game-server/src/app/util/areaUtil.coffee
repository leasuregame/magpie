fs = require('fs')
path = require('path')
playerConfig = require('../../config/data/player')
msgConfig = require('../../config/data/message')
utility = require('../common/utility')

FLAG_FILE = path.join(__dirname, '..', '..', 'config', 'powerGivenFlag')
DEFAULT_FLAG = powerGiven: [], date: '1970-1-1'
SYSTEM = -1

module.exports = 
  doGivePower: (app, hour = new Date().getHours()) ->
    return if not @_canGivePower(hour, app)
    
    data = @_readFlag(app)
    data.powerGiven.push(hour)
    data.date = utility.shortDateString()
    @_writeFlag JSON.stringify(data), app
    @_addSysMsg(app)

  checkFlagFile: (app)->
    filepath = @_filePath(app)
    if not fs.existsSync(filepath)
      fs.writeFileSync(filepath, JSON.stringify(DEFAULT_FLAG))

  _filePath: (app) ->
    serverId = app.getServerId()
    FLAG_FILE + "-#{serverId}.json"

  _readFlag: (app)->
    JSON.parse(fs.readFileSync(@_filePath(app)))

  _writeFlag: (data, app)->
    fs.writeFileSync(@_filePath(app), data)

  _canGivePower: (hour = new Date().getHours(), app) ->
    hours = playerConfig.POWER_GIVE.hours
    data = @_readFlag(app)
    if data.date isnt utility.shortDateString()
      data.date = utility.shortDateString()
      data.powerGiven = []
      @_writeFlag JSON.stringify(data), app

    hours.indexOf(hour) > -1 and data.powerGiven.indexOf(hour) < 0

  _addSysMsg: (app) ->
    givePoint = playerConfig.POWER_GIVE.point
    # app.get('dao').message.create data: {
    #   options: {powerValue: givePoint}
    #   sender: SYSTEM
    #   receiver: SYSTEM
    #   content: '系统赠送50点体力'
    #   type: msgConfig.MESSAGETYPE.SYSTEM
    #   status: msgConfig.MESSAGESTATUS.UNHANDLED
    # }, (err, msg) ->
    #   if not err
    app.get('messageService').pushMessage {
      route: 'onPowerGive'
      msg: {powerValue: givePoint}
    }, () ->

  
        