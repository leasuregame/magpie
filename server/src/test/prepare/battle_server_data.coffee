Player = require '../../model/player'
#Account = require '../model/account'
_ = require 'underscore'

exports = module.exports =
  player_id1: 'aa20df72-c748-11e2-a527-377d32fa9d96'
  player_id2: 'aa20df73-c748-11e2-a527-377d32fa9d96'
  player_id3: 'aa20df74-c748-11e2-a527-377d32fa9d96'
  player_id4: 'aa20df75-c748-11e2-a527-377d32fa9d96'
  player_id5: 'aa20df76-c748-11e2-a527-377d32fa9d96'
  player_id6: 'aa20df77-c748-11e2-a527-377d32fa9d96'
  player_id7: 'aa20df78-c748-11e2-a527-377d32fa9d96'  
  player_id8: 'aa20df79-c748-11e2-a527-377d32fa9d96'

  laodTestData: ->
    aps = all_players()
    console.log aps.length, '-a-'
    for p in aps
      console.log p.id
    for p in aps
      do (p) ->
        Player.create p, (err, res) ->
          console.log 'create player data', err, p.id
          if err
            console.log '---------error occur when create player data------------', p.id
    return aps

  clearTestData: (aps)->
    for p in aps
      do (p) ->
        Player.remove p.id, (err, res) ->
          console.log 'delete player data', err, p.id
          if err
            console.log '---------error occur when delete player data------------', p.id

all_players = ->
  player_data
  #.concat(player_data_hight_star)
  #.concat(player_data_mass())
  .concat(player_random())

randomHeros = (num)->
  _res = []
  max = hero_data.length
  
  while(true)
    r = _.random(0, max - 1)
    _res.push r if r not in _res
    break if _res.length >= num

  console.log 'random indexs: ', _res
  hero_data[i] for i in _res

player_random = ->
  m = _.random(1, 6)
  n = _.random(1, 6)
  cards = randomHeros(m+n)

  console.log m, n, cards

  ps = _.clone(player_data_hight_star)
  ps[0].id = 'aa20df78-c748-11e2-a527-377d32fa9d96'   
  ps[0].hero_ids = cards[0...m]

  ps[1].id = 'aa20df79-c748-11e2-a527-377d32fa9d96'
  ps[1].hero_ids = cards[m..]
  ps

player_data_mass = ->
  ps = _.clone(player_data_hight_star)
  ps[0].id = 'aa20df76-c748-11e2-a527-377d32fa9d96'
  ps[0].hero_ids = [
    {id: 1, lv: 52, star: 4, card_id: 4, skill_lv: 1, sp_value: [{name: 'dodge', value: 50}]} #1
    {id: 2, lv: 45, star: 4, card_id: 9, skill_lv: 1, sp_value: [{name: 'dodge', value: 50}]} #2
    {id: 3, lv: 37, star:4, card_id: 129, skill_lv: 1, sp_value: [{name: 'hp_improve', value: 50}]}
    {id: 4, lv: 37, star:4, card_id: 184, skill_lv: 1, sp_value: [{name: 'hp_improve', value: 50}]}
    {id: 5, lv: 55, star: 4, card_id: 24, skill_lv: 1, sp_value: [{name: 'akt_improve', value: 50}]}
    {id: 6, lv: 46, star: 4, card_id: 204, skill_lv: 1, sp_value: [{name: 'dmg_rebound', value: 50}]}
  ]

  ps[1].id = 'aa20df77-c748-11e2-a527-377d32fa9d96'
  ps[1].hero_ids = [
    {id: 7, lv: 37, star:4, card_id: 194, skill_lv: 1, sp_value: [{name: 'hp_improve', value: 50}]}
    {id: 8, lv: 40, star:5, card_id: 200, skill_lv: 1, sp_value: [{name: 'dmg_reduce', value: 50}]}
    {id: 9, lv: 56, star: 4, card_id: 44, skill_lv: 1, sp_value: [{name: 'crit', value: 50}]}
    {id: 10, lv: 60, star: 5, card_id: 50, skill_lv: 1, sp_value: [{name: 'crit', value: 50}]}
    {id: 11, lv: 35, star: 4, card_id: 54, skill_lv: 1, sp_value: [{name: 'hp_improve', value: 50}]}
    {id: 12, lv: 46, star: 5, card_id: 235, skill_lv: 1, sp_value: [{name: 'dmg_rebound', value: 50}]}
  ]
  ps

