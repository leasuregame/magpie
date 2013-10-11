battle = require '../../../manager/simulateBattle'
lottery = require '../../../manager/lottery'
card = require '../../../domain/entity/card'


module.exports = (app) ->
  new Handler(app)

Handler = (@app) ->

Handler::simulateBattle = (msg,session,next)->
  console.log msg
  attacker = msg.attacker
  defender = msg.defender
  battleLog = new battle(attacker,defender);
  next(null,{code:200,msg:battleLog})

Handler::simulateLottery = (msg,session,next)->
  console.log msg
  level = msg.level
  type = msg.type
  next null,{code:200,msg:lottery(level,type)}

Handler::simulatePassSkillAfresh = (msg,session,next)->
  console.log msg
  type = msg.type
  ps = {
    id:0,
    name:'',
    value:0.0
  }
  c = new card
  c.star = 3;
  c.afreshPassiveSkill(type,ps)
  console.log(c.passiveSkills);
  next null,{code:200,msg:c.passiveSkills}



