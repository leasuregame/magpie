http = require 'http'
querystring = require "querystring"
url = require 'url'
util = require 'util'
fs = require 'fs'
path = require 'path'
ursa = require 'ursa'
async = require 'async'
logger = require('pomelo-logger').getLogger(__filename)

PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '..', '..', 'config', 'pp.pub'))
APP_KEY_TB = "o$KiXv0SHUsB6Dbz$2Kivk9GeTs6ODzo"

module.exports = (app, opts) ->
  return new Component(app, opts)

class Component
  constructor: (@app, opts={}) ->

  @name = '__simpleWeb__'

  start: (cb) ->
    server = @app.getCurServer()
    http.createServer (req, res) =>
      pathname = url.parse(req.url).pathname
      
      switch pathname
        when '/orderResult' 
          processTBOrderResult(@app, req, res)
          break
        when '/orderResult/PP' 
          processPPOrderResult(@app, req, res)
          break
        when '/orderResult/91' 
          process91OrderResult(@app, req, res)
          break
        else 
          res.writeHead(404, 'Not Found')
          res.end()
    .listen(server.webPort, server.host)
    process.nextTick cb

  afterStart: (cb) ->
    process.nextTick cb

  stop: (force, cb) ->
    process.nextTick cb

process91OrderResult = (app, req, res) ->
  if req.method isnt 'GET'
    res.writeHead 405, "Content-Type": "text/plain"
    return res.end()
  
  params = url.parse(req.url, true).query

  AppId        = params['AppId'] #应用ID
  Act        = params['Act'] #操作
  ProductName    = params['ProductName'] #应用名称
  ConsumeStreamId  = params['ConsumeStreamId'] #消费流水号
  CooOrderSerial   = params['CooOrderSerial'] #商户订单号
  Uin        = params['Uin'] #91帐号ID
  GoodsId      = params['GoodsId'] #商品ID
  GoodsInfo      = params['GoodsInfo'] #商品名称
  GoodsCount     = params['GoodsCount'] #商品数量
  OriginalMoney    = params['OriginalMoney'] #原始总价（格式：0.00）
  OrderMoney     = params['OrderMoney'] #实际总价（格式：0.00）
  Note       = params['Note'] #支付描述
  PayStatus      = params['PayStatus'] #支付状态：0=失败，1=成功
  CreateTime     = params['CreateTime'] #创建时间
  Sign       = params['Sign'] #91服务器直接传过来的sign

  async.waterfall [
    (done) ->
      makeSureParamsIsNotEmpty params, done

    (done) ->
      if parseInt Act isnt 1
        done ErrorCode: '3', ErrorDesc: 'Act无效'

      APP_ID_91 = process.env.APP_ID_91
      if AppId.toString() isnt APP_ID_91.toString()
        done ErrorCode: '2', ErrorDesc: 'AppId无效'

      sign_text = "#{APP_ID_91}#{Act}#{ProductName}#{ConsumeStreamId}#{CooOrderSerial}#{Uin}"+
        "#{GoodsId}#{GoodsInfo}#{GoodsCount}#{OriginalMoney}#{OrderMoney}#{Note}#{PayStatus}"+
        "#{CreateTime}#{process.env.APP_KEY_91}"
      sign_check = md5 new Buffer(sign_text, 'utf8')
      #console.log Sign, sign_check
      if sign_check is Sign
        done()
      else 
        done ErrorCode: '5', ErrorDesc: 'Sign无效'

    (done) ->
      [proId, areaId] = CooOrderSerial.split('-')
      playerId = parseInt(Note)
      remoteData = 
        playerId: playerId
        areaId: parseInt areaId
        tradeNo: CooOrderSerial
        tborderNo: ConsumeStreamId
        partner: '91'
        amount: OrderMoney
        productId: GoodsId
        paydes: Note

      session = 
        get: (k) -> return areaId if k is 'areaId'

      app.rpc.area.orderRemote.add session, remoteData, '91', (err, orderResult) ->
        if err or not orderResult.ok
          done ErrorCode: '0', ErrorDesc: '接收失败'
        else
          done()
  ], (err) ->
    if err
      res.write(JSON.stringify(err))
    else
      res.write(JSON.stringify({ErrorCode: '1', ErrorDesc: '接收成功'}))

    res.end()

makeSureParamsIsNotEmpty = (params, cb) ->
  ok = params.AppId? and params.Act? and params.ProductName? and \
  params.ConsumeStreamId? and params.CooOrderSerial? and \
  params.Uin? and params.GoodsId? and params.GoodsInfo? and \
  params.GoodsCount? and params.OriginalMoney? and \
  params.OrderMoney? and params.Note? and params.PayStatus? and \
  params.CreateTime? and params.Sign?

  if ok 
    cb(null)
  else 
    cb({ErrorCode: '0', ErrorDesc: '接收失败'})

processPPOrderResult = (app, req, res) ->
  processPost req, res, (data) ->
    sign = new Buffer(data.sign, 'base64')    
    key = ursa.createPublicKey(PUBLIC_KEY)
    base64Sign = key.publicDecrypt(sign, 'base64', 'utf8')
    jData = JSON.parse base64Sign

    #console.log 'jData=', jData, data, data.order_id is jData.order_id and data.billno is jData.billno and data.amount is jData.amount
    ### order_id, billno, account, amount, status, app_id, uuid, roleid, zone, sign ###
    if data.order_id is jData.order_id and data.billno is jData.billno and data.amount is jData.amount
      if parseInt(jData.status) is 0
        [productId, areaId] = jData.billno.split('-')
        playerId = jData.roleid

        remoteData = 
          playerId: playerId
          areaId: areaId
          tradeNo: jData.billno
          tborderNo: jData.order_id
          partner: 'PP'
          amount: jData.amount
          productId: productId

        session = 
          get: (k) -> return areaId if k is 'areaId'

        console.log '-remote-', remoteData
        app.rpc.area.orderRemote.add session, remoteData, 'PP', (err, orderRes) ->
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

processTBOrderResult = (app, req, res) ->
  if req.method isnt 'GET'
    res.writeHead 405, "Content-Type": "text/plain"
    return res.end()

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
    'source=%s&trade_no=%s&amount=%d&partner=%s&paydes=%s&debug=%d&tborder=%s&key=%s',
    source, trade_no, amount, partner, paydes, debug, tborder, APP_KEY_TB
  )
<<<<<<< HEAD
  if debug
    tempsign = md5 util.format(
      'source=%s&trade_no=%s&amount=%d&partner=%s&paydes=%s&debug=%d&tborder=%s&key=%s',
      source, trade_no, amount, partner, paydes, debug, tborder, process.env.APP_KEY_TB
    )
=======

>>>>>>> f98657adf4d0b372117a8280086998ae4215dbda
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