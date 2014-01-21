logger = require('pomelo-logger').getLogger(__filename)
utility = require '../../../common/utility'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::success = (msg, session, next) ->
  version = msg.version
  fpath = msg.path

  @app.get('dao').upgrade.create data: {
    version: version,
    path: fpath,
    created: utility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
  }, (err, res) ->
    if err
      logger.error('faild to create upgrade record.', err)
      next(null, {code: 500, msg: err.msg})

    next(null, {code: 200})