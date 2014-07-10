/**
 * Created by lcc3536 on 13-12-6.
 */


/*
 * go payment layer
 * */

var TYPE_POWER_BUY_COUNT_USE_UP_TIPS = 1;
var TYPE_CHALLENGE_BUY_COUNT_USE_UP_TIPS = 2;
var TYPE_EXP_PASS_BUY_COUNT_USE_UP_TIPS = 3;
var TYPE_GIVE_BLESS_COUNT_USE_UP_TIPS = 4;
var TYPE_SPIRIT_COLLECT_COUNT_USE_UP_TIPS = 5;
var TYPE_BUY_VIP_BOX_TIPS = 6;

var GoPaymentLayer = LazyLayer.extend({
    _goPaymentLayerFit: null,

    _cb: null,
    _otherData: null,

    init: function (type, otherData) {
        cc.log("GoPaymentLayer init");

        if (!this._super()) return false;

        this._goPaymentLayerFit = gameFit.mainScene.goPaymentLayer;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        this._cb = function () {
            PaymentLayer.pop();
        };

        this._otherData = otherData || {};

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(550, 250));
        bgSprite.setPosition(this._goPaymentLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        this._titleLabel = StrokeLabel.create("", "STHeitiTC-Medium", 28);
        this._titleLabel.setPosition(this._goPaymentLayerFit.titleLabelPoint);
        this.addChild(this._titleLabel);

        this._tipLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 22);
        this._tipLabel.setPosition(this._goPaymentLayerFit.tipLabelPoint);
        this.addChild(this._tipLabel);

        this._paymentItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button21,
            main_scene_image.button21s,
            main_scene_image.icon159,
            this._onClickGo,
            this
        );
        this._paymentItem.setPosition(this._goPaymentLayerFit.paymentItemPoint);
        this._paymentItem.setVisible(false);

        this._closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon36,
            this._onClickCancel,
            this
        );
        this._closeItem.setPosition(this._goPaymentLayerFit.closeItemPoint);
        this._closeItem.setVisible(false);

        this._continueItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickCancel,
            this
        );
        this._continueItem.setPosition(this._goPaymentLayerFit.continueItemPoint);
        this._continueItem.setVisible(false);

        var menu = cc.Menu.create(this._paymentItem, this._closeItem, this._continueItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._initWithTipsType(type);

        return true;
    },

    _initWithTipsType: function (type) {

        switch (type) {
            case TYPE_POWER_BUY_COUNT_USE_UP_TIPS:
                this._initPowerBuyCountUseUpTips();
                break;
            case TYPE_CHALLENGE_BUY_COUNT_USE_UP_TIPS:
                this._initChallengeBuyCountUseUpTips();
                break;
            case TYPE_EXP_PASS_BUY_COUNT_USE_UP_TIPS:
                this._initExpPassBuyCountUseUpTips();
                break;
            case TYPE_GIVE_BLESS_COUNT_USE_UP_TIPS:
                this._initGiveBlessCountUseUpTips();
                break;
            case TYPE_SPIRIT_COLLECT_COUNT_USE_UP_TIPS:
                this._initSpiritCollectCountUseUpTips();
                break;
            case TYPE_BUY_VIP_BOX_TIPS:
                this._initBuyVipBoxTips();
                break;
        }

    },

    _initPowerBuyCountUseUpTips: function () {
        cc.log("GoPaymentLayer _initPowerBuyCountUseUpTips");

        this._titleLabel.setString("体力购买次数已用完");

        var tipVip = this._getTipsVip("buy_power_count");

        if (-1 == tipVip) {
            this._tipLabel.setString("您已买完所有权限次数");
            this._continueItem.setVisible(true);
        } else {
            this._tipLabel.setString("成为VIP" + tipVip + "，每日即可获得更多购买次数");
            this._paymentItem.setVisible(true);
            this._closeItem.setVisible(true);
        }
    },

    _initChallengeBuyCountUseUpTips: function () {
        cc.log("GoPaymentLayer _initChallengeBuyCountUseUpTips");

        this._titleLabel.setString("有奖竞技购买次数已用完");

        var tipVip = this._getTipsVip("challenge_buy_count");

        if (-1 == tipVip) {
            this._tipLabel.setString("您已买完所有权限次数");
            this._continueItem.setVisible(true);
        } else {
            this._tipLabel.setString("成为VIP" + tipVip + "，每日即可获得更多购买次数");
            this._paymentItem.setVisible(true);
            this._closeItem.setVisible(true);
        }

    },

    _initExpPassBuyCountUseUpTips: function () {
        cc.log("GoPaymentLayer _initChallengeBuyCountUseUpTips");

        this._titleLabel.setString("购买次数已用完");

        var tipVip = this._getTipsVip("exp_pass_count");

        if (-1 == tipVip) {
            this._tipLabel.setString("您已买完所有权限次数");
            this._continueItem.setVisible(true);
        } else {
            this._tipLabel.setString("成为VIP" + tipVip + "，每日即可获得更多购买次数");
            this._paymentItem.setVisible(true);
            this._closeItem.setVisible(true);
        }

    },

    _initGiveBlessCountUseUpTips: function () {
        cc.log("GoPaymentLayer _initGiveBlessCountUseUpTips");

        this._titleLabel.setString("祝福次数已用完");

        var tipVip = this._getTipsVip("give_bless_count");

        if (-1 == tipVip) {
            this._tipLabel.setString("您已使用完所有权限次数");
            this._continueItem.setVisible(true);
        } else {
            this._tipLabel.setString("成为VIP" + tipVip + "，每日即可获得额外的祝福次数");
            this._paymentItem.setVisible(true);
            this._closeItem.setVisible(true);
        }
    },

    _initSpiritCollectCountUseUpTips: function () {
        cc.log("GoPaymentLayer _initSpiritCollectCountUseUpTips");

        this._titleLabel.setString("采集次数已用完");

        var tipVip = this._getTipsVip("spirit_collect_count");

        if (-1 == tipVip) {
            this._tipLabel.setString("您已使用完所有权限次数");
            this._continueItem.setVisible(true);
        } else {
            this._tipLabel.setString("成为VIP" + tipVip + "，每日即可获得额外的采集次数");
            this._paymentItem.setVisible(true);
            this._closeItem.setVisible(true);
        }
    },

    _initBuyVipBoxTips: function () {
        cc.log("GoPaymentLayer _initBuyVipBoxTips");

        this._titleLabel.setString("购 买 失 败");

        this._tipLabel.setString("只有达到VIP" + this._otherData.id + "才能购买此礼包，快去充值吧！");
        this._paymentItem.setVisible(true);
        this._closeItem.setVisible(true);
    },

    _getTipsVip: function (key) {
        cc.log("GoPaymentLayer _getTipsVip");

        var tipVip = -1;
        var table = outputTables.vip_privilege.rows;
        var len = Object.keys(table).length;
        var vip = gameData.player.get("vip");

        for (var i = vip + 1; i < len; i++) {
            if (table[i][key] > table[vip][key]) {
                tipVip = i;
                break;
            }
        }

        return tipVip;
    },

    _onClickGo: function () {
        cc.log("GoPaymentLayer _onClickGo");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();

        if (this._cb) {
            this._cb();
        }
    },

    _onClickCancel: function () {
        cc.log("GoPaymentLayer _onClickCancel");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    }
});


GoPaymentLayer.create = function (type, otherData) {
    var ret = new GoPaymentLayer();

    if (ret && ret.init(type, otherData)) {
        return ret;
    }

    return null;
};


GoPaymentLayer.pop = function (type, otherData) {
    var goPaymentLayer = GoPaymentLayer.create(type, otherData);

    MainScene.getInstance().getLayer().addChild(goPaymentLayer, 10);

    return goPaymentLayer;
};