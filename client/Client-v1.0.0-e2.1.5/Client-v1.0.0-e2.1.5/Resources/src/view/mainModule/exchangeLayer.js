/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-10-9
 * Time: 下午5:11
 * To change this template use File | Settings | File Templates.
 */


/*
 * exchange layer
 * */


var ExchangeLayer = cc.Layer.extend({
    onEnter: function () {
        cc.log("ExchangeLayer init");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("ExchangeLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg19);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(cc.p(40, 0));
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 968));
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon246);
        titleIcon.setPosition(cc.p(360, 1008));
        this.addChild(titleIcon);

        var headLabel = cc.Sprite.create(main_scene_image.icon147);
        headLabel.setPosition(cc.p(360, 938));
        this.addChild(headLabel);

        var fragmentIcon = cc.Sprite.create(main_scene_image.icon243);
        fragmentIcon.setPosition(cc.p(570, 938));
        this.addChild(fragmentIcon);

        this._fragmentLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._fragmentLabel.setAnchorPoint(cc.p(0, 0.5));
        this._fragmentLabel.setPosition(cc.p(600, 938));
        this.addChild(this._fragmentLabel);

        return true;
    },

    update: function () {
        cc.log("ExchangeLayer update");

        this._fragmentLabel.setString(gameData.player.get("fragment"));
    }
});


ExchangeLayer.create = function () {
    var ret = new ExchangeLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};