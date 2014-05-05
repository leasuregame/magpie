/**
 * Created by lujunyu on 14-5-5.
 */

var GrowthPlanLayer = cc.Layer.extend({

    init: function() {
        cc.log("GrowthPlanLayer init");

        if(!this._super()) return false;

        var bgLabel = cc.Sprite.create(main_scene_image.bg23);
        bgLabel.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(bgLabel);

        var topIcon = cc.Sprite.create(main_scene_image.icon434);
        topIcon.setPosition(cc.p(360, 740));
        this.addChild(topIcon);

        return true;
    }

});

GrowthPlanLayer.create = function () {
    cc.log("GrowthPlanLayer create");

    var ret = new GrowthPlanLayer();
    if (ret && ret.init()) {
        return ret;
    }

    return null;
};