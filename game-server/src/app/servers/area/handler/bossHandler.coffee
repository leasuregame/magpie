app = require('pomelo').app
dao = app.get('dao')
_ = require 'underscore'
async = require 'async'
playerManager = require('pomelo').app.get('playerManager')
fightManager = require '../../../manager/fightManager'
utility = require('../../../common/utility')
entityUtil = require('../../../util/entityUtil')
table = require '../../../manager/table'
job = require '../../../dao/job'
configData = require '../../../../config/data'
logger = require('pomelo-logger').getLogger(__filename)

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::attackDetails = (msg, session, next) ->
  bossId = msg.bossId

  if not bossId
    return next(null, {code: 501, msg: '参数错误'})

  dao.bossAttack.getByBossId bossId, (err, items) ->
    if err
      return next(null, {code: err.code or 501, msg: err.msg or err})

    next(null, {code: 200, msg: items})

Handler::lastWeek = (msg, session, next) ->
  playerId = session.get('playerId')

  async.parallel [
    (cb) =>
      @app.get('dao').damageOfRank.lastWeekDamageRank cb
    (cb) =>
      @app.get('dao').damageOfRank.getRank playerId, utility.lastWeek(), cb
    (cb) =>
      @app.get('dao').damageOfRank.fetchOne {
        fields: ['got']
        where: playerId: playerId, week: utility.lastWeek()
      }, (err, res) ->
        if err and err.code is 404
          cb(null, null)
        else 
          cb(null, res) 
  ], (err, results) ->
    if err
      return next(null, {code: 501, msg: err.message or err.msg})

    damageList = results[0]
    lastWeekRank = results[1]
    got = results[2]?.got

    next(null, {code: 200, msg: {
      damageList: damageList
      lastWeek: lastWeekRank
      isGet: !!got
    }})

Handler::thisWeek = (msg, session, next) ->
  playerId = session.get('playerId')

  async.parallel [
    (cb) =>
      @app.get('dao').damageOfRank.thisWeekDamageRank cb
    (cb) =>
      @app.get('dao').damageOfRank.getRank playerId, utility.thisWeek(), cb
  ], (err, results) ->
    if err
      return next(null, {code: 501, msg: err.message or err.msg})

    damageList = results[0]
    thisWeekRank = results[1]

    next(null, {code: 200, msg: {
      damageList: damageList
      thisWeek: thisWeekRank
    }})

Handler::getLastWeekReward = (msg, session, next) ->
  playerId = session.get('playerId')

  week = utility.lastWeek()
  rank = null
  player = null
  reward = null
  async.waterfall [
    (cb) =>
      @app.get('dao').damageOfRank.getRank playerId, week, cb
    (res, cb) ->
      rank = res
      if not rank
        return cb({code: 501, msg: '上周不够努力，没奖励可领哦'})
      cb(null)
    (cb) =>
      @app.get('dao').damageOfRank.fetchOne {
        fields: ['got']
        where: 
          playerId: playerId,
          week: week
      }, cb
    (dor, cb) ->
      if dor.got is 1
        return cb({code: 501, msg: '不能重复领取'})
      cb(null)
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb
    (res, cb) ->
      player = res
      reward = countDamageRewards(rank?.rank)
      entityUtil.getReward player, reward, cb
    (cards, cb) =>
      @app.get('dao').damageOfRank.update {
        data: got: 1
        where: playerId: playerId, week: week
      }, cb
  ], (err, result) ->
    if err
      return next(null, {code: 501, msg: err.message or err.msg})

    player.save()
    next(null, {code: 200, msg: reward})

Handler::friendRewardList = (msg, session, next) ->
  playerId = session.get('playerId')

  async.parallel [
    (cb) ->
      dao.bossFriendReward.rewardList playerId, cb
    (cb) ->
      dao.bossFriendReward.getReward playerId, cb
  ], (err, results) ->
    if err
      return next(null, {code: 501, msg: err.message or err.msg})    

    items = results[0]
    reward = results[1]

    next(null, {
      code: 200,
      msg: 
        rewardList: items
        total:
          money: reward?.money or 0
          honor: reward?.honor or 0
    })

Handler::getFriendReward = (msg, session, next) ->
  playerId = session.get('playerId')

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb
    (player, cb) ->
      dao.bossFriendReward.getReward playerId, (err, res) ->
        if err or not res or (res.money is null and res.honor is null)
          return cb({
            code: 501, 
            msg: '没有奖励可领'
          })
        else 
          cb(null, res, player)
    (reward, player, cb) ->
      if reward.money > 0 and reward.honor > 0
        dao.bossFriendReward.update {
          data: got: 1
          where: playerId: playerId, got: 0
        }, (err, res) ->
          if err
            cb(err)
          else 
            cb(null, reward, player)
  ], (err, reward, player) ->
    if err
      return next(null, {code: 501, msg: err.message or err.msg})

    player.increase 'money', reward.money
    player.increase 'honor', reward.honor
    player.save()
    next(null, {
      code: 200,
      msg: {
        money: reward.money
        honor: reward.honor
      }
    })

