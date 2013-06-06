_ = require 'underscore'
utility = require '../common/utility'
log = require '../common/logger'

# PP_TYPE = 
#   'atk_improve'
#   'hp_improve'
#   'crit'
#   'dodge'
#   'dmg_reduce'
#   'dmg_rebound'

class SpecialProperty
  constructor: (attrs) ->
    @_attrs = attrs

  takeEffect: (tag) ->
    for a in @_attrs
      _pro = passive_propertys[a['name']]
      if _pro? 
        tag['init_'+_pro] = tag[_pro] += parseInt( tag[_pro] * a['value'] / 100 )
        log.error tag.name, tag.hp, tag.init_hp

  has: (name) ->
    !!_.findWhere @_attrs, {name: name}

  get: (name) ->
    (_.findWhere @_attrs, {name: name})?['value']

  isCrit: ->
    @_hit('crit')

  isDodge: ->
    @_hit('dodge')

  dmgReduce: (val) ->
    return val if not @has('dmg_reduce') 

    parseInt( val * ( 1 - @get('dmg_reduce')/100 ) )

  dmgRebound: (val) ->
    return 0 if not @has('dmg_rebound') 
    parseInt( val * ( 1 - @get('dmg_rebound')/100 ) )

  _hit: (type) ->
    return false if not @has('crit') 

    utility.hitRate parseInt(@get('crit'))

passive_propertys = 
  'atk_improve': 'atk'
  'hp_improve': 'hp'

exports = module.exports = SpecialProperty
      
