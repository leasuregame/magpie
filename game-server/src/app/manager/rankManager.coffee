dao = require('pomelo').app.get('dao')
_ = require('underscore')

Manager = module.exports = 
  exchangeRankings: (playerId, targetId, cb) ->
    app.get('dao').rank.select " playerId in (#{[playerId, targetId].toString()}) ", (err, ranks) ->
      if err
        return cb(err)

      if !!res and res.length isnt 2
        return cb({code: 501, msg: 'can not get all rank records'})

      dao.rank.updateRanks {
        player: {id: playerId, ranking: _.find(ranks, (r) -> r.playerId == playerId).ranking}
        target: {id: targetId, ranking: _.find(ranks, (r) -> r.playerId == targetId).ranking}
      }, cb