ModelBase = require './model_base'

class Account extends ModelBase
  @configure(
    'Account', 
    'id', 
    'player_id', 
    'number',
    'phone', 
    'email', 
    'password'
  )

exports = module.exports = Account

