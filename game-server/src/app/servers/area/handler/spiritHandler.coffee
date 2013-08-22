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
    if spiritPool.collectCount >= spiritConfig.MAX_COLLECT_COUNT
      return next(null, {code: 501, msg: '不能采集，已经达到每天最大采集次数'})

    spiritPollData = table.getTableItem('spirit_pool', spiritPool.lv)
    spiritPool.exp += spiritConfig.EXP_PER_COLLECT

    ### 判断灵气池是否升级 ###
    if spiritPool.exp >= spiritPollData.exp_need
      spiritPool.lv += 1
      spiritPool.exp -= spiritPollData.exp_need
    spiritPool.collectCount += 1

    ### 获得灵气，并判断元神是否升级 ###
    spiritor = _.clone(player.spiritor)
    spiritor.spirit += spiritPollData.spirit_obtain * times
    spiritorData = table.getTableItem('spirit', spiritor.lv)
    if spiritor.spirit >= spiritorData.spirit_need
      spiritor.lv += 1
      spiritor.spirit -= spiritorData.spirit_need

    ### 每次采集都已一定的概率获得额外数量的灵气 ###
    if utility.hitRate(spiritConfig.REWORD.RATE)
      [from, to] = spiritConfig.REWORD.VALUE.split('~')
      rd = _.random(parseInt(from), parseInt(to))
      spiritor.spirit += rd
      rewardSpirit = rd

    ### 消耗元宝，增加灵气产量 ###
    if isGold
      player.decrease('gold', spiritConfig.BUY_SPIRIT_GOLD)

    player.set('spiritPool', spiritPool)
    player.set('spiritor', spiritor)
    player.save()
    next(null, {code: 200, msg: {
      spiritor: player.spiritor, 
      spiritPool: player.spiritPool,
      rewardSpirit: rewardSpirit
      }
    })