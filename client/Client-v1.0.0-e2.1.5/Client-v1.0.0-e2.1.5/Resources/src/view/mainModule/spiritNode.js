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
    _spiritSprite: null,
    _bubbleNode: null,

    init: function (spiritLv) {
        cc.log("SpiritNode init");

        if (!this._super()) return false;

        if (spiritLv == undefined) {
            spiritLv = gameData.spirit.get("lv");
        }

        this._spiritSprite = cc.Sprite.create(main_scene_image["spirit_1_" + Math.ceil(spiritLv / 2)]);
        this.addChild(this._spiritSprite);

        return true;
    },

    getId: function () {
        cc.log("SpiritNode getId");

        return -1;
    },

    speak: function (isWin) {
        cc.log("SpiritNode speak");

        if (this._bubbleNode) {
            this._bubbleNode.removeFromParent();
        }

        if (Math.random() < 0.2) {
            var str;

            if (isWin) {
                str = gameData.speak.getPassWinSpiritSpeak();
            } else {
                str = gameData.speak.getPassFailSpiritSpeak();
            }

            if (str) {
                this._bubbleNode = BubbleNode.create(str);
                this._bubbleNode.setPosition(cc.p(45, 30));
                this.addChild(this._bubbleNode);

                this.scheduleOnce(function () {
                    this._bubbleNode.removeFromParent();
                    this._bubbleNode = null;
                }, 2.5);
            }
        }
    },

    setOpacity: function (opacity) {
        this._spiritSprite.setOpacity(opacity);
    },

    up: function () {
        this._spiritSprite.setScale(1.1);
    },

    put: function () {
        this._spiritSprite.setScale(1);
    }
});


SpiritNode.create = function (spiritLv) {
    var ret = new SpiritNode();

    if (ret && ret.init(spiritLv)) {
        return ret;
    }

    return null;
};


SpiritNode.getSpiritItem = function (cb, target) {
    cb = cb || function () {
        if (noviceTeachingLayer.isNoviceTeaching()) {
            noviceTeachingLayer.clearAndSave();
            noviceTeachingLayer.next();
        }

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

    spiritItem.setScale(0.9);

    return spiritItem;
};
