playerManager = require '../../../manager/playerManager'
table = require '../../../manager/table'
utility = require '../../../common/utility'
lotteryConfig = require '../../../../config/data/lottery'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::lottery = (msg, session, next) ->
  playerId = session.get('playerId')

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    if player.dailyGift.lotteryCount >= lotteryConfig.DAILY_LOTTERY_COUNT
      return next(null, {code: 501, msg: '您的抽奖次数已用完'})

    if player.gold < 10
      return next(null, {code: 501, msg: '元宝不足'})

    if player.dailyGift.lotteryFreeCount > 0
      ### 免费抽奖次数减一 ###
      player.updateGift 'lotteryFreeCount', player.dailyGift.lotteryFreeCount-1
    else
      ### 无免费次数，则消耗10个元宝 ###
      player.decrease('gold', 10)

    ### 抽奖次数减一 ###
    player.updateGift 'lotteryCount', player.dailyGift.lotteryCount+1

    resource = randomReward()
    if resource.type is 'power'
      player.resumePower(resource.value)
    else
      player.increase(resource.type, resource.value)

    player.save()

    next(null, {code: 200, msg: {
      resourceId: resource.id, 
      lotteryCount: player.dailyGift.lotteryCount,
      lotteryFreeCount: player.dailyGift.lotteryFreeCount
      }
    })

randomReward = ->
  tData = table.getTable('treasure_hunt')
  items = tData.map (row) ->
    return [row.id, row.rate * 100]

  values = []
  rates = []
  for item in items
    values.push item[0]
    rates.push item[1]

  id = utility.randomValue values, rates, 10000
  table.getTableItem('treasure_hunt', id)