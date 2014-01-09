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
      @app.get('dao').cdkey.fetchOne where: code: cdkey, (err, res) ->
        if err and err.code is 404
          return cb({code: 501, msg: '激活码不存在'})
        else 
          cb(err, res)
    
    (row, cb) =>
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
    data = returnData(data)
    data.cards = cards?.map (c)-> c.toJson?()
    next(null, {code: 200, msg: data})

validCdkey = (key) -> /^\S*-\S*$/.test(key)

returnData = (data) ->
  gold: data.gold if data.gold
  energy: data.energy if data.energy
  money: data.money if data.money
  skillPoint: data.skillPoint if data.skillPoint
  elixir: data.elixir if data.elixir
  fragment: data.fragments if data.fragments
  spirit: data.spirit if data.spirit

updatePlayer = (app, player, data, cb) ->
  setIfExist = (attrs) ->
    player.increase att, val for att, val of data when att in attrs
    return

  setIfExist ['gold', 'energy', 'money', 'skillPoint', 'elixir', 'fragments']

  if _.has data, 'spirit' and data.spirit > 0
    player.incSpirit(data.spirit)

  if _.has data, 'card_ids'
    ids = data.card_ids?.toString().split(',') or []
    lvs = data.card_lvs?.toString().split(',') or []
    qtys = data.card_qtys?.toString().split(',') or []

    rows = []
    for id, i in ids
      if qtys[i]? and qtys[i] > 1
        count = parseInt(qtys[i])
      else 
        count = 1
      
      for j in [1..count]
        rows.push 
          tableId: parseInt(id),
          lv: if lvs[i]? then parseInt(lvs[i]) else 1
          playerId: player.id

    async.map rows, entityUtil.createCard, (err, cards) -> cb(err, data, player, cards)
  else
    cb null, data, player, []