Handler::convertHonor = (msg, session, next) ->
  playerId = session.get('playerId')
  number = msg.number

  if typeof number is 'undefined' or typeof number isnt 'number' or number < 0
    return next(null, {code: 501, msg: '参数错误'})

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: 501, msg: err.message or err.msg})

    if player.honor < number * configData.bossStatus.HONOR_TO_SUPER
      return next(null, {code: 501, msg: '荣誉点不足'})

    player.decrease 'honor', number * configData.bossStatus.HONOR_TO_SUPER
    player.increase 'superHonor', number
    player.save()

    next(null, {code: 200, msg: {
      superHonor: player.superHonor
      honor: player.honor
    }})

Handler::removeTimer = (msg, session, next) ->
  playerId = session.get('playerId')

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: 501, msg: err.message or err.msg})

    if player.getCD() is 0
      return next(null, {code: 501, msg: '没有可消除的CD'})

    gold_resume = player.removeTimerConsume()
    if player.gold < gold_resume
      return next(null, {code: 501, msg: '魔石不足'})

    player.decrease 'gold', gold_resume
    player.removeCD()
    player.incRmTimerCount()
    player.save()

    next(null, {code: 200, msg: {
      gold: player.gold
    }})

Handler::kneel = (msg, session, next) ->
  playerId = session.get('playerId')
  targetId = msg.playerId

  if typeof targetId is 'undefined'
    return next(null, {code: 501, msg: '请指定膜拜对象'})

  player = null
  async.waterfall [
    (cb) ->
      dao.player.exists where: {
        id: targetId
      }, cb
    (exist, cb) ->
      if not exist
        return cb({code: 501, msg: '膜拜对象不存在'})
      playerManager.getPlayerInfo pid: playerId, cb
    (res, cb) ->
      player = res
      if player.kneelCountLeft() <= 0
        return cb({code: 501, msg: '膜拜次数已用完'})

      if player.hasKneel(targetId)
        return cb({code: 501, msg: '不能重复膜拜'})
        
      cb(null)
    (cb) ->
      dao.damageOfRank.getRank targetId, utility.thisWeek(), cb
    (rank, cb) ->
      if not rank or rank.rank > 5
        cb({code: 501, msg: '玩家没有上榜，不能膜拜'})
      cb(null)
    (cb) ->
      player.increase 'energy', configData.bossStatus.KNEEL_REWARD.ENERGY
      player.addPower configData.bossStatus.KNEEL_REWARD.POWER
      player.updateGift 'kneelCountLeft', player.dailyGift.kneelCountLeft-1
      player.addKneel targetId
      player.save()
      cb(null)
    (cb) ->
      dao.damageOfRank.updateKneelCount targetId, cb
  ], (err, res) ->
    if err
      return next(null, {code: 501, msg: err.message or err.msg})

    next(null, {
      code: 200,
      msg: 
        power: configData.bossStatus.KNEEL_REWARD.POWER
        energy: configData.bossStatus.KNEEL_REWARD.ENERGY
    })

Handler::bossList = (msg, session, next) ->
  playerId = session.get('playerId')

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb
    (player, cb) ->
      boss_limit_level = table.getTableItem('function_limit', 1)?.boss or 1
      if player.lv < boss_limit_level
        return cb({code: 501, msg: "#{boss_limit_level}级开放"})

      ids = player.friends.map (f) -> f.id
      dao.boss.bossList playerId, ids, cb
    (items, cb) ->
      checkBossStatus(items, cb)
  ], (err, results) ->
    if err
      return next(null, {code: err.code or 501, msg: err.msg or err})

    next(null, {
      code: 200,
      msg: sortBossList(results.map((r) -> r.toJson()), playerId)
    })

checkBossStatus = (items, cb) ->
  timeOutItems = items.filter (i) -> i.timeLeft() <= 0 and i.status isnt configData.bossStatus.STATUS.TIMEOUT
  ids = timeOutItems.map (i) -> i.id

  if ids.length is 0
    return cb(null, items)

  dao.boss.update {
    where: ' id in ('+ids.toString()+') '
    data: status: configData.bossStatus.STATUS.TIMEOUT
  }, (err, res) ->
    if err
      cb(err)
    else
      timeOutItems.forEach (i) -> i.status = configData.bossStatus.STATUS.TIMEOUT
      cb(null, items)

