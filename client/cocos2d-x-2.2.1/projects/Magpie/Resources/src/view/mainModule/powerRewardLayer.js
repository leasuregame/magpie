/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-29
 * Time: 下午5:21
 * To change this template use File | Settings | File Templates.
 */

var PowerRewardLayer = cc.Layer.extend({
    _powerRewardLayerFit: null,

    _btnGetReward: null,
    _effect: null,

    onEnter: function() {
        cc.log("PowerRewardLayer onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("领取体力界面");
    },

    onExit: function() {
        cc.log("PowerRewardLayer onExit");

        this._super();

        lz.um.endLogPageView("领取体力界面");
    },

    init: function() {
        cc.log("PowerRewardLayer init");

        if (!this._super()) return false;
        this._powerRewardLayerFit = gameFit.mainScene.powerRewardLayer;

        var lineIcon = cc.Sprite.create(main_scene_image.icon18);
        lineIcon.setAnchorPoint(cc.p(0, 0));
        lineIcon.setPosition(this._powerRewardLayerFit.lineIconPoint);
        this.addChild(lineIcon);

        var headText = cc.LabelTTF.create('每天中午、下午和晚上固定时间，可免费领取体力', "STHeitiTC-Medium", 20);
        headText.setColor(cc.c3b(255, 239, 131));
        headText.setAnchorPoint(cc.p(0, 0));
        headText.setPosition(this._powerRewardLayerFit.headTextPoint);
        this.addChild(headText);

        var tipIcon = cc.Sprite.create(main_scene_image.icon269);
        tipIcon.setAnchorPoint(cc.p(0, 0));
        tipIcon.setPosition(this._powerRewardLayerFit.tipIconPoint);
        this.addChild(tipIcon);

        this._effect = cc.BuilderReader.load(main_scene_image.uiEffect53, this);
        this._effect.setPosition(this._powerRewardLayerFit.powerBgIconPoint);

        this.addChild(this._effect);

        var itemText1 = cc.LabelTTF.create("中午            11点 ~ 13点", "STHeitiTC-Medium", 25);
        itemText1.setAnchorPoint(cc.p(0, 0));
        itemText1.setPosition(cc.p(this._powerRewardLayerFit.itemText1BasePoint.x, this._powerRewardLayerFit.itemText1BasePoint.y));
        this.addChild(itemText1);

        var itemText2 = cc.LabelTTF.create("下午            17点 ~ 19点", "STHeitiTC-Medium", 25);
        itemText2.setAnchorPoint(cc.p(0, 0));
        itemText2.setPosition(cc.p(this._powerRewardLayerFit.itemText1BasePoint.x, this._powerRewardLayerFit.itemText2BasePoint.y));
        this.addChild(itemText2);

        var itemText3 = cc.LabelTTF.create('晚上            21点 ~ 23点', "STHeitiTC-Medium", 25);
        itemText3.setAnchorPoint(cc.p(0, 0));
        itemText3.setPosition(cc.p(this._powerRewardLayerFit.itemText1BasePoint.x, this._powerRewardLayerFit.itemText3BasePoint.y));
        this.addChild(itemText3);

        this._btnGetReward = cc.MenuItemImage.createWithIcon(
            main_scene_image.button10,
            main_scene_image.button10s,
            main_scene_image.button9d,
            main_scene_image.icon123,
            this._onClickGetReward,
            this
        );

        this._btnGetReward.setPosition(this._powerRewardLayerFit.btnGetRewardPoint);
        this._btnGetReward.setEnabled(gameMark.getPowerRewardMark());

        var menu = cc.Menu.create(this._btnGetReward);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    update: function() {
        cc.log("PowerRewardLayer update");

        var isMark = gameMark.getPowerRewardMark();

        if (isMark) {
            this._effect.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_2", 0);
        } else {
            this._effect.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_1", 0);
        }

        this._btnGetReward.setEnabled(isMark);

    },

    _onClickGetReward: function() {
        cc.log("PowerRewardLayer _onClickGetReward");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;

        gameData.activity.getPowerReward(function() {
            gameMark.updatePowerRewardMark(false);
            that.update();
        });
    }


});

PowerRewardLayer.create = function() {
    var ret = new PowerRewardLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};