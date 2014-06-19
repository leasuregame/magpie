playerManager = require('pomelo').app.get('playerManager')
logger = require('pomelo-logger').getLogger(__filename)
_ = require 'underscore'
async = require 'async'
fightManager = require '../../../manager/fightManager'
table = require '../../../manager/table'
entityUtil = require '../../../util/entityUtil'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::attack = (msg, session, next) ->
  playerId = session.get('playerId')
  passId = msg.id

  if not passId or not _.isNumber(passId)
    return next(null, {code: 501, msg: '参数错误'})

  passData = table.getTableItem('exp_pass_config', passId)
  if not passData
    return next(null, {code: 501, msg: '参数错误'})

  player = null
  battle_log = null
  isWin = false
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb

    (res, cb) ->
      player = res
      if player.lv < passData.limit_lv
        return cb({code: 501, msg: "#{passData.limit_lv}级开放"})

      if player.power.value < passData.power_consume
        return cb({code: 501, msg: '体力不足'})

      if player.expPassCount() <= 0
        return cb({code: 501, msg: '今日免费次数已用完'})

      fightManager.pve {pid: player.id, tableId: passId, table: 'exp_pass_config'}, cb

    (bl, cb) ->
      battle_log = bl
      isWin = bl.winner is 'own'

      if isWin
        addExpCards player, bl, caculateExpCardReward(passData), cb
      else 
        cb(null)

    (cb) ->
      if isWin
        player.updateGift 'expPassCount', player.expPassCount()-1
        entityUtil.upgradePlayer player, passData.player_exp, (isUpgrade, level9Box, rewards) ->
          if isUpgrade
            upgradeInfo = {
              lv: player.lv
              rewards: rewards
              friendsCount: player.friendsCount
            }
          else 
            upgradeInfo = null

          cb(null, isUpgrade, level9Box, upgradeInfo)
      else
        cb(null, false)

  ], (err, isUpgrade, level9Box, upgradeInfo) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})
    player.consumePower(if isWin then parseInt(passData.power_consume) else 1)
    player.save()
    next(null, {
      code: 200
      msg: 
        exp: player.exp
        power: player.power
        isUpgrade: isUpgrade
        level9Box: level9Box if isUpgrade
        upgradeInfo: upgradeInfo if isUpgrade
        battleLog: battle_log 
        expPassCount: player.expPassCount()
      }
    )

caculateExpCardReward = (passData) ->

  [c1, c2] = passData.total_count_scope?.split(',')
  [c3, c4] = passData.litle_count_scope?.split(',')
  [s1, s2, s3] = passData.exp_card_stars?.split(',')

  totalCount = _.random(c1*1, c2*1)
  count1 = _.random(c3*1, c4*1)
  count3 = _.random(c3*1, c4*1)
  count2 = totalCount - count1 - count3

  [
    [s1*1, count1]
    [s2*1, count2]
    [s3*1, count3]
  ]


addExpCards = (player, bl, items, cb) ->
  bl.rewards.cards = []
  if not items or items.length is 0
    return cb(null)
  
  async.map items, (item, done) ->
    if item[1] > 0
      playerManager.addExpCardFor player, item[1], item[0], done
    else 
      done(null, [])
  , (err, cards) ->
    cards = cards.reduce(
      (x, y) -> x.concat(y)
    , [])
    bl.rewards.cards = cards
    cb(null)