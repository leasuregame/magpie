ModelBase = require '../model/model_base'
model = new ModelBase()
should = require 'should'

data = 
  name: "孙悟空"
  lv: 30
  hp: 1000
  atk: 300

_id = '123456789'

callback = (err, item) ->
  if err? 
    throw new Error('error occur!')

_model = null

describe 'ModelBase, static methods', ->
  #beforeEach ->
    #_model = ModelBase.create data, (err, item) ->

  #afterEach ->
    #ModelBase.remove _model.id, (err, item) ->

  it 'create', ->
    ModelBase.create data, (err, item) ->
      should.strictEqual undefined, err
      item.should.be.instanceOf ModelBase
      
      item.name.should.be.equal "孙悟空"
      item.lv.should.be.equal 30
      item.hp.should.be.equal 1000
      item.atk.should.be.equal 300
      
      ModelBase.remove item.id, (err, item) ->
        should.strictEqual undefined, err
        item.should.be.ok

  it 'fetch', ->
    ModelBase.create data, (err, item) ->
      should.strictEqual undefined, err
      item.should.be.instanceOf ModelBase

      ModelBase.fetch item.id, (err, result) ->
        should.strictEqual undefined, err
        result.id.should.be.equal item.id
        result.name.should.be.equal "孙悟空"
        result.lv.should.be.equal 30
        result.hp.should.be.equal 1000
        result.atk.should.be.equal 300

      ModelBase.remove item.id, (err, item) ->
        should.strictEqual undefined, err
        item.should.be.ok

  it 'fetchMany', ->
    ModelBase.create data, (err, item1) ->
      should.strictEqual undefined, err
      console.log item1
      ModelBase.create data, (err, item2) ->
        should.strictEqual undefined, err
        console.log item1, item2

        ModelBase.fetchMany [item1.id, item2.id], (err, result) ->
          console.log err, result

  it 'update', ->
    ModelBase.create data, (err, item) ->
      should.strictEqual undefined, err
      item.should.be.instanceOf ModelBase

      ModelBase.update item.id, {lv: 20}, (err, result) ->
        should.strictEqual undefined, err
        result.should.be.ok

        ModelBase.fetch item.id, (err, result) ->
          should.strictEqual undefined, err
          result.name.should.be.equal "孙悟空"
          result.lv.should.be.equal 20
          result.hp.should.be.equal 1000
          result.atk.should.be.equal 300

          ModelBase.remove item.id, (err, item) ->
            should.strictEqual undefined, err
            item.should.be.ok

  it 'remove', ->
    ModelBase.create data, (err, item) ->
      should.strictEqual undefined, err
      item.should.be.instanceOf ModelBase
      
      ModelBase.remove item.id, (err, result) ->
        should.strictEqual undefined, err
        result.should.be.ok

        ModelBase.remove item.id, (err, result) ->
          should.strictEqual undefined, err
          result.should.not.be.ok

describe 'ModelBase, instance mothods', ->
  it 'init', ->
    mb = new ModelBase(_id, {name: 'dahai'})
    mb.id.should.be.equal _id
    mb.name.should.be.equal 'dahai'

  # it 'create', ->
  #   mb = new ModelBase(_id, {name: 'dahai'})
  #   mb.create {lv: 10}, (err, result) ->
  #     should.strictEqual undefined, err
  #     result.name.should.be.equal 'dahai'
  #     result.lv.should.be.equal 10

  # it 'gen uuid', ->
  #   uuid = require 'node-uuid'
  #   res = []
  #   for i in [0..10]
  #     res.push uuid.v1()

  #   console.log res
