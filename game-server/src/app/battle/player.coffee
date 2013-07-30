Module = require '../common/module'
Hero = require './hero'
Matrix = require './matrix'
tab = require '../manager/table'
_ = require 'underscore'
utility = require '../common/utility'
logger = require('pomelo-logger').getLogger(__filename)

class Player extends Module
  @table: 'player'

  init: (entity) ->
    for key, val of entity
      @[key] = val if entity.hasOwnProperty(key)

    @initAttrs() if not entity
    
    @heros = []
    @lineUp = @lineUp or ''
    @enemy = null
    @is_attacker = false
    @matrix = new Matrix()
    @dead = false
    
    @loadHeros()
    @bindCards()
    @setAttackCount()
    super

  initAttrs: ->
    @id = 0
    @lv = 0
    @exp = 0
    @power = 0
    @money = 0
    @cards = {}

  setEnemy: (enm, is_attacker = false) ->
    @enemy = enm
    @is_attacker = is_attacker
    @heros.forEach (h) =>
      h.setIdx @matrix.positionToNumber(h.pos), is_attacker

  loadHeros: ->
    @heros = if @cards? then (new Hero(@cards[id], @) for id of @cards) else []

  bindCards: ->
    if @lineUp? and @lineUp != ''
      @parseLineUp().forEach (item) =>
        [pos, id] = item 
        
        _hero = (id) =>
          for h in @heros
            return h if h.id is parseInt(id)
          null
        _h = _hero(id)

        if _h
          @matrix.set(pos, _h)
        else
          logger.warn 'you have not such card with id is ' + id
    else
      logger.warn 'there is not line up for player ' + @name
    
    @matrix.reset()

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

  getCards: ->
    _.map @matrix.allWithNull(), (c) -> 
      if c? 
        return {
          id: c.id
          lv: c.lv
          hp: c.init_hp
          atk: c.init_atk
        }
      else
        return null
    
  death: ->
    @aliveHeros().length is 0

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
      _hero.attack(callback)

  currentHero: ->
    @matrix.current()

  nextHero: ->
    res = @matrix.next()
    res

  currentIndex: ->
    @matrix.curIndex

  herosToBeAttacked: (scope, args) ->
    @matrix.attackElement scope, args

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

exports = module.exports = Player