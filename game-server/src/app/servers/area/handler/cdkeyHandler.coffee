async = require 'async'
playerManager = require('pomelo').app.get('playerManager')
table = require '../../../manager/table'
entityUtil = require('../../../util/entityUtil')

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::verifyCdkey = (msg, session, next) ->
  playerId = session.get('playerId')
  cdkey = msg.cdkey

  if not cdkey or not validCdkey(cdkey)
    return next(null, {code: 501, msg: '请输入有效的激活码'})

  [keyPrefix, val] = cdkey.split('-')
  player = null
  cdkeyRow = null
  async.waterfall [
    (cb) => 
      @app.get('dao').cdkey.fetchOne where: code: cdkey, cb
    
    (row, cb) =>
      console.log('row', row, typeof row.endDate, row.endDate)
      if not row
        return cb({code: 501, msg: '激活码不存在'})
      if row.activate is 1
        return cb({code: 501, msg: '激活码已使用过'})
      if row.endDate < new Date()
        return cb({code: 501, msg: '激活码已过期'})
      cdkeyRow = row
      cb()

    (cb) =>
      @app.get('dao').cdkey.isAvalifyPlayer playerId, keyPrefix, cb
    
    (valified, cb) ->
      if valified
        return cb({code: 501, msg: '每个玩家只能使用一个激活码'})
      cb()
          
    (cb) =>
      playerManager.getPlayerInfo pid: playerId, cb
   
    (player, cb) =>
      data = table.getTableItem('cdkey', keyPrefix+'-')
      if not data
        return cb({code: 501, msg: '激活码不存在'}, null, null)

      @app.get('dao').cdkey.update {
        data: activate: 1, playerId: playerId
        where: code: cdkey
      }, (err, updated) ->
        updatePlayer(@app, player, data, cb)
  ], (err, data, player, cards) ->
    if err
      return next(null, {code: err.code or 501, msg: err.msg or err})

    player.addCards cards
    player.save()
    next(null, {code: 200, msg: {data: data, cards: cards?.map (c)-> c.toJson?()}})

validCdkey = (key) -> /^\S*-\S*$/.test(key)

updatePlayer = (app, player, data, cb) ->
  setIfExist = (attrs) ->
    player.increase att, val for att, val of data when att in attrs
    return

  setIfExist ['gold', 'energy', 'money', 'skillPoint', 'elixir', 'fragments']

  if _.has data, 'spirit' and data.spirit > 0
    player.incSpirit(data.spirit)

  if _.has data, 'card_ids'
    ids = data.card_ids.split(',').map (i)-> tableId: parseInt(i), playerId: player.id
    async.map ids, entityUtil.createCard, (err, cards) -> cb(err, data, player, cards)
  else
    cb null, data, player, []

