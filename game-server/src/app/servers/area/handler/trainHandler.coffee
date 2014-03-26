playerManager = require('pomelo').app.get('playerManager')
cardManager = require '../../../manager/cardManager'
lottery = require '../../../manager/lottery'
async = require 'async'
dao = require('pomelo').app.get('dao')
table = require '../../../manager/table'
passSkillConfig = require '../../../../config/data/passSkill'
elixirConfig = require '../../../../config/data/elixir'
starUpgradeConfig = require '../../../../config/data/starUpgrade'
cardConfig = require '../../../../config/data/card'
utility = require '../../../common/utility'
msgQueue = require '../../../common/msgQueue'
entityUtil = require '../../../util/entityUtil'
job = require '../../../dao/job'
achieve = require '../../../domain/achievement'
_ = require 'underscore'
_s = require 'underscore.string'
logger = require('pomelo-logger').getLogger(__filename)

LOTTERY_BY_GOLD = 1
LOTTERY_BY_ENERGY = 0

LOW_LUCKYCARD = 1
HIGH_LUCKYCARD = 2

ELIXIR_TYPE_HP = 0
ELIXIR_TYPE_ATK = 1

EXTRACT_TYPE_ELIXIR = 0
EXTRACT_TYPE_SKILLPOINT = 1
DEFAULT_EXTRACT_CONSOME = 200

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::extract = (msg, session, next) ->
  playerId = session.get('playerId')
  cardId = msg.cardId
  type = msg.type

  if not cardId or type not in [EXTRACT_TYPE_ELIXIR, EXTRACT_TYPE_SKILLPOINT]
    return next(null, {code: 501, msg: '参数错误'})

  playerManager.getPlayerInfo {pid: playerId}, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    consume = table.getTableItem('values', 'extractConsumeGold')?.value or DEFAULT_EXTRACT_CONSOME
    if player.gold < consume
      return next(null, {code: 501, msg: '魔石不足'})

    card = player.getCard(cardId)
    if not card
      return next(null, {code: 501, msg: '找不到该卡牌'})

    if type is EXTRACT_TYPE_ELIXIR
      extVal = card.elixirHp + card.elixirAtk
      if extVal is 0
        return next(null, {code: 501, msg: '该卡没有可提取的仙丹'})
      else 
        card.set('elixirHp', 0)
        card.set('elixirAtk', 0)
        player.increase('elixir', extVal)
        player.decrease('gold', consume)
        return next(null, {code: 200, msg: {card: card.toJson(), elixir: player.elixir}})

    if type is EXTRACT_TYPE_SKILLPOINT
      extVal = card.skillPoint
      if extVal is 0
        return next(null, {code: 501, msg: '该卡没有可提取的技能点'})
      else
        card.set('skillPoint', 0)
        card.resetSkillLv()
        player.increase('skillPoint', extVal)
        player.decrease('gold', consume)
        return next(null, {code: 200, msg: {card: card.toJson(), skillPoint: player.skillPoint}})

    next(null, {code: 501, msg: '提取不成功'})

###
强化
###
Handler::strengthen = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  sources = msg.sources or []
  target = msg.target
  player = null;

  if sources.length == 0
    return next(null, {code: 501, msg: '素材卡牌不能为空'})

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res

      player.strengthen target, sources, cb

    (results, targetCard, cb) ->
      ### 更新玩家战斗力值 ###
      if player.isLineUpCard(targetCard) 
        player.updateAbility()

      _jobs = []

      cardData = targetCard.getSaveData()
      _jobs.push {
        type: 'update'
        options: 
          table: 'card'
          where: id: targetCard.id
          data: cardData
      } if not _.isEmpty(cardData)

      playerData = player.getSaveData()
      _jobs.push {
        type: 'update'
        options: 
          table: 'player'
          where: id: playerId
          data: playerData
      } if not _.isEmpty(playerData)

      _jobs.push {
        type: 'delete'
        options: 
          table: 'card'
          where: " id in (#{sources.toString()}) "
      } if sources.length > 0 

      job.multJobs _jobs, (err, ok) ->
        if err and not ok
          return cb(err)

        cb(null, results)
  ], (err, result) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    next(null, {code: 200, msg: result})



