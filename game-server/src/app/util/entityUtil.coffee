dao = require('pomelo').app.get('dao')
playerManager = require('pomelo').app.get('playerManager')
table = require('../manager/table')
configData = require '../../config/data'
utility = require '../common/utility'
job = require '../dao/job'
async = require 'async'
logger = require('pomelo-logger').getLogger(__filename)
_ = require 'underscore'

MAX_PLAYER_LV = table.getTableItem('lv_limit', 1).player_lv_limit

module.exports = 
  createCard: (data, done) ->
    unless data.star
      data.star = cardStar(data.tableId)

    if data.star >= 3
      data.passiveSkills = initPassiveSkillGroup(data.star)
      genFactorForCard(data)

    dao.card.create data: data, (err, card) ->
      if err
        return done(err)
      done(null, card)

  ###
  cards  a array contains one or more card's info
  done   a callback execute after created all cards
  ###
  createCards: (cards, done) ->
    cards = [cards] if not _.isArray(cards)

    async.map cards, (card, doneEach) =>
      qty = card.qty or 1
      delete card.qty
      async.times qty, (n, doneTimes) => 
        @createCard card, doneTimes
      , doneEach
    , (err, res) ->
      if err
        done(err)
      else 
        items = res.reduce(
          (x, y) -> x.concat(y)
        , [])
        done(err, items)

  resetSkillIncForCard: (card) ->
    genSkillInc(card) if card.star >= 3

  upgradePlayer: (player, exp, cb) ->
    ### 等级到达最高级后不加经验 ###
    if player.lv >= MAX_PLAYER_LV
      player.exp = 0
      return cb(false)

    player.increase('exp', exp)
    upgradeInfo = table.getTableItem 'player_upgrade', player.lv

    isUpgrade = false
    level9Box = null
    rewards = money: 0, energy: 0, skillPoint: 0, elixir: 0, power: 0
    while(upgradeInfo? and player.exp >= upgradeInfo.exp and player.lv < MAX_PLAYER_LV)
      isUpgrade = true
      player.increase 'lv'
      player.decrease 'exp', upgradeInfo.exp
      
      updateFriendCount(player)

      rewards.money += upgradeInfo.money
      rewards.energy += upgradeInfo.energy
      rewards.skillPoint += upgradeInfo.skillPoint
      rewards.elixir += upgradeInfo.elixir
      rewards.power += upgradeInfo.power

      upgradeInfo = table.getTableItem 'player_upgrade', player.lv
      if player.lv is 9
        level9Box = 
          money: 50000
          skillPoint: 50000
          energy: 5000
          powerValue: 100
          gold: 200
        player.increase('money', level9Box.money)
        player.increase('skillPoint', level9Box.skillPoint)
        player.increase('energy', level9Box.energy)
        player.addPower(level9Box.powerValue)        
        player.increase('gold', level9Box.gold)

    if isUpgrade
      player.increase('money', rewards.money)
      player.increase('energy', rewards.energy)
      player.increase('skillPoint', rewards.skillPoint)
      player.increase('elixir', rewards.elixir)
      player.addPower rewards.power

    if player.lv is MAX_PLAYER_LV
      player.exp = 0
      
    cb(isUpgrade, level9Box, rewards)

  randomCardId: (star, lightUpIds) ->
    ###
      点亮7张卡牌后，概率随机到新卡和旧卡
    ###
    if lightUpIds.length > configData.card.LUCKY_CARD_LIMIT.COUNT
      if utility.hitRate configData.card.LUCKY_CARD_LIMIT.NEW
        id = generateCardId star, null, lightUpIds
      else
        filtered = filterTableId star, lightUpIds
        id = generateCardId star, filtered
        vstar = cardStar(id)
        id += star - vstar if star isnt vstar
    else
      id = generateCardId star

    id

  randomCardIds: (stars, num) ->
    utility.randArrayItems getCardIdsByStar(stars), num

  getReward: (player, data, cb) ->
    setIfExist(player, data)

    if typeof data.spirit != 'undefined' and data.spirit > 0
      player.incSpirit(data.spirit)
    if typeof data.power != 'undefined' and data.power > 0
      player.addPower(data.power)
      
    if typeof data.exp_card_count != 'undefined' and data.exp_card_count > 0
      playerManager.addExpCardFor player, data.exp_card_count, data.exp_card_star, cb
    else if typeof data.card_id != 'undefined' and data.card_id > 0
      this.createCard {
        playerId: player.id
        tableId: data.card_id
      }, (err, card) -> cb(null, [card])
    else 
      cb(null, [])

  updateEntities: (groups..., cb) ->
    ###
    groups ['optionName', 'tableName', entityObject], ...
    e.g. ['update', 'player', player], ['update', 'card', cards], ['delete', 'card', cards], ...
    ###
    jobs = []
    groups.forEach (group) ->
      if _.isArray(group) and group.length >= 2
        type = group[0]
        tableName = group[1]
        entities = group.slice(2)
        entities.forEach (ent) -> 
          action = type: type, options: {table: tableName}

          switch type
            when 'update' 
              data = ent.getSaveData()
              if not _.isEmpty(data)
                action.options.where = id: ent.id
                action.options.data = data
            when 'delete'
              if _.isArray(ent) and ent.length > 0
                ids = ent.map (e) -> e.id or e
                action.options.where = " id in (#{ids.toString()}) "
              else if _.has(ent, 'id')
                action.options.where = id: ent.id
              else if _.isString(ent)
                action.options.where = ent
              else
                action.options.where = '1=2'
            when 'insert'
              action.options.data = ent
            else
              action.options = {}

          jobs.push action

    console.log '-jobs-', JSON.stringify(jobs)
    job.multJobs jobs, cb

