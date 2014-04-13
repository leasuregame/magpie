###
Battle log steps 格式:
  [攻击方]:[承受方,一个或多个]:[技能]:[技能产生的效果]
###
class BattleLog
  constructor: ->
    @result = 
      steps: []
      rewards: {}
      cards: []

  set: (key, value) ->
    @result[key] = value

  get: (key) ->
    @result[key]

  addCards: (cards) ->
    @result.cards.push cards

  setWinner: (winner) ->
    @set('winner', winner)

  addStep: (step) ->
    @result.steps.push step

  addReward: (key, value) ->
    @result.rewards[key] = value

  reports: ->
    @result

  clear: ->
    @result = 
      steps: []
      rewards: {}
      cards: []

analyze = (bl) ->
  
  ownCount = enemyCount = 0
  results = {}
  for k, v of bl.cards
    ownCount += 1 if k <= 6 and typeof v is 'object'
    enemyCount += 1 if k > 6 and typeof v is 'object'

    results[k] = v
    results[k].atkCount = 0
    results[k].hitCount = 0
    results[k].dmage = 0
    results[k].death = false

  for s in bl.steps
    results[Math.abs(s.a)].atkCount += 1 if not s.t

    for d, i in s.d
      results[Math.abs(d)].hitCount += 1
      results[Math.abs(d)].dmage += s.e[i]
      results[Math.abs(d)].death = true if Math.abs(results[Math.abs(d)].dmage) >= results[Math.abs(d)].hp
  
  ownDeadCount = (k for k, v of results when v.death and k <= 6).length
  enemyDeadCount = (k for k, v of results when v.death and k > 6).length

  return {
    ownCount: ownCount
    enemyCount: enemyCount
    ownDeadCount: ownDeadCount
    enemyDeadCount: enemyDeadCount
    isWin: enemyCount is enemyDeadCount
    results: results
  }

#bl =  { cards : { 1 : { tableId : 29, hp : 18076, atk : 7793, spiritHp : 3615, spiritAtk : 1558 }, 2 : { tableId : 34, hp : 18725, atk : 7396, spiritHp : 3745, spiritAtk : 1479 }, 3 : { tableId : 39, hp : 18725, atk : 7432, spiritHp : 3745, spiritAtk : 1486 }, 4 : { tableId : 45, hp : 31163, atk : 12740, spiritHp : 6232, spiritAtk : 2548 }, 5 : { tableId : 50, hp : 29834, atk : 12877, spiritHp : 5966, spiritAtk : 2575 }, 6 : 4, 7 : { tableId : 4, hp : 18148, atk : 7576, spiritHp : 3629, spiritAtk : 1515 }, 8 : { tableId : 9, hp : 24589, atk : 6566, spiritHp : 3918, spiritAtk : 1313 }, 9 : { tableId : 14, hp : 23689, atk : 7288, spiritHp : 3737, spiritAtk : 1457 }, 10 : { tableId : 20, hp : 30934, atk : 12602, spiritHp : 6186, spiritAtk : 2520 }, 11 : { tableId : 25, hp : 30980, atk : 12465, spiritHp : 6196, spiritAtk : 2493 }, 12 : 4 }, ownId : 101, enemyId : 100, winner : 'own', round_num : 4, steps : [ { a : -1, d : [ 7, 8, 9 ], e : [ -4286, -3857, -4286 ], dhp : 23689 }, { a : -7, d : [ 4, 5 ], e : [ -4166, -4166 ], dhp : 29834 }, { a : 2, d : [ 8 ], e : [ -6656 ], dhp : 14076 }, { a : 8, d : [ 2 ], e : [ -6566 ], dhp : 12159 }, { a : 3, d : [ 9 ], e : [ -7432 ], dhp : 11971 }, { a : -9, d : [ 3 ], e : [ -10932 ], dhp : 18725 }, { a : -4, d : [ 7 ], e : [ -21021 ], dhp : 13862, death : true }, { a : 10, d : [ 1 ], e : [ -12602 ], dhp : 5474 }, { a : 5, d : [ 8 ], e : [ -11589 ], dhp : 2487 }, { a : 11, d : [ 2 ], e : [ -12465 ], death : true, dhp : -306 }, { a : -2, d : [ 10, 11 ], e : [ -2847, -2847 ], t : 1, dhp : 30980 }, { a : 1, d : [ 10 ], e : [ -7793 ], dhp : 20294 }, { a : 8, d : [ 5 ], e : [ -6566 ], dhp : 19102 }, { a : 3, d : [ 9 ], e : [ -7432 ], dhp : 4539 }, { a : -9, d : [ 3 ], e : [ -10932 ], dhp : 7793, death : true }, { a : -4, d : [ 10 ], e : [ -21021 ], dhp : 20294, death : true }, { a : -5, d : [ 8 ], e : [ -19122 ], dhp : 2487, death : true }, { a : -8, d : [ 1, 4 ], e : [ -2987, -2987 ], t : 1, dhp : 26997 }, { a : 1, d : [ 11 ], e : [ -7793 ], dhp : 20340 }, { a : -9, d : [ 5 ], e : [ -10932 ], dhp : 19102 }, { a : 4, d : [ 11 ], e : [ -12740 ], dhp : 7600 }, { a : 11, d : [ 5 ], e : [ -12465 ], death : true, dhp : -4295 }, { a : 1, d : [ 11 ], e : [ -7793 ], death : true, dhp : -193 }, { a : -11, d : [ 9 ], e : [ 4362 ], t : 1, dhp : 8901 }, { a : 9, d : [ 1 ], e : [ -7288 ], death : true, dhp : -4801 }, { a : 4, d : [ 9 ], e : [ -12740 ], death : true, dhp : -3839 } ], rewards : { ranking_elixir : 0, exp : 8, money : 297, elixir : 53 } } 
#console.log analyze(bl)

exports = module.exports = new BattleLog()