Handler::luckyCard = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  level = msg.level or LOW_LUCKYCARD
  type = if msg.type? then msg.type else LOTTERY_BY_GOLD
  times = if msg.times? then msg.times else 1

  typeMapping = {}
  typeMapping[LOTTERY_BY_GOLD] = 'gold'
  typeMapping[LOTTERY_BY_ENERGY] = 'energy'

  player = null
  totalConsume = 0
  totalFragment = 0
  isFree = 0

  generateCard = (player, level, type, times, isFree, cb) ->
    if isFree and times is 1
      except_ids = _.values(player.cards).map (c) -> c.tableId
      [card, consumeVal, fragment] = lottery.freeLottery(level, except_ids)
      totalConsume = consumeVal
      totalFragment = fragment
      cb(null, [card], 0, 0, 0)
    else
      rfc = player.rowFragmentCount + 1 #普通抽卡魂次数
      hfc = player.highFragmentCount + 1 #高级抽卡魂次数
      hdcc = player.highDrawCardCount + 1 #高级抽卡次数

      async.timesSeries times, (n, next) ->
        [card, consumeVal, fragment] = lottery.lottery(level, type, times, rfc++, hfc++, hdcc++, player.lightUpCards())
        totalConsume += consumeVal
        totalFragment += fragment
        
        ### 获得卡魂，重设卡魂抽卡次数 ###
        if fragment
          if level is LOW_LUCKYCARD
            rfc = 1

        ### 抽到5星卡牌，高级抽卡次数变为0 ###
        if level is HIGH_LUCKYCARD and card.star is 5
          hdcc = 1

        next(null, card, consumeVal, fragment)
      , (err, cards, consumes, fragments) ->
        firstTen = 0
        if typeof player.firstTime.highTenLuckCard is 'undefined' or player.firstTime.highTenLuckCard
          firstTen = 1

        if level is HIGH_LUCKYCARD and type is LOTTERY_BY_GOLD and times is 10 and firstTen
          grainFiveStarCard cards, player
          player.setFirstTime('highTenLuckCard', 0)

        # 每次高级10连抽，必得卡魂1个，1%概率额外获得卡魂1个。
        frags = 0;
        if level is HIGH_LUCKYCARD and times == 10
            frags += 1
            if utility.hitRate(1)
              frags += 1    
        totalFragment += frags

        cb(null, cards, --rfc, --hfc, --hdcc)

  grainFiveStarCard = (cards, player) ->
    lids = player.lightUpCards()
    for card in cards
      tid = card.tableId + 5 - card.star
      if card.star isnt 5 and tid not in lids
        card.tableId = tid
        card.star = 5
        break

    return

  processCards = (cards) ->
    ### 抽奖次数成就 ###
    achieve.luckyCardCount(player, times)

    ### 高级抽奖次数成就 ###
    if level is HIGH_LUCKYCARD
      achieve.highLuckyCardCount(player, times)

    for ent in cards
      ### 获得五星卡成就 ###
      if ent.star is 5
        achieve.star5card(player)

      if level is HIGH_LUCKYCARD and ent.star == 5 
        card = table.getTableItem('cards', ent.tableId)
        msg = {
          #route: 'onSystemMessage',
          msg: player.name + '*幸运的召唤到了5星卡*' + card.name + '*',
          type: 0,
          validDuration: 10 / 60
        }
        #@app.get('messageService').pushMessage(msg)
        msgQueue.push(msg)

  first5GoldLuckyCardBy10 = (player, cards) ->
    ### 每天前5次魔石10连抽，必得一张5星卡 ###

    rates = 
      1: 25
      2: 35
      3: 45
      4: 55
      5: 100

    player.incGoldLuckyCard10()
    goldLuckyCard10 = player.dailyGift.goldLuckyCard10
    if not goldLuckyCard10.got and utility.hitRate rates[goldLuckyCard10.count]
      grainFiveStarCard(cards, player)
      goldLuckyCard10.got = true
      player.updateGift 'goldLuckyCard10', goldLuckyCard10


  first3GoldLuckyCard = (player) ->
    ### 每天前3次单次魔石抽卡，比得一个卡魂 ###

    rates = 
      1: 50
      2: 70
      3: 100

    player.incGoldLuckyCardForFragment()
    goldLuckyCardForFragment = player.dailyGift.goldLuckyCardForFragment
    if not goldLuckyCardForFragment.got and utility.hitRate rates[goldLuckyCardForFragment.count]
      totalFragment += 1
      goldLuckyCardForFragment.got = true
      player.updateGift 'goldLuckyCardForFragment', goldLuckyCardForFragment

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res

      totalConsume = parseInt totalConsume*0.8 if times is 10
      if player[typeMapping[type]] < totalConsume
        return cb({code: 501, msg: '没有足够的资源来完成本次抽卡'}, null)

      if level is LOW_LUCKYCARD and type is LOTTERY_BY_GOLD and player.firstTime.lowLuckyCard
        isFree = player.firstTime.lowLuckyCard
        player.setFirstTime('lowLuckyCard', 0)
      if level is HIGH_LUCKYCARD and type is LOTTERY_BY_GOLD and player.firstTime.highLuckyCard
        isFree = player.firstTime.highLuckyCard
        player.setFirstTime('highLuckyCard', 0)

      cardCount = _.keys(player.cards).length
      if cardCount >= player.cardsCount
        return cb({code: 501, msg: '卡牌容量已经达到最大值'})

      generateCard player, level, type, times, isFree, cb

    (cards, rfc, hfc, hdcc, cb) ->     

      if(level == LOW_LUCKYCARD)
          player.set('rowFragmentCount', rfc)
      else
          player.set('highFragmentCount', hfc)
          player.set('highDrawCardCount', hdcc)

      first5GoldLuckyCardBy10(player, cards) if times is 10 and type is LOTTERY_BY_GOLD and level is HIGH_LUCKYCARD
      first3GoldLuckyCard(player) if times isnt 10 and type is LOTTERY_BY_GOLD and level is HIGH_LUCKYCARD

      card.playerId = player.id for card in cards
      async.map cards, entityUtil.createCard, cb
        
    (cardEnts, cb) =>
      player.addCards(cardEnts)

      if type is LOTTERY_BY_GOLD
        player.decrease('gold', totalConsume)

      if type is LOTTERY_BY_ENERGY
        player.decrease('energy', totalConsume)

      processCards(cardEnts)

      if totalFragment
        player.increase('fragments',totalFragment)

      cb(null, cardEnts)
  ], (err, cardEnts) ->
    if err
      return next(null, {code: err.code, msg: err.msg})

    player.save()
    next(null, {
      code: 200, 
      msg:
        card: cardEnts[0].toJson() if cardEnts.length is 1
        cards: (cardEnts.map (c) -> c.toJson()) if cardEnts.length > 1
        consume: totalConsume
        fragment: totalFragment
    })

