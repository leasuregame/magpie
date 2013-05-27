ModelBase = require '../model/model_base'
model = new ModelBase()
util = require 'util'

data = 
  name: "孙悟空"
  lv: 30
  hp: 1000
  atk: 300

callback = (err, item) ->
  if err? 
    throw new Error('error occur!')

_model = null

describe 'ModelBase', ->
  #beforeEach ->
    #_model = ModelBase.create data, (err, item) ->

  #afterEach ->
    #ModelBase.remove _model.id, (err, item) ->

  it 'create', ->
    ModelBase.create data, (err, item) ->
      #console.log item.id
      console.log 'create........'
      item.name.should.be.equal "孙悟空"
      item.lv.should.be.equal 30
      item.hp.should.be.equal 1000
      item.atk.should.be.equal 300
      ModelBase.remove item.id, (err, item) ->


  it 'fetch', ->
    ModelBase.fetch '51b14a10-c6c0-11e2-b1fa-4375fabd52c1', (err, item) ->
      console.log  err, item.id
      item.id.should.be.equal '51b14a10-c6c0-11e2-b1fa-4375fabd52c1'