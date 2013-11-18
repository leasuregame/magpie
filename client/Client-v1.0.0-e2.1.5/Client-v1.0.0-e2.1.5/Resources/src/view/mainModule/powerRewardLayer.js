/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-29
 * Time: 下午5:21
 * To change this template use File | Settings | File Templates.
 */

var PowerRewardLayer = cc.Layer.extend({
    _powerRewardLayerFit: null,

    onEnter: function () {
        cc.log("PowerRewardLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("PowerRewardLayer init");

        if (!this._super()) return false;
        this._powerRewardLayerFit = gameFit.mainScene.powerRewardLayer;
        return true;
    },

    update: function () {
        cc.log("PowerRewardLayer update");

        var lineIcon = cc.Sprite.create(main_scene_image.icon18);
        lineIcon.setAnchorPoint(cc.p(0, 0));
        lineIcon.setPosition(this._powerRewardLayerFit.lineIconPoint);
        this.addChild(lineIcon);

        var headText = cc.LabelTTF.create('每天中午和晚上固定时间，可免费领取体力', "STHeitiTC-Medium", 20);
        headText.setColor(cc.c3b(255, 239, 131));
        headText.setAnchorPoint(cc.p(0, 0));
        headText.setPosition(this._powerRewardLayerFit.headTextPoint);
        this.addChild(headText);

        var tipIcon = cc.Sprite.create(main_scene_image.icon269);
        tipIcon.setAnchorPoint(cc.p(0, 0));
        tipIcon.setPosition(this._powerRewardLayerFit.tipIconPoint);
        this.addChild(tipIcon);

        var powerBgIcon = cc.Sprite.create(main_scene_image.icon270);
        powerBgIcon.setAnchorPoint(cc.p(0, 0));
        powerBgIcon.setPosition(this._powerRewardLayerFit.powerBgIconPoint);
        this.addChild(powerBgIcon);

        var time = ['中午', '12', '13', '晚上', '18', '19'];

        for (var i = 0; i < 2; i++) {

            var x = i * this._powerRewardLayerFit.textOffsetX;
            var itemText1 = cc.LabelTTF.create(time[i * 3], "STHeitiTC-Medium", 25);
            itemText1.setAnchorPoint(cc.p(0, 0));
            itemText1.setPosition(cc.p(this._powerRewardLayerFit.itemText1BasePoint.x + x, this._powerRewardLayerFit.itemText1BasePoint.y));
            this.addChild(itemText1);

            var itemText2 = cc.LabelTTF.create('     点 --      点', "STHeitiTC-Medium", 25);
            itemText2.setAnchorPoint(cc.p(0, 0));
            itemText2.setPosition(cc.p(this._powerRewardLayerFit.itemText2BasePoint.x + x, this._powerRewardLayerFit.itemText2BasePoint.y));
            this.addChild(itemText2);

            var timeText1 = cc.LabelTTF.create(time[i * 3 + 1], "STHeitiTC-Medium", 25);
            timeText1.setAnchorPoint(cc.p(0, 0));
            timeText1.setPosition(cc.p(this._powerRewardLayerFit.timeText1BasePoint.x + x, this._powerRewardLayerFit.timeText1BasePoint.y));
            timeText1.setColor(cc.c3b(255, 239, 131));
            this.addChild(timeText1);

            var timeText2 = cc.LabelTTF.create(time[i * 3 + 2], "STHeitiTC-Medium", 25);
            timeText2.setAnchorPoint(cc.p(0, 0));
            timeText2.setPosition(cc.p(this._powerRewardLayerFit.timeText2BasePoint.x + x, this._powerRewardLayerFit.timeText2BasePoint.y));
            timeText2.setColor(cc.c3b(255, 239, 131));
            this.addChild(timeText2);

            var itemText3 = cc.LabelTTF.create('可领取1次', "STHeitiTC-Medium", 25);
            itemText3.setAnchorPoint(cc.p(0, 0));
            itemText3.setPosition(cc.p(this._powerRewardLayerFit.itemText3BasePoint.x + x, this._powerRewardLayerFit.itemText3BasePoint.y));
            this.addChild(itemText3);

        }

        var btnGetReward = cc.MenuItemImage.createWithIcon(
            main_scene_image.button10,
            main_scene_image.button10s,
            main_scene_image.icon123,
            this._onClickGetReward,
            this
        );

        btnGetReward.setPosition(this._powerRewardLayerFit.btnGetRewardPoint);

        var menu = cc.Menu.create(btnGetReward);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);
    },

    _onClickGetReward: function () {
        cc.log("PowerRewardLayer _onClickGetReward");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        gameData.activity.getPowerReward();
    }


});

PowerRewardLayer.create = function () {
    var ret = new PowerRewardLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};
