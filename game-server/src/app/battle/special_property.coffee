_ = require 'underscore'
utility = require '../common/utility'
log = require('pomelo-logger').getLogger(__filename)

passive_propertys = 
  'atk_improve': 'atk'
  'hp_improve': 'hp'

class SpecialProperty
  constructor: (attrs) ->
    @_attrs = []

    for att in attrs 
      if att.active
        @_attrs = att.items

  takeEffect: (tag) ->
    for a in @_attrs
      _pro = passive_propertys[a['name']]
      if _pro? 
        tag['init_'+_pro] = tag[_pro] += parseInt( tag[_pro] * a['value'] / 100 )

  has: (name) ->
    !!_.findWhere @_attrs, {name: name}

  get: (name) ->
    _.where(@_attrs, {name: name})
    .map((i) -> i.value)
    .reduce(((x, y) -> x+y), 0)

  isCrit: (val) ->
    @_hit('crit', val)

  isDodge: (val) ->
    @_hit('dodge', val)

  dmgReduce: (val, disrupting) ->
    return val if not @has('dmg_reduce') 

    parseInt( val * ( 1 - (@get('dmg_reduce')-(disrupting||0))/100 ) )

  dmgRebound: (val) ->
    return 0 if not @has('dmg_rebound') 

    parseInt( val * ( 1 - @get('dmg_rebound')/100 ) )

  _hit: (type, val) ->
    return false if not @has(type) 
    utility.hitRate @get(type)-(val||0)

exports = module.exports = SpecialProperty
      
