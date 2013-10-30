/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-29
 * Time: 下午5:21
 * To change this template use File | Settings | File Templates.
 */

var PowerRewardLayer = cc.Layer.extend({

    onEnter: function () {
        cc.log("RechargeLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("RechargeLayer init");

        if (!this._super()) return false;

        return true;
    },

    update: function() {
        cc.log("RechargeLayer update");

        var lineIcon = cc.Sprite.create(main_scene_image.icon18);
        lineIcon.setAnchorPoint(cc.p(0,0));
        lineIcon.setPosition(cc.p(40, 875));
        this.addChild(lineIcon);

        var headText = cc.LabelTTF.create('每天中午和晚上固定时间，可免费领取体力', "STHeitiTC-Medium", 20);
        headText.setColor(cc.c3b(255, 239, 131));
        headText.setAnchorPoint(cc.p(0,0));
        headText.setPosition(cc.p(165, 900));
        this.addChild(headText);

        var sprite1 = cc.Sprite.create(main_scene_image.icon269);
        sprite1.setAnchorPoint(cc.p(0,0));
        sprite1.setPosition(cc.p(120,675));
        this.addChild(sprite1);

        var sprite2 = cc.Sprite.create(main_scene_image.icon270);
        sprite2.setAnchorPoint(cc.p(0,0));
        sprite2.setPosition(cc.p(125,290));
        this.addChild(sprite2);

        var time = ['中午','12','13','晚上','18','19'];

        for(var i = 0;i < 2;i++) {

            var x = i * 270;
            var itemText = cc.LabelTTF.create(time[i * 3], "STHeitiTC-Medium", 25);
            itemText.setAnchorPoint(cc.p(0, 0));
            itemText.setPosition(cc.p(200 + x,770));
            this.addChild(itemText);

            var itemText = cc.LabelTTF.create('    点--    点', "STHeitiTC-Medium", 25);
            itemText.setAnchorPoint(cc.p(0, 0));
            itemText.setPosition(cc.p(170 + x,730));
            this.addChild(itemText);

            var timeText = cc.LabelTTF.create(time[i * 3 + 1], "STHeitiTC-Medium", 25);
            timeText.setAnchorPoint(cc.p(0, 0));
            timeText.setPosition(cc.p(165 + x,730));
            timeText.setColor(cc.c3b(255, 239, 131));
            this.addChild(timeText);

            var timeText = cc.LabelTTF.create(time[i * 3 + 2], "STHeitiTC-Medium", 25);
            timeText.setAnchorPoint(cc.p(0, 0));
            timeText.setPosition(cc.p(235 + x,730));
            timeText.setColor(cc.c3b(255, 239, 131));
            this.addChild(timeText);

            var itemText = cc.LabelTTF.create('可领取1次', "STHeitiTC-Medium", 25);
            itemText.setAnchorPoint(cc.p(0, 0));
            itemText.setPosition(cc.p(170 + x,690));
            this.addChild(itemText);

        }


        var getReward = cc.MenuItemImage.createWithIcon(
            main_scene_image.button10,
            main_scene_image.button10s,
            main_scene_image.icon123,
            this._onClickGetReward,
            this
        );

        getReward.setPosition(cc.p(355,270));

        var menu = cc.Menu.create(getReward);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);
    },

    _onClickGetReward: function() {
        cc.log("PowerRewardLayer _onClickGetReward");

        //MainScene.getInstance().switchLayer(ShopLayer);
    }


});

PowerRewardLayer.create = function () {
    var ret = new PowerRewardLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};
