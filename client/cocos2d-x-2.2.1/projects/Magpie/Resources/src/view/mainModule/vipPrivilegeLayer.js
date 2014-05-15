/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-4
 * Time: 下午4:11
 * To change this template use File | Settings | File Templates.
 */


/*
 * vip privilege layer
 * */


var vipPrivilegeDescription = {
    lottery_free_count: "每日免费寻宝次数",
    exp_card_count: "每日经验元灵购买次数",
    friend_count: "好友上限",
    buy_power_count: "每日体力购买次数",
    give_bless_count: "每日送出祝福次数",
    receive_bless_count: "每日接受祝福次数",
    challenge_buy_count: "每日有奖竞技购买次数",
    spirit_collect_count: "每日灵气采集次数"
};

var VipPrivilegeLayer = LazyLayer.extend({
    _vipPrivilegeLayerFit: null,

    onEnter: function () {
        cc.log("VipPrivilegeLayer onEnter");

        this._super();

        lz.um.beginLogPageView("VIP特权界面");
    },

    onExit: function () {
        cc.log("VipPrivilegeLayer onExit");

        this._super();

        lz.um.endLogPageView("VIP特权界面");
    },

    init: function () {
        cc.log("VipPrivilegeLayer init");

        if (!this._super()) return false;

        this._vipPrivilegeLayerFit = gameFit.mainScene.vipPrivilegeLayer;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 640, 1136);
        bgLayer.setPosition(this._vipPrivilegeLayerFit.bgLayerPoint);
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(this._vipPrivilegeLayerFit.bgSpriteContentSize);
        bgSprite.setPosition(this._vipPrivilegeLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var shop = gameData.shop;
        var vip = gameData.player.get("vip");
        var nextVipCash = shop.getNextVipCash();

        cc.log(nextVipCash);
        if (nextVipCash) {
            var tipLabel = ColorLabelTTF.create(
                {
                    string: "您是",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 23
                },
                {
                    string: "VIP" + vip,
                    fontName: "STHeitiTC-Medium",
                    fontSize: 23,
                    isStroke: true,
                    color: cc.c3b(255, 248, 69)
                },
                {
                    string: "再冲",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 23
                },
                {
                    string: nextVipCash,
                    fontName: "STHeitiTC-Medium",
                    fontSize: 23,
                    isStroke: true,
                    color: cc.c3b(255, 248, 69)
                },
                {
                    string: "元即可享受",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 23
                },
                {
                    string: "VIP" + (vip + 1),
                    fontName: "STHeitiTC-Medium",
                    fontSize: 23,
                    isStroke: true,
                    color: cc.c3b(255, 248, 69)
                }
            );
            tipLabel.setAnchorPoint(cc.p(0.5, 0));
            tipLabel.setPosition(this._vipPrivilegeLayerFit.tipLabelPoint);
            this.addChild(tipLabel);
        }

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._vipPrivilegeLayerFit.closeItemPoint);

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var vipPrivilegeList = shop.getVipPrivilegeList();
        var len = vipPrivilegeList.length;

        var scrollViewLayer = MarkLayer.create(this._vipPrivilegeLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = len * 440;
        if (scrollViewHeight < this._vipPrivilegeLayerFit.scrollViewHeight) {
            scrollViewHeight = this._vipPrivilegeLayerFit.scrollViewHeight;
        }

        var vipTable = outputTables.vip.rows;
        var vipPrivilegeLabel, vipPrivilegeIcon;

        for (var i = 0; i < len; ++i) {

            var y = scrollViewHeight - 440 - i * 440;
            var vipPrivilege = vipPrivilegeList[i];
            var tmpVip = MAX_VIP_LEVEL - i;

            var bgSpriteUrl = main_scene_image.icon169;
            if (vip == vipPrivilege.id) {
                bgSpriteUrl = main_scene_image.icon168;
            }

            var bgIcon = cc.Sprite.create(bgSpriteUrl);
            bgIcon.setAnchorPoint(cc.p(0, 0));
            bgIcon.setPosition(cc.p(0, y));
            bgIcon.setScaleY(1.4);
            scrollViewLayer.addChild(bgIcon);

            var vipIcon = cc.Sprite.create(main_scene_image["vip" + vipPrivilege.id]);
            vipIcon.setPosition(cc.p(250, y + 385));
            scrollViewLayer.addChild(vipIcon);

            var offsetY = y + 340;


            vipPrivilegeIcon = cc.Sprite.create(main_scene_image.icon171);
            vipPrivilegeIcon.setPosition(cc.p(40, offsetY));
            scrollViewLayer.addChild(vipPrivilegeIcon);

            vipPrivilegeLabel = ColorLabelTTF.create(
                {
                    string: "累计充值",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 20
                },
                {
                    string: vipTable[tmpVip].total_cash,
                    fontName: "STHeitiTC-Medium",
                    fontSize: 20,
                    isStroke: true,
                    color: cc.c3b(255, 248, 69)
                },
                {
                    string: "元即可享受该级特权",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 20
                }
            );
            vipPrivilegeLabel.setAnchorPoint(cc.p(0, 0));
            vipPrivilegeLabel.setPosition(cc.p(70, offsetY));
            scrollViewLayer.addChild(vipPrivilegeLabel);

            offsetY -= 35;

            for (var key in vipPrivilege) {

                if (vipPrivilege[key] <= 0 || key == "id") {
                    continue;
                }

                vipPrivilegeIcon = cc.Sprite.create(main_scene_image.icon171);
                vipPrivilegeIcon.setPosition(cc.p(40, offsetY));
                scrollViewLayer.addChild(vipPrivilegeIcon);

                if (key == "description") {
                    vipPrivilegeLabel = cc.LabelTTF.create(
                        vipPrivilege[key],
                        "STHeitiTC-Medium",
                        20
                    );
                } else {
                    vipPrivilegeLabel = cc.LabelTTF.create(
                        (vipPrivilegeDescription[key]) + " + " + vipPrivilege[key],
                        "STHeitiTC-Medium",
                        20
                    );
                }

                vipPrivilegeLabel.setAnchorPoint(cc.p(0, 0.5));
                vipPrivilegeLabel.setPosition(cc.p(70, offsetY));
                scrollViewLayer.addChild(vipPrivilegeLabel);

                offsetY -= 35;
            }

            vipPrivilegeIcon = cc.Sprite.create(main_scene_image.icon171);
            vipPrivilegeIcon.setPosition(cc.p(40, offsetY));
            scrollViewLayer.addChild(vipPrivilegeIcon);
            vipPrivilegeLabel = ColorLabelTTF.create(
                {
                    string: "可购买",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 20
                },
                {
                    string: "VIP" + tmpVip,
                    fontName: "STHeitiTC-Medium",
                    fontSize: 20,
                    isStroke: true,
                    color: cc.c3b(255, 248, 69)
                },
                {
                    string: "礼包",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 20
                }
            );
            vipPrivilegeLabel.setAnchorPoint(cc.p(0, 0));
            vipPrivilegeLabel.setPosition(cc.p(70, offsetY));
            scrollViewLayer.addChild(vipPrivilegeLabel);
        }

        var scrollView = cc.ScrollView.create(this._vipPrivilegeLayerFit.scrollViewSize, scrollViewLayer);
        scrollView.setTouchPriority(-300);
        scrollView.setPosition(this._vipPrivilegeLayerFit.scrollViewPoint);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        scrollView.setContentSize(cc.size(500, scrollViewHeight));

        var size = this._vipPrivilegeLayerFit.scrollViewSize;

        if (vip > 0) {
            offsetY = (vip - 1) * -440 + (size.height - 440);
            offsetY = Math.max(scrollView.minContainerOffset().y, offsetY);
        } else {
            offsetY = scrollView.minContainerOffset().y;
        }

        scrollView.setContentOffset(cc.p(0, offsetY));

        return true;
    },

    _onClickClose: function () {
        cc.log("VipPrivilegeLayer _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var parent = this.getParent();

        var paymentLayer = PaymentLayer.create();
        parent.addChild(paymentLayer, 1);

        this.removeFromParent();
    }
});


VipPrivilegeLayer.create = function () {
    var ret = new VipPrivilegeLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};