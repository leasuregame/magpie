app = require('pomelo').app
dao = app.get('dao')
job = require('../dao/job')
table = require('./table')
achieve = require('../domain/achievement')
_ = require('underscore')

Manager = module.exports = 
  getRank: (playerId, cb) ->
    dao.rank.fetchOne sync: true, where: {playerId: playerId}, cb

  exchangeRankings: (player, targetId, isWin, cb) ->
    dao.rank.fetchMany where: " playerId in (#{[player.id, targetId].toString()}) ", (err, ranks) ->
      if err
        return cb(err)

      if !!ranks and ranks.length isnt 2
        return cb({code: 501, msg: 'can not get all rank records'})

      challenger = (ranks.filter (r) -> r.playerId == player.id)?[0]
      defender = (ranks.filter (r) -> r.playerId == targetId)?[0]
      challenger.increase('challengeCount')
      defender.increase('challengeCount')
      defender.pushRecent(player.id)
      
      rewards = {ranking_elixir: 0}
      countRewards(player, challenger, isWin, rewards)

      if isWin        
        exchangeRanking(challenger, defender)
        updateRankInfo(challenger, defender)
        
        ### 首次达到排名奖励 1, 10, 50, 100, 500, 1000, 5000 ###
        # if challenger.canGetRankingReward()
        #   challenger.getRankingReward()
          # rewards.ranking_elixir = table.getTableItem('ranking_reward', player.ranking).elixir
          # player.increase('elixir', rewards.ranking_elixir)
      else
        updateRankInfo(defender, challenger)

      # update rank info
      player.rank = challenger
      updateAll(player, challenger, defender, targetId, rewards, cb)
      

updateAll = (player, challenger, defender, targetId, rewards, cb) ->
  jobs = [
    {
      type: 'update',
      options: 
        table: 'player',
        where: {id: player.id}
        data: player.getSaveData()
    }
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

  job.multJobs jobs, (err, res) -> cb(err, res, rewards) 

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

checkAchievement = (player, challenger) ->
  achieve.winCount(player, challenger.winCount)
  achieve.winningStreak(player, challenger.winningStreak)
  achieve.rankingToOne(player) if palyer.ranking is 1

rewardPercent = (ranking) ->
  pct = 0
  items = table.getTable('ranking_reward_factor').filter (id, row) ->
    row.ranking <= ranking

  if items.length > 0
    items.sort (x, y) -> y.ranking - x.ranking
    pct = items[0].percent

  pct

countRewards = (player, challenger, isWin, rewards) ->
  if isWin
    percent = rewardPercent(challenger.ranking)
    _str = 'win_'
  else
    percent = 0
    _str = 'lose_'

  rankData = table.getTableItem 'rank', player.lv
  rewards.exp = parseInt rankData[_str+'exp']*(1 + percent/100)
  rewards.money = parseInt rankData[_str+'money']*(1 + percent/100)
  rewards.elixir = parseInt rankData[_str+'elixir']*(1 + percent/100)

  player.increase('exp', rewards.exp)
  player.increase('money', rewards.money)
  player.increase('elixir', rewards.elixir)