Handler::skillUpgrade = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  cardId = msg.cardId

  sp_need = 0
  card = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      fun_limit = table.getTableItem('function_limit', 1)
      if player.lv < fun_limit?.skill_upgrade 
        return cb({code: 501, msg: "#{fun_limit.skill_upgrade}级开放"})

      card = player.getCard(cardId)
      cb(null, player, card)

    (player, card, cb) ->
      if not card
        return cb({code: 501, msg: '找不到卡牌'})

      if card? and card.star < 3
        return cb({code: 501, msg: '三星级以下的卡牌没有技能，不能升级'})

      if card? and card.skillLv == 5
        return cb({code: 501, msg: '该卡牌的技能等级已经升到最高级，不能再升级了'})

      upgradeData = table.getTableItem('skill_upgrade', card.skillLv)
      sp_need = upgradeData['star'+card.star]

      sp_left = card.skillPointLeft()
      if player.skillPoint + sp_left < sp_need
        return cb({code: 501, msg: '技能点不够，不能升级'})  
      
      sp_need = sp_need - sp_left
      card.increase('skillLv')
      card.increase('skillPoint', sp_need)
      player.decrease('skillPoint', sp_need)
      cb(null, player, card)

    (player, card, cb) ->
      ### 更新玩家战斗力值 ###
      if player.isLineUpCard(card) 
        player.updateAbility()

      _jobs = []

      playerData = player.getSaveData()
      _jobs.push {
        type: 'update'
        options: 
          table: 'player'
          where: id: player.id
          data: playerData
      } if not _.isEmpty(playerData)

      cardData = card.getSaveData()
      _jobs.push {
        type: 'update'
        options:
          table: 'card'
          where: id: card.id
          data: cardData
      } if not _.isEmpty(cardData)

      job.multJobs _jobs, cb
  ], (err, res) ->
    if err
      return next(null, {code: err.code, msg: err.msg})

    next(null, {code: 200, msg: {skillLv: card.skillLv, skillPoint: sp_need, ability: card.ability()}})

