app = require('pomelo').app
dao = app.get('dao')
job = require('../dao/job')
table = require('./table')
achieve = require('../domain/achievement')
playerManager = app.get('playerManager')
entityUtil = require '../util/entityUtil'
_ = require('underscore')
async = require 'async'
utility = require '../common/utility'
logger = require('pomelo-logger').getLogger(__filename)

Manager = module.exports = 
  getRank: (playerId, cb) ->
    dao.rank.fetchOne sync: true, where: {playerId: playerId}, cb

  getRankings: (ids, cb) ->
    dao.rank.getRankingsByPids ids,(err,ranks) ->
      rankings = ranks.map (r)-> r.ranking
      cb(null,rankings)

  exchangeRankings: (player, target, isWin, cb) ->
    targetId = target.id
    dao.rank.fetchMany where: " playerId in (#{[player.id, targetId].toString()}) ", (err, ranks) ->
      if err
        return cb(err)

      if !!ranks and ranks.length isnt 2
        return cb({code: 501, msg: '拿不对方的竞技排行信息'})

      challenger = (ranks.filter (r) -> r.playerId == player.id)?[0]
      defender = (ranks.filter (r) -> r.playerId == targetId)?[0]
      challenger.increase('challengeCount')
      challenger.increase('startCount')
      defender.increase('challengeCount')
      
      rewards = {ranking_elixir: 0, elixir: 0}
      ###  获取竞技奖励，每天10次，还可额外购买10次 ###
      upgradeInfo = null
      level9Box = null

      if isWin
        exchangeRanking(challenger, defender)

      if player.dailyGift.challengeCount > 0
        countRewards(player, challenger, isWin, rewards)
        entityUtil.upgradePlayer player, rewards.exp, (isUpgrade, box, rew) ->
          if isUpgrade
            upgradeInfo = {
              lv: player.lv
              rewards: rew
              friendsCount: player.friendsCount
            }
          if box?
            level9Box = box

      if isWin
        updateRankInfo(challenger, defender)
        defender.pushRecent(player.id)
        challenger.recentChallenger = _.without(challenger.recentChallenger,targetId)
      else
        updateRankInfo(defender, challenger)

      # update rank info
      reflashRank(player, challenger, targetId, defender)
      if isWin
        checkAchievement(player, challenger)
      else
        checkAchievement(target, defender)
      
      updateElixir(player, rewards.elixir)
      updateAll(player, target, challenger, defender, targetId, rewards, upgradeInfo, level9Box, cb)

updateElixir = (player, elixir) ->
  week = utility.thisWeek()
  async.waterfall [
    (cb) ->
      dao.elixirOfRank.fetchOne where: {
        playerId: player.id
        week: week
      }, (err, res) ->
        if err
          cb(null, null)
        else
          cb(null, res)

    (row, cb) ->
      if not row
        dao.elixirOfRank.create data: {
          playerId: player.id
          week: week
          name: player.name
          elixir: elixir
        }, cb
      else 
        dao.elixirOfRank.update {
          data: {elixir: row.elixir + elixir}
          where: {playerId: player.id, week: week}
        }, cb
  ], (err, result) ->
    if err
      logger.error('update elixir of ranking error: ', err.stack)


updateAll = (player, target, challenger, defender, targetId, rewards, upgradeInfo, level9Box, cb) ->
  player.rank = challenger
  target.rank = defender
  
  jobs = [
    {
      type: 'update',
      options: 
        table: 'rank',
        where: {playerId: player.id}
        data: challenger.getSaveData()
    }
    {
      type: 'update',
      options: 
        table: 'rank',
        where: {playerId: targetId}
        data: defender.getSaveData()
    }
  ]

  playerData = player.getSaveData()
  jobs.push {
    type: 'update',
    options: 
      table: 'player',
      where: {id: player.id}
      data: playerData
  } if not _.isEmpty(playerData)

  targetData = target.getSaveData()
  jobs.push {
    type: 'update',
    options: 
      table: 'player',
      where: {id: target.id}
      data: targetData
  } if not _.isEmpty(targetData)

  job.multJobs jobs, (err, res) -> cb(err, res, rewards, upgradeInfo, level9Box) 

exchangeRanking = (cha, def) ->
  if cha.ranking > def.ranking
    r = def.ranking
    def.set('ranking', cha.ranking)
    cha.set('ranking', r)

updateRankInfo = (winner, loser) ->
  winner.increase 'winCount'
  winner.increase 'winningStreak'
  loser.resetCount 'winningStreak'
  loser.increase 'loseCount'

reflashRank = (player, clg, targetId, def) ->
  player.rank = clg

  target = playerManager.getPlayerFromCache(targetId)
  target.rank = def if target

checkAchievement = (player, challenger) ->
  achieve.winCount(player, challenger.winCount)
  achieve.winningStreak(player, challenger.winningStreak)
  achieve.rankingToOne(player) if player.rank.ranking is 1

rewardPercent = (ranking) ->
  pct = 0
  items = table.getTable('ranking_reward_factor').filter (id, row) ->
    row.ranking <= ranking

  if items.length > 0
    items.sort (x, y) -> y.ranking - x.ranking
    pct = items[0].percent

  pct

countRewards = (player, challenger, isWin, rewards) ->
  percent = rewardPercent(challenger.ranking)
  
  if isWin
    _str = 'win_'
  else
    _str = 'lose_'

  rankData = table.getTableItem 'rank', player.lv
  rewards.exp = parseInt rankData[_str+'exp']*(1 + percent/100)
  rewards.money = parseInt rankData[_str+'money']*(1 + percent/100)
  rewards.elixir = parseInt rankData[_str+'elixir']*(1 + percent/100)

  player.increase('money', rewards.money)
  player.increase('elixir', rewards.elixir)
  player.updateGift('challengeCount', player.dailyGift.challengeCount-1)
