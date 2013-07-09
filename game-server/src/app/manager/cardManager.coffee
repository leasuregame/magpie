dao = require('pomelo').app.get('dao');
async = require 'async'
_ = require 'underscore'

class Manager
  @deleteCards: (ids, cb) ->
    ids = [ids] if not _.isArray(ids)

    async.each(
      ids,
      (id, done) ->
        dao.card.deleteCardById id, (err, result) ->
          if err isnt null
            return done(err)

          done()
      , (err) ->
        if err isnt null
          cb(err, false)
        else
          cb(null, true)
      )
