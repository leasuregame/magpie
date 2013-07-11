dao = require('pomelo').app.get('dao');
async = require 'async'
_ = require 'underscore'

class Manager
  @deleteCards: (ids, cb) ->
    ids = [ids] if not _.isArray(ids)

    async.map(
      ids,
      (id, done) ->
        dao.card.deleteCardById id, (err, result) ->
          if err isnt null
            return done(err, false)

          done(null, result)
      , (err, results) ->
        if err isnt null
          cb(err, false)
        else
          cb(null, _.some(results))
      )

  @getCards: (ids, cb) ->
    ids = [ids] if not _.isArray(ids)

    async.map(
      ids,
      (id, done) ->
        dao.card.getCardInfo id, done
      , (err, cards) ->
        if err isnt null
          cb(err, null)
        else
          cb(null, cards)

    )

  @getCardInfo: (id, cb) ->
    dao.card.getCardInfo id, cb

module.exports = Manager