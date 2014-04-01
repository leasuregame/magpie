http = require 'http'
url = require 'url'
util = require 'util'
logger = require('pomelo-logger').getLogger(__filename)

APPKEY = '#Wi7vFSpf3CZO0yJ#ti7FdSp3MCOm0y#'

module.exports = (app, opts) ->
  return new Component(app, opts)

class Component
  constructor: (@app, opts={}) ->

  @name = '__simpleWeb__'

  start: (cb) ->
    server = @app.getCurServer()
    http.createServer (req, res) =>
      pathname = url.parse(req.url).pathname
      if pathname is '/orderResult'
        checkOrderResult(@app, req, res)
      else 
        res.writeHead(404, 'Not Found')
        res.end()
    .listen(server.webPort, server.host)
    process.nextTick cb

  afterStart: (cb) ->
    process.nextTick cb

  stop: (force, cb) ->
    process.nextTick cb


checkOrderResult = (app, req, res) ->
  params = url.parse(req.url, true).query
  # source, trade_no, amount, partner, paydes, debug, sign
  source = params.source
  trade_no = params.trade_no
  amount = params.amount
  partner = params.partner
  paydes = params.paydes   # playerId:areaId:productId
  debug = params.debug
  sign = params.sign
  tborder = params.tborder

  tempsign = md5 util.format(
    'source=%s&trade_no=%s&amount=%d&partner=%s&paydes=%s&tborder=%s&key=%s',
    source, trade_no, amount, partner, paydes, tborder, APPKEY
  )
  if debug
    tempsign = md5 util.format(
      'source=%s&trade_no=%s&amount=%d&partner=%s&paydes=%s&debug=%d&tborder=%s&key=%s',
      source, trade_no, amount, partner, paydes, debug, tborder, APPKEY
    )
  console.log tempsign, sign
  res.writeHead(200, {'Content-type': 'application/json'})
  if tempsign is sign
    [playerId, areaId, productId] = paydes.split(':')
    session = 
      get: (k) -> return areaId if k is 'areaId'
    
    app.rpc.area.orderRemote.add session, {
      playerId: playerId
      areaId: areaId
      tradeNo: trade_no
      amount: amount
      partner: partner
      paydes: paydes
      productId: productId
      tborderNo: tborder
    }, (err, orderRes) ->
      if err or not orderRes.ok
        logger.error('add tb order faild: ', err, orderRes)
        res.write(JSON.stringify({status: 'error'}))
        return res.end()
      
      res.write(JSON.stringify {status: 'success'})
      res.end()
  else
    res.write(JSON.stringify {status: 'error'})
    res.end()

md5 = (text) ->
  hash = require('crypto').createHash('md5')
  hash.update(text).digest('hex')