Handler::starUpgradeInitRate = (msg, session, next) ->
  playerId = session.get('playerId')
  playerManager.getPlayerInfo {pid: playerId}, (err, player) ->
    if err
      return next(null, {code: err.code, msg: err.msg})

    next(null, {code: 200, msg: initRate: player.initRate})

Handler::starUpgrade = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  target = msg.target
  sources = msg.sources

  card_count = sources.length
  is_upgrade = false
  money_consume = 0
  card = null
  player = null
  starUpgradeConfig = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      card = player.getCard(target)
      if card is null
        return cb({code: 501, msg: "找不到卡牌"})

      if card.tableId >= 10000
        return cb({code: 501, msg: "该卡牌不可以进阶"})

      if card.star is 7
        return cb({code: 501, msg: "卡牌星级已经是最高级了"})

      if card.lv isnt table.getTableItem('card_lv_limit', card.star).max_lv
        return cb({code: 501, msg: "未达到进阶等级"})

      starUpgradeConfig = table.getTableItem('star_upgrade', card.star)
      if not starUpgradeConfig
        return cb({code: 500, msg: "找不到卡牌进阶的配置信息"})

      sourceCards = player.getCards(sources)
      if _.isEmpty(sourceCards)
        return cb({code: 501, msg: "找不到素材卡牌"})

      badCardsCount = (sourceCards.filter (s) -> s.star isnt starUpgradeConfig.source_card_star).length
      if badCardsCount > 0
        return cb({code: 501, msg: "素材卡牌必须为#{starUpgradeConfig.source_card_star}星"})

      cb(null)

    (cb) =>
      money_consume = starUpgradeConfig.money_need
      
      if player.money < money_consume
        return cb({code: 501, msg: '仙币不足'})

      if starUpgradeConfig.super_honor > 0 and player.superHonor < starUpgradeConfig.super_honor
        return cb({code: 501, msg: '精元不足'})

      rate = player.initRate['star'+card.star] or 0
      max_num = Math.ceil (100 - rate)/starUpgradeConfig.rate_per_card
      if card_count > max_num
        return cb({code: 501, msg: "最多消耗#{max_num}张卡牌"})

      addRate = card_count * starUpgradeConfig.rate_per_card
      totalRate = _.min([addRate + rate, 100])

      is_upgrade = !!utility.hitRate(totalRate)
      if card.star is 4 
        is_upgrade = false if (card.useCardsCounts+card_count) <= (starUpgradeConfig.no_work_count or 10)
        card.increase('useCardsCounts' , card_count)
      
      player.decrease('money', money_consume)
      player.decrease('superHonor', starUpgradeConfig.super_honor) if starUpgradeConfig.super_honor > 0
      if is_upgrade
        ### 成功进阶，对应星级初始概率置为0 ###
        player.setInitRate(card.star, 0)

        card.increase('star')
        card.increase('tableId')
        card.resetSkillLv()      

        # 获得so lucky成就
        if card_count is 1
          achieve.soLucky(player)

        # 获得五星卡成就
        if card.star is 5
          achieve.star5card(player)
          cardNmae = table.getTableItem('cards', parseInt(card.tableId)-1).name
          msg = {
            msg: "#{player.name}*成功的将*#{cardNmae}*进阶为#{card.star}星",
            type: 0,
            validDuration: 10 / 60
          }
          msgQueue.push(msg)
        # 卡牌星级进阶，添加一个被动属性
        if card.star >= 3
          card.bornPassiveSkill()
        cb null
      else
        player.incInitRate(card.star, parseInt addRate*0.5)
        cb null

    (cb) ->
      ### 更新玩家战斗力值 ###
      if is_upgrade and player.isLineUpCard(card) 
        player.updateAbility()

      _jobs = []

      playerData = player.getSaveData()
      _jobs.push {
        type: 'update'
        options: 
          table: 'player'
          where: id: player.id
          data: playerData
      } if not _.isEmpty(playerData)

      cardData = card.getSaveData()
      _jobs.push {
        type: 'update'
        options:
          table: 'card'
          where: id: card.id
          data: cardData
      } if not _.isEmpty(cardData)

      _jobs.push {
        type: 'delete'
        options: 
          table: 'card'
          where: " id in (#{sources.toString()}) "
      }

      job.multJobs _jobs, cb
  ], (err, result) ->
    if err and not result
      return next(null, {code: err.code, msg: err.msg})
      
    player.popCards(sources)
    next(null, {code: 200, msg: {
      upgrade: is_upgrade, 
      card: card?.toJson(), 
      initRate: player.initRate,
      money: player.money,
      superHonor: player.superHonor
    }})

