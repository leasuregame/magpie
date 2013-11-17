playerManager = require '../../../manager/playerManager'
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

MAX_CARD_COUNT = table.getTableItem('resource_limit', 1).card_count_limit
LOTTERY_BY_GOLD = 1
LOTTERY_BY_ENERGY = 0

LOW_LUCKYCARD = 1
HIGH_LUCKYCARD = 2

ELIXIR_TYPE_HP = 0
ELIXIR_TYPE_ATK = 1

module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

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

  typeMapping = {}
  typeMapping[LOTTERY_BY_GOLD] = 'gold'
  typeMapping[LOTTERY_BY_ENERGY] = 'energy'

  player = null
  consumeVal = 0
  fragment = 0
  isFree = 0
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      if level is LOW_LUCKYCARD and type is LOTTERY_BY_GOLD and player.firstTime.lowLuckyCard
        isFree = player.firstTime.lowLuckyCard
        player.setFirstTime('lowLuckyCard', 0)
      if level is HIGH_LUCKYCARD and type is LOTTERY_BY_GOLD and player.firstTime.highLuckyCard
        isFree = player.firstTime.highLuckyCard
        player.setFirstTime('highLuckyCard', 0)

      if _.keys(player.cards).length >= MAX_CARD_COUNT
        return cb({code: 501, msg: '卡牌容量已经达到最大值'})

      rfc = player.rowFragmentCount + 1 #普通抽卡魂次数
      hfc = player.highFragmentCount + 1 #高级抽卡魂次数
      hdcc = player.highDrawCardCount + 1 #高级抽卡次数

      if isFree
        except_ids = _.values(player.cards).map (c) -> c.tableId
        [card, consumeVal, fragment] = lottery.freeLottery(level, except_ids)
      else
        [card, consumeVal, fragment] = lottery.lottery(level, type, rfc, hfc, hdcc)

      if player[typeMapping[type]] < consumeVal
        return cb({code: 501, msg: '没有足够的资源来完成本次抽卡'}, null)

      card.playerId = player.id
      cb(null, card)

    (card, cb) ->
      entityUtil.createCard card, cb
        
    (cardEnt, cb) =>
      player.addCard(cardEnt);
      if(level == LOW_LUCKYCARD)
          player.increase('rowFragmentCount',1)
      else
          player.increase('highFragmentCount',1)
          player.increase('highDrawCardCount',1);

      if type is LOTTERY_BY_GOLD
        player.decrease('gold', consumeVal)

      if type is LOTTERY_BY_ENERGY
        player.decrease('energy', consumeVal)

      if level is HIGH_LUCKYCARD and cardEnt.star == 5 #抽到5星卡牌，高级抽卡次数变为0
        player.set('highDrawCardCount',0)
        card = table.getTableItem('cards', cardEnt.tableId)
        msg = {
          #route: 'onSystemMessage',
          msg: player.name + '幸运的召唤到了5星卡' + card.name + '！！！'
          type: 0
        }
        #@app.get('messageService').pushMessage(msg)
        msgQueue.push(msg)

      if fragment
        player.increase('fragments',fragment)
        if level is LOW_LUCKYCARD
          player.set('rowFragmentCount',0)
        else
          player.set('highFragmentCount',0)

      cb(null, cardEnt, player)
  ], (err, cardEnt, player) ->
    if err
      return next(null, {code: err.code, msg: err.msg})

    ### 获得五星卡成就 ###
    if cardEnt.star is 5
      achieve.star5card(player)

    ### 抽奖次数成就 ###
    achieve.luckyCardCount(player)

    ### 高级抽奖次数成就 ###
    if level is HIGH_LUCKYCARD
      achieve.highLuckyCardCount(player)

    player.save()
    next(null, {
      code: 200, 
      msg: {
        card: cardEnt.toJson(), 
        consume: consumeVal,
        fragment: fragment
      }
    })

