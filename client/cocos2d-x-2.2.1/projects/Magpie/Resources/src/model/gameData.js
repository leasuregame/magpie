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
    clock: null,
    sound: Sound.create(),
    user: User.create(),
    player: null,
    cardList: null,
    lineUp: null,
    task: null,
    pass: null,
    cardLibrary: null,
    rank: null,
    lottery: null,
    treasureHunt: null,
    message: null,
    tournament: null,
    spirit: null,
    spiritPool: null,
    friend: null,
    payment: null,
    shop: null,
    signIn: null,
    achievement: null,
    speak: null,
    exchange: null,
    activity: null,
    greeting: null,
    boss: null,

    gameStart: function (player) {
        cc.log("gameData init");

        this.clock = Clock.create();
        this.player = Player.create();
        this.cardList = CardList.create();
        this.lineUp = LineUp.create();
        this.task = Task.create();
        this.pass = Pass.create();
        this.cardLibrary = CardLibrary.create();
        this.rank = Rank.create();
        this.lottery = Lottery.create();
        this.treasureHunt = TreasureHunt.create();
        this.message = Message.create();
        this.tournament = Tournament.create();
        this.spirit = Spirit.create();
        this.spiritPool = SpiritPool.create();
        this.friend = Friend.create();
        this.payment = Payment.create();
        this.shop = Shop.create();
        this.signIn = SignIn.create();
        this.achievement = Achievement.create();
        this.speak = Speak.create();
        this.exchange = Exchange.create();
        this.activity = Activity.create();
        this.greeting = Greeting.create();
        this.boss = Boss.create();

        gameCombo.reset();

        gameMark.init();
        gameGuide.init();

        this.player.init(player, function () {
            cc.log("replace to MainScene");

            var mainScene = MainScene.getInstance();
            mainScene.init();
            cc.Director.getInstance().replaceScene(mainScene);
        });
    },

    gameEnd: function () {
        gameCombo.stop();

        if (this.clock) this.clock.unscheduleAllCallbacks();
        if (this.player) this.player.unscheduleAllCallbacks();
        if (this.boss) this.boss.unscheduleAllCallbacks();
    }
};