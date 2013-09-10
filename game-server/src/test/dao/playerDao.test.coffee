setup = require ('./setup')
setup(1);
app = require('pomelo').app
dao = require('../../app/dao').init('mysql')
dbClient = app.get('dbClient')
async = require 'async'
should = require 'should'

describe "Player Dao Access Object", ->
  uid = 1000
  pid = 1000
  areaId = 10
  name = 'test_player_name'

  before (done) -> dbClient.delete 'delete from player', -> done()

  describe "#createPlayer", ->

    describe "When player not exists", ->
      after (done) ->
        dbClient.delete 'delete from player where id = ?', [pid], -> done()

      it "should can create a player", (done) ->
        dao.player.create( data: {
          id: pid
          userId: uid
          areaId: areaId
          name: name
        }, (err, res) ->
          should.strictEqual null, err
          res.id.should.be.equal(pid)
          res.name.should.be.equal(name)
          res.areaId.should.be.equal(areaId)
          done()
        )

      it "should return error with param wrong", (done) ->
        dao.player.create data: {}, (err, res) -> 
          should.strictEqual null, res
          err.should.be.eql(
            code: 'ER_NO_DEFAULT_FOR_FIELD',
            msg: 'ER_NO_DEFAULT_FOR_FIELD: Field \'userId\' doesn\'t have a default value')
          
          dao.player.create data: {userId: uid}, (err, res) ->
            should.strictEqual null, res
            err.should.be.eql(
              code: 'ER_NO_DEFAULT_FOR_FIELD',
              msg: 'ER_NO_DEFAULT_FOR_FIELD: Field \'areaId\' doesn\'t have a default value')
            done()


    describe "when player exists", ->
      before (done) ->
        dbClient.insert 'insert into player (id, userId, areaId, name, createTime) values (?,?,?,?,?)',
          [pid, uid, areaId, name, Date.now()], -> done()

      after (done) ->
        dbClient.delete 'delete from player where id = ?', [pid], -> done()

      it "should can not create duplicate player", (done) ->
        dao.player.create data: {
          id: pid
          userId: uid
          areaId: areaId
          name: name
        }, (err, res) ->
          should.strictEqual null, res
          err.should.eql { code: 'ER_DUP_ENTRY', msg: 'ER_DUP_ENTRY: Duplicate entry \'1000\' for key \'PRIMARY\'' }
          done()


  describe "#getPlayer", ->
    before (done) ->
      dbClient.insert 'insert into player (id, userId, areaId, name, createTime) values (?,?,?,?,?)',
        [pid, uid, areaId, name, Date.now()], -> done()

    after (done) ->
      dbClient.delete 'delete from player where id = ?', [pid], -> done()

    describe "when player exists", ->
      it "should can get the existed user with id", (done) ->
        dao.player.fetchOne where: {id: pid}, (err, res) ->
          should.strictEqual null, err
          res.id.should.be.equal(pid)
          res.name.should.be.equal(name)
          # check other property of res
          done()

      it "should can get the existed user with name", (done) ->
        dao.player.fetchOne where: {name: name}, (err, res) ->
          should.strictEqual null, err
          res.id.should.be.equal(pid)
          res.name.should.be.equal(name)
          # check other property of res
          done()

      it "shoudl can get the existed user with userId", (done) ->
        dao.player.fetchOne where: {userId: uid}, (err, res) ->
          should.strictEqual null, err
          res.id.should.be.equal(pid)
          res.name.should.be.equal(name)
          # check other property of res
          done()

    describe "when player not exists", ->
      it "get user with id should return error", (done) ->
        pid_not_exists = 100000
        dao.player.fetchOne where: {id: pid_not_exists}, (err, res) ->
          should.strictEqual null, res
          err.should.eql {code: 404, msg: 'can not find player'}
          done()

      it "get user with name should return error", (done) ->
        name_not_exists = 'not exists name'
        dao.player.fetchOne where: {name: name_not_exists}, (err, res) ->
          should.strictEqual null, res
          err.should.eql {code: 404, msg: 'can not find player'}
          done()

    describe "get all player info", ->
      _pid = 1001
      now = Date.now()
      
      before (done) ->
        async.series([
          (cb) -> dbClient.insert 'insert into player (id, userId, areaId, name, createTime) values (?,?,?,?,?)', [_pid, uid, areaId, name+'__', now], cb
          
          (cb) -> dbClient.insert 'insert into card (id, playerId, tableId, createTime) values (?,?,?,?)', [1, _pid, 1, now], cb
          (cb) -> dbClient.insert 'insert into passiveSkill (id, cardId, name, value) values (?,?,?,?)', [1, 1, 'hp_improve', 10], cb
          
          (cb) -> dbClient.insert 'insert into card (id, playerId, tableId, createTime) values (?,?,?,?)', [2, _pid, 2, now], cb
          (cb) -> dbClient.insert 'insert into passiveSkill (id, cardId, name, value) values (?,?,?,?)', [2, 2, 'hp_improve', 10], cb

          (cb) -> dbClient.insert 'insert into card (id, playerId, tableId, createTime) values (?,?,?,?)', [3, _pid, 3, now], cb
          (cb) -> dbClient.insert 'insert into passiveSkill (id, cardId, name, value) values (?,?,?,?)', [3, 3, 'hp_improve', 10], cb

          (cb) -> dbClient.insert 'insert into card (id, playerId, tableId, createTime) values (?,?,?,?)', [4, _pid, 4, now], cb
          (cb) -> dbClient.insert 'insert into passiveSkill (id, cardId, name, value) values (?,?,?,?)', [4, 4, 'hp_improve', 10], cb

          (cb) -> dbClient.insert 'insert into card (id, playerId, tableId, createTime) values (?,?,?,?)', [5, _pid, 5, now], cb
          (cb) -> dbClient.insert 'insert into passiveSkill (id, cardId, name, value) values (?,?,?,?)', [5, 5, 'hp_improve', 10], cb
          ], (err, res) -> 
            if err
              console.log '创建测试数据出错:', err
            done()
        )

      after (done) ->
        dbClient.delete 'delete from player where id = ?', [_pid], ->
          dbClient.delete 'delete from card', ->
            dbClient.delete 'delete from passiveSkill', -> done()
          
      it "should can be got all the player infomation", (done) ->
        dao.player.getPlayerInfo where: id: _pid, (err, player) ->
          should.strictEqual null, err
          mark = (0 for i in [0...100])

          expect = {
                id: 1001,
                createTime: now,
                userId: 1000,
                areaId: 10,
                name: 'test_player_name__',
                power: '',
                lv: 0,
                vip: 0,
                vipBox: '',
                cash: 0,
                exp: 0,
                money: 0,
                gold: 0,
                lineUp: {},
                ability: 0,
                task: '',
                pass: {
                  layer:0,
                  mark:mark
                }
                dailyGift: {},
                skillPoint: 0,
                energy: 0,
                fregments: undefined,
                elixir: 0,
                spiritor: '',
                spiritPool: {},
                cards: [{
                      id: 1,
                      createTime:now,
                      playerId: 1001,
                      tableId: 1,
                      init_hp: 103,
                      init_atk: 59,
                      hp: 113,
                      atk: 59,
                      incs:{
                        group_hp: 0,
                        group_atk: 0,
                        spirit_hp: 0,
                        spirit_atk: 0,
                        ps_hp: 10,
                        ps_atk: 0,
                        elixir_hp: 0,
                        elixir_atk: 0
                      },
                      star: 1,
                      lv: 1,
                      exp: 0,
                      skillLv: 1,
                      skillPoint: 0,
                      elixir: 0,
                      hpAddition: 0,
                      atkAddition: 0,
                      passiveSkills: [{
                            id: 1,
                            cardId: 1,
                            name: 'hp_improve',
                            value: 10
                      }]
                }, {
                      id: 2,
                      createTime:now,
                      playerId: 1001,
                      tableId: 2,
                      init_hp: 125,
                      init_atk: 109,
                      hp: 137,
                      atk: 109,
                      incs:{
                        group_hp: 0,
                        group_atk: 0,
                        spirit_hp: 0,
                        spirit_atk: 0,
                        ps_hp: 12,
                        ps_atk: 0,
                        elixir_hp: 0,
                        elixir_atk: 0
                      },
                      star: 2,
                      lv: 1,
                      exp: 0,
                      skillLv: 1,
                      skillPoint: 0,
                      elixir: 0,
                      hpAddition: 0,
                      atkAddition: 0,
                      passiveSkills: [{
                            id: 2,
                            cardId: 2,
                            name: 'hp_improve',
                            value: 10
                      }]
                }, {
                      id: 3,
                      createTime:now,
                      playerId: 1001,
                      tableId: 3,
                      init_hp: 352,
                      init_atk: 155,
                      hp: 387,
                      atk: 155,
                      incs:{
                        group_hp: 0,
                        group_atk: 0,
                        spirit_hp: 0,
                        spirit_atk: 0,
                        ps_hp: 35,
                        ps_atk: 0,
                        elixir_hp: 0,
                        elixir_atk: 0
                      },
                      star: 3,
                      lv: 1,
                      exp: 0,
                      skillLv: 1,
                      skillPoint: 0,
                      elixir: 0,
                      hpAddition: 0,
                      atkAddition: 0,
                      passiveSkills: [{
                            id: 3,
                            cardId: 3,
                            name: 'hp_improve',
                            value: 10
                      }]
                }, {
                      id: 4,
                      createTime:now,
                      playerId: 1001,
                      tableId: 4,
                      init_hp: 503,
                      init_atk: 210,
                      hp: 553,
                      atk: 210,
                      incs:{
                        group_hp: 0,
                        group_atk: 0,
                        spirit_hp: 0,
                        spirit_atk: 0,
                        ps_hp: 50,
                        ps_atk: 0,
                        elixir_hp: 0,
                        elixir_atk: 0
                      },
                      star: 4,
                      lv: 1,
                      exp: 0,
                      skillLv: 1,
                      skillPoint: 0,
                      elixir: 0,
                      hpAddition: 0,
                      atkAddition: 0,
                      passiveSkills: [{
                            id: 4,
                            cardId: 4,
                            name: 'hp_improve',
                            value: 10
                      }]
                }, {
                      id: 5,
                      createTime:now,
                      playerId: 1001,
                      tableId: 5,
                      init_hp: 651,
                      init_atk: 280,
                      hp: 716,
                      atk: 280,
                      incs:{
                        group_hp: 0,
                        group_atk: 0,
                        spirit_hp: 0,
                        spirit_atk: 0,
                        ps_hp: 65,
                        ps_atk: 0,
                        elixir_hp: 0,
                        elixir_atk: 0
                      },
                      star: 5,
                      lv: 1,
                      exp: 0,
                      skillLv: 1,
                      skillPoint: 0,
                      elixir: 0,
                      hpAddition: 0,
                      atkAddition: 0,
                      passiveSkills: [{
                            id: 5,
                            cardId: 5,
                            name: 'hp_improve',
                            value: 10
                      }]
                }],
            rank: {},
            friends: [],
            signIn: {}
          }
          _.isEqual(player.toJson(), expect).should.be.equal(true)
         # player.toJson().should.be.eql(expect)
          done()

  describe "#deletePlayer", ->

    before (done) ->
      dbClient.insert 'insert into player (id, userId, areaId, name, createTime) values (?,?,?,?,?)',
        [pid, uid, areaId, name, Date.now()], -> done()

    after (done) ->
      dbClient.delete 'delete from player where id = ?', [pid], -> done()

    it "when player exists, should can be delete a player", (done) ->
      dao.player.delete where: id: pid, (err, res) ->
        should.strictEqual err, null
        res.should.be.ok
        done()

    it "when player not exists, should return false", (done) ->
      dao.player.delete where: id: pid+10000, (err, res) ->
        should.strictEqual err, null
        res.should.not.be.ok
        done()

  describe "#getPlayerDetails",->
    now = Date.now()
    before (done) ->
      async.series([
        (cb) -> dbClient.delete 'delete from player',cb
        (cb) -> dbClient.insert 'insert into player (id, userId, areaId, name, createTime) values (?,?,?,?,?)', [3, 10000, 10, '11', now], cb
        (cb) -> dbClient.insert 'insert into card (id, playerId, tableId, createTime) values (?,?,?,?)', [1, 3, 1, now], cb
        (cb) -> dbClient.insert 'insert into passiveSkill (id, cardId, name, value) values (?,?,?,?)', [1, 1, 'hp_improve', 10], cb

        (cb) -> dbClient.insert 'insert into player (id, userId, areaId, name, createTime) values (?,?,?,?,?)', [2, 20000, 10, '22', now], cb
        (cb) -> dbClient.insert 'insert into card (id, playerId, tableId, createTime) values (?,?,?,?)', [2, 2, 2, now], cb
        (cb) -> dbClient.insert 'insert into passiveSkill (id, cardId, name, value) values (?,?,?,?)', [2, 2, 'hp_improve', 10], cb
      ],(err,res)->
        if(err)
          console.log err
        done()
      )

    after (done) ->
      dbClient.delete 'delete from player', [], ->
        dbClient.delete 'delete from card', ->
          dbClient.delete 'delete from passiveSkill', -> done()

    it "should can be get player details",(done)->
      mark = (0 for i in [0...100])
      dao.player.getPlayerDetails [3,2],(err,res) ->
          expect = [
            {
              id: 3,
              createTime: now,
              userId: 10000,
              areaId: 10,
              name: '11',
              power: '',
              lv: 0,
              vip: 0,
              vipBox: '',
              cash: 0,
              exp: 0,
              money: 0,
              gold: 0,
              lineUp: {},
              ability: 0,
              task: '',
              pass: {
                layer:0,
                mark:mark
              }
              dailyGift: {},
              skillPoint: 0,
              energy: 0,
              fregments: undefined,
              elixir: 0,
              spiritor: '',
              spiritPool: {},
              cards: [{
                id: 1,
                createTime:now,
                playerId: 3,
                tableId: 1,
                init_hp: 103,
                init_atk: 59,
                hp: 113,
                atk: 59,
                incs:{
                  group_hp: 0,
                  group_atk: 0,
                  spirit_hp: 0,
                  spirit_atk: 0,
                  ps_hp: 10,
                  ps_atk: 0,
                  elixir_hp: 0,
                  elixir_atk: 0
                },
                star: 1,
                lv: 1,
                exp: 0,
                skillLv: 1,
                skillPoint: 0,
                elixir: 0,
                hpAddition: 0,
                atkAddition: 0,
                passiveSkills: [{
                  id: 1,
                  cardId: 1,
                  name: 'hp_improve',
                  value: 10
                }]
              }],
              rank: {},
              friends: [],
              signIn: {}
            },
            {
              id: 2,
              createTime: now,
              userId: 20000,
              areaId: 10,
              name: '22',
              power: '',
              lv: 0,
              vip: 0,
              vipBox: '',
              cash: 0,
              exp: 0,
              money: 0,
              gold: 0,
              lineUp: {},
              ability: 0,
              task: '',
              pass: {
                layer:0,
                mark:mark
              }
              dailyGift: {},
              skillPoint: 0,
              energy: 0,
              fregments: undefined,
              elixir: 0,
              spiritor: '',
              spiritPool: {},
              cards: [{
                id: 2,
                createTime:now,
                playerId: 2,
                tableId: 2,
                init_hp: 125,
                init_atk: 109,
                hp: 137,
                atk: 109,
                incs:{
                  group_hp: 0,
                  group_atk: 0,
                  spirit_hp: 0,
                  spirit_atk: 0,
                  ps_hp: 12,
                  ps_atk: 0,
                  elixir_hp: 0,
                  elixir_atk: 0
                },
                star: 2,
                lv: 1,
                exp: 0,
                skillLv: 1,
                skillPoint: 0,
                elixir: 0,
                hpAddition: 0,
                atkAddition: 0,
                passiveSkills: [{
                  id: 2,
                  cardId: 2,
                  name: 'hp_improve',
                  value: 10
                }]
              }],
              rank: {},
              friends: [],
              signIn: {}
            }
          ]

          console.log res[0].toJson()

          should.strictEqual err,null
          _.isEqual(res[0].toJson(), expect[1]).should.be.equal(true)
          _.isEqual(res[1].toJson(), expect[0]).should.be.equal(true)
          done()

  # describe "#getTop10Players", ->
  #   it "should can get top 10 players order by 'ranking'", (done) ->
  #     dao.player.getTop10Players 'ranking', (err, players) ->
  #       players.length.should.be.equal(6)
  #       (players.map (p) -> p.ranking).should.eql([1,2,3,4,5,6])          
  #       done()