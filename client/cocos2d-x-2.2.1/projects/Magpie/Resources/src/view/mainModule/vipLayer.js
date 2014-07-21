/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-4
 * Time: 上午10:00
 * To change this template use File | Settings | File Templates.
 */


/*
 * vip layer
 * */

var vipBoxUrl = {
    vip1: "icon276",
    vip2: "icon276",
    vip3: "icon276",
    vip4: "icon276",
    vip5: "icon277",
    vip6: "icon277",
    vip7: "icon277",
    vip8: "icon277",
    vip9: "icon281",
    vip10: "icon281",
    vip11: "icon281",
    vip12: "icon281"
};

var VipLayer = cc.Layer.extend({
    _vipLayerFit: null,

    _goldLabel: null,
    _moneyLabel: null,
    _scrollView: null,

    _isFirstEnter: true,

    onEnter: function () {
        cc.log("VipLayer onEnter");

        this._super();
        this.update();

        this.schedule(this._update, 1);

        lz.um.beginLogPageView("VIP礼包界面");
    },

    onExit: function () {
        cc.log("VipLayer onExit");

        this._super();

        lz.um.endLogPageView("VIP礼包界面");
    },

    init: function () {
        cc.log("VipLayer init");

        if (!this._super()) return false;

        this._vipLayerFit = gameFit.mainScene.vipLayer;
        this._isFirstEnter = true;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._vipLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headLabel = cc.Sprite.create(main_scene_image.icon147);
        headLabel.setAnchorPoint(cc.p(0, 0));
        headLabel.setPosition(this._vipLayerFit.headLabelPoint);
        this.addChild(headLabel);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(this._vipLayerFit.goldIconPoint);
        this.addChild(goldIcon);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
        moneyIcon.setPosition(this._vipLayerFit.moneyIconPoint);
        this.addChild(moneyIcon);

        this._goldLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._goldLabel.setAnchorPoint(cc.p(0, 0.5));
        this._goldLabel.setPosition(this._vipLayerFit.goldLabelPoint);
        this.addChild(this._goldLabel);

        this._moneyLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._moneyLabel.setPosition(this._vipLayerFit.moneyLabelPoint);
        this.addChild(this._moneyLabel);

        var paymentItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button38,
            main_scene_image.button38s,
            main_scene_image.icon159,
            this._onClickPayment,
            this
        );
        paymentItem.setPosition(this._vipLayerFit.paymentItemPoint);

        var menu = cc.Menu.create(paymentItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var effect = cc.BuilderReader.load(main_scene_image.uiEffect74, this);
        effect.setPosition(this._vipLayerFit.paymentItemPoint);
        this.addChild(effect);

        var buyIcon = cc.Sprite.create(main_scene_image.icon303);
        buyIcon.setPosition(this._vipLayerFit.buyIconPoint);
        this.addChild(buyIcon);

        return true;
    },

    update: function () {
        cc.log("VipLayer update");

        this._update();

        if (this._scrollView != null) {
            this._scrollView.removeFromParent();
        }

        var vipBoxList = gameData.shop.getVipBoxList();
        var len = vipBoxList.length;
        var index;
        var vip = gameData.player.get("vip");

        var scrollViewLayer = MarkLayer.create(this._vipLayerFit.scrollViewLayerRect);

        var slideLabel = [];

        var scrollViewHeight = len * 180;
        if (scrollViewHeight < this._vipLayerFit.scrollViewHeight) {
            scrollViewHeight = this._vipLayerFit.scrollViewHeight;
        }

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 170 - i * 180;
            var vipBox = vipBoxList[i];

            slideLabel[i] = cc.Node.create();
            slideLabel[i].setPosition(cc.p(0, 0));
            slideLabel[i].setVisible(!this._isFirstEnter);

            var menu = LazyMenu.create();
            menu.setPosition(cc.p(0, 0));
            slideLabel[i].addChild(menu, 1);

            if (vipBox.id <= vip && index == undefined) {
                index = i;

                var ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect56, this);
                ccbNode.setPosition(cc.p(320, y + 85));
                slideLabel[i].addChild(ccbNode);
            }

            var bgSprite = cc.Sprite.create(main_scene_image.icon162);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(17, y));
            slideLabel[i].addChild(bgSprite);

            var vipBoxDetailsItem = cc.MenuItemImage.create(
                main_scene_image[vipBoxUrl["vip" + vipBox.id]],
                main_scene_image[vipBoxUrl["vip" + vipBox.id]],
                this._onClickVipBoxDetails(vipBox),
                this
            );
            vipBoxDetailsItem.setPosition(cc.p(95, y + 86));
            vipBoxDetailsItem.setScale(0.8);
            menu.addChild(vipBoxDetailsItem);

            var buyItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon163,
                this._onClickBuy(vipBox),
                this
            );
            buyItem.setPosition(cc.p(525, y + 45));
            menu.addChild(buyItem);

            var vipLabel = cc.Sprite.create(main_scene_image["vip" + vipBox.id]);
            vipLabel.setAnchorPoint(cc.p(0, 0.5));
            vipLabel.setPosition(cc.p(170, y + 143));
            slideLabel[i].addChild(vipLabel);

            var titleLabel = cc.LabelTTF.create("尊享礼包", "STHeitiTC-Medium", 22);
            titleLabel.setColor(cc.c3b(74, 27, 27));
            titleLabel.setPosition(cc.p(340, y + 140));
            slideLabel[i].addChild(titleLabel);

            var descriptionLabel = cc.LabelTTF.create(
                "只能购买一次，点击图表可预览礼包内容。",
                "STHeitiTC-Medium",
                18
            );
            descriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            descriptionLabel.setColor(cc.c3b(74, 27, 27));
            descriptionLabel.setPosition(cc.p(170, y + 105));
            slideLabel[i].addChild(descriptionLabel);

            var costIcon = cc.LabelTTF.create("原价", "STHeitiTC-Medium", 20);
            costIcon.setColor(cc.c3b(74, 27, 27));
            costIcon.setAnchorPoint(cc.p(0, 0.5));
            costIcon.setPosition(cc.p(175, y + 70));
            slideLabel[i].addChild(costIcon);

            var costGoldIcon = cc.Sprite.create(main_scene_image.icon148);
            costGoldIcon.setScale(0.7);
            costGoldIcon.setPosition(cc.p(250, y + 70));
            slideLabel[i].addChild(costGoldIcon);

            var costLabel = cc.LabelTTF.create(vipBox.true_price, "STHeitiTC-Medium", 20);
            costLabel.setColor(cc.c3b(74, 27, 27));
            costLabel.setAnchorPoint(cc.p(0, 0.5));
            costLabel.setPosition(cc.p(275, y + 67));
            slideLabel[i].addChild(costLabel);

            var specialOfferIcon = cc.Sprite.create(main_scene_image.icon167);
            specialOfferIcon.setPosition(cc.p(195, y + 35));
            slideLabel[i].addChild(specialOfferIcon);

            var goldIcon = cc.Sprite.create(main_scene_image.icon148);
            goldIcon.setScale(0.7);
            goldIcon.setPosition(cc.p(250, y + 35));
            slideLabel[i].addChild(goldIcon);

            var specialOfferLabel = cc.LabelTTF.create(vipBox.price, "STHeitiTC-Medium", 20);
            specialOfferLabel.setColor(cc.c3b(74, 27, 27));
            specialOfferLabel.setAnchorPoint(cc.p(0, 0.5));
            specialOfferLabel.setPosition(cc.p(275, y + 32));
            slideLabel[i].addChild(specialOfferLabel);

            scrollViewLayer.addChild(slideLabel[i]);
        }

        this._scrollView = cc.ScrollView.create(this._vipLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._vipLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));

        offsetY = Math.min(this._scrollView.minContainerOffset().y + (index || 0) * 180, 0);
        this._scrollView.setContentOffset(cc.p(0, offsetY));

        if (this._isFirstEnter) {
            this._isFirstEnter = false;
            var slideLayer = SlideLayer.create(
                {
                    labels: slideLabel,
                    slideTime: 0.4,
                    timeTick: 0.05
                }
            );
            slideLayer.showSlide();
        }
    },

    _update: function () {
        cc.log("VipLayer _update");

        var player = gameData.player;

        this._goldLabel.setString(player.get("gold"));
        this._moneyLabel.setString(lz.getMoneyStr(player.get("money")));
    },

    _onClickPayment: function () {
        cc.log("VipLayer _onClickPayment");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        PaymentLayer.pop();
    },

    _onClickBuy: function (vipBox) {
        return function () {
            cc.log("VipLayer _onClickBuy: " + vipBox.id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var that = this;
            var id = vipBox.id;

            var player = gameData.player;

            if (player.get("vip") < id) {
                GoPaymentLayer.pop(TYPE_BUY_VIP_BOX_TIPS, {id: id});
                return;
            }

            if (gameData.cardList.isFull()) {
                CardListFullTipLayer.pop();
                return;
            }


            var table = outputTables.vip_box.rows[id];
            if (player.get("gold") < table.price) {
                TipLayer.tip("魔石不足");
                return;
            }

            var cb = function () {
                gameData.shop.buyVipBox(function (data) {
                    cc.log(data);
                    that.update();
                    lz.tipReward(data);
                }, id);
            };

            GiftBagLayer.pop({
                reward: vipBox,
                type: BUY_GIFT_BAG,
                cb: cb
            });
        }

    },

    _onClickVipBoxDetails: function (data) {
        return function () {
            cc.log("VipLayer _onClickVipBoxDetails");

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            GiftBagLayer.pop({reward: data, type: SHOW_GIFT_BAG});

        }
    }
});


VipLayer.create = function () {
    var ret = new VipLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};