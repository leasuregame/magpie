setup = require ('./setup')
setup(1)
app = require("pomelo").app
dao = app.get('dao')
dbClient = app.get('dbClient')
should = require 'should'

describe 'Level Distribution Date Access Object', ->
  cd = Date.now()
  data = 
    id: 1
    createTime: cd
    lv: 10
    qty: 10
    playerCreateTime: cd

  describe '#create', ->
    describe 'when not exists', ->
      before (done)-> dbClient.delete 'delete from lvDistribution', -> done()

      after (done) -> dbClient.delete 'delete from lvDistribution where id = ?', [data.id], -> done()

      it 'should can create a lvDistribution record', (done) ->
        dao.lvDistribution.create data: data, (err, res) ->
          should.strictEqual null, err
          res.id.should.be.equal data.id
          res.createTime.should.be.equal cd
          res.qty.should.be.equal data.qty
          res.lv.should.be.equal data.lv
          res.playerCreateTime.should.be.equal data.playerCreateTime
          done()

      it "should can't be create with the wrong param", (done) ->
          dao.lvDistribution.create data:{}, (err, res) ->
            should.strictEqual null, err
            res.qty.should.be.equal 0
            done()

    describe 'when exists', -> 
      before (done) -> dbClient.insert 'insert into lvDistribution set ? ', data, -> done()

      after (done) -> dbClient.delete 'delete from lvDistribution where id = ?', [data.id], -> done()

      it 'should can not create a duplicate record', (done) ->
        dao.lvDistribution.create data: data, (err, res) ->
          should.strictEqual null, res
          err.should.eql {"code":"ER_DUP_ENTRY","msg":"ER_DUP_ENTRY: Duplicate entry '1' for key 'PRIMARY'"}
          done()

  describe '#delete', ->
    before (done) -> dbClient.insert 'insert into lvDistribution set ? ', data, -> done()

    it 'should can delete a lvDistribution record', (done) ->
      dao.lvDistribution.delete where: id: data.id, (err, res) ->
        should.strictEqual null, err
        res.should.be.ok
        done()

    it 'should can not delete a not exist lvDistribution record', (done) ->
      dao.lvDistribution.delete where: id: data.id+1, (err, res) ->
        should.strictEqual null, err
        res.should.not.be.ok
        done()      

  describe '#fetchOne', ->
    before (done) -> dbClient.insert 'insert into lvDistribution set ? ', data, -> done()

    after (done) -> dbClient.delete 'delete from lvDistribution where id = ?', [data.id], -> done()

    it 'should can fetch one record by id', (done) -> 
      dao.lvDistribution.fetchOne where: id: data.id, (err, res) -> 
        should.strictEqual null, err

        res.id.should.be.equal data.id
        res.createTime.should.be.equal cd
        res.qty.should.be.equal data.qty
        res.lv.should.be.equal data.lv
        res.playerCreateTime.should.be.equal data.playerCreateTime
        done()

    it 'should can not fetch one not exist lvDistribution record', (done) -> 
      dao.lvDistribution.fetchOne where: id: data.id + 100, (err, res) ->
        should.strictEqual null, res
        err.should.eql {code: 404, msg: 'can not find lvDistribution'}
        done()

  describe '#update', ->
    before (done) -> dbClient.insert 'insert into lvDistribution set ? ', data, -> done()

    after (done) -> dbClient.delete 'delete from lvDistribution where id = ?', [data.id], -> done()

    it 'shoudl can update an exist lvDistribution record', (done) ->
      dao.lvDistribution.update {
        where: id: data.id
        data: qty: 30
      }, (err, res) ->
        should.strictEqual null,err
        res.should.be.equal true

        dbClient.query 'select qty from lvDistribution where id = ?', [data.id], (err, res) ->
          should.strictEqual null,err
          res[0].qty.should.be.equal 30
          done()

    it 'should can not update an not exist lvDistribution record', (done) ->
      dao.lvDistribution.update {
        where: id : data.id + 100
        data: qty: 40
      }, (err, res) ->
        should.strictEqual null,err
        res.should.be.equal false
        done()
