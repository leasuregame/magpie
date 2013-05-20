Hero = require '../battle/hero'
tab = require '../model/table'

describe 'Hero', ->
  before ->
    tab.reloadTables(
        './test/tables/skills.xml',
        './test/tables/cards.xml'
        )

  it 'Initial', ->
    hero = new Hero({
        id: 1
        lv: 10
        star: 1
        card_id: 1
        })
    
    hero.id.should.equal(1)
    hero.lv.should.equal(10)
    hero.star.should.equal(1)
    hero.card_id.should.equal(1)
    hero.hp.should.equal(275)
    hero.atk.should.equal(100)

  it 'Death', ->
    hero = new Hero({
        id: 1
        lv: 10
        star: 1
        card_id: 1
        skill_lv: 2
        })
    hero.death().should.be.false
    hero.hp = 0
    hero.death().should.be.true
    hero.dp = -1
    hero.death().should.be.true

  it 'create hero, with skill atk_improve', ->
    hero = new Hero(
        id: 1
        lv: 10
        star: 3
        card_id: 8
        skill_lv: 2
      )

    hero.should.be.instanceof(Hero)
    hero.init_atk.should.be.equal(550)
    hero.init_hp.should.be.equal(580)

    hero.atk.should.be.equal(632)
    hero.hp.should.be.equal(580)
