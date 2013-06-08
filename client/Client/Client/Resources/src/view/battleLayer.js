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
            label.setPosition(this._cardPosition[i].x - 70, this._cardPosition[i].y + 50);
        }

        this.formation(battleLog);

        return true;
    },

    formation : function(battleLog) {
        cc.log("BattleLayer formation");

        var me = battleLog.getBattleOwn().cards;
        var enemy = battleLog.getBattleEnemy().cards;

        cc.log(me);
        cc.log(enemy);

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

            var card = i < 6 ? me[i] : enemy[i  - 6];

            if(card == null) continue;

            var sprite = CardNode.create(i);
            this.addChild(sprite);
            sprite.setPosition(this._cardPosition[i]);
            this._cardsList[i] = sprite;

            var progress = Progress.createWithFile(s_progress_bg, s_progress, card.hp, card.hp);
            this.addChild(progress);
            progress.setPosition(this._cardPosition[i].x, this._cardPosition[i].y - 100);
            progress.setScale(0.2);
            this._progressList[i] = progress;
        }

        BattlePlayer.getInstance().play(battleLog, this._cardsList, this._labelsList, this._progressList, this._tipLabel);
    }
})


BatterLayer.create = function(battleLog) {
    var ret = new BatterLayer();

    if(ret && ret.init(battleLog)) {
        return ret;
    }

    return null;
}