Handler::skillUpgrade = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  cardId = msg.cardId

  sp_need = 0
  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (res, cb) ->
      player = res
      card = player.getCard(cardId)
      cb(null, player, card)

    (player, card, cb) ->
      if not card
        return cb({code: 501, msg: '找不到卡牌'})

      if card? and card.star < 3
        return cb({code: 501, msg: '三星级以下的卡牌没有技能，不能升级'})

      if card? and card.skillLv == 5
        return cb({code: 501, msg: '该卡牌的技能等级已经升到最高级，不能再升级了'})

      upgradeData = table.getTableItem('skill_upgrade', card.skillLv + 1)
      sp_need = upgradeData['star'+card.star]

      if player.skillPoint < sp_need
        return cb({code: 501, msg: '技能点不够，不能升级'})  
      
      card.increase('skillLv')
      card.increase('skillPoint', sp_need)
      player.decrease('skillPoint', sp_need)
      cb(null, player, card)
  ], (err, player, card) ->
    if err
      return next(null, {code: err.code, msg: err.msg})

    card.save()
    player.save()
    next(null, {code: 200, msg: {skillLv: card.skillLv, skillPoint: sp_need, ability: card.ability()}})

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

      if card.star is 5
        return cb({code: 501, msg: "卡牌星级已经是最高级了"})

      if card.lv isnt table.getTableItem('card_lv_limit', card.star).max_lv
        return cb({code: 501, msg: "未达到进阶等级"})

      starUpgradeConfig = table.getTableItem('star_upgrade', card.star)
      if not starUpgradeConfig
        return cb({code: 500, msg: "找不到卡牌进阶的配置信息"})
      if _.isEmpty(player.getCards(sources))
        return cb({code: 501, msg: "找不到素材卡牌"})

      cb(null)

    (cb) =>
      money_consume = starUpgradeConfig.money_need
      
      if player.money < money_consume
        return cb({code: 501, msg: '铜板不足'})

      if card_count > starUpgradeConfig.max_num
        return cb({code: 501, msg: "最多只能消耗#{starUpgradeConfig.max_num}张卡牌来进行升级"})

      rate = 0

      if card.star is 4
        if card.useCardsCounts < 6 and card.useCardsCounts >= 0
          count = if (card.useCardsCounts + card_count <= 6) then card_count else 6 - card.useCardsCounts
          card.increase('useCardsCounts' , count)
          card_count -= count

        if card.useCardsCounts > 5
          rate = card.useCardsCounts * starUpgradeConfig.rate_per_card
          card.set('useCardsCounts',-1)

      totalRate = _.min([card_count * starUpgradeConfig.rate_per_card + rate, 100])

      if utility.hitRate(totalRate)
        is_upgrade = true
      
      if is_upgrade
        player.decrease('money', money_consume)
        card.increase('star')
        card.increase('tableId')
        card.resetSkillLv()
        entityUtil.resetSkillIncForCard(card)

        # 获得so lucky成就
        if card_count is 1
          achieve.soLucky(player)

        # 获得五星卡成就
        if card.star is 5
          achieve.star5card(player)
          cardNmae = table.getTableItem('cards', card.tableId).name
          msg = {
            msg: player.name + '成功的将' + cardNmae + '进阶为5星！！！'
            type: 0
          }
          msgQueue.push(msg);
        # 卡牌星级进阶，添加一个被动属性
        if card.star >= 3
          card.bornPassiveSkill()
        return cb null

      cb null

    (cb) ->
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

    cardManager.getCardInfo card.id, (err, res) ->
      if err
        return next(null, err)
      
      next(null, {code: 200, msg: {upgrade: is_upgrade, card: res.toJson()}})

