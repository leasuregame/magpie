Client = require('pomelo-admin').adminClient
logger = require('pomelo-logger').getLogger(__filename)

DEFAULT_INTERVAL = 300000

module.exports = (app, opts) ->
  return new Component(app, opts)

class Component
  constructor: (app, opts) ->
    @app = app
    @interval = opts.interval || DEFAULT_INTERVAL
    @timerId = null
    @client = new Client(
      username: 'admin',
      password: 'admin'
    )

  @name: '__counter__'

  start: (cb) ->
    master = @app.getMaster()
    @client.connect 'counter-component'+@app.getServerId(), master.host, master.port, (err, res) -> 
      if err
        logger.error('conter component connect to master faild.', err)
      logger.info('counter component connect to master success')

    process.nextTick cb

  afterStart: (cb) ->
    runCounter = =>
      logger.info(@client.request 'areaInfo', null, (err, data) -> console.log err, data)

    @timerId = setInterval runCounter, @interval
    process.nextTick cb

  stop: (force, cb) ->
    clearInterval @timerId
    process.nextTick cb