Hero = require '../battle/hero'

describe 'Hero', ->
  it 'Initial', ->
    hero = new Hero({
        id: 1
        lv: 10
        star: 3
        card_id: 1
        })
    
    hero.id.should.equal(1)
    hero.lv.should.equal(10)
    hero.star.should.equal(3)
    hero.card_id.should.equal(1)
    hero.hp.should.equal(275)
    hero.atk.should.equal(100)

  it 'Death', ->
    hero = new Hero({
        id: 1
        lv: 10
        star: 3
        card_id: 1
        })
    hero.death().should.be.false
    hero.hp = 0
    hero.death().should.be.true
    hero.dp = -1
    hero.death().should.be.true

  # it 'Attack', ->
  #   hero1 = new Hero({
  #       id: 1
  #       lv: 10
  #       star: 3
  #       card_id: 1
  #       })
  #   hero2 = new Hero({
  #       id: 2
  #       lv: 10
  #       star: 3
  #       card_id: 1
  #       })
  #   hero3 = new Hero({
  #       id: 3
  #       lv: 10
  #       star: 3
  #       card_id: 1
  #       })

  #   hero1.attack(hero2)
  #   hero2.hp.should.equal(459)

  #   hero1.attack([hero2, hero3])
  #   hero2.hp.should.equal(418)
  #   hero3.hp.should.equal(459)