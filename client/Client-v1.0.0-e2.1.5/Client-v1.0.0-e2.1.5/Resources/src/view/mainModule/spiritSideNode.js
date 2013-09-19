/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-19
 * Time: 下午6:27
 * To change this template use File | Settings | File Templates.
 */


/*
 * spirit side node
 * */


var SpiritSideNode = cc.Node.extend({
    _spiritSprite: null,
    _spiritFaceSprite1: null,
    _spiritFaceSprite2: null,
    _spiritFaceSprite3: null,

    init: function () {
        cc.log("SpiritSideNode init");

        if (!this._super()) return false;

        this._spiritSprite = cc.Sprite.create(main_scene_image.spirit_side);
        this.addChild(this._spiritSprite);

        this._spiritFaceSprite1 = cc.Sprite.create(main_scene_image.spirit_face1);
        this._spiritFaceSprite1.setPosition(cc.p(10, -5));
        this.addChild(this._spiritFaceSprite1);

        this._spiritFaceSprite2 = cc.Sprite.create(main_scene_image.spirit_face2);
        this._spiritFaceSprite2.setPosition(cc.p(48, 8));
        this.addChild(this._spiritFaceSprite2);

        this._spiritFaceSprite3 = cc.Sprite.create(main_scene_image.spirit_face3);
        this._spiritFaceSprite3.setPosition(cc.p(30, 10));
        this.addChild(this._spiritFaceSprite3);

        this.normal();

        return true;
    },

    normal: function () {
        cc.log("SpiritSideNode normal");

        this._spiritFaceSprite1.setVisible(true);
        this._spiritFaceSprite2.setVisible(false);
        this._spiritFaceSprite3.setVisible(false);
    },

    encounterBattle: function () {
        cc.log("SpiritSideNode encounterBattle");

        this._spiritFaceSprite1.setVisible(false);
        this._spiritFaceSprite2.setVisible(true);
        this._spiritFaceSprite3.setVisible(false);
    },

    encounterBox: function () {
        cc.log("SpiritSideNode encounterBox");

        this._spiritFaceSprite1.setVisible(false);
        this._spiritFaceSprite2.setVisible(false);
        this._spiritFaceSprite3.setVisible(true);
    }
});


SpiritSideNode.create = function () {
    var ret = new SpiritSideNode();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}