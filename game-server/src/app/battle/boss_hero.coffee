Hero = require './hero'
Skill = require './skill'
tab = require '../manager/table'

class BossHero extends Hero
  init: (data, player) ->
    @player = player

module.exports = BossHero