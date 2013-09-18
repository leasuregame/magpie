'''
Battle log steps 格式:
  [攻击方]:[承受方,一个或多个]:[技能]:[技能产生的效果]
'''
class BattleLog
  constructor: ->
    @result = {}
    @steps = []
    @rewards = {}

  set: (key, value) ->
    @result[key] = value

  get: (key) ->
    @result[key]

  setWinner: (winner) ->
    @set('winner', winner)

  addStep: (step) ->
    @steps.push step

  addReward: (key, value) ->
    @rewards[key] = value

  reports: ->
    @set('steps', @steps)
    @set('rewards', @rewards)
    @result

  clear: ->
    @result = {}
    @rewards = {}
    @steps = []

analyze = (bl) ->
  ownCount = enemyCount = 0
  results = {}
  for k, v in bl.cards
    ownCount += 1 if k <= 6
    enemyCount += 1 if k > 6

    results[k] = v
    results[k].atkCount = 0
    results[k].hitCount = 0
    results[k].dmage = 0

  for s in bl.steps
    results[Math.abs(a)].atkCount += 1

    for d in s.d
      results[Math.abs(d)].hitCount += 1
      

  

exports = module.exports = new BattleLog()