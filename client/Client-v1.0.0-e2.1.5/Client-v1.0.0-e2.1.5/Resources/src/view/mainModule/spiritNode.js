/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-23
 * Time: 上午10:02
 * To change this template use File | Settings | File Templates.
 */


/*
 * spirit node
 * */


var SpiritNode = cc.Node.extend({
    _spirit: null,
    _spiritSprite: null,

    init: function () {
        cc.log("SpiritNode init");

        if (!this._super()) return false;

        this._spirit = gameData.spirit;

        var spiritLv = this._spirit.get("lv");

        this._spiritSprite = cc.Sprite.create(main_scene_image["spirit" + spiritLv]);
        this.addChild(this._spiritSprite);

        return true;
    },

    getId: function () {
        cc.log("SpiritNode getId");

        return -1;
    },

    _speak: function (str) {
        cc.log("SpiritNode speak");

        if (str) {
            var bubbleNode = BubbleNode.create(str);
            bubbleNode.setPosition(cc.p(45, 30));
            this.addChild(bubbleNode);

            this.scheduleOnce(function () {
                bubbleNode.removeFromParent();
            }, 3);
        }
    },

    passWinSpeak: function () {
        cc.log("SpiritNode passWinSpeak");

        this._speak(gameData.speak.getPassWinSpiritSpeak());
    },

    passFailSpeak: function () {
        cc.log("SpiritNode passFailSpeak");

        this._speak(gameData.speak.getPassFailSpiritSpeak());
    }
});


SpiritNode.create = function () {
    var ret = new SpiritNode();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};


SpiritNode.getSpiritItem = function (cb, target) {
    cb = cb || function () {
        var spiritDetails = SpiritDetails.create();
        MainScene.getInstance().addChild(spiritDetails, 1);
    };
    target = target || this;

    var spiritItem = cc.MenuItemImage.create(
        main_scene_image.spirit1,
        main_scene_image.spirit1,
        cb,
        target
    );

    spiritItem.setScale(0.8);

    return spiritItem;
};