Handler::passSkillActive = (msg, session, next) ->
  playerId = session.get('playerId')
  cardId = msg.cardId
  groupId = msg.groupId

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb
    (player, cb) ->
      card = player.getCard(cardId)
      if not card
        return cb({code: 501, msg: '找不到卡牌'})

      card.activeGroup(groupId)
      cb(null, card)
  ], (err, card) ->
    if err
      return next(null, {code: err.code, msg: err.msg})

    card.save()
    next(null, {code: 200, msg: {
      ability: card.ability()
    }})

Handler::passSkillOpen = (msg, session, next) ->
  playerId = session.get('playerId')
  cardId = msg.cardId

  if _.isUndefined(cardId)
    return next(null, {code: 501, msg: '缺少卡牌Id参数'})

  default_count = 3
  gold_per_card = 50
  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code, msg: err.msg})

    card = player.getCard(cardId)
    if not card
      return next(null, {code: 501, msg: '找不到卡牌'})

    if card.psGroupCount >= 8
      return next(null, {code: 501, msg: '分组数量已达最大值'})

    if card.psGroupCount < default_count
      card.psGroupCount = default_count

    goldConsume = (card.psGroupCount - default_count + 1) * gold_per_card
    if player.gold < goldConsume
      return next(null, {code: 501, msg: '魔石不足'})

    card.addPsGroup()
    player.decrease 'gold', goldConsume
    player.save()

    next(null, {code: 200, msg: {
      gold: player.gold,
      passiveSkill: _.last(card.passiveSkills)
    }})


