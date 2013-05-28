Player = require '../../model/player'
#Account = require '../model/account'

exports = module.exports =
  player_id1: 'aa20df72-c748-11e2-a527-377d32fa9d96'
  player_id2: 'aa20df73-c748-11e2-a527-377d32fa9d96'
  laodTestData: ->
    console.log Player.attributes
    for p in player_data
      Player.create(p)

  clearTestData: ->
    for p in player_data
      Player.remove(p.id)

ids = [ 
  'aa20df74-c748-11e2-a527-377d32fa9d96',
  'aa20df75-c748-11e2-a527-377d32fa9d96',
  'aa20df76-c748-11e2-a527-377d32fa9d96',
  'aa20df77-c748-11e2-a527-377d32fa9d96',
  'aa20df78-c748-11e2-a527-377d32fa9d96',
  'aa20df79-c748-11e2-a527-377d32fa9d96',
  'aa20df7a-c748-11e2-a527-377d32fa9d96' 
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
      {id: 1, lv: 3, star: 2, card_id: 1, skill_lv: 1}
      {id: 2, lv: 4, star: 2, card_id: 2, skill_lv: 1}
      {id: 3, lv: 5, star: 3, card_id: 3, skill_lv: 1}
      {id: 4, lv: 10, star: 4, card_id: 4, skill_lv: 1}
      {id: 5, lv: 30, star: 4, card_id: 5, skill_lv: 1}
      {id: 6, lv: 40, star: 5, card_id: 6, skill_lv: 1}
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
      {id: 7, lv: 3, star: 2, card_id: 7, skill_lv: 1}
      {id: 8, lv: 4, star: 2, card_id: 8, skill_lv: 1}
      {id: 9, lv: 5, star: 3, card_id: 9, skill_lv: 1}
      {id: 10, lv: 10, star: 4, card_id: 10, skill_lv: 1}
      {id: 11, lv: 30, star: 4, card_id: 11, skill_lv: 1}
      {id: 12, lv: 40, star: 5, card_id: 12, skill_lv: 1}
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