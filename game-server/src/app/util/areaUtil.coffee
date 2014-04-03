fs = require('fs')
path = require('path')
configData = require '../../config/data'
utility = require('../common/utility')

FLAG_FILE = path.join(__dirname, '..', '..', 'config', 'powerGivenFlag')
DEFAULT_FLAG = powerGiven: [], endPowerGiven: [], date: '1970-1-1'
SYSTEM = -1

flag_data = null

module.exports = 
  doGivePower: (app, hour = new Date().getHours()) ->
    [start_give_power, end_give_power] = @_canGivePower(app, hour)
    
    if start_give_power
      @_update app, hour, 'powerGiven'

    if end_give_power
      @_update app, hour, 'endPowerGiven'


  checkFlagFile: (app)->
    filepath = @_filePath(app)
    if not fs.existsSync(filepath)
      fs.writeFileSync(filepath, JSON.stringify(DEFAULT_FLAG))

  _update: (app, hour, key) ->
    data = @_readFlag(app)
    data[key].push(hour)
    data.date = utility.shortDateString()
    @_writeFlag JSON.stringify(data), app
    @_addSysMsg(app, key)

  _filePath: (app) ->
    serverId = app.getServerId()
    FLAG_FILE + "-#{serverId}.json"

  _readFlag: (app)->
    if not flag_data
      fpath = @_filePath(app)
      flag_data = JSON.parse(fs.readFileSync(fpath))
      fs.watchFile fpath, (curr, prev) ->
        flag_data = JSON.parse(fs.readFileSync(fpath))

    flag_data

  _writeFlag: (data, app)->
    fs.writeFileSync(@_filePath(app), data)

  _canGivePower: (app, hour = new Date().getHours()) ->
    hours = configData.player.POWER_GIVE.hours
    data = @_readFlag(app)
    if data.date isnt utility.shortDateString()
      data.date = utility.shortDateString()
      data.powerGiven = []
      data.endPowerGiven = []
      @_writeFlag JSON.stringify(data), app

    DURATION = configData.player.POWER_GIVE.duration
    last_hour = if hour < DURATION then (24 - DURATION + hour) else (hour - DURATION)
    start_give_power = hours.indexOf(hour) > -1 and data.powerGiven.indexOf(hour) < 0
    end_give_power = hours.indexOf(last_hour) > -1 and data.endPowerGiven.indexOf(hour) < 0
    [start_give_power, end_give_power]

  _addSysMsg: (app, key) ->
    msgs = 
      powerGiven: route: 'onPowerGive', msg: {powerValue: configData.player.POWER_GIVE.point}
      endPowerGiven: route: 'onPowerGiveEnd', msg: {}

    app.get('messageService').pushMessage {
      route: msgs[key].route
      msg: msgs[key].msg
    }, () ->

  
        