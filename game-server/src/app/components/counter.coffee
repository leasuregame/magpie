Client = require('pomelo-admin').adminClient
logger = require('pomelo-logger').getLogger(__filename)
utility = require('../common/utility')
path = require 'path'
fs = require 'fs'

DEFAULT_INTERVAL = 60000 * 30
HOUR  = 0
DATE_FILEPATH = path.join(__dirname, '..', '..', 'config', 'lvDistributionDate.conf')

module.exports = (app, opts) ->
  return new Component(app, opts)

class Component
  constructor: (app, opts={}) ->
    @app = app
    @interval = opts.interval || DEFAULT_INTERVAL
    @flagDate = '1970-1-1'
    @timerId = null
    @timerId_lvDis = null
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
    @timerId = setInterval onlineUserCounter.bind(null, @), @interval
    @timerId_lvDis = setInterval lvDistributionCounter.bind(null, @), 60000 * 60 * 24
    process.nextTick cb

  stop: (force, cb) ->
    clearInterval @timerId
    clearInterval @timerId_lvDis
    process.nextTick cb


onlineUserCounter = (self) ->
  self.client.request 'areaInfo', {sid: self.app.getServerId()}, (err, data) ->
    self.app.get('dao').onlineUser.create data: {
      createTime: Date.now()
      qty: data.length
    }, (err, res) -> 
      if err
         logger.error('faild create onlineUser record.', err)

lvDistributionCounter = (self) ->
  logger.info self.flagDate, utility.shortDateString(), new Date().getHours(), HOUR
  return if self.flagDate == utility.shortDateString() or new Date().getHours() != HOUR

  dateStr = fs.readFileSync(DATE_FILEPATH).toString()
  if not /^\d{4}-\d{1,2}-\d{1,2}$/.test(dateStr)
    logger.error('date string of lvDistributionDate.conf if not right.')
    return

  self.flagDate = utility.shortDateString()
  [year, month, day] = dateStr.split('-')
  self.app.get('dao').lvDistribution.analyseLvDistribution(year, month, day)