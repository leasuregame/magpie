Module = require '../common/module'
Hero = require './hero'
battleLog = require './battle_log'
Spiritor = require './spiritor'
Matrix = require './matrix'
tab = require '../manager/table'
utility = require '../common/utility'
_ = require 'underscore'
logger = require('pomelo-logger').getLogger(__filename)

copyAttrs = (self, ent) ->
  self.id = ent.id 
  self.name = ent.name
  self.lv = ent.lv
  self.exp = ent.exp
  self.lineUp = filterEmptyLinuUp _.clone(ent.lineUp)
  self.spiritor = if ent.spiritor? then new Spiritor(ent.spiritor) else null
  self.cards = ent.activeCards?() or ent.cards

  self.spiritorIdx = -1
  _refs = if ent.lineUpObj? then ent.lineUpObj()[0] else {}
  _.each _refs, (v, k) -> 
    if v is -1 
      self.spiritorIdx = parseInt(k)

filterEmptyLinuUp = (lineUp) ->
  return lineUp if lineUp.length is 1

  l = lineUp[0]
  if _.isObject(l) and _.values(l).indexOf(-1) > -1
    lineUp = lineUp.splice 0, 1
    return lineUp
  return lineUp

defaultEntity = 
  id: 0
  name: 'anyone'
  lv: 0
  exp: 0
  lineUp: []
  spiritor: {lv: 1}
  cards: []

DEFAULT_OPTIONS = 
  inc_scale: 0
  is_attacker: false
  is_boss: false

class Player extends Module
  init: (entity, options = {}) ->
    entity ||= defaultEntity
    copyAttrs @, entity
    _.extend @, _.defaults(options, DEFAULT_OPTIONS)
    
    @heros = []
    @enemy = null
    @matrix = new Matrix()
    @dead = false
    @is_monster = false
    @used_empty_lineUp = false
    @cards_for_bl = {}
    
    @loadHeros()
    @bindCards()
    @setAttackCount()
    super

  attack: (callback) ->
    _hero = @currentHero()
    if _hero is null or _hero.death()
      logger.warn "玩家 #{@name} 拿不到当前卡牌，或者没有可用的牌可出了。\
      卡牌：#{_hero?.name}, 死亡状态：#{_hero?.death()} \
      卡牌位置: #{@matrix.curIndex}
      "
      #@dead = true
    else
      logger.info "#{@name} 出手", _hero.idx
      _hero.attack (enemyHeros) =>
        return callback() if not enemyHeros

        enemyHeros = [enemyHeros] if not _.isArray(enemyHeros)
        return callback(enemyHeros) if @enemy.is_monster

        hasDeath = not _.isEmpty(enemyHeros.filter (h) -> h.death())

        if hasDeath and not @enemy.death()
          logger.warn '卡牌死亡，判断触发元神之怒'
          ### 触发元神之怒 ###
          @enemy.spiritor.angry(enemyHeros, callback)
        else 
          callback(enemyHeros)

  setEnemy: (enm) ->
    @enemy = enm

  loadHeros: ->
    @heros = if not _.isEmpty(@cards) then (new Hero(card, @) for card in @cards) else []

  bindCards: ->
    if @lineUp and not _.isEmpty(@lineUp)
      lu = @lineUp.shift()
      
      if _.keys(lu).length is 1 and @used_empty_lineUp
        return

      @matrix.clear()
      _.each lu, (id, pos) =>
        if parseInt(id) is -1
          @spiritorIdx = parseInt(pos)
          return 

        _h = _.findWhere @heros, id: parseInt(id)
        if _h 

          @matrix.set(pos-1, _h)
        else
          logger.warn 'you have not such card with id is ' + id

      @matrix.reset()
      @correctIdx(@is_attacker)
      @setCards()

      if _.keys(lu).length is 1
        @used_empty_lineUp = true
    else
      logger.warn 'there is not line up for player ' + @name

  parseLineUp: (lineUp)->
    _str = lineUp || @lineUp
    pos_hero = _str.split(',')
    pos_hero.map (item) => 
      [pos,id] = item.split(':')
      if pos.length is 1
        pos = @matrix.numberToPosition(pos)
      [pos, id]

  setLineUp: (lineUp)->
    # line up formation: 
    # saparator is : and ,
    # [position]:[hero_id],[position]:[hero_id]...
    @lineUp = lineUp
    @bindCards()
    @

  setCards: ->
    cobj = {}
    cobj[c.idx] = {
      tableId: c.card_id
      hp: c.init_hp
      atk: c.init_atk
      spiritHp: c.spirit_hp
      spiritAtk: c.spirit_atk
    } for c in @matrix.all()
    
    cobj[if @is_attacker then @spiritorIdx else @spiritorIdx + 6] = @spiritor.lv
    @cards_for_bl = cobj
    
    battleLog.addCards cobj
    battleLog.addStep {
      go: battleLog.get('cards').length - 1
    }

  death: ->
    @matrix.alive().length is 0

  currentHero: ->
    item = @matrix.current()
    if item is null or item.death()
      item = @matrix.next()
    item

  nextHero: ->
    res = @matrix.next()
    res

  currentIndex: ->
    @matrix.curIndex

  herosToBeAttacked: (scope, args, filter) ->
    @matrix.attackElement scope, args, filter

  reset: ->
    @matrix.reset()
    @setAttackCount()

    @heros.forEach (h) -> h.reset()

  ###
  检查在一个回合中，还有没有出手次数
  ###
  bulletOut: ->
    res = _.find @heros, (h) -> not h.isAttacked()
    not res

  aliveHeros: ->
    res = @matrix.all().filter (h) ->
      h.hp? and h.hp > 0
    res || []

  setAttackCount: ->
    @attack_count = @aliveHeros().length

  correctIdx: ->
    for h in @matrix.all()
      h.setIdx h.idx, @is_attacker

exports = module.exports = Player