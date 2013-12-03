playerManager = require('pomelo').app.get('playerManager')
table = require '../../../manager/table'
utility = require '../../../common/utility'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::lottery = (msg, session, next) ->
  playerId = session.get('playerId')

  goldResume = 20
  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    fdata = table.getTableItem('function_limit', 1)
    if player.lv < fdata.lottery
      return next(null, {code: 501, msg: fdata.lottery+'级开放'})

    if player.dailyGift.lotteryCount <= 0
      return next(null, {code: 501, msg: '您的抽奖次数已用完'})

    if player.gold < goldResume
      return next(null, {code: 501, msg: '魔石不足'})

    if player.dailyGift.lotteryFreeCount > 0
      ### 免费抽奖次数减一 ###
      goldResume = 0
      player.updateGift 'lotteryFreeCount', player.dailyGift.lotteryFreeCount-1
    else
      ### 无免费次数，则消耗20个魔石 ###
      player.decrease('gold', goldResume)

    ### 抽奖次数减一 ###
    player.updateGift 'lotteryCount', player.dailyGift.lotteryCount-1

    resource = randomReward()
    if resource.type is 'power'
      player.resumePower(resource.value)
    else
      player.increase(resource.type, resource.value)

    player.save()

    next(null, {code: 200, msg: {
      resourceId: resource.id, 
      lotteryCount: player.toJson().dailyGift.lotteryCount,
      lotteryFreeCount: player.toJson().dailyGift.lotteryFreeCount,
      goldResume: goldResume
      }
    })

Handler::signInDetails = (msg, session, next) ->
  playerId = session.get('playerId')
  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})
    next(null, {code: 200, msg: player.signIn})

Handler::signIn = (msg, session, next) ->
  playerId = session.get('playerId')

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    sdata = table.getTableItem('daily_signin_rewards', 1)
    player.signToday()
    player.increase('money', sdata.money)
    player.increase('energy', sdata.energy)
    player.save()
    next(null, {
      code: 200, 
      msg: {
        money: sdata.money
        energy: sdata.energy
      }
    })

Handler::reSignIn = (msg, session, next) ->
  playerId = session.get('playerId')

  goldResume = 20
  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    if player.gold < goldResume
      return next(null, {code: 501, msg: '魔石不足'})

    if player.signDays() >= 31
      return next(null, {code: 501, msg: '没有日期可以补签'})

    day = player.signFirstUnsignDay()
    if day >= (new Date).getDate()
      return next(null, {code: 501, msg: '没有日期可以补签'})

    sdata = table.getTableItem('daily_signin_rewards', 1)
    player.decrease('gold', goldResume)
    player.save()
    
    next(null, {
      code: 200
      msg: 
        day: day
        goldResume: goldResume
        reward: {
          money: sdata.money
          energy: sdata.energy
        }
      }
    )

Handler::getSignInGift = (msg, session, next) ->
  playerId = session.get('playerId')
  id = msg.id

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    
    if err
      return next(null, {code: err.code or 500, msg: err.msg or err})

    rew = table.getTableItem('signIn_rewards', id)
    count = rew.count
    if count is -1
      d = new Date()
      count = (new Date(d.getFullYear(), d.getMonth() + 1, 0)).getDate()

    if player.signDays() < count
      return next(null, {code: 501, msg: "签到次数不足#{count}次"})
    if player.hasSignInFlag(id)
      return next(null, {code: 501, msg: '不能重复领取'})

    setIfExist = (attrs) ->
      player.increase att, val for att, val of rew when att in attrs and val > 0
      return

    setIfExist ['energy', 'money', 'skillPoint', 'elixir', 'gold', 'fragments']
    player.incSpirit(rew.spirit)
    if rew.lottery_free_count > 0
      dg = utility.deepCopy(player.dailyGift)
      dg.lotteryFreeCount += rew.lottery_free_count
      player.dailyGift = dg

    player.setSignInFlag(id)
    player.save()
    next(null, {
      code: 200
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