setIfExist = (player, data, attrs=['energy', 'money', 'skillPoint', 'elixir', 'gold', 'fragments', 'honor', 'superHonor']) ->
  player.increase att, val for att, val of data when att in attrs and val > 0
  return

filterTableId = (star, ids) ->
  if star isnt 5
    return ids

  # 过滤掉5星卡牌及与其同一系列的所有卡牌
  exceptIds = []
  ids.forEach (i) ->
    if cardStar(i) is 5
      s = i-4
      e = i+15
      exceptIds = exceptIds.concat [s..e]
  
  results = ids.filter (i) -> i not in exceptIds
  if results.length > 0 then results else ids


generateCardId = (star, tableIds, exceptIds) ->
  ### 
  star: 卡牌星级
  tableIds: 如果不为空，那么从tableIds中拿一张
  exceptIds: 为排除的卡牌id 
  ###
  if not tableIds
    if exceptIds?
      tableIds = getCardIdsByStar [star], exceptIds
    else
      tableIds = getCardIdsByStar [star]

  idx = _.random(0, tableIds.length-1)
  tableIds[idx]

getCardIdsByStar = (stars, exceptIds = [], isContainsRare=false) ->
  if isContainsRare
    rare_card_filter = (row) -> true
  else
    rare_card_filter = (row) -> (row.is_rare) isnt 1

  items = table.getTable('cards')
  .filter((id, row) -> id <= 1500 and parseInt(id) not in exceptIds and row.star in stars and rare_card_filter(row)) 
  .map((item) -> parseInt(item.id))
  .sort((x, y) -> x - y)

  if items.length is 0 and exceptIds.length > 0
    return exceptIds.filter (i) -> cardStar(i) in stars

  console.log 'cardIds:', items
  items

cardStar = (tid) ->
  tid%20 || 20

genFactorForCard = (card) ->
  card.factor = _.random(1, 1000)

genSkillInc = (card) ->
  cdata = table.getTableItem('cards', card.tableId)
  skill = cdata?.skill_id_linktarget
  if skill?
    min = skill["star#{card.star}_inc_min"]
    max = skill["star#{card.star}_inc_max"]
    card.skillInc = _.random(min, max)
  else
    logger.warn('can not find skill info of card: ' + card.tableId)

updateFriendCount = (player) ->
  fl = configData.player.FRIENDCOUNT_LIMIT
  keys = Object.keys(fl).reverse()

  for lv in keys
    if player.lv >= lv
      vipInfo = table.getTableItem('vip_privilege', player.vip)
      player.friendsCount = fl[lv] + vipInfo.friend_count
      break

initPassiveSkill = (star) ->
  count = star - 2
  count = 3 if count > 3
  
  results = []
  for i in [0...count]
    index = _.random(configData.card.PASSIVESKILL.TYPE.length-1)
    [start, end] = configData.card.PASSIVESKILL.VALUE_SCOPE.split('-')
    results.push(
      id:i,
      name: configData.card.PASSIVESKILL.TYPE[index],
      value: parseFloat(parseFloat(_.random(parseInt(start) * 10, parseInt(end) * 10) / 10).toFixed(1))
    )
  results

initPassiveSkillGroup = (star) ->
  list = []
  for i in [1..3]
    list.push {
      id: i,
      items: initPassiveSkill(star)
      active: if i is 1 then true else false
    }
  list
