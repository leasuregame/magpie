_ = require 'underscore'
async = require 'async'
request = require 'request'
table = require '../../../manager/table'
utility = require '../../../common/utility'
rechargeDao = require('pomelo').app.get('dao').backendRecharge

GOLDCARD_MAP =
  'com.leasuregame.magpie.week.card': 'week'
  'com.leasuregame.magpie.month.card': 'month'

GOLD_CARD_ID_WEEK = 'com.leasuregame.magpie.week.card'
GOLD_CARD_ID_MONTH = 'com.leasuregame.magpie.month.card'

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::recharge = (msg, session, next) ->
  app = @app

  playerIds = msg.playerIds
  playerNames = msg.playerNames
  signature = msg.signature
  proId = msg.productId
  type = if msg.type then msg.type else 0
  qty = msg.qty

  if not _.isArray playerIds
    playerIds = [playerIds]

  if (not qty) or (not _.isNumber qty) or qty <= 0 or qty > 20
    return next(null, {code: 500, msg: 'parameter unexpected'})

  if (isGoldCard(proId) && qty != 1)
    return next(null, {code: 500, msg: 'parameter unexpected'})

  if (not signature || signature.length != 32)
    return next(null, {code: 500, msg: 'parameter unexpected'})

  verifyParam = msg;
  verifyParam.areaId = session.get('areaId');
  if(!verifySignature signature, verifyParam)
    return next(null, {code: 500, msg: 'verify failed'})

  products = table.getTable('recharge').filter (id, item) -> item.product_id is proId
  if products and products.length > 0
    product = products[0]
  else
    return next(null, {code: 500, msg: 'product does not exists'})

  # 用于记录用户的充值结果
  retPlayers = []
  async.each playerIds
  , (playerId, eachCb) ->
    isFirstRechage = false
    player = null

    async.waterfall [
      (cb) ->
        #查找用户
        app.get('playerManager').getPlayerInfo {pid: playerId}, cb

      (_player, cb) ->
        #为用户增加相关资源
        player = _player

        if product.product_id == GOLD_CARD_ID_WEEK && player.goldCards.week
          return cb({msg:'充值失败,周卡已存在'})
        else if product.product_id == GOLD_CARD_ID_MONTH && player.goldCards.month
          return cb({msg:'充值失败,月卡已存在'})

        presentTimes = 1

        ### 首冲获得相应倍数魔石 ###
        if player.isRechargeFirstTime(parseInt product.id)
          presentTimes = product.times
          player.setRechargeFirstTime(parseInt product.id)

        if player.cash is 0
          isFirstRechage = true

        cashAmount = product.cash * qty
        goldGain = (product.cash * 10 + product.gold) * (presentTimes + qty - 1)

        player.increase('cash', cashAmount)
        player.increase('gold', goldGain)
        player.save()

        orderId = new Date().getTime() + "" + Math.ceil(Math.random() * 100)

        addGoldCard(app, orderId, player, product, ->
          cb null, data:
            playerId : player.id
            type : type
            productId : proId
            qty : qty
            amount : cashAmount
            gain : goldGain
        )
      (rechargeData, cb) ->
        # 记录此次操作
        rechargeDao.createRecharge rechargeData, cb
    ], (err) ->
      retPlayerData = {
        id : playerId
        name : player && player.name
        status : 1
      }
      if err
        # 如果充值失败,返回失败信息
        retPlayerData.status = 2
        retPlayerData.msg = err.msg
        eachCb()
      retPlayers.push retPlayerData
      successMsg app, player, isFirstRechage
      eachCb()
  , (err) ->
    if(err)
      next null, {code: 500, msg: err}
    next null, {code: 200, msg: {players:retPlayers, product:product, qty:qty}}


verifySignature = (sig, param) ->
  SALTS = ['JWj$vN_F!g','?eecCX37lg','0%OZ-Yf@l?','a938tofcqv',
           'iw57m:>s>~','d,CZ>e12j;','63dS0OZ$R#','N"WY9YU&&J',
           'Kl=.aqX)=M',';1E6BNG*(0','w17muG:gZZ','V1Ue.J)Nl9']

  crypto = require 'crypto'
  salt = SALTS[new Date().getHours() % SALTS.length];

  md5 = crypto.createHash('md5');
  md5.update(param.areaId.toString());
  md5.update(salt);
  md5.update(param.playerIds.toString());
  md5.update(param.productId.toString());
  conPart1 = md5.digest('hex');

  md5 = crypto.createHash('md5');
  md5.update(param.qty.toString());
  md5.update(salt);
  md5.update(param.playerNames.toString());
  conPart2 = md5.digest('hex');

  md5 = crypto.createHash('md5');
  md5.update(conPart1);
  md5.update(conPart2);

  sig == md5.digest('hex')


addGoldCard = (app, orderId, player, product, cb) ->
  return cb() if not isGoldCard(product)

  createNewGoldCard app, orderId, player, product, cb

isGoldCard = (product) ->
  ids = [
    GOLD_CARD_ID_WEEK,
    GOLD_CARD_ID_MONTH
  ]
  if product and product.product_id in ids
    return true
  else
    return false

createNewGoldCard = (app, orderId, player, product, cb) ->
  today = new Date()
  vd = new Date()
  vd.setDate(vd.getDate()+product.valid_days-1)
  app.get('dao').goldCard.create {
    data: {
      orderId: orderId,
      playerId: player.id,
      type: GOLDCARD_MAP[product.product_id],
      created: utility.dateFormat(today, "yyyy-MM-dd"),
      validDate: utility.dateFormat(vd, "yyyy-MM-dd"),
      status: 1
    }
  }, (err, res) ->
    if err
      logger.error('faild to create goldCard record: ', err)

    player.addGoldCard(res)
    cb()

successMsg = (app, player, isFirstRechage) ->
  app.get('messageService').pushByPid player.id, {
    route: 'onVerifyResult'
    msg: {
      gold: player.gold
      vip: player.vip
      cash: player.cash
      goldCards: player.getGoldCard()
      recharge: player.firstTime.recharge or 0
      firstRechargeBox: 1 if isFirstRechage
      vipLoginReward: !player.dailyGift.vipReward if player.isVip()
    }
  }, (err, res) ->
    if err
      logger.error('faild to send message to playerId ', playerId)