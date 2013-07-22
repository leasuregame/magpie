app = require('pomelo').app
dao = app.get('dao')
job = require('../dao/job')
_ = require('underscore')

Manager = module.exports = 
  exchangeRankings: (player, targetId, rewards, isWin, cb) ->
    dao.rank.fetchMany where: " playerId in (#{[player.id, targetId].toString()}) ", (err, ranks) ->
      if err
        return cb(err)

      if !!ranks and ranks.length isnt 2
        return cb({code: 501, msg: 'can not get all rank records'})

      challenger = (ranks.filter (r) -> r.playerId == player.id)?[0]
      defender = (ranks.filter (r) -> r.playerId == targetId)?[0]
      playerRanking = challenger.ranking
      targetRanking = defender.ranking

      if isWin
        defender.set('ranking', playerRanking)
        challenger.set('ranking', targetRanking)
        challenger.incCount('win')
        challenger.incCount('winningStreak')
        defender.resetCount('winningStreak')
        defender.incCount('lose')
      else
        challenger.incCount('lose')
        defender.incCount('win')
        defender.incCount('winningStreak')
        challenger.resetCount('winningStreak')

      challenger.incCount('challenge')
      defender.incCount('challenge')
      challenger.increase('honorPoint', rewards.honorPoint)
      defender.increase('honorPoint', parseInt(rewards.honorPoint/2))
      challenger.pushRecent(targetId)
      defender.pushRecent(player.id)

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

      job.multJobs jobs, cb
