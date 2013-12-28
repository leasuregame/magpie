http = require 'http'
url = require 'url'
util = require 'util'

APPKEY = 'o$KiXv0SHUsB6Dbz$2Kivk9GeTs6ODzo'

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
    console.log 'create web on http://'+server.host+':'+server.webPort
    process.nextTick cb

  afterStart: (cb) ->
    process.nextTick cb

  stop: (force, cb) ->
    process.nextTick cb


checkOrderResult = (app, req, res) ->
  params = url.parse(req.url, true).query
  console.log '-a--a--a-', params
  # source, trade_no, amount, partner, paydes, debug, sign
  source = params.source
  trade_no = params.trade_no
  amount = params.amount
  partner = params.partner
  paydes = params.paydes   # playerId:areaId:productId
  debug = params.debug
  sign = params.sign

  tempsign = md5 util.format(
    'source=%s&trade_no=%s&amount=%d&partner=%s&paydes=%s&key=%s',
    source, trade_no, amount, partner, paydes, APPKEY
  )
  if debug
    tempsign = md5 util.format(
      'source=%s&trade_no=%s&amount=%d&partner=%s&paydes=%s&debug=%d&key=%s',
      source, trade_no, amount, partner, paydes, debug, APPKEY
    )

  res.writeHead(200, {'Content-type': 'application/json'})
  console.log 'tems sign: ', tempsign
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
    }, (err, orderRes) ->
      console.log '-asdfasd-', err, orderRes
      if err or not orderRes.ok
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