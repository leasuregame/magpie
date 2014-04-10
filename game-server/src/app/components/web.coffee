http = require 'http'
querystring = require "querystring"
url = require 'url'
util = require 'util'
fs = require 'fs'
path = require 'path'
ursa = require 'ursa'
logger = require('pomelo-logger').getLogger(__filename)

APPKEY = '#Wi7vFSpf3CZO0yJ#ti7FdSp3MCOm0y#'

PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '..', '..', 'config', 'pp.pub'))

module.exports = (app, opts) ->
  return new Component(app, opts)

class Component
  constructor: (@app, opts={}) ->

  @name = '__simpleWeb__'

  start: (cb) ->
    server = @app.getCurServer()
    http.createServer (req, res) =>
      pathname = url.parse(req.url).pathname
      console.log pathname, req.method, req
      if pathname is '/orderResult'
        checkOrderResult(@app, req, res)
      else if pathname is '/orderResult/PP'
        processPPOrderResult(@app, req, res)
      else 
        res.writeHead(404, 'Not Found')
        res.end()
    .listen(server.webPort, server.host)
    process.nextTick cb

  afterStart: (cb) ->
    process.nextTick cb

  stop: (force, cb) ->
    process.nextTick cb

processPPOrderResult = (app, req, res) ->
  processPost req, res, (data) ->
    sign = new Buffer(data.sign, 'base64')    
    key = ursa.createPublicKey(PUBLIC_KEY)
    base64Sign = key.publicDecrypt(sign, 'base64', 'utf8')
    jData = JSON.parse base64Sign
    console.log 'jData=', jData
    ### order_id, billno, account, amount, status, app_id, uuid, roleid, zone, sign ###
    if data.order_id is jData.order_id and data.billno is jData.billno and data.amount is jData.amount and data.status is jData.status
      if jData.status is '0'
        [productId, areaId] = jData.billno.split('-')
        playerId = jData.roleid

        remoteData = 
          playerId: playerId
          areaId: areaId
          tradeNo: jData.billno
          tborderNo: jData.order_id
          partner: 'PP'
          amount: jData.amount

        session = 
          get: (k) -> return areaId if k is 'areaId'

        app.rpc.area.orderRemote.add session, remoteData, 'PP', (err, orderRes) ->
          console.log '-a-', err, orderRes
          if err or not orderRes.ok
            res.write('fail')
            res.end()
          else
            res.write("success")
            res.end()
      else 
        res.write("success")
        res.end()
    else
      res.write('fail')
      res.end()

processPost = (request, response, callback) ->
  queryData = ""
  return null  if typeof callback isnt "function"
  if request.method is "POST"
    request.on "data", (data) ->
      queryData += data
      if queryData.length > 1e6
        queryData = ""
        response.writeHead(413,
          "Content-Type": "text/plain"
        ).end()
        request.connection.destroy()
      return

    request.on "end", ->
      callback(querystring.parse(queryData))
      return
  else
    response.writeHead 405,
      "Content-Type": "text/plain"

    response.end()
    callback()
  return

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
    }, 'TB', (err, orderRes) ->
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