playerManager = require('pomelo').app.get('playerManager')
recordManager = require('pomelo').app.get('recordManager')
SOURCE = require('../../../../config/data').record.CONSUMPTION_SOURCE
table = require '../../../manager/table'
utility = require '../../../common/utility'
configData = require '../../../../config/data'
_ = require 'underscore'

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
    
    if isGold and player.gold < configData.spirit.BUY_SPIRIT_GOLD
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
    if utility.hitRate(configData.spirit.REWORD.RATE)
      spirit_obtain = spirit_obtain * 2
      isDouble = true

    ### 消耗魔石，增加灵气产量 ###
    if isGold
      player.decrease('gold', configData.spirit.BUY_SPIRIT_GOLD)

    player.incSpirit(spirit_obtain)
    player.incSpiritPoolExp(configData.spirit.EXP_PER_COLLECT)
    player.save()
    if isGold
      recordManager.createConsumptionRecord player.id, SOURCE.COLLECT_DOUBLE_SPIRIT, {expense : configData.spirit.BUY_SPIRIT_GOLD}
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

    if player.spiritor.lv >= (table.getTableItem('lv_limit', 1)?.spirit_lv_limit or 10)
      return next(null, {code: 501, msg: '元神等级已经是最高级别别'})

    if not player.canUpgradeSpiritor()
      return next(null, {code: 501, msg: '灵气不够，不能升级'})

    player.spiritorUprade()
    player.updateAbility()
    player.save()
    next(null, {code: 200, msg: {
      spiritor: player.getSpiritor()
    }})
