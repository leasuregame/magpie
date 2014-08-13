/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-15
 * Time: 下午3:09
 * To change this template use File | Settings | File Templates.
 */


/*
 * player details layer
 * */


var PlayerDetails = LazyLayer.extend({
    _playerDetailsFit: null,

    _powerLabel: null,
    _menu: null,

    onEnter: function () {
        cc.log("PlayerDetails onEnter");

        this._super();
        this.update();

        this.schedule(this.update, 5);

        lz.um.beginLogPageView("玩家详细信息界面");
    },

    onExit: function () {
        cc.log("PlayerDetails onExit");

        this._super();

        lz.um.endLogPageView("玩家详细信息界面");
    },

    init: function () {
        cc.log("PlayerDetails init");

        if (!this._super()) return false;

        this._playerDetailsFit = gameFit.mainScene.playerDetails;

        var player = gameData.player;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(600, 720));
        bgSprite.setPosition(this._playerDetailsFit.bgSpritePoint);
        this.addChild(bgSprite);

        var labelSprite1 = cc.Scale9Sprite.create(main_scene_image.icon155);
        labelSprite1.setContentSize(cc.size(550, 150));
        labelSprite1.setPosition(this._playerDetailsFit.labelSprite1Point);
        this.addChild(labelSprite1);

        var labelSprite2 = cc.Scale9Sprite.create(main_scene_image.icon155);
        labelSprite2.setContentSize(cc.size(550, 100));
        labelSprite2.setPosition(this._playerDetailsFit.labelSprite2Point);
        this.addChild(labelSprite2);

        var labelSprite3 = cc.Scale9Sprite.create(main_scene_image.icon155);
        labelSprite3.setContentSize(cc.size(550, 150));
        labelSprite3.setPosition(this._playerDetailsFit.labelSprite3Point);
        this.addChild(labelSprite3);

        var labelSprite4 = cc.Scale9Sprite.create(main_scene_image.icon155);
        labelSprite4.setContentSize(cc.size(550, 100));
        labelSprite4.setPosition(this._playerDetailsFit.labelSprite4Point);
        this.addChild(labelSprite4);

        var titleLabel = StrokeLabel.create("基  础  信  息", "STHeitiTC-Medium", 30);
        titleLabel.setColor(cc.c3b(255, 239, 131));
        titleLabel.setPosition(this._playerDetailsFit.titleLabelPoint);
        this.addChild(titleLabel);

        var playerLabel = cc.LabelTTF.create("玩        家:", "STHeitiTC-Medium", 25);
        playerLabel.setAnchorPoint(cc.p(1, 0.5));
        playerLabel.setPosition(this._playerDetailsFit.playerLabelPoint);
        this.addChild(playerLabel);

        var nameLabel = cc.LabelTTF.create(player.get("name"), "STHeitiTC-Medium", 25);
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(this._playerDetailsFit.nameLabelPoint);
        this.addChild(nameLabel);

        var vip = player.get("vip");
        var vipIcon = cc.Sprite.create(main_scene_image["vip" + vip]);
        vipIcon.setPosition(this._playerDetailsFit.vipIconPoint);
        this.addChild(vipIcon);

        var buyVipItem = cc.MenuItemImage.create(
            main_scene_image.button16,
            main_scene_image.button16s,
            this._onClickBuyVip,
            this
        );

        buyVipItem.setPosition(this._playerDetailsFit.buyVipItemPoint);
        buyVipItem.setVisible(vip != 12);

        var lvIconLabel = cc.LabelTTF.create("等        级:", "STHeitiTC-Medium", 25);
        lvIconLabel.setAnchorPoint(cc.p(1, 0.5));
        lvIconLabel.setPosition(this._playerDetailsFit.lvIconLabelPoint);
        this.addChild(lvIconLabel);

        var lvLabel = cc.LabelTTF.create(player.get("lv"), "STHeitiTC-Medium", 25);
        lvLabel.setAnchorPoint(cc.p(0, 0.5));
        lvLabel.setPosition(this._playerDetailsFit.lvLabelPoint);
        this.addChild(lvLabel);

        var spiritLvIconLabel = cc.LabelTTF.create("元神等级:", "STHeitiTC-Medium", 25);
        spiritLvIconLabel.setAnchorPoint(cc.p(1, 0.5));
        spiritLvIconLabel.setPosition(this._playerDetailsFit.spiritLvIconLabelPoint);
        this.addChild(spiritLvIconLabel);

        var spiritLvLabel = cc.LabelTTF.create(gameData.spirit.get("lv"), "STHeitiTC-Medium", 25);
        spiritLvLabel.setAnchorPoint(cc.p(0, 0.5));
        spiritLvLabel.setPosition(this._playerDetailsFit.spiritLvLabelPoint);
        this.addChild(spiritLvLabel);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
        moneyIcon.setPosition(this._playerDetailsFit.moneyIconPoint);
        this.addChild(moneyIcon);

        var moneyIconLabel = cc.LabelTTF.create("仙    币:", "STHeitiTC-Medium", 25);
        moneyIconLabel.setAnchorPoint(cc.p(1, 0.5));
        moneyIconLabel.setPosition(this._playerDetailsFit.moneyIconLabelPoint);
        this.addChild(moneyIconLabel);

        var moneyLabel = cc.LabelTTF.create(player.get("money"), "STHeitiTC-Medium", 25);
        moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        moneyLabel.setPosition(this._playerDetailsFit.moneyLabelPoint);
        this.addChild(moneyLabel);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(this._playerDetailsFit.goldIconPoint);
        this.addChild(goldIcon);

        var goldIconLabel = cc.LabelTTF.create("魔    石:", "STHeitiTC-Medium", 25);
        goldIconLabel.setAnchorPoint(cc.p(1, 0.5));
        goldIconLabel.setPosition(this._playerDetailsFit.goldIconLabelPoint);
        this.addChild(goldIconLabel);

        var goldLabel = cc.LabelTTF.create(player.get("gold"), "STHeitiTC-Medium", 25);
        goldLabel.setAnchorPoint(cc.p(0, 0.5));
        goldLabel.setPosition(this._playerDetailsFit.goldLabelPoint);
        this.addChild(goldLabel);

        var buyGoldItem = cc.MenuItemImage.create(
            main_scene_image.button16,
            main_scene_image.button16s,
            this._onClickBuyGold,
            this
        );

        buyGoldItem.setPosition(this._playerDetailsFit.buyGoldItemPoint);

        var skillPointIcon = cc.Sprite.create(main_scene_image.icon152);
        skillPointIcon.setPosition(this._playerDetailsFit.skillPointIconPoint);
        this.addChild(skillPointIcon);

        var skillPointIconLabel = cc.LabelTTF.create("技能点:", "STHeitiTC-Medium", 25);
        skillPointIconLabel.setAnchorPoint(cc.p(1, 0.5));
        skillPointIconLabel.setPosition(this._playerDetailsFit.skillPointIconLabelPoint);
        this.addChild(skillPointIconLabel);

        var skillPointLabel = cc.LabelTTF.create(player.get("skillPoint"), "STHeitiTC-Medium", 25);
        skillPointLabel.setAnchorPoint(cc.p(0, 0.5));
        skillPointLabel.setPosition(this._playerDetailsFit.skillPointLabelPoint);
        this.addChild(skillPointLabel);

        var elixirIcon = cc.Sprite.create(main_scene_image.icon151);
        elixirIcon.setPosition(this._playerDetailsFit.elixirIconPoint);
        this.addChild(elixirIcon);

        var elixirIconLabel = cc.LabelTTF.create("仙    丹:", "STHeitiTC-Medium", 25);
        elixirIconLabel.setAnchorPoint(cc.p(1, 0.5));
        elixirIconLabel.setPosition(this._playerDetailsFit.elixirIconLabelPoint);
        this.addChild(elixirIconLabel);

        var elixirLabel = cc.LabelTTF.create(player.get("elixir"), "STHeitiTC-Medium", 25);
        elixirLabel.setAnchorPoint(cc.p(0, 0.5));
        elixirLabel.setPosition(this._playerDetailsFit.elixirLabelPoint);
        this.addChild(elixirLabel);

        var energyIcon = cc.Sprite.create(main_scene_image.icon154);
        energyIcon.setPosition(this._playerDetailsFit.energyIconPoint);
        this.addChild(energyIcon);

        var energyIconLabel = cc.LabelTTF.create("活力点:", "STHeitiTC-Medium", 25);
        energyIconLabel.setAnchorPoint(cc.p(1, 0.5));
        energyIconLabel.setPosition(this._playerDetailsFit.energyIconLabelPoint);
        this.addChild(energyIconLabel);

        var energyLabel = cc.LabelTTF.create(player.get("energy"), "STHeitiTC-Medium", 25);
        energyLabel.setAnchorPoint(cc.p(0, 0.5));
        energyLabel.setPosition(this._playerDetailsFit.energyLabelPoint);
        this.addChild(energyLabel);

        var powerIcon = cc.Sprite.create(main_scene_image.icon150);
        powerIcon.setPosition(this._playerDetailsFit.powerIconPoint);
        this.addChild(powerIcon);

        var powerIconLabel = cc.LabelTTF.create("体    力:", "STHeitiTC-Medium", 25);
        powerIconLabel.setAnchorPoint(cc.p(1, 0.5));
        powerIconLabel.setPosition(this._playerDetailsFit.powerIconLabelPoint);
        this.addChild(powerIconLabel);

        this._powerLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 25);
        this._powerLabel.setAnchorPoint(cc.p(0, 0.5));
        this._powerLabel.setPosition(this._playerDetailsFit.powerLabelPoint);
        this.addChild(this._powerLabel);

        var buyPowerItem = cc.MenuItemImage.create(
            main_scene_image.button16,
            main_scene_image.button16s,
            this._onClickBuyPower,
            this
        );

        buyPowerItem.setPosition(this._playerDetailsFit.buyPowerItemPoint);

        var tipLabel = cc.LabelTTF.create("体力每 10 分钟恢复 5 点", "STHeitiTC-Medium", 25);
        tipLabel.setAnchorPoint(cc.p(0, 0.5));
        tipLabel.setPosition(this._playerDetailsFit.tipLabelPoint);
        this.addChild(tipLabel);

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickClose,
            this
        );
        okItem.setPosition(this._playerDetailsFit.okItemPoint);

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._playerDetailsFit.closeItemPoint);

        this._menu = cc.Menu.create(buyVipItem, buyGoldItem, buyPowerItem, okItem, closeItem);
        this._menu.setPosition(cc.p(0, 0));
        this.addChild(this._menu);

        return true;
    },

    update: function () {
        var player = gameData.player;
        this._powerLabel.setString(player.get("power") + " / " + player.get("maxPower"));
    },

    _onClickBuyVip: function () {
        cc.log("PlayerDetails _onClickBuyVip");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        PaymentLayer.pop();
    },

    _onClickBuyGold: function () {
        cc.log("PlayerDetails _onClickBuyGold");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        PaymentLayer.pop();
    },

    _onClickBuyPower: function () {
        cc.log("PlayerDetails _onClickBuyPower");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var product = gameData.shop.getProduct(2);

        if (product.remainTimes <= 0) {
            if (gameData.shop.get("powerBuyCount") <= 0) {
                GoPaymentLayer.pop(TYPE_POWER_BUY_COUNT_USE_UP_TIPS);
            }
        } else {
            AmountLayer.pop(
                function (count) {
                    gameData.shop.buyProduct(function (data) {
                        lz.tipReward(data);
                    }, 2, count);
                },
                product
            );
        }

    },

    _onClickClose: function () {
        cc.log("PlayerDetails _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._menu.setEnabled(false);

        this.removeFromParent();
    }
});


PlayerDetails.create = function () {
    var ret = new PlayerDetails();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};


PlayerDetails.pop = function () {
    var playerDetails = PlayerDetails.create();

    MainScene.getInstance().getLayer().addChild(playerDetails, 10);

    return playerDetails;
};
