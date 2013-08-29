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

        this._spiritSprite = cc.Sprite.create(main_scene_image.spirit1);
        this.addChild(this._spiritSprite);

        return true;
    },

    getId: function() {
        cc.log("SpiritNode getId");

        return -1;
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