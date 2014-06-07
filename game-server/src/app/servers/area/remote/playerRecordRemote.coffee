
module.exports = (app) ->
  new Remote(app)

Remote = (@app) ->

Remote::createLoginRecord = (player, callback) ->
  makeAPlayerDailyRecord(@app, player, true, callback)

Remote::createLogoutRecord = (player, callback) ->
  makeAPlayerDailyRecord(@app, player, false, callback)

makeAPlayerDailyRecord = (app, player, isLogin, cb) ->
  playerManager = app.get('playerManager')
  dailyLvDao = app.get('dao').playerDailyLvRecord

  player = if player instanceof Object then player else playerManager.getPlayerFromCache(player)
  curDate = new Date()
  recordDate = curDate.getFullYear() +
    "-" + (curDate.getMonth() + 1) +
    "-" + curDate.getDate()
  record =
    where :
      playerId : player.id
      recordDate : recordDate
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
