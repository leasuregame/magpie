/**
 * Created by lujunyu on 14-5-5.
 */

var GrowthPlanLayer = cc.Layer.extend({
    _growthPlanLayerFit: null,

    _buyIcon: null,
    _alreadyBuyIcon: null,
    _buyItem: null,

    onEnter: function () {
        cc.log("GrowthPlanLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("GrowthPlanLayer init");

        if (!this._super()) return false;

        this._growthPlanLayerFit = gameFit.mainScene.growthPlanLayer;

        var bgLabel = cc.Sprite.create(main_scene_image.bg23);
        bgLabel.setScale(this._growthPlanLayerFit.bgLabelScaleY);
        bgLabel.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(bgLabel);

        var topIcon = cc.Sprite.create(main_scene_image.icon434);
        topIcon.setPosition(this._growthPlanLayerFit.topIconPoint);
        this.addChild(topIcon);

        var go2PaymentItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button21,
            main_scene_image.button21s,
            main_scene_image.button21d,
            main_scene_image.icon159,
            this._onClickGo2Payment,
            this
        );
        go2PaymentItem.setPosition(this._growthPlanLayerFit.go2PaymentItemPoint);

        this._buyItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            this._onClickBuy,
            this
        );
        this._buyItem.setPosition(this._growthPlanLayerFit.buyItemPoint);

        var size = this._buyItem.getContentSize();

        this._buyIcon = cc.Sprite.create(main_scene_image.icon302);
        this._buyIcon.setPosition(cc.p(size.width / 2, size.height / 2));
        this._buyItem.addChild(this._buyIcon);

        this._alreadyBuyIcon = cc.Sprite.create(main_scene_image.icon436);
        this._alreadyBuyIcon.setPosition(cc.p(size.width / 2, size.height / 2));
        this._buyItem.addChild(this._alreadyBuyIcon);

        var menu = cc.Menu.create(go2PaymentItem, this._buyItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var buyTipLabel = ColorLabelTTF.create(
            {
                string: "1000",
                fontName: "STHeitiTC-Medium",
                fontSize: 20,
                color: cc.c3b(255, 241, 17),
                isStroke: true
            },
            {
                iconName: "gold",
                scale: 0.8
            }
        );

        buyTipLabel.setAnchorPoint(cc.p(0, 0.5));
        buyTipLabel.setPosition(this._growthPlanLayerFit.buyTipLabelPoint);
        this.addChild(buyTipLabel);

        var rewardBgLabel = cc.Scale9Sprite.create(main_scene_image.icon437);
        rewardBgLabel.setScaleY(this._growthPlanLayerFit.rewardBgLabelScaleY);
        rewardBgLabel.setPosition(this._growthPlanLayerFit.rewardBgLabelPoint);
        this.addChild(rewardBgLabel);

        this._addScrollView();

        return true;
    },

    update: function () {
        cc.log("GrowthPlanLayer update");

        var isBuy = gameData.activity.get("isBuyPlan");
        this._buyIcon.setVisible(!isBuy);
        this._alreadyBuyIcon.setVisible(isBuy);
        this._buyItem.setEnabled(!isBuy);
    },

    _addScrollView: function () {

        var scrollViewLayer = MarkLayer.create(this._growthPlanLayerFit.scrollViewLayerRect);

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 2);

        this._getRewardItems = [];
        this._gotRewardIcons = [];

        var rewards = outputTables.growth_plan.rows;

        var len = Object.keys(rewards).length;
        var scrollViewHeight = len * 112;

        var lv = gameData.player.get("lv");
        var currentId;

        for (var id in rewards) {
            var y = scrollViewHeight - 112 * id;
            var reward = rewards[id];

            var rewardLabel = cc.Sprite.create(main_scene_image.button15);
            rewardLabel.setAnchorPoint(cc.p(0, 0));
            rewardLabel.setScaleY(0.83);
            rewardLabel.setPosition(cc.p(10, y));
            scrollViewLayer.addChild(rewardLabel);

            var lvBgLabel = cc.Sprite.create(main_scene_image.icon435);
            lvBgLabel.setAnchorPoint(cc.p(0, 0));
            lvBgLabel.setPosition(cc.p(40, y + 62));
            scrollViewLayer.addChild(lvBgLabel);

            var lvLabel = StrokeLabel.create(reward.lv + "级成长基金", "STHeitiTC-Medium", 22);
            lvLabel.setColor(cc.c3b(255, 78, 228));
            lvLabel.setBgColor(cc.c3b(72, 29, 26));
            lvLabel.setAnchorPoint(cc.p(0, 0.5));
            lvLabel.setPosition(cc.p(15, 12));
            lvBgLabel.addChild(lvLabel);

            var str = "达到" + reward.lv + "级可领取" + reward.gold + "魔石";
            var tipLabel = StrokeLabel.create(str, "STHeitiTC-Medium", 25);
            tipLabel.setColor(cc.c3b(255, 241, 17));
            tipLabel.setBgColor(cc.c3b(128, 53, 51));
            tipLabel.setAnchorPoint(cc.p(0, 0));
            tipLabel.setPosition(cc.p(40, y + 22));
            scrollViewLayer.addChild(tipLabel);

            var goldIcon = cc.Sprite.create(main_scene_image.icon112);
            goldIcon.setAnchorPoint(cc.p(0, 0));
            goldIcon.setPosition(cc.p(340, y + 14));
            scrollViewLayer.addChild(goldIcon);

            var goldLabel = cc.LabelTTF.create("+" + reward.gold, "STHeitiTC-Medium", 16);
            goldLabel.setAnchorPoint(cc.p(1, 0));
            goldLabel.setPosition(cc.p(73, 8));
            goldIcon.addChild(goldLabel);

            var state = gameData.activity.getStateById(TYPE_GROWTH_PLAN_REWARD, reward.id);

            var rewardItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button10,
                main_scene_image.button10s,
                main_scene_image.button9d,
                main_scene_image.icon123,
                this._onClickGetReward(reward.id),
                this
            );
            rewardItem.setAnchorPoint(cc.p(0, 0));
            rewardItem.setPosition(cc.p(435, y + 20));
            rewardItem.setEnabled(lv >= reward.lv);
            rewardItem.setVisible(state != ALREADY_GOT_REWARD);

            if (state != ALREADY_GOT_REWARD && currentId == undefined) {
                currentId = (0 == id - 1) ? id - 1 : id - 2;
            }

            this._getRewardItems[reward.id] = rewardItem;
            menu.addChild(rewardItem);

            var gotRewardIcon = cc.Sprite.create(main_scene_image.icon138);
            gotRewardIcon.setAnchorPoint(cc.p(0, 0));
            gotRewardIcon.setPosition(cc.p(435, y + 20));
            gotRewardIcon.setVisible(state == ALREADY_GOT_REWARD);
            scrollViewLayer.addChild(gotRewardIcon);

            this._gotRewardIcons[reward.id] = gotRewardIcon;
        }

        var scrollView = cc.ScrollView.create(this._growthPlanLayerFit.scrollViewSize, scrollViewLayer);
        scrollView.setPosition(this._growthPlanLayerFit.scrollViewPoint);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        scrollView.setContentSize(cc.size(600, scrollViewHeight));

        var offsetY = Math.min(scrollView.minContainerOffset().y + 112 * (currentId|| 0), 0);
        scrollView.setContentOffset(cc.p(0, offsetY));

    },

    _onClickGo2Payment: function () {
        cc.log("GrowthPlanLayer _onClickGo2Payment");

        //gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        var shopLayer = ShopLayer.create();
        shopLayer._onClickVipLayer();
        MainScene.getInstance().switchTo(shopLayer);
    },

    _onClickBuy: function () {
        cc.log("GrowthPlanLayer _onClickBuy");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (gameData.player.get("vip") < 2) {
            TipLayer.tip("您的vip等级不足，vip2及以上才可购买");
            return;
        }

        var that = this;
        AdvancedTipsLabel.pop(TYPE_BUY_GROWTH_PLAN_TIPS, function () {
            gameData.activity.buyPlan(function () {
                that.update();
            });
        });

    },

    _onClickGetReward: function (id) {

        var that = this;
        return function () {
            cc.log("GrowthPlanLayer _onClickGetReward: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var activity = gameData.activity;

            if (!activity.get("isBuyPlan")) {
                TipLayer.tip("购买成长计划后才可领取");
                return;
            }

            activity.getPlanReward(id, function () {
                that._getRewardItems[id].setVisible(false);
                that._gotRewardIcons[id].setVisible(true);

                var gold = outputTables.growth_plan.rows[id].gold;
                lz.tipReward({gold: gold});
            });
        }
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