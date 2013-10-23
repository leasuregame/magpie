fs = require('fs')
path = require('path')
playerConfig = require('../../config/data/player')
msgConfig = require('../../config/data/message')
utility = require('../common/utility')

FLAG_FILE = path.join(__dirname, '..', '..', 'config', 'powerGivenFlag.json')
SYSTEM = -1

module.exports = 
  doGivePower: (app, hour = new Date().getHours()) ->
    return if not @_canGivePower(hour)
    
    data = @_readFlag()
    data.powerGiven.push(hour)
    data.date = utility.shortDateString()
    @_writeFlag JSON.stringify(data)
    @_addSysMsg(app)

  _readFlag: ->
    JSON.parse(fs.readFileSync(FLAG_FILE))

  _writeFlag: (data)->
    fs.writeFileSync(FLAG_FILE, data)

  _canGivePower: (hour = new Date().getHours()) ->
    hours = playerConfig.POWER_GIVE.hours
    data = @_readFlag()
    if data.date isnt utility.shortDateString()
      data.date = utility.shortDateString()
      data.powerGiven = []
      @_writeFlag JSON.stringify(data)

    hours.indexOf(hour) > -1 and data.powerGiven.indexOf(hour) < 0

  _addSysMsg: (app) ->
    givePoint = playerConfig.POWER_GIVE.point
    app.get('dao').message.create data: {
      options: {powerValue: givePoint}
      sender: SYSTEM
      receiver: SYSTEM
      content: '系统赠送50点体力'
      type: msgConfig.MESSAGETYPE.SYSTEM
      status: msgConfig.MESSAGESTATUS.UNHANDLED
    }, (err, msg) ->
      if not err
        app.get('messageService').pushMessage {
          route: 'onMessage'
          msg: msg.toJson()
        }, () ->

  
        