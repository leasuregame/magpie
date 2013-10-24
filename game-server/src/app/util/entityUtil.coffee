dao = require('pomelo').app.get('dao')
table = require('../manager/table')
cardConfig = require '../../config/data/card'
playerConfig = require '../../config/data/player'
utility = require '../common/utility'
async = require 'async'
_ = require 'underscore'

module.exports = 
  createCard: (data, done) ->
    unless data.star
      data.star = data.tableId%5 or 5

    if data.star >= 3
      data.passiveSkills = initPassiveSkill(data.star)
      genSkillInc(data)

    dao.card.create data: data, (err, card) ->
      if err
        return done(err)
      done(null, card)

  resetSkillIncForCard: (card) ->
    genSkillInc(card) if card.star >= 3

  upgradePlayer: (player, exp, cb) ->
    player.increase('exp', exp)
    upgradeInfo = table.getTableItem 'player_upgrade', player.lv

    isUpgrade = false
    rewards = money: 0, energy: 0, skillPoint: 0, elixir: 0
    while(player.exp >= upgradeInfo.exp)
      isUpgrade = true
      player.increase 'lv'
      player.elixirPerLv = {}
      player.decrease 'exp', upgradeInfo.exp
      updateFriendCount(player)

      rewards.money += upgradeInfo.money
      rewards.energy += upgradeInfo.energy
      rewards.skillPoint += upgradeInfo.skillPoint
      rewards.elixir += upgradeInfo.elixir

      upgradeInfo = table.getTableItem 'player_upgrade', player.lv

    player.increase('money', rewards.money)
    player.increase('energy', rewards.energy)
    player.increase('skillPoint', rewards.skillPoint)
    player.increase('elixir', rewards.elixir)
    cb(isUpgrade, rewards)

genSkillInc = (card) ->
  cdata = table.getTableItem('cards', card.tableId)
  skill = cdata.skill_id_linktarget
  if skill?
    min = skill["star#{card.star}_inc_min"]
    max = skill["star#{card.star}_inc_max"]
    card.skillInc = _.random(min, max)
  else
    throw new Error('can not file skill info of card: ' + card.tableId)

updateFriendCount = (player) ->
  fl = playerConfig.FRIENDCOUNT_LIMIT
  keys = Object.keys(fl).reverse()

  for lv in keys
    if player.lv >= lv
      vipInfo = table.getTableItem('vip_privilege', player.vip)
      player.friendsCount = fl[lv] + vipInfo.friend_count
      break

initPassiveSkill = (star) ->
  count = star - 2
  results = []
  for i in [0...count]
    index = _.random(cardConfig.PASSIVESKILL.TYPE.length-1)
    [start, end] = cardConfig.PASSIVESKILL.VALUE_SCOPE.split('-')
    results.push(
      id:i,
      name: cardConfig.PASSIVESKILL.TYPE[index],
      value: parseFloat(parseFloat(_.random(parseInt(start) * 10, parseInt(end) * 10) / 10).toFixed(1))
    )
  results