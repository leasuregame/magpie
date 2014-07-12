/**
 * Created by lujunyu on 14-7-1.
 */

var VipUpgradeTipLabel = LazyLayer.extend({

    init: function () {

        if (!this._super()) return false;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var point = gameFit.GAME_MIDPOINT;
        var effect = cc.BuilderReader.load(main_scene_image.uiEffect113, this);
        effect.setPosition(point);
        this.addChild(effect);

        var frameLayer = cc.Node.create();
        effect.controller.ccbLabel.addChild(frameLayer);

        var bgLabel = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgLabel.setContentSize(cc.size(550, 660));
        bgLabel.setPosition(cc.p(0, 0));
        frameLayer.addChild(bgLabel);

        var titleIcon = cc.Sprite.create(main_scene_image.icon479);
        titleIcon.setPosition(cc.p(0, 330));
        frameLayer.addChild(titleIcon);

        var contentLabel = cc.Scale9Sprite.create(main_scene_image.icon175);
        contentLabel.setContentSize(cc.size(490, 460));
        contentLabel.setPosition(cc.p(0, 0));
        frameLayer.addChild(contentLabel);

        var vip = gameData.player.get("vip");

        var tipLabel = StrokeLabel.create("恭喜大神成为V" + vip, "STHeitiTC-Medium", 25);
        tipLabel.setPosition(cc.p(0, 260));
        tipLabel.setColor(cc.c3b(255, 204, 0));
        tipLabel.setBgColor(cc.c3b(0, 0, 0));
        frameLayer.addChild(tipLabel);

        var titleLabel = StrokeLabel.create("V" + vip + "尊贵特权", "STHeitiTC-Medium", 25);
        titleLabel.setPosition(cc.p(0, 200));
        titleLabel.setColor(cc.c3b(255, 204, 0));
        titleLabel.setBgColor(cc.c3b(0, 0, 0));
        frameLayer.addChild(titleLabel);

        var vipPrivilege = outputTables.vip_privilege.rows[vip];
        var offsetY = 150;

        var vipPrivilegeLabel, vipPrivilegeIcon;

        for (var key in vipPrivilege) {

            if (vipPrivilege[key] <= 0 || key == "id") {
                continue;
            }

            vipPrivilegeIcon = cc.Sprite.create(main_scene_image.icon171);
            vipPrivilegeIcon.setPosition(cc.p(-180, offsetY));
            frameLayer.addChild(vipPrivilegeIcon);

            if (key == "description") {
                vipPrivilegeLabel = cc.LabelTTF.create(
                    vipPrivilege[key],
                    "STHeitiTC-Medium",
                    22
                );
            } else {
                vipPrivilegeLabel = cc.LabelTTF.create(
                    (vipPrivilegeDescription[key]) + " + " + vipPrivilege[key],
                    "STHeitiTC-Medium",
                    22
                );
            }

            vipPrivilegeLabel.setAnchorPoint(cc.p(0, 0.5));
            vipPrivilegeLabel.setPosition(cc.p(-150, offsetY));
            frameLayer.addChild(vipPrivilegeLabel);

            offsetY -= 35;
        }

        var OKItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOK,
            this
        );
        OKItem.setPosition(cc.p(0, -270));

        var menu = cc.Menu.create(OKItem);
        menu.setPosition(cc.p(0, 0));
        frameLayer.addChild(menu);

        return true;
    },

    _onClickOK: function () {
        cc.log("VipUpgradeTipLabel _onClickOK");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    }

});

VipUpgradeTipLabel.create = function () {
    cc.log("VipUpgradeTipLabel create");

    var ret = new VipUpgradeTipLabel();
    if (ret && ret.init()) {
        return ret;
    }

    return null;
};

VipUpgradeTipLabel.pop = function () {
    cc.log("VipUpgradeTipLabel pop");

    var vipUpgradeTipLabel = VipUpgradeTipLabel.create();
    MainScene.getInstance().getLayer().addChild(vipUpgradeTipLabel, 10);
    //cc.Director.getInstance().getRunningScene().addChild(vipUpgradeTipLabel, 1);
};