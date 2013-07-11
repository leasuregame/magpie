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
    mainScene : null,

    user: null,
    player: null,
    task: null,
    pass: null,
    cardLibrary: null,
    rank: null,
    lottery: null,

    gameInit: function() {
        cc.log("gameData init");

        this.lottery = Lottery.create();
    },

    gameEnd: function() {

    }
}


gameData.gameInit();