sortBossList = (items, playerId) ->
  group = _.groupBy items, (i) -> if i.playerId is playerId then 'mine' else 'friend'
  
  mine = (group.mine?.sort (x, y) -> x.status - y.status > 0) or []
  friend = (group.friend?.sort (x, y) -> x.status - y.status > 0) or []
  mine.concat friend

Handler::attack = (msg, session, next) ->
  playerId = session.get('playerId')
  bossId = msg.bossId
  inspireCount = msg.inspireCount or 0

  player = null
  boss = null
  totalDamage = 0
  gold_resume = 0
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo pid: playerId, cb
    (res, cb) ->
      player = res
      if player.getCD() > 0
        return cb({code: 501, msg: '冷却时间未到'})
      cb()
    (cb) ->
      dao.boss.fetchOne where: id: bossId, cb
    (res, cb) ->
      boss = res
      friendIds = player.friends.map (f) -> f.id
      friendIds.push playerId
      if boss.playerId not in friendIds
        return cb({code: 501, msg: '不能攻击陌生人的Boss哦'})

      if boss.timeLeft() <= 0 or boss.countLeft() is 0 or boss.isDisappear() or boss.isDeath()
        return cb({code: 501, msg: 'Boss已逃跑'})

      if boss.playerId isnt playerId and boss.status is configData.bossStatus.STATUS.SLEEP
        return cb({code: 501, msg: 'Boss未苏醒'})
      cb()
    (cb) ->
      if inspireCount > 5
        inspireCount = 5

      gold_resume = configData.bossStatus.INSPIRE_GOLD * inspireCount
      if player.gold < gold_resume
        return cb({code: 501, msg: '魔石不足'})

      incRate = _.min [inspireCount * configData.bossStatus.INSPIRE_PER_CARD, configData.bossStatus.INSPIRE_MAX]
      fightManager.attackBoss player, boss, incRate, cb
    (bl ,cb) ->
      totalDamage = countDamage(bl)
      countRewards(totalDamage, boss, bl, player)
      updateBossAndPlayer(boss, bl, player, gold_resume)
      noticeFriendrewards(player, boss, bl.rewards)
      cb(null, bl)
    (bl, cb) ->
      saveBattleLog bl, player, boss, (err, res) ->
        if err
          cb(err)
        else
          cb(null, bl, res)
    (bl, blObj, cb) ->
      dao.damageOfRank.fetchOne where: {
        playerId: playerId,
        week: utility.thisWeek()
      }, (err, dorObj) ->
        saveObjects(bl, boss, player, totalDamage, blObj.id, dorObj, cb)
  ], (err, bl, totalDamage) ->
    if err
      return next(null, {code: err.code or 501, msg: err.msg or err})

    next(null, {
      code: 200
      msg: 
        boss: boss.toJson()
        gold: player.gold
        damage: totalDamage
        cd: player.getCD()
        battleLog: bl
    })

countDamageRewards = (rank) ->
  row = table.getTableItem('boss_rank_reward', rank)
  if row    
    money: row.money
    honor: row.honor
    energy: row.energy
  else 
    honor5 = table.getTableItem('boss_rank_reward', 5)?.honor or configData.bossStatus.REWARD_COUNT.BASE_VALUE
    gap = table.getTableItem('values', 'damageOfRankHonorGap')?.value or 0
    honor = parseInt (honor5-gap)*(1-Math.ceil((rank-5)/configData.bossStatus.REWARD_COUNT.DURACTION)*configData.bossStatus.REWARD_COUNT.FACTOR)
    honor = configData.bossStatus.REWARD_COUNT.MIN if honor < configData.bossStatus.REWARD_COUNT.MIN
    honor: honor

countDamage = (bl) ->
  ds = []
  bl.steps.forEach (s) ->
    return if not _.isUndefined(s.go)
    s.d.forEach (el, idx) -> ds.push Math.abs(s.e[idx]) if Math.abs(el) > 6

  # 删除死亡的boss卡牌
  for cards, i in bl.cards
    for k, v of cards
      delete bl.cards[i][k] if v.hp is 0

  add = (x, y) -> x + y
  ds.reduce add, 0

countRewards = (totalDamage, boss, bl, player) ->
  bossInfo = table.getTableItem('boss', boss.tableId)
  rewardsInc = table.getTableItem('boss_type_rate', bossInfo.type)?.reward_inc or 0

  money = Math.ceil totalDamage/configData.bossStatus.DAMAGE_TO_MONEY.DAMAGE*configData.bossStatus.DAMAGE_TO_MONEY.MONEY*(100+rewardsInc)/100
  honor = Math.ceil totalDamage/configData.bossStatus.DAMAGE_TO_HONOR.DAMAGE*configData.bossStatus.DAMAGE_TO_HONOR.HONOR*(100+rewardsInc)/100
  bl.rewards = 
    money: money
    honor: honor

  if boss.playerId isnt player.id
    bl.rewards.friend = 
      money: Math.ceil(money*configData.bossStatus.FRIEND_REWARD_PERCENT)
      honor: Math.ceil(honor*configData.bossStatus.FRIEND_REWARD_PERCENT)

