dao = require('pomelo').app.get('dao')
table = require('../manager/table')
cardConfig = require '../../config/data/card'
playerConfig = require '../../config/data/player'
utility = require '../common/utility'
async = require 'async'
logger = require('pomelo-logger').getLogger(__filename)
_ = require 'underscore'

MAX_PLAYER_LV = table.getTableItem('lv_limit', 1).player_lv_limit

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
    ### 等级到达最高级后不加经验 ###
    if player.lv >= MAX_PLAYER_LV
      player.exp = 0
      return

    player.increase('exp', exp)
    upgradeInfo = table.getTableItem 'player_upgrade', player.lv

    isUpgrade = false
    level9Box = null
    rewards = money: 0, energy: 0, skillPoint: 0, elixir: 0
    while(upgradeInfo? and player.exp >= upgradeInfo.exp and player.lv < MAX_PLAYER_LV)
      isUpgrade = true
      player.increase 'lv'
      player.decrease 'exp', upgradeInfo.exp
      updateFriendCount(player)

      rewards.money += upgradeInfo.money
      rewards.energy += upgradeInfo.energy
      rewards.skillPoint += upgradeInfo.skillPoint
      rewards.elixir += upgradeInfo.elixir

      upgradeInfo = table.getTableItem 'player_upgrade', player.lv
      if player.lv is 9
        level9Box = 
          money: 50000
          skillPoint: 20000
          energy: 5000
          powerValue: 200
        player.increase('money', level9Box.money)
        player.increase('skillPoint', level9Box.skillPoint)
        player.increase('energy', level9Box.energy)
        player.addPower(level9Box.powerValue)        

    if isUpgrade
      player.increase('money', rewards.money)
      player.increase('energy', rewards.energy)
      player.increase('skillPoint', rewards.skillPoint)
      player.increase('elixir', rewards.elixir)

    if player.lv is MAX_PLAYER_LV
      player.exp = 0
      
    cb(isUpgrade, level9Box, rewards)

  randomCardId: (star, lightUpIds) ->
    if lightUpIds.length > cardConfig.LUCKY_CARD_LIMIT.COUNT
      if utility.hitRate cardConfig.LUCKY_CARD_LIMIT.NEW
        id = generateCardId star, null, lightUpIds
      else
        filtered = lightUpIds.filter (i) -> (i%5 || 5) is star
        id = generateCardId star, if filtered.length > 0 then filtered else lightUpIds
        vstar = (id%5 || 5)
        id += star - vstar if star isnt vstar
    else
      id = generateCardId star

    id

  randomCardIds: (stars, num) ->
    utility.randArrayItems getCardIdsByStar(stars), num

generateCardId = (star, tableIds, exceptIds) ->
  ### exceptIds 为排除的id ###
  if not tableIds
    if exceptIds?
      tableIds = getCardIdsByStar [star], exceptIds
    else
      tableIds = getCardIdsByStar [star]

  idx = _.random(0, tableIds.length-1)
  tableIds[idx]

getCardIdsByStar = (stars, exceptIds = []) ->
  items = table.getTable('cards')
  .filter((id, row) -> id <= 500 and parseInt(id) not in exceptIds and row.star in stars)
  .map((item) -> parseInt(item.id))
  .sort((x, y) -> x - y)
  items

genSkillInc = (card) ->
  cdata = table.getTableItem('cards', card.tableId)
  skill = cdata?.skill_id_linktarget
  if skill?
    min = skill["star#{card.star}_inc_min"]
    max = skill["star#{card.star}_inc_max"]
    card.skillInc = _.random(min, max)
  else
    logger.warn('can not file skill info of card: ' + card.tableId)

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