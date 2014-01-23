//require('./setup');
var Player = require('../../app/domain/entity/player');
var achieve = require('../../app/domain/achievement');
var should = require('should');

describe("Achievement Object", function() {

	describe("Achievement tests", function() {
		describe('当修改了成就达成的上限时', function() {
			it('应该重设达成标记', function() {
				var ply = new Player({
					lv: 50,
					achievement: {
						'1': {
							method: 'levelTo',
							isAchieve: true,
							isTake: true,
							got: 50
						}
					}
				});

				ply.achievement.should.eql({});


			});
		});

		describe("when player lv is 10", function() {
			it('应该有升级成就，但还没有达到', function() {
				var ply = new Player({
					lv: 10
				});
				ply.achievement.should.eql({
					'1': {
						method: 'levelTo',
						isAchieve: false,
						got: 10
					},
					'2': {
						method: 'levelTo',
						isAchieve: false,
						got: 10
					},
					'3': {
						method: 'passTo',
						isAchieve: false,
						got: 0
					},
					'4': {
						method: 'passTo',
						isAchieve: false,
						got: 0
					}
				});
			});
		});

		describe('when player lv is 50', function() {
			it('获得成就：升级达人', function() {
				var ply = new Player({
					lv: 50
				});
				ply.achievement.should.eql({
					'1': {
						method: 'levelTo',
						isAchieve: true,
						got: 50
					},
					'2': {
						method: 'levelTo',
						isAchieve: false,
						got: 50
					},
					'3': {
						method: 'passTo',
						isAchieve: false,
						got: 0
					},
					'4': {
						method: 'passTo',
						isAchieve: false,
						got: 0
					}
				});
			});
		});

		describe('when player lv is 90', function() {
			it('获得成就：升级达人，疯狂升级', function() {
				var ply = new Player({
					lv: 90
				});
				ply.achievement.should.eql({
					'1': {
						method: 'levelTo',
						isAchieve: true,
						got: 50
					},
					'2': {
						method: 'levelTo',
						isAchieve: true,
						got: 90
					},
					'3': {
						method: 'passTo',
						isAchieve: false,
						got: 0
					},
					'4': {
						method: 'passTo',
						isAchieve: false,
						got: 0
					}
				});
			});
		});

		describe('when player pass layer is 10', function() {
			it('有爬塔成就记录，但未通过', function() {
				var ply = new Player({
					pass: {
						layer: 10,
						mark: []
					}
				});
				ply.achievement[3].should.eql({
					method: 'passTo',
					isAchieve: false,
					got: 10
				});
				ply.achievement[4].should.eql({
					method: 'passTo',
					isAchieve: false,
					got: 10
				});
			});
		});

		describe('when player pass layer is 50', function(){
			it('获得成就：一半！', function(){
				var ply = new Player({
					pass: {
						layer: 50,
						mark: []
					}
				});
				ply.achievement[3].should.eql({
					method: 'passTo',
					isAchieve: true,
					got: 50
				});
				ply.achievement[4].should.eql({
					method: 'passTo',
					isAchieve: false,
					got: 50
				});
			});
		});

		describe('when player pass layer is 100', function(){
			it('获得成就：一半！，通关！', function(){
				var ply = new Player({
					pass: {
						layer: 100,
						mark: []
					}
				});
				ply.achievement[3].should.eql({
					method: 'passTo',
					isAchieve: true,
					got: 50
				});
				ply.achievement[4].should.eql({
					method: 'passTo',
					isAchieve: true,
					got: 100
				});
			});
		});

		describe('when win count is 23', function(){
			it('应该记录了胜利次数成就，但未获得', function(){
				var ply = new Player();
				achieve.winCount(ply, 23);
				ply.achievement[5].should.eql({
					method: 'winCount',
					isAchieve: false,
					got: 23
				});
				ply.achievement[6].should.eql({
					method: 'winCount',
					isAchieve: false,
					got: 23
				});
			});
		});

		describe('when win count is 50', function(){
			it('获得成就：小试牛刀', function(){
				var ply = new Player();
				achieve.winCount(ply, 50);
				ply.achievement[5].should.eql({
					method: 'winCount',
					isAchieve: true,
					got: 50
				});
				ply.achievement[6].should.eql({
					method: 'winCount',
					isAchieve: false,
					got: 50
				});
			});
		});

		describe('when win count is 5000', function(){
			it('获得成就：小试牛刀，已经超神了', function(){
				var ply = new Player();
				achieve.winCount(ply, 5000);
				ply.achievement[5].should.eql({
					method: 'winCount',
					isAchieve: true,
					got: 50
				});
				ply.achievement[6].should.eql({
					method: 'winCount',
					isAchieve: true,
					got: 5000
				});
			});
		});

		describe('when winning streak is 10', function(){
			it('应该记录了连胜次数成就，但未获得', function(){
				var ply = new Player();
				achieve.winningStreak(ply, 10);
				ply.achievement[7].should.eql({
					method: 'winningStreak',
					isAchieve: false,
					got: 10
				});
			});
		});

		describe('when winning streak is 50', function(){
			it('获得成就：所向披靡', function(){
				var ply = new Player();
				achieve.winningStreak(ply, 50);
				ply.achievement[7].should.eql({
					method: 'winningStreak',
					isAchieve: true,
					got: 50
				});
			});
		});

		describe('when ranking is 1', function() {
			it('获得成就：寂寞', function(){
				var ply = new Player();
				achieve.rankingToOne(ply);
				ply.achievement[8].should.eql({
					method: 'rankingTo',
					isAchieve: true,
					got: 1
				});
			});
		});

		describe('when friend count is 20', function(){
			it('获得成就：我们约会吧', function(){
				var ply = new Player();
				achieve.friends(ply, 20);
				ply.achievement[10].should.eql({
					method: 'friends',
					isAchieve: true,
					got: 20
				});
			})
		});

		describe('when elixir is 10000', function(){
			it('应该记录了拥有过的仙丹数量成绩，但未获得', function(){
				var ply = new Player();
				achieve.elixirTo(ply, 10000);
				ply.achievement[17].should.eql({
					method: 'elixirTo',
					isAchieve: false,
					got: 10000
				});
			});
		});

		describe('when elixir is 10000', function(){
			it('获得成就：一大波仙丹', function(){
				var ply = new Player();
				achieve.elixirTo(ply, 100000);
				ply.achievement[17].should.eql({
					method: 'elixirTo',
					isAchieve: true,
					got: 100000
				});
			});
		});

		describe('when power consume is 100', function(){
			it('应该记录了体力消耗成就，但未获得', function(){
				var ply = new Player();
				achieve.powerConsume(ply, 100);
				ply.achievement[22].should.eql({
					method: 'powerConsume',
					isAchieve: false,
					got: 100
				});

				achieve.powerConsume(ply, 200);
				ply.achievement[22].should.eql({
					method: 'powerConsume',
					isAchieve: false,
					got: 300
				});
			});
		});

		describe('when power consume is 100', function(){
			it('获得成就：孜孜不倦', function(){
				var ply = new Player();
				achieve.powerConsume(ply, 100);
				ply.achievement[22].should.eql({
					method: 'powerConsume',
					isAchieve: false,
					got: 100
				});

				achieve.powerConsume(ply, 9900);
				ply.achievement[22].should.eql({
					method: 'powerConsume',
					isAchieve: true,
					got: 10000
				});
			});
		});

		describe('when give bless', function(){
			it('应该记录了送祝福次数成就，但未获得', function(){
				var ply = new Player();
				achieve.gaveBless(ply);
				ply.achievement[11].should.eql({
					method: 'gaveBless',
					isAchieve: false,
					got: 1
				});

				achieve.gaveBless(ply);
				ply.achievement[11].should.eql({
					method: 'gaveBless',
					isAchieve: false,
					got: 2
				});
			});
		});

		describe('when give bless count is 500', function(){
			it('获得成就：无私奉献', function(){
				var ply = new Player();
				for (var i = 0; i < 500; i++) {
					achieve.gaveBless(ply);
				}
				
				ply.achievement[11].should.eql({
					method: 'gaveBless',
					isAchieve: true,
					got: 500
				});
			});				
		});

	// end of 'Achievement tests'
	});
// end of 'Achievement Object'
});