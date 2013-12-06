/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-14
 * Time: 下午5:45
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle end layer
 * */


var BattleEndLayer = cc.Layer.extend({
    _battleEndLayerFit: null,

    _battleLog: null,
    _ccbNode: null,
    init: function (battleLog) {
        cc.log("BattleEndLayer init");

        if (!this._super()) return false;

        this._battleEndLayerFit = gameFit.battleScene.battleEndLayer;

        this._battleLog = battleLog;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 100), 640, 1136);
        bgLayer.setPosition(this._battleEndLayerFit.bgLayerPoint);
        this.addChild(bgLayer);

        var isWin = this._battleLog.isWin();
        var label;

        if (isWin) {
            this._ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect17, this);
            this._ccbNode.setPosition(this._battleEndLayerFit.winBgSpritePoint);
            this.addChild(this._ccbNode);

            label = this._ccbNode.controller.label;

            var obtainSprite = cc.Sprite.create(main_scene_image.icon227);
            obtainSprite.setPosition(this._battleEndLayerFit.obtainSpritePoint);
            label.addChild(obtainSprite);
        } else {
            this._ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect18, this);
            this._ccbNode.setPosition(this._battleEndLayerFit.failBgSpritePoint);
            this.addChild(this._ccbNode);

            label = this._ccbNode.controller.label;
        }

        var str = lz.getRewardString(this._battleLog.get("reward"));
        var len = str.length;

        if (len == 0) {
            if (isWin) {
                str = [
                    {str: "再接再励", color: cc.c3b(255, 239, 131)},
                    {str: "勇往直前", color: cc.c3b(255, 239, 131)},
                    {str: "打遍三界无敌手", color: cc.c3b(255, 239, 131)}
                ];
            } else {
                str = [
                    {str: "胜败乃常事", color: cc.c3b(255, 255, 255)},
                    {str: "搞搞强化培养洗练", color: cc.c3b(255, 255, 255)},
                    {str: "必能打过", color: cc.c3b(255, 255, 255)}
                ];
            }

            len = 3;
        }

        var offsetY = this._battleEndLayerFit.offsetYHeight;
        var rewardLabel;
        for (var i = 0; i < len; ++i) {
            rewardLabel = cc.LabelTTF.create(str[i].str, "STHeitiTC-Medium", 20);
            rewardLabel.setColor(str[i].color);
            rewardLabel.setAnchorPoint(cc.p(0.5, 1));
            rewardLabel.setPosition(cc.p(this._battleEndLayerFit.rewardLabelPointX, offsetY));
            label.addChild(rewardLabel);

            offsetY -= 53;
        }

        var okItem = cc.MenuItemImage.create(
            main_scene_image.button66,
            main_scene_image.button66s,
            this.end,
            this
        );
        okItem.setPosition(this._battleEndLayerFit.okItemPoint);

        var replayItem = cc.MenuItemImage.create(
            main_scene_image.button67,
            main_scene_image.button67s,
            this.replay,
            this
        );
        replayItem.setPosition(this._battleEndLayerFit.replayItemPoint);

        var goStrengthenLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button27,
            main_scene_image.button27s,
            main_scene_image.icon126,
            this._onClickGoStrengthenLayer,
            this
        );
        goStrengthenLayerItem.setPosition(this._battleEndLayerFit.goStrengthenLayerItemPoint);

        var menu = cc.Menu.create(okItem, replayItem, goStrengthenLayerItem);
        menu.setPosition(cc.p(0, 0));
        label.addChild(menu);

        var goStrengthenLayerIcon = goStrengthenLayerItem.getIconImage();
        goStrengthenLayerIcon.runAction(
            cc.RepeatForever.create(
                cc.Sequence.create(
                    cc.FadeOut.create(2),
                    cc.FadeIn.create(2)
                )
            )
        );

        goStrengthenLayerItem.setVisible(!isWin);

        this.setVisible(false);

        return true;
    },

    play: function () {
        cc.log("BattleEndLayer play");

        this.setVisible(true);

        this._ccbNode.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_1", 0);

        var fragment = this._battleLog.get("reward").fragment;

        if (fragment) {
            var fragmentEffect = cc.BuilderReader.load(main_scene_image.uiEffect23, this);
            fragmentEffect.setPosition(this._battleEndLayerFit.fragmentEffectPoint);
            this.addChild(fragmentEffect, 1);

            fragmentEffect.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_2", 0);

        }

    },

    end: function () {
        cc.log("BattleEndLayer end");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        BattlePlayer.getInstance().next();
    },

    replay: function () {
        cc.log("BattleEndLayer replay");

        BattlePlayer.getInstance().next();
        BattlePlayer.getInstance().play(this._battleLog.get("id"), true);
    },

    _onClickGoStrengthenLayer: function () {
        cc.log("BattleEndLayer _onClickGoStrengthenLayer");

        BattlePlayer.getInstance().end(StrengthenLayer);
    }
});


BattleEndLayer.create = function (battleLog) {
    var ret = new BattleEndLayer();

    if (ret && ret.init(battleLog)) {
        return ret;
    }

    return null;
};