/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-9
 * Time: 下午4:42
 * To change this template use File | Settings | File Templates.
 */


/*
 * achievement layer
 * */


var AchievementLayer = cc.Layer.extend({
    init: function () {
        cc.log("AchievementLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 962));
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon210);
        titleIcon.setPosition(cc.p(360, 1000));
        this.addChild(titleIcon);

        return true;
    },

    update: function () {
        cc.log("AchievementLayer update");
    }
});


AchievementLayer.create = function () {
    var ret = new AchievementLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};