player_data_hight_star = [
  {
    id: 'aa20df74-c748-11e2-a527-377d32fa9d96'
    #account_id: 'aa20df70-c748-11e2-a527-377d32fa9d96'
    lv: 45
    name: '小芳'
    exp: 456
    power: 60
    money: 850000
    hero_ids:[
      {id: 1, lv: 52, star: 4, card_id: 4, skill_lv: 1}
      {id: 2, lv: 45, star: 4, card_id: 9, skill_lv: 1}
      {id: 3, lv: 60, star: 5, card_id: 15, skill_lv: 1}
      {id: 4, lv: 39, star: 4, card_id: 19, skill_lv: 1}
      {id: 5, lv: 55, star: 4, card_id: 24, skill_lv: 1}
      {id: 6, lv: 40, star: 5, card_id: 30, skill_lv: 1}
    ]
  },
  {
    id: 'aa20df75-c748-11e2-a527-377d32fa9d96'
    #account_id: 'aa20df71-c748-11e2-a527-377d32fa9d96'
    lv: 46
    name: '小丽'
    exp: 324
    power: 45
    money: 1000000
    hero_ids:[
      {id: 7, lv: 60, star: 5, card_id: 35, skill_lv: 1}
      {id: 8, lv: 48, star: 4, card_id: 39, skill_lv: 1}
      {id: 9, lv: 56, star: 4, card_id: 44, skill_lv: 1}
      {id: 10, lv: 60, star: 5, card_id: 50, skill_lv: 1}
      {id: 11, lv: 35, star: 4, card_id: 54, skill_lv: 1}
      {id: 12, lv: 40, star: 4, card_id: 59, skill_lv: 1}
    ]
  }
]

player_data = [
  {
    id: 'aa20df72-c748-11e2-a527-377d32fa9d96'
    #account_id: 'aa20df70-c748-11e2-a527-377d32fa9d96'
    lv: 10
    name: '小强'
    exp: 456
    power: 60
    money: 100000
    hero_ids:[
      {id: 1, lv: 52, star: 4, card_id: 4, skill_lv: 1, sp_value: [{name: 'dodge', value: 50}]} #1
      {id: 2, lv: 45, star: 4, card_id: 9, skill_lv: 1, sp_value: [{name: 'dodge', value: 50}]} #2
      {id: 3, lv: 37, star:4, card_id: 129, skill_lv: 1, sp_value: [{name: 'hp_improve', value: 50}]}
      {id: 4, lv: 37, star:4, card_id: 184, skill_lv: 1, sp_value: [{name: 'hp_improve', value: 50}]}
      {id: 5, lv: 55, star: 4, card_id: 24, skill_lv: 1, sp_value: [{name: 'akt_improve', value: 50}]}
      {id: 6, lv: 46, star: 4, card_id: 204, skill_lv: 1, sp_value: [{name: 'dmg_rebound', value: 50}]}
    ]
  },
  {
    id: 'aa20df73-c748-11e2-a527-377d32fa9d96'
    #account_id: 'aa20df71-c748-11e2-a527-377d32fa9d96'
    lv: 12
    name: '小刚'
    exp: 324
    power: 45
    money: 120000
    hero_ids:[
      {id: 7, lv: 37, star:4, card_id: 194, skill_lv: 1, sp_value: [{name: 'hp_improve', value: 50}]}
      {id: 8, lv: 40, star:5, card_id: 200, skill_lv: 1, sp_value: [{name: 'dmg_reduce', value: 50}]}
      {id: 9, lv: 56, star: 4, card_id: 44, skill_lv: 1, sp_value: [{name: 'crit', value: 50}]}
      {id: 10, lv: 60, star: 5, card_id: 50, skill_lv: 1, sp_value: [{name: 'crit', value: 50}]}
      {id: 11, lv: 35, star: 4, card_id: 54, skill_lv: 1, sp_value: [{name: 'hp_improve', value: 50}]}
      {id: 12, lv: 46, star: 5, card_id: 235, skill_lv: 1, sp_value: [{name: 'dmg_rebound', value: 50}]}
    ]
  }
]

