/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-21
 * Time: 下午4:37
 * To change this template use File | Settings | File Templates.
 */

var BatterLayer = cc.Layer.extend({
    _cardsList : null,
    _labelsList : null,
    _progressList : null,
    _tipLabel : null,

    _cardPosition : [
        cc.p(130, 450),
        cc.p(355, 450),
        cc.p(590, 450),
        cc.p(130, 250),
        cc.p(355, 250),
        cc.p(590, 250),
        cc.p(130, 750),
        cc.p(355, 750),
        cc.p(590, 750),
        cc.p(130, 950),
        cc.p(355, 950),
        cc.p(590, 950)
    ],

    ctor : function() {
        this._super();
        cc.associateWithNative( this, cc.Layer );
    },

    init : function(battleLog) {
        if(!this._super()) return false;

        var size = cc.Director.getInstance().getWinSize();

        var bgSprite = cc.Sprite.create(s_game_bg);
        bgSprite.setPosition(size.width / 2, size.height / 2);
        this.addChild(bgSprite);

        this._cardsList = [];
        this._labelsList = [];
        this._progressList = [];
        this._tipLabel = cc.LabelTTF.create("xxx",  'Times New Roman', 30);
        this._tipLabel.setAnchorPoint(cc.p(0, 0));
        this._tipLabel.setPosition(150, 20);
        this.addChild(this._tipLabel);

        for(var i = 0; i < 12; ++i) {
            var label = cc.LabelTTF.create("",  'Times New Roman', 60);
            label.setColor(cc.c3b(255, 0, 0));
            this.addChild(label, 1);
            label.setPosition(this._cardPosition[i]);
            this._labelsList.push(label);

            label = cc.LabelTTF.create("" + i,  'Times New Roman', 60);
            label.setColor(cc.c3b(255, 255, 0));
            this.addChild(label, 1);
            label.setPosition(this._cardPosition[i].x - 60, this._cardPosition[i].y + 50);
        }


//        var item = cc.MenuItemFont.create("战斗吧、小怪兽！", this.getBattleLog, this);
//        item.setFontSize(20);
//
//        var menu = cc.Menu.create(item);
//        this.addChild(menu);

        this.formation(battleLog);

        return true;
    },

//    getBattleLog : function() {
//        lz.HttpClientPackage.getInstance().HttpGetRequest("http://192.168.1.7:3344/vs", this.newBattle, this);
//    },
//
//    newBattle : function(json) {
//        var battleLogNote = BattleLogNote.getInstance();
//        battleLogNote.pushBattleLogWithJson(json);
//
//        var battleLog = battleLogNote.getLastBattleLog();
//        cc.log(battleLog);
//
//        this.formation(battleLog);
//
//        BattlePlayer.getInstance().play(battleLog.getBattleSteps(), this._cardsList, this._labelsList, this._progressList, this._tipLabel);
//    },

    formation : function(battleLog) {
        cc.log("BattleLayer formation");

        var me = battleLog.getBattleMe().cards;
        var enemy = battleLog.getBattleEnemy().cards;

        cc.log(me);
        cc.log(enemy);

        var cards = [];

        this._tipLabel.setString("");

        for(var i = 0; i < 12; ++i) {
            if(this._cardsList[i] != null) {
                cc.log("remove " + i + " this._cardsList[i]");
                this._cardsList[i].removeFromParent();
                this._cardsList[i] = null;
            }
            if(this._progressList[i] != null) {
                cc.log("remove " + i + " this._progressList[i]");
                this._progressList[i].removeFromParent();
                this._progressList[i] = null;
            }

            cards[i] = i < 6 ? me[i] : enemy[i  - 6];

            if(cards[i] == null) continue;

            var sprite = cc.Sprite.create(s_hero);
            this.addChild(sprite);
            sprite.setPosition(this._cardPosition[i]);
            this._cardsList[i] = sprite;

            var progress = Progress.createWithFile(s_progress_bg, s_progress, cards[i], cards[i]);
            this.addChild(progress);
            progress.setPosition(this._cardPosition[i].x, this._cardPosition[i].y - 100);
            progress.setScale(0.2);
            this._progressList[i] = progress;
        }

        BattlePlayer.getInstance().play(battleLog.getBattleSteps(), this._cardsList, this._labelsList, this._progressList, this._tipLabel);
    }
})


BatterLayer.create = function(battleLog) {
    var ret = new BatterLayer();

    if(ret && ret.init(battleLog)) {
        return ret;
    }

    return null;
}