Handler::passSkillAfresh  = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  cardId = msg.cardId
  psIds = msg.psIds or []
  groupId = msg.groupId
  type = if msg.type? then msg.type else passSkillConfig.TYPE.MONEY
  _pros = 1: 'money', 2: 'gold'

  if _.isUndefined(groupId) or not checkPsIds(psIds)
    return next(null, {code: 501, msg: '参数错误'})

  ids = psIds.map (i) -> i.id
  
  consumeVal = 0
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (player, cb) ->
      fun_limit = table.getTableItem('function_limit', 1)
      if player.lv < fun_limit?.pass_skillafresh 
        return cb({code: 501, msg: "#{fun_limit.pass_skillafresh}级开放"})

      consumeVal = passSkillConfig.CONSUME[type]

      if player[_pros[type]] < consumeVal
        return cb({code: 501, msg: if _pros[type] == 'money' then '仙币不足' else '魔石不足'})

      card = player.getCard(cardId)
      if not card
        return cb({code: 501, msg: '找不到要洗练的卡牌'})

      psGroup = card.getPsGroup(groupId)
      passSkills = psGroup.getItems(ids)
      if not psGroup or not passSkills
        return cb({code: 501, msg: '找不到被动属性'})

      card.afrash(type, groupId, psIds) 
      player.decrease(_pros[type], consumeVal)
      cb(null, player, card)
  ], (err, player, card) ->
    if err
      return next(null, {code: err.code, msg: err.msg})

    ### 更新玩家战斗力值 ###
    if player.isLineUpCard(card) 
      player.updateAbility()
    
    player.save()
    # 拥有了百分之10的被动属性成就
    if (card.getPsGroup(groupId).getItems(ids).filter (ps) -> parseInt(ps.value) >= 10).length > 0
      achieve.psTo10(player)

    result = {
      ability: card.ability(),
      passiveSkill: card.passiveSkills.filter((p) -> p.id is groupId)[0]
    }

    next(null, {code: 200, msg: result})

checkPsIds = (ids) ->
  return false if not _.isArray(ids) or ids.length is 0

  for id in ids
    return false if _.isUndefined(id.id) or _.isUndefined(id.lock)

  return true

Handler::smeltElixir_is_discarded = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  cardIds = msg.cardIds

  result = []
  sum = 0
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      cards = player.getCards cardIds
      if cards.length is 0
        return cb({code: 501, msg: '找不到卡牌'})

      result = cards.map (c) ->
        _points = 0
        if utility.hitRate(elixirConfig.smelt[c.star].rate)
          _points += elixirConfig.smelt[c.star].value

        return _points

      cb(null, player)    

    (player, cb) ->
      sum = result.reduce((x,y) -> x + y) if not _.isEmpty(result)
      player.increase('elixir', sum) if _.isNumber(sum) and sum > 0

      _jobs = [
        {
          type: 'delete'
          options:
            table: 'card'
            where: " id in (#{cardIds.toString()})"
        }
      ]
      
      pData = player.getSaveData()
      _jobs.push {
        type: 'update'
        options:
          table: 'player'
          where: id: player.id
          data: pData
      } if not _.isEmpty(pData)
      
      job.multJobs _jobs, cb
  ], (err, res) ->
    if err and not res
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    next(null, {code: 200, msg: {elixir: result, sum: sum}})

Handler::useElixir = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  elixir = msg.elixir
  type = if typeof msg.type isnt 'undefined' then msg.type else ELIXIR_TYPE_HP
  cardId = msg.cardId
  elixirLimit = table.getTable('elixir_limit')

  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if (err) 
      return next(null, {code: err.code or 500, msg: err.msg or err})

    if player.elixir < elixir
      return next(null, {code: 501, msg: '仙丹不足'})

    card = player.getCard(cardId)
    if card is null
      return next(null, {code: 501, msg: '找不到卡牌'})

    if card.star < 3
      return next(null, {code: 501, msg: '3星以下的卡牌不能使用仙丹'})

    limit = elixirLimit.getItem(card.star)
    if (card.elixirHp + card.elixirAtk) >= limit.elixir_limit
      return next(null, {code: 501, msg: "卡牌可吞噬仙丹数量已满"})

    if (card.elixirHp + card.elixirAtk + elixir) > limit.elixir_limit
      return next(null, {code: 501, msg: "使用的仙丹已达卡牌上限"})

    card.increase('elixirHp', elixir) if type is ELIXIR_TYPE_HP
    card.increase('elixirAtk', elixir) if type is ELIXIR_TYPE_ATK
    player.decrease('elixir', elixir)
    
    _jobs = []
    playerData = player.getSaveData()
    _jobs.push {
      type: 'update'
      options: 
        table: 'player'
        where: id: player.id
        data: playerData
    } if not _.isEmpty(playerData)

    cardData = card.getSaveData()
    _jobs.push {
      type: 'update'
      options:
        table: 'card'
        where: id: card.id
        data: cardData
    } if not _.isEmpty(cardData)

    job.multJobs _jobs, (err, result) ->
      if err
        return next(null, {code: err.code or 500, msg: err.msg or ''})

      result = {
        elixirHp: card.elixirHp,
        elixirAtk:card.elixirAtk,
        ability: card.ability()
      }

      return next(null, {code: 200,msg:result})

Handler::changeLineUp = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  lineupObj = msg.lineUp
  index = msg.index

  if (index? and (index not in [0, 1] or _.isArray(lineupObj))) or (_.isUndefined(index) and not _.isArray(lineupObj))
    return next(null, {code: 501, msg: '参数错误'})

  playerManager.getPlayerInfo {pid: playerId}, (err, player) ->
    if err
      return next(null, {code: 500, msg: err.msg})

    lineupItems = _.clone(player.lineUp)
    if not _.isUndefined(index)
      lineupItems[index] = lineupObj
    else
      lineupItems = lineupObj

    cids = lineupItems.reduce(
      (pre, cur) ->
        pre.concat(_.values(cur))
      , []
    )
    cids_wo_spirit = cids.filter (i) -> i isnt -1
    if _.uniq(cids_wo_spirit).length isnt cids_wo_spirit.length
      return next(null, {code: 501, msg: '上阵卡牌的不能重复'})

    console.log cids, lineupItems
    console.log cids.filter((i) -> i is -1).length, lineupItems.length
    if cids.filter((i) -> i is -1).length isnt lineupItems.length
      return next(null, {code: 501, msg: '阵型中缺少元神信息'})

    for lineup in lineupItems
      cardIds = _.values(lineup)
      tids = player.getCards(cardIds).map (i) -> i.tableId
      console.log '-6-', cardIds, tids
      if cardIds.length isnt (tids.length+1)
        return next(null, {code: 501, msg: '上阵卡牌不存在'})

      nums = (
        table.getTable('cards').filter (id, item) -> item.id in tids
      ).map (item) -> item.number
      if _.uniq(nums).length isnt nums.length
        return next(null, {code: 501, msg: '上阵卡牌不能是相同系列的卡牌'})

    cardCount = lineupCardCount(player.lv)
    if not checkCardCount(cids, cardCount)
      return next(null, {code: 501, msg: "当前等级只能上阵#{cardCount}张卡牌"})

    player.updateLineUp(lineupObj, index)
    player.save()
    next(null, { code: 200, msg: {lineUp: player.lineUpObj()} })

Handler::sellCards = (msg, session, next) ->
  playerId = session.get('playerId')
  cardIds = if msg.ids? then msg.ids else []

  if cardIds.length is 0
    return next(null, {code: 200, msg: price: 0})

  price = 0
  player = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      cards = player.popCards cardIds
      if _.isEmpty(cards)
        return cb({code: 501, msg: '找不到卡牌'})

      price += c.price() for c in cards
      cb(null, price)

    (price, cb) ->
      dao.card.delete where: " id in (#{cardIds.toString()}) ", cb
  ], (err, res) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    player.increase('money', price)
    player.save()
    next(null, {code: 200, msg: price: price})

Handler::getCardBook = (msg, session, next) ->
  playerId = session.get('playerId')

  playerManager.getPlayerInfo {pid: playerId}, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    next(null, {code: 200, msg: cardBook: player.cardBook})

Handler::getCardBookEnergy = (msg, session, next) ->
  playerId = session.get('playerId')
  tableId = msg.tableId

  ENERGY = cardConfig.LIGHT_UP_ENERGY[cardStar(tableId)]
  playerManager.getPlayerInfo {pid: playerId}, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    if not player.cardBookMark.hasMark(tableId) or player.cardBookFlag.hasMark(tableId)
      return next(null, {code: 501, msg: '不能领取，已经领过或者还没有点亮该卡牌'})

    player.cardBookFlag.mark(tableId)
    player.increase('energy', ENERGY)
    cardBook = utility.deepCopy(player.cardBook)
    cardBook.flag = player.cardBookFlag.value
    player.cardBook = cardBook
    player.save()
    return next(null, {code: 200, msg: energy: ENERGY})

Handler::getExchangeCards = (msg, session, next) ->
  playerId = session.get('playerId')

  consumeVal = table.getTableItem('values', 'reflashExcCardsMoney')?.value || 5000
  playerManager.getPlayerInfo pid: playerId, (err, player) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    if player.money < consumeVal
      return next(null, {code: 501, msg: '仙币不足'})

    ids = entityUtil.randomCardIds([4,5], 4)
    player.set('exchangeCards', JSON.stringify(ids))
    player.decrease('money', consumeVal)
    player.save()
    next(null, {code: 200, msg: ids: ids})

Handler::exchangeCard = (msg, session, next) ->
  playerId = session.get('playerId')
  tableId = msg.tableId

  unless tableId
    return next(null, {code: 501, msg: 'tableId require'})

  star = cardStar(tableId)
  if star not in [4, 5]
    return next(null, {code: 501, msg: '只能兑换4星，5星卡牌'})

  player = null
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      if _.keys(player.cards).length >= player.cardsCount
        return cb({code: 501, msg: '卡牌容量已经达到最大值'})
      
      if player.fragments < cardConfig.CARD_EXCHANGE[star]
        return cb({code: 501, msg: '卡牌碎片不足'})

      entityUtil.createCard {
        tableId: tableId
        playerId: player.id
      }, cb
  ], (err, card) ->
    if err
      return next(null, {code: err.code or 500, msg: err.msg or ''})

    player.decrease('fragments', cardConfig.CARD_EXCHANGE[star])
    player.addCard(card)
    setExchangedCard(player, tableId)
    ### 增加5星卡牌成就 ###
    achieve.star5card(player) if star is 5

    player.save()
    next(null, {code: 200, msg: {
      card: card.toJson(),
      fragments: player.fragments
    }})

    if card.star is 5
      cardNmae = table.getTableItem('cards', card.tableId).name
      msg = {
        msg: player.name + '*成功兑换到一张*' + cardNmae + '*的五星卡牌',
        type: 0,
        validDuration: 10 / 60
      }
      msgQueue.push(msg)


setExchangedCard = (player, tid) ->
  newCards = []
  for id in player.exchangeCards
    if (parseInt id) is (parseInt tid)
      newCards.push -id
    else
      newCards.push id
  player.set('exchangeCards', JSON.stringify(newCards))

cardStar = (tableId) ->
  tableId % 20 or 20

checkCardCount = (cardIds, cardCount) ->
  card_count = (cardIds.filter (id) -> id isnt -1).length
  if card_count > cardCount
    return false
  else
    return true

lineupCardCount = (plv) ->
  count = 0
  table.getTable('card_lineup_limit').forEach (id, item) ->
    for k, v of item
      count += 1 if _s.startsWith(k, 'card_') and plv >= v
  count