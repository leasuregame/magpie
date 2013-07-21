app = require('pomelo').app
dao = app.get('dao')
_ = require('underscore')

Manager = module.exports = 
  exchangeRankings: (playerId, targetId, rewards, isWin, cb) ->
    app.get('dao').rank.select " playerId in (#{[playerId, targetId].toString()}) ", (err, ranks) ->
      if err
        return cb(err)

      if !!res and res.length isnt 2
        return cb({code: 501, msg: 'can not get all rank records'})

      challenger = (ranks.filter (r) -> r.playerId == playerId)?[0]
      defender = (ranks.filter (r) -> r.playerId == targetId)?[0]
      playerRanking = challenger.ranking
      targetRanking = defender.ranking

      if isWin
        defender.set('ranking', playerRanking)
        challenger.set('ranking', targetRanking)
        challenger.incCount('win')
        challenger.incCount('winningStreak')
        defender.resetCount('winningStreak')
      else
        challenger.incCount('lose')
        defender.incCount('win')
        defender.incCount('winningStreak')
        challenger.resetCount('winningStreak')

      challenger.incCount('challenge')
      challenger.increase('honorPoint', rewards.honorPoint)
      defender.increase('honorPoint', parseInt(rewards.honorPoint/2))

      sqlList = [
        {
          sql: 'update player set exp = ?, money = ? where id = ?',
          args: [rewards.exp, rewards.money, playerId]
        }
        {
          sql: 'update rank set ranking = ?, honorPoint = ? where playerId = ?',
          args: [targetRanking, rewards.honorPoint, playerId]
        }
        {
          sql: 'update rank set ranking = ?, honorPoint = ? where playerId = ?',
          args: [playerRanking, parseInt(rewards.honorPoint/2), targetId]
        }
      ]