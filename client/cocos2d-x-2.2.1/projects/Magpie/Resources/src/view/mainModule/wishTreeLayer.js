/**
 * Created by xiaoyu on 2014/10/23.
 */

var WishTreeLayer = cc.Layer.extend({
    _wishTreeLayerFit: null,

    _tree: null,

    onEnter: function () {
        this._super();
        this.update();
    },

    init: function (tree) {
        if (!this._super()) return false;

        this._wishTreeLayerFit = gameFit.mainScene.wishTreeLayer;

        this._tree = tree;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._wishTreeLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._wishTreeLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon16);
        titleIcon.setPosition(this._wishTreeLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var nextCollectLabel = StrokeLabel.create("下次采集时间: ", "STHeitiTC-Medium", 22);
        nextCollectLabel.setPosition(this._wishTreeLayerFit.nextCollectLabelPoint);
        this.addChild(nextCollectLabel);

        this._collectCdTime = StrokeLabel.create(
            "00:00:00",
            "STHeitiTC-Medium",
            22
        );
        this._collectCdTime.setPosition(this._wishTreeLayerFit.collectCdTimePoint);
        this.addChild(this._collectCdTime);

        this._removeCdTimeItem = cc.MenuItemImage.create(
            main_scene_image.button33,
            main_scene_image.button33s,
            this._onClickRemoveCdTime,
            this
        );
        this._removeCdTimeItem.setPosition(this._wishTreeLayerFit.removeCdTimeItemPoint);

        var todayCollectLabel = StrokeLabel.create("今天采集次数: ", "STHeitiTC-Medium", 22);
        todayCollectLabel.setPosition(this._wishTreeLayerFit.todayCollectLabelPoint);
        this.addChild(todayCollectLabel);

        this._collectTimesLabel = StrokeLabel.create("0/0", "STHeitiTC-Medium", 22);
        this._collectTimesLabel.setPosition(this._wishTreeLayerFit.collectTimeLabelPoint);
        this.addChild(this._collectTimesLabel);

        this._wishTree = cc.BuilderReader.load(main_scene_image.uiEffect121, this);
        this._wishTree.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(this._wishTree);

        this._lvLabel = StrokeLabel.create("Lv：0", "STHeitiTC-Medium", 22);
        this._lvLabel.setPosition(this._wishTreeLayerFit.lvLabelPoint);
        this.addChild(this._lvLabel);

        var progressBgSprite = cc.Sprite.create(main_scene_image.progress4);
        progressBgSprite.setPosition(this._wishTreeLayerFit.progressPoint);
        progressBgSprite.setScaleY(1.2);
        progressBgSprite.setScaleX(1.8);
        this.addChild(progressBgSprite);

        this._progress = Progress.create(null, main_scene_image.progress5, 0, 1);
        this._progress.setPosition(this._wishTreeLayerFit.progressPoint);
        this._progress.setScaleY(1.2);
        this._progress.setScaleX(1.8);
        this.addChild(this._progress);

        var tipLabel = StrokeLabel.create("等级越高，获得奖励越丰富", "STHeitiTC-Medium", 22);
        tipLabel.setPosition(this._wishTreeLayerFit.tipLabelPoint);
        this.addChild(tipLabel);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._wishTreeLayerFit.backItemPoint);

        var menu = cc.Menu.create(this._removeCdTimeItem, backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this.schedule(this._updateCdTime, UPDATE_CD_TIME_INTERVAL);

        return true;
    },

    update: function () {
        var exp = outputTables.union_tree_upgrade_config.rows[this._tree.lv + 1].exp;
        this._progress.setAllValue(this._tree.exp, exp);
        this._collectCdTime.setString(lz.getCountdownStr(this._tree.waterCd));
        this._collectTimesLabel.setString(this._tree.waterCountLeft + "/" + this._tree.waterTotalCount);
        this._lvLabel.setString("Lv：" + this._tree.lv);
        this._removeCdTimeItem.setVisible(this._tree.waterCd > 0);
    },

    _updateCdTime: function () {
        this._collectCdTime.setString(lz.getCountdownStr(this._tree.waterCd));

        if (this._tree.waterCD > 0) {
            this._tree.waterCD--;
        }

        this._removeCdTimeItem.setVisible(this._tree.waterCd > 0);
    },

    ccbFnWatering: function() {
        cc.log("WishTreeLayer ccbFnWatering");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        LazyLayer.showCloudLayer();

        var that = this;
        gameData.union.watering(function (tree) {
            if(tree) {
                that._tree = tree;
                that.update();
                that._wishTree.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_2", 0);
            } else {
                that.update();
                LazyLayer.closeCloudLayer();
            }
        });
    },

    ccbFnWaterPlay: function() {
        cc.log("WishTreeLayer ccbFnWaterPlay");

        this._wishTree.animationManager.setCompletedAnimationCallback(this, function(){
            LazyLayer.closeCloudLayer();
            that._wishTree.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_1", 0);
        });
    },

    _onClickRemoveCdTime: function () {
        cc.log("WishTreeLayer _onClickRemoveCdTime");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;
        AdvancedTipsLabel.pop(TYPE_REMOVE_WATER_CD_TIPS, function () {
            gameData.union.removeWaterCd(function (cd) {
                that._tree.waterCd = cd;
            });
        });
    },

    _onClickBack: function () {
        cc.log("WishTreeLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(UnionLayer);
    }
});

WishTreeLayer.create = function (tree) {
    var ret = new WishTreeLayer();

    if (ret && ret.init(tree)) {
        return ret;
    }

    return null;
};