account_data = [
  {
    id: 'aa20df70-c748-11e2-a527-377d32fa9d96'
    player_id: 'aa20df72-c748-11e2-a527-377d32fa9d96'
    number: '12345'
    phone: ''
    email: 'a@leasuregame.com'
    password: '1'
  },
  {
    id: 'aa20df71-c748-11e2-a527-377d32fa9d96'
    player_id: 'aa20df73-c748-11e2-a527-377d32fa9d96'
    number: '12343'
    phone: ''
    email: 'b@leasuregame.com'
    password: '1'
  }
]

ids = [ 
  
  'aa20df7a-c748-11e2-a527-377d32fa9d96' 
]

hero_data = [
  {id: 1, lv: 52, star: 4, card_id: 4, skill_lv: 1, sp_value: [{name: 'dodge', value: 50}]} #1
  {id: 2, lv: 45, star: 4, card_id: 9, skill_lv: 1, sp_value: [{name: 'dodge', value: 50}]} #2
  {id: 3, lv: 60, star: 5, card_id: 15, skill_lv: 1, sp_value: [{name: 'dodge', value: 50}]} #3
  {id: 4, lv: 39, star: 4, card_id: 19, skill_lv: 1, sp_value: [{name: 'dodge', value: 50}]}
  {id: 5, lv: 55, star: 4, card_id: 24, skill_lv: 1, sp_value: [{name: 'akt_improve', value: 50}]}
  {id: 6, lv: 40, star: 5, card_id: 30, skill_lv: 1, sp_value: [{name: 'akt_improve', value: 50}]}
  {id: 7, lv: 60, star: 5, card_id: 35, skill_lv: 1, sp_value: [{name: 'akt_improve', value: 50}]}
  {id: 8, lv: 48, star: 4, card_id: 39, skill_lv: 1, sp_value: [{name: 'crit', value: 50}]}
  {id: 9, lv: 56, star: 4, card_id: 44, skill_lv: 1, sp_value: [{name: 'crit', value: 50}]}
  {id: 10, lv: 60, star: 5, card_id: 50, skill_lv: 1, sp_value: [{name: 'crit', value: 50}]}
  {id: 11, lv: 35, star: 4, card_id: 54, skill_lv: 1, sp_value: [{name: 'hp_improve', value: 50}]}
  {id: 12, lv: 40, star: 4, card_id: 59, skill_lv: 1, sp_value: [{name: 'hp_improve', value: 50}]}

  # aoe
  {id: 13, lv: 37, star:4, card_id: 129, skill_lv: 1, sp_value: [{name: 'hp_improve', value: 50}]}
  {id: 14, lv: 40, star:5, card_id: 139, skill_lv: 1, sp_value: [{name: 'dmg_reduce', value: 50}]}
  {id: 19, lv: 37, star:4, card_id: 179, skill_lv: 1, sp_value: [{name: 'hp_improve', value: 50}]}
  {id: 20, lv: 40, star:5, card_id: 190, skill_lv: 1, sp_value: [{name: 'dmg_reduce', value: 50}]}
  {id: 21, lv: 37, star:4, card_id: 184, skill_lv: 1, sp_value: [{name: 'hp_improve', value: 50}]}
  {id: 23, lv: 37, star:4, card_id: 194, skill_lv: 1, sp_value: [{name: 'hp_improve', value: 50}]}
  {id: 24, lv: 40, star:5, card_id: 200, skill_lv: 1, sp_value: [{name: 'dmg_reduce', value: 50}]}

  # aoe rate
  {id: 15, lv: 44, star: 4, card_id: 174, skill_lv: 1, sp_value: [{name: 'dmg_reduce', value: 50}]}
  {id: 16, lv: 46, star: 5, card_id: 195, skill_lv: 1, sp_value: [{name: 'dmg_rebound', value: 50}]}

  # heal
  {id: 17, lv: 46, star: 4, card_id: 204, skill_lv: 1, sp_value: [{name: 'dmg_rebound', value: 50}]}
  {id: 18, lv: 46, star: 5, card_id: 235, skill_lv: 1, sp_value: [{name: 'dmg_rebound', value: 50}]}
]