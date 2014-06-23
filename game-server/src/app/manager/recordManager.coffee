async = require 'async'
_ = require 'underscore'
logger = require('pomelo-logger').getLogger(__filename)

class Record
  constructor: (@app) ->

  createLoginRecord : (player, cb) ->
    @makeAPlayerDailyRecord(@app, player, true, cb)

  createLogoutRecord : (player, cb) ->
    @makeAPlayerDailyRecord(@app, player, false, cb)

  # 新建player消费记录,其中 bill : {resourceType, expense}
  createConsumptionRecord : (playerId, source, bill, cb) ->
    consumptionDao = @app.get('dao').playerConsumptionRecord
    record =
      data:
        playerId : playerId
        source : source
        expense : bill.expense
        resourceType : if bill.resourceType then bill.resourceType else 1
    cb = if cb then cb else (err) ->
      logger.error "ERROR ON EXECUTING recordManager.createConsumptionRecord", err if err
    consumptionDao.createRecord record, cb

  # 新建player登入登出记录,主要记录playerId, playerLv, loginCount, recordDate
  makeAPlayerDailyRecord: (app, player, isLogin, cb) ->
    playerManager = app.get('playerManager')
    dailyLvDao = app.get('dao').playerDailyLvRecord

    callbackAfterGetPlayer = (err, player) ->
      return cb err, null if err?
      return cb new Error('player is undefined'), null unless player
      curDate = new Date()
      recordDate = curDate.getFullYear() +
        "-" + (curDate.getMonth() + 1) +
        "-" + curDate.getDate()
      record =
        where :
          playerId : player.id
          recordDate : recordDate
      # 若该记录为player今天首次记录,则直接插入到库中,否则只需更新player今天已入库的记录
      dailyLvDao.fetchOne record, (err, data) ->
        if err
          if err.code != 404
            cb err, null
          else
            dailyLvDao.createRecord
              data :
                playerId : player.id,
                recordDate : recordDate,
                playerLv : player.lv
              , cb
        else
          record.data =
            playerLv : player.lv
          record.data.loginCount = data['loginCount'] + 1 if isLogin
          dailyLvDao.update record, cb

    if player instanceof Object
      callbackAfterGetPlayer null, player
    else
      playerManager.getPlayerInfo({pid:player}, callbackAfterGetPlayer)

module.exports = Record