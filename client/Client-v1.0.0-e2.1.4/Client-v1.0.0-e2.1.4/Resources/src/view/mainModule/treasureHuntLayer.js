/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-21
 * Time: 下午3:40
 * To change this template use File | Settings | File Templates.
 */


/*
 * treasure hunt layer
 * */


var TreasureHuntLayer = cc.Layer.extend({
    _selectFrame: null,
    _table: [

    ],
    _locate: {
        1: cc.p(172, 764),
        2: cc.p(360, 764),
        3: cc.p(548, 764),
        4: cc.p(172, 553),
        5: cc.p(360, 553),
        6: cc.p(548, 553)
    },

    onEnter: function () {
        cc.log("TreasureHuntLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("TreasureHuntLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        for(var i = 0; i < 20; ++i) {

        }
        var frame = cc.Sprite.create(main_scene_image.card_item_bg1);
        frame.setScale(0.8);
        frame.setPosition(cc.p(502, 498));
        this.addChild(frame);

        this._selectFrame = cc.Sprite.create(main_scene_image.icon105);
        this._selectFrame.setPosition(cc.p(500, 500));
        this.addChild(this._selectFrame);

        return true;
    },

    update: function () {
        cc.log("TreasureHuntLayer update");


    }
});


TreasureHuntLayer.create = function () {
    var ret = new TreasureHuntLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};