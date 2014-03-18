playerManager = require('pomelo').app.get('playerManager')
table = require '../../../manager/table'
utility = require '../../../common/utility'
spiritConfig = require '../../../../config/data/spirit'
_ = require 'underscore'
SPIRITOR_PER_LV = require('../../../../config/data/card').ABILIGY_EXCHANGE.spiritor_per_lv
MAX_SPIRITOR_LV = table.getTableItem('lv_limit', 1).spirit_lv_limit

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::collect = (msg, session, next) ->
  playerId = session.get('playerId')
  isGold = msg.isGold
  times = if isGold then 2 else 1

  isDouble = false
  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})
    
    if isGold and player.gold < spiritConfig.BUY_SPIRIT_GOLD
      return next(null, {code: 501, msg: '魔石不足'})

    spiritPool = _.clone(player.spiritPool)
    if spiritPool.collectCount <= 0
      return next(null, {code: 501, msg: '不能采集，已经达到每天最大采集次数'})   
    spiritPool.collectCount -= 1
    player.set('spiritPool', spiritPool)

    ### 获得灵气 ###
    spiritPollData = table.getTableItem('spirit_pool', player.spiritPool.lv);
    spirit_obtain = spiritPollData.spirit_obtain * times
    
    ### 每次采集都已一定的概率获得翻倍的灵气 ###
    if utility.hitRate(spiritConfig.REWORD.RATE)
      spirit_obtain = spirit_obtain * 2
      isDouble = true

    ### 消耗魔石，增加灵气产量 ###
    if isGold
      player.decrease('gold', spiritConfig.BUY_SPIRIT_GOLD)

    player.incSpirit(spirit_obtain)
    player.incSpiritPoolExp(spiritConfig.EXP_PER_COLLECT)
    player.save()
    next(null, {code: 200, msg: {
      spirit_obtain: spirit_obtain
      isDouble: isDouble
      spiritPool: player.spiritPool
    }})

Handler::spiritorUpgrade = (msg, session, next) ->
  playerId = session.get('playerId')

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    if player.spiritor.lv >= MAX_SPIRITOR_LV
      return next(null, {code: 501, msg: '元神等级已经是最高级别别'})

    if not player.canUpgradeSpiritor()
      return next(null, {code: 501, msg: '灵气不够，不能升级'})

    player.spiritorUprade()
    player.updateAbility()
    player.save()
    next(null, {code: 200, msg: {
      spiritor: player.getSpiritor()
    }})
