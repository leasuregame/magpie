async = require 'async'
playerManager = require('pomelo').app.get('playerManager')
table = require '../../../manager/table'

module.exports = (app) ->
	new Handler(app)

Handler = (@app) ->

Handler::valifyCdkey = (msg, session, next) ->
	playerId = session.get('playerId')
	cdkey = msg.cdkey

	if not cdkey or not validCdkey(cdkey)
		return next(null, {code: 501, msg: 'please input a valid cdkey'})

	[keyPrefix, val] = cdkey.split('-')
	async.waterfall [
		(cb) =>
			@app.get('dao').isAvalifyPlayer playerId, keyPrefix, cb
		(valified, cb) ->
			if valified
				return ({code: 501, msg: 'you have valify a cdkey, can not valify another one'})
			cd()
		(cb) => 
			@app.get('dao').fetch where: key: cdkey, cb
		(row, cb) =>
			if row.activate is 1
				return cb({code: 501, msg: 'a used cdkey'})
			if row.endDate < new Date()
				return cb({code: 501, msg: 'cdkey is expired'})

			@app.get('dao').update {
				data: activate: 1
				where: key: cdkey
			}, cb
		(updated, cb) =>
			playerManager.getPlayerInfo pid: playerId, cb
		(player) =>
			data = table.getTableItem('cdkey', keyPrefix)
			if not data
				return cb({code: 501, msg: 'unvalid cdkey'})
			updatePlayer(@app, player, data, cb)
	], (err, data, cards) ->
		if err
			return next({code: err.code or 501, msg: err.msg or err})

		player.save()
		next(null, {code: 200, msg: {data: data, cards: cards}})

validCdkey = (key) -> /^\S*-\S*$/.test(key)

updatePlayer = (app, player, data, cb) ->
	setIfExist = (attrs) ->
		player.increase att, val for att, val of boxInfo when att in attrs
		return

	setIfExist ['gold', 'energy', 'money', 'skillPoint', 'elixir', 'fragments']

	if _.has data, cardIds
		ids = cardIds.split(',').map (i) tableId: parseInt i
		async.map ids, entityUtil.createCard, (err, cards) -> cb(err, data, cards)
	else
		cd null, data, []