noticeFriendrewards = (player, boss, rewards) ->
  return if player.id is boss.playerId

  dao.bossFriendReward.create data: {
    playerId: boss.playerId
    friendName: player.name
    money: rewards.friend?.money
    honor: rewards.friend?.honor
    created: utility.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
  }, (err, res) ->
    if err
      logger.error(err)

    sendMessage(boss.playerId, rewards.friend)

sendMessage = (playerId, rewards) ->
  app.get('messageService').pushByPid playerId, {
    route: 'onFriendHelp'
    msg: {friendId: playerId}
  }, (err, res) ->
    if err
      logger.error(err)


updateBossAndPlayer = (boss, bl, player, gold_resume) ->
  if boss.atkCount is 0
    boss.set('status', configData.bossStatus.STATUS.AWAKE)
  boss.increase('atkCount')

  # update hp info
  for cards in bl.cards
    do (cards) ->
      _.each cards, (v, k) ->
        c = boss.hp[k-6]
        if k > 6 and c? and c.cardId is v.tableId
          boss.updateHp(k-6, v.hpLeft)

  # update status and death time
  maxCount = table.getTableItem('boss', boss.tableId)?.atk_count or 10
  
  isWin = bl.winner is 'own'
  if isWin or boss.atkCount is maxCount
    boss.set('status', if isWin then configData.bossStatus.STATUS.DEATH else configData.bossStatus.STATUS.RUNAWAY)
    boss.set('deathTime', new Date().getTime())
    boss.set('killer', player.name)
    # 奖励翻倍
    bl.rewards.money *= 2
    bl.rewards.honor *= 2
    if bl.rewards.friend
      bl.rewards.friend.money *= 2
      bl.rewards.friend.honor *= 2

    # 修改boss发现标记为false
    resetBossFound player, boss

  player.increase('money', bl.rewards.money)
  player.increase('honor', bl.rewards.honor)
  player.decrease('gold', gold_resume)
  player.resetCD()

resetBossFound = (player, boss)->
  if player.id is boss.playerId
    player.setBossFound(false)
  # else
  #   dao.player.fetchOne {
  #     where: id: boss.playerId
  #     fields: ['task']
  #   }, (err, obj) ->
  #     if err
  #       logger.error('get player info error: ' + err.stack)
  #       return

  #     obj.setBossFound(false)
  #     dao.player.update {
  #       where: id: obj.id
  #       data: task: obj.task
  #     }, (err, res) ->
  #       if err
  #         logger.error('update player error: ', err.stack)

  #       playerManager.updatePlayerBossFoundIfOnline obj.id

saveBattleLog = (bl, player, boss, cb) ->
  dao.battleLog.create {
    data: 
      type: 'boss'
      own: player.id
      enemy: boss.tableId
      battleLog: JSON.stringify(bl)
  }, cb

saveObjects = (bl, boss, player, totalDamage, battleLogId, dorObj, cb) ->
  bossAttackData = 
    bossId: boss.id
    playerId: player.id
    damage: totalDamage
    money: bl.rewards.money
    honor: bl.rewards.honor
    moneyAdd: bl.rewards.friend?.money
    honorAdd: bl.rewards.friend?.honor
    battleLogId: battleLogId

  jobItems = [{
    type: 'insert'
    options: 
      table: 'bossAttack'
      data: bossAttackData
  }]

  if dorObj
    jobItems.push {
      type: 'update'
      options: 
        table: 'damageOfRank'
        where: 
          playerId: player.id
          week: utility.thisWeek()
        data: 
          damage: dorObj.damage + totalDamage
    }
  else
    jobItems.push {
      type: 'insert'
      options: 
        table: 'damageOfRank'
        data: 
          playerId: player.id
          week: utility.thisWeek()
          name: player.name
          damage: totalDamage
    }

  playerData = player.getSaveData()
  jobItems.push {
    type: 'update'
    options:
      table: 'player'
      where: 
        id: player.id
      data: playerData
  } if not _.isEmpty(playerData)

  bossData = boss.getSaveData()
  jobItems.push {
    type: 'update'
    options:
      table: 'boss'
      where: 
        id: boss.id
      data: bossData
  } if not _.isEmpty(bossData)

  job.multJobs jobItems, (err, ok) ->
    if err and not ok
      return cb(err)

    cb(null, bl, totalDamage)