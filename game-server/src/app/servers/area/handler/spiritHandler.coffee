playerManager = require '../../../manager/playerManager'
table = require '../../../manager/table'
utility = require '../../../common/utility'
spiritConfig = require '../../../../config/data/spirit'
_ = require 'underscore'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::collect = (msg, session, next) ->
  playerId = session.get('playerId')
  isGold = msg.isGold
  times = if isGold then 2 else 1

  rewardSpirit = 0
  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})
    
    spiritPool = _.clone(player.spiritPool)
    if spiritPool.collectCount <= 0
      return next(null, {code: 501, msg: '不能采集，已经达到每天最大采集次数'})   
    spiritPool.collectCount -= 1
    player.set('spiritPool', spiritPool)

    ### 获得灵气 ###
    spirit_obtain = spiritPollData.spirit_obtain * times
    
    ### 每次采集都已一定的概率获得额外数量的灵气 ###
    if utility.hitRate(spiritConfig.REWORD.RATE)
      [from, to] = spiritConfig.REWORD.VALUE.split('~')
      rd = _.random(parseInt(from), parseInt(to))
      spirit_obtain += rd
      rewardSpirit = rd

    ### 消耗元宝，增加灵气产量 ###
    if isGold
      player.decrease('gold', spiritConfig.BUY_SPIRIT_GOLD)

    player.incSpirit(spirit_obtain)
    player.incSpiritPoolExp(spiritConfig.EXP_PER_COLLECT)
    player.save()
    next(null, {code: 200, msg: {
      spiritor: player.spiritor, 
      spiritPool: player.spiritPool,
      rewardSpirit: rewardSpirit
      }
    })