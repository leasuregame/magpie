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
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb

    (res, cb) ->
      player = res
      if player.lv < passData.limit_lv
        return cb({code: 501, msg: "#{passData.limit_lv}级开放"})

      if player.power.value < passData.power_consume
        return cb({code: 501, msg: '体力不足'})

      fightManager.pve {pid: player.id, tableId: passId, table: 'exp_pass_config'}, cb

    (bl, cb) ->
      battle_log = bl
      addExpCards player, caculateExpCardReward(bl, passData), cb

    (cards, cb) ->
      entityUtil.upgradePlayer player, passData.player_exp, (isUpgrade, level9Box, rewards) ->
        cb(null, cards, isUpgrade, level9Box, rewards)

  ], (err, cards, isUpgrade, level9Box, rewards) ->
    if err
      logger.error(err)
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    player.consumePower(passData.power_consume)
    player.save()
    next(null, {
      code: 200
      msg: 
        battleLog: battle_log 
        cards: cards
        exp: passData.player_exp
        power: player.power
        isUpgrade: isUpgrade
        level9Box: level9Box if isUpgrade
        rewards: rewards if isUpgrade
      }
    )


caculateExpCardReward = (bl, passData) ->
  return if bl.winner is 'enemy'

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


addExpCards = (player, items, cb) ->
  if not items or items.length is 0
    return cb(null, [])
  
  async.map items, (item, done) ->
    if item[1] > 0
      playerManager.addExpCardFor player, item[1], item[0], done
    else 
      done(null, [])
  , (err, cards) ->
    cards = cards.reduce(
      (x, y) -> x.concat(y)
    , [])
    cb(null, cards)