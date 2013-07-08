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

exports = module.exports = new BattleLog()