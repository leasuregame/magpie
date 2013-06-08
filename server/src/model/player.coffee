ModelBase = require './model_base'

class Player extends ModelBase
  @configure(
    'id',
    'account_id', 
    'name',
    'lv',
    'exp',
    'power',
    'money',
    'hero_ids'
    )

exports = module.exports = Player

