/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-9
 * Time: 下午6:11
 * To change this template use File | Settings | File Templates.
 */


/*
 * game data
 * */

var gameData = {
    user: null,
    player: null,
    cardList: null,
    lineUp: null,
    task: null,
    pass: null,
    cardLibrary: null,
    rank: null,
    lottery: null,
    message: null,
    tournament : null,

    gameInit: function () {
        cc.log("gameData init");

        this.user = User.create();
        this.player = Player.create();
        this.cardList = CardList.create();
        this.lineUp = LineUp.create();
        this.task = Task.create();
        this.pass = Pass.create();
        this.cardLibrary = CardLibrary.create();
        this.rank = Rank.create();
        this.lottery = Lottery.create();
        this.message = Message.create();
        this.tournament = Tournament.create();
    },

    gameEnd: function () {

    }
}


gameData.gameInit();