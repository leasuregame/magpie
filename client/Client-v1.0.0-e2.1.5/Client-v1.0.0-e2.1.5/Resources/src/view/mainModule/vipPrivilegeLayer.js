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
    lottery_free_count: "每日抽奖次数",
    friend_count: "好友上限",
    buy_power_count: "每日体力购买次数",
    give_bless_count: "每日送出祝福次数",
    receive_bless_count: "每日接受祝福次数",
    challenge_count: "每日有奖竞技次数",
    spirit_collect_count: "每日灵气采集次数"
};

var VipPrivilegeLayer = LazyLayer.extend({
    init: function () {
        cc.log("VipPrivilegeLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(540, 720));
        bgSprite.setPosition(cc.p(360, 580));
        this.addChild(bgSprite);

        var shop = gameData.shop;
        var vip = gameData.player.get("vip");
        var nextVipCash = shop.getNextVipCash();
        cc.log(nextVipCash);
        if (nextVipCash) {
            var tipLabel = cc.LabelTTF.create(
                "您现在是VIP" + vip + "再冲" + nextVipCash + "元RMB可以享受VIP" + (vip + 1),
                "STHeitiTC-Medium",
                22
            );
            tipLabel.setPosition(cc.p(360, 880));
            this.addChild(tipLabel);
        }

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(cc.p(605, 925));

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var vipPrivilegeList = shop.getVipPrivilegeList();
        var len = vipPrivilegeList.length;

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 194, 640, 711));
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = len * 315;

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 315 - i * 315;

            var vipPrivilege = vipPrivilegeList[i];

            var bgSpriteUrl = main_scene_image.icon169;
            if (vip == vipPrivilege.id) {
                bgSpriteUrl = main_scene_image.icon168;
            }

            var bgSprite = cc.Sprite.create(bgSpriteUrl);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(0, y));
            scrollViewLayer.addChild(bgSprite);

            var vipIcon = cc.Sprite.create(main_scene_image["vip" + vipPrivilege.id]);
            vipIcon.setPosition(cc.p(250, y + 280));
            scrollViewLayer.addChild(vipIcon);

            var offsetY = y + 240;
            for (var key in vipPrivilege) {
                if (vipPrivilegeDescription[key] != undefined && vipPrivilege[key] > 0) {
                    var vipPrivilegeIcon = cc.Sprite.create(main_scene_image.icon171);
                    vipPrivilegeIcon.setPosition(cc.p(40, offsetY));
                    scrollViewLayer.addChild(vipPrivilegeIcon);

                    var vipPrivilegeLabel = cc.LabelTTF.create(
                        vipPrivilegeDescription[key] + " + " + vipPrivilege[key],
                        "STHeitiTC-Medium",
                        20
                    );
                    vipPrivilegeLabel.setAnchorPoint(cc.p(0, 0.5));
                    vipPrivilegeLabel.setPosition(cc.p(70, offsetY));
                    scrollViewLayer.addChild(vipPrivilegeLabel);

                    offsetY -= 35;
                }
            }
        }

        var scrollView = cc.ScrollView.create(cc.size(500, 600), scrollViewLayer);
        scrollView.setTouchPriority(-300);
        scrollView.setPosition(cc.p(110, 260));
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        scrollView.setContentSize(cc.size(500, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

        return true;
    },

    _onClickClose: function () {
        cc.log("VipPrivilegeLayer _onClickClose");

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