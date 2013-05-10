Hero = require '../battle/hero'

describe 'Hero', ->
  it 'Initial', ->
    hero = new Hero({
        id: 1
        lv: 10
        star: 3
        card_id: 1
        })
    
    hero.hp.should.equal(501)
    hero.atk.should.equal(41)
    hero.slots.should.be.empty
    hero.magic.should.be.empty

  it 'Load', ->
    hero = new Hero({
        id: 1
        lv: 10
        star: 3
        card_id: 1
        })
    hero.load(2)

    hero.hp.should.equal(500)
    hero.atk.should.equal(40)

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

  it 'Attack', ->
    hero1 = new Hero({
        id: 1
        lv: 10
        star: 3
        card_id: 1
        })
    hero2 = new Hero({
        id: 2
        lv: 10
        star: 3
        card_id: 1
        })
    hero3 = new Hero({
        id: 3
        lv: 10
        star: 3
        card_id: 1
        })

    hero1.attack(hero2)
    hero2.hp.should.equal(459)

    hero1.attack([hero2, hero3])
    hero2.hp.should.equal(418)
    hero3.hp.should.equal(459)