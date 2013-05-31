_ = require 'underscore'
utility = require '../common/utility'

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
    _propertys = 
      'atk_improve': 'atk'
      'hp_improve': 'hp'

    for a in @_attrs
      _pro = _propertys[a['name']]
      _pro? and (tag[_pro] += parseInt( tag[_pro] * a['value'] / 100 ))

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

exports = module.exports = SpecialProperty
      