Handler::passSkillAfresh  = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  cardId = msg.cardId
  psIds = msg.psIds or []
  type = if msg.type? then msg.type else passSkillConfig.TYPE.MONEY
  _pros = 1: 'money', 2: 'gold'

  async.waterfall [
    (cb) ->
      playerManager.getPlayerInfo {pid: playerId}, cb

    (player, cb) ->
      money_need = passSkillConfig.CONSUME[type] * psIds.length

      if player[_pros[type]] < money_need
        return cb({code: 501, msg: '铜板/元宝不足，不能洗炼'})

      card = player.getCard(cardId)
      passSkills = card.passiveSkills.filter (ps) -> _.contains(psIds, ps.id)

      if _.isEmpty(passSkills)
        return cb({code: 501, msg: '找不到被动属性'})

      card.afreshPassiveSkill(type, ps) for ps in passSkills
      player.decrease(_pros[type], money_need)
      cb(null, player, card)
  ], (err, player, card) ->
    if err
      return next(null, {code: err.code, msg: err.msg})

    player.save()
    # 拥有了百分之10的被动属性成就
    if (card.passiveSkills.filter (ps) -> parseInt(ps.value) is 10).length > 0
      achieve.psTo10(player)

    result = {
      ability: card.ability(),
      passiveSkills: card.passiveSkills
    }

    next(null, {code: 200, msg: result})

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

    if player.lv < 10
      return next(null, {code: 501, msg: '10级开放'})

    if player.elixir < elixir
      return next(null, {code: 501, msg: '仙丹不足'})

    card = player.getCard(cardId)
    if card is null
      return next(null, {code: 501, msg: '找不到卡牌'})

    if card.star < 3
      return next(null, {code: 501, msg: '不能对3星以下的卡牌使用仙丹'})

    limit = elixirLimit.getItem(card.star)
    if (card.elixirHp + card.elixirAtk) >= limit.elixir_limit
      return next(null, {code: 501, msg: "卡牌可吞噬仙丹数量已满"})

    if (card.elixirHp + card.elixirAtk + elixir) > limit.elixir_limit
      return next(null, {code: 501, msg: "使用的仙丹已经超出了卡牌的最大仙丹容量"})

    if not player.isCanUseElixirForCard(cardId)
      return next(null, {code: 501, msg: "已达当前可吞噬数量上限，请提升角色等级"})

    can_use_elixir = player.canUseElixir(cardId)
    if can_use_elixir < elixir
      return next(null, {code: 501, msg: "最多还可以消耗#{can_use_elixir}点仙丹"})

    card.increase('elixirHp', elixir) if type is ELIXIR_TYPE_HP
    card.increase('elixirAtk', elixir) if type is ELIXIR_TYPE_ATK
    player.decrease('elixir', elixir)
    player.useElixirForCard(cardId, elixir)
    
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
        ability: card.ability(),
      }

      return next(null, {code: 200,msg:result})

Handler::changeLineUp = (msg, session, next) ->
  playerId = session.get('playerId') or msg.playerId
  lineupObj = msg.lineUp

  cids = _.values(lineupObj)
  if _.uniq(cids).length isnt cids.length
    return next(null, {code: 501, msg: '上阵卡牌的不能重复'})

  if -1 not in cids
    return next(null, {code: 501, msg: '阵型中缺少元神信息'})

  playerManager.getPlayerInfo {pid: playerId}, (err, player) ->
    if err
      return next(null, {code: 500, msg: err.msg})

    tids = player.getCards(cids).map (i) -> i.tableId
    nums = (
      table.getTable('cards').filter (id, item) -> item.id in tids
    ).map (item) -> item.number
    if _.uniq(nums).length isnt nums.length
      return next(null, {code: 501, msg: '上阵卡牌不能是相同系列的卡牌'})

    if not checkCardCount(player.lv, cids)
      return next(null, {code: 501, msg: "上阵卡牌数量不对"})

    player.updateLineUp(lineupObj)
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
      if _.keys(player.cards).length >= MAX_CARD_COUNT
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
    player.save()
    next(null, {code: 200, msg: {
      card: card.toJson(),
      fragments: player.fragments
    }})

cardStar = (tableId) ->
  tableId % 5 or 5

checkCardCount = (playerLv, cardIds) ->
  card_count = (cardIds.filter (id) -> id isnt -1).length
  fdata = table.getTableItem('function_limit', 1)
  lvMap = {4: fdata.card4_position, 5: fdata.card5_position}
  for qty, lv of lvMap
    if playerLv < lv and card_count >= qty
      return false
  return true