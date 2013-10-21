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
    _powerLabel: null,
    _menu: null,

    onEnter: function () {
        cc.log("PlayerDetails onEnter");

        this._super();
        this.update();

        this.schedule(this.update, 5, null);
    },

    init: function () {
        cc.log("PlayerDetails init");

        if (!this._super()) return false;

        var player = gameData.player;

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(600, 720));
        bgSprite.setPosition(cc.p(363, 580));
        this.addChild(bgSprite);

        var labelSprite1 = cc.Scale9Sprite.create(main_scene_image.icon155);
        labelSprite1.setContentSize(cc.size(550, 150));
        labelSprite1.setPosition(cc.p(360, 795));
        this.addChild(labelSprite1);

        var labelSprite2 = cc.Scale9Sprite.create(main_scene_image.icon155);
        labelSprite2.setContentSize(cc.size(550, 100));
        labelSprite2.setPosition(cc.p(360, 655));
        this.addChild(labelSprite2);

        var labelSprite3 = cc.Scale9Sprite.create(main_scene_image.icon155);
        labelSprite3.setContentSize(cc.size(550, 150));
        labelSprite3.setPosition(cc.p(360, 515));
        this.addChild(labelSprite3);

        var labelSprite4 = cc.Scale9Sprite.create(main_scene_image.icon155);
        labelSprite4.setContentSize(cc.size(550, 100));
        labelSprite4.setPosition(cc.p(360, 370));
        this.addChild(labelSprite4);

        var titleLabel = StrokeLabel.create("基  础  信  息", "STHeitiTC-Medium", 30);
        titleLabel.setColor(cc.c3b(255, 239, 131));
        titleLabel.setPosition(cc.p(360, 900));
        this.addChild(titleLabel);

        var playerLabel = cc.LabelTTF.create("玩        家:", "STHeitiTC-Medium", 25);
        playerLabel.setColor(cc.c3b(255, 239, 131));
        playerLabel.setAnchorPoint(cc.p(1, 0.5));
        playerLabel.setPosition(cc.p(280, 841));
        this.addChild(playerLabel);

        var nameLabel = cc.LabelTTF.create(player.get("name"), "STHeitiTC-Medium", 25);
        nameLabel.setColor(cc.c3b(255, 239, 131));
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(cc.p(320, 841));
        this.addChild(nameLabel);

        var vip = player.get("vip");
        if (vip) {
            var vipIcon = cc.Sprite.create(main_scene_image["vip" + vip]);
            vipIcon.setPosition(530, 841);
            this.addChild(vipIcon);
        }

        var lvIconLabel = cc.LabelTTF.create("等        级:", "STHeitiTC-Medium", 25);
        lvIconLabel.setColor(cc.c3b(255, 239, 131));
        lvIconLabel.setAnchorPoint(cc.p(1, 0.5));
        lvIconLabel.setPosition(cc.p(280, 795));
        this.addChild(lvIconLabel);

        var lvLabel = cc.LabelTTF.create(player.get("lv"), "STHeitiTC-Medium", 25);
        lvLabel.setColor(cc.c3b(255, 239, 131));
        lvLabel.setAnchorPoint(cc.p(0, 0.5));
        lvLabel.setPosition(cc.p(320, 795));
        this.addChild(lvLabel);

        var spiritLvIconLabel = cc.LabelTTF.create("元神等级:", "STHeitiTC-Medium", 25);
        spiritLvIconLabel.setColor(cc.c3b(255, 239, 131));
        spiritLvIconLabel.setAnchorPoint(cc.p(1, 0.5));
        spiritLvIconLabel.setPosition(cc.p(280, 749));
        this.addChild(spiritLvIconLabel);

        var spiritLvLabel = cc.LabelTTF.create(gameData.spirit.get("lv"), "STHeitiTC-Medium", 25);
        spiritLvLabel.setColor(cc.c3b(255, 239, 131));
        spiritLvLabel.setAnchorPoint(cc.p(0, 0.5));
        spiritLvLabel.setPosition(cc.p(320, 749));
        this.addChild(spiritLvLabel);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
        moneyIcon.setPosition(170, 678);
        this.addChild(moneyIcon);

        var moneyIconLabel = cc.LabelTTF.create("仙    币:", "STHeitiTC-Medium", 25);
        moneyIconLabel.setColor(cc.c3b(255, 239, 131));
        moneyIconLabel.setAnchorPoint(cc.p(1, 0.5));
        moneyIconLabel.setPosition(cc.p(280, 678));
        this.addChild(moneyIconLabel);

        var moneyLabel = cc.LabelTTF.create(player.get("money"), "STHeitiTC-Medium", 25);
        moneyLabel.setColor(cc.c3b(255, 239, 131));
        moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        moneyLabel.setPosition(cc.p(320, 678));
        this.addChild(moneyLabel);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(170, 632);
        this.addChild(goldIcon);

        var goldIconLabel = cc.LabelTTF.create("魔    石:", "STHeitiTC-Medium", 25);
        goldIconLabel.setColor(cc.c3b(255, 239, 131));
        goldIconLabel.setAnchorPoint(cc.p(1, 0.5));
        goldIconLabel.setPosition(cc.p(280, 632));
        this.addChild(goldIconLabel);

        var goldLabel = cc.LabelTTF.create(player.get("gold"), "STHeitiTC-Medium", 25);
        goldLabel.setColor(cc.c3b(255, 239, 131));
        goldLabel.setAnchorPoint(cc.p(0, 0.5));
        goldLabel.setPosition(cc.p(320, 632));
        this.addChild(goldLabel);

        var skillPointIcon = cc.Sprite.create(main_scene_image.icon152);
        skillPointIcon.setPosition(170, 561);
        this.addChild(skillPointIcon);

        var skillPointIconLabel = cc.LabelTTF.create("技能点:", "STHeitiTC-Medium", 25);
        skillPointIconLabel.setColor(cc.c3b(255, 239, 131));
        skillPointIconLabel.setAnchorPoint(cc.p(1, 0.5));
        skillPointIconLabel.setPosition(cc.p(280, 561));
        this.addChild(skillPointIconLabel);

        var skillPointLabel = cc.LabelTTF.create(player.get("skillPoint"), "STHeitiTC-Medium", 25);
        skillPointLabel.setColor(cc.c3b(255, 239, 131));
        skillPointLabel.setAnchorPoint(cc.p(0, 0.5));
        skillPointLabel.setPosition(cc.p(320, 561));
        this.addChild(skillPointLabel);

        var elixirIcon = cc.Sprite.create(main_scene_image.icon151);
        elixirIcon.setPosition(170, 515);
        this.addChild(elixirIcon);

        var elixirIconLabel = cc.LabelTTF.create("仙    丹:", "STHeitiTC-Medium", 25);
        elixirIconLabel.setColor(cc.c3b(255, 239, 131));
        elixirIconLabel.setAnchorPoint(cc.p(1, 0.5));
        elixirIconLabel.setPosition(cc.p(280, 515));
        this.addChild(elixirIconLabel);

        var elixirLabel = cc.LabelTTF.create(player.get("elixir"), "STHeitiTC-Medium", 25);
        elixirLabel.setColor(cc.c3b(255, 239, 131));
        elixirLabel.setAnchorPoint(cc.p(0, 0.5));
        elixirLabel.setPosition(cc.p(320, 515));
        this.addChild(elixirLabel);

        var energyIcon = cc.Sprite.create(main_scene_image.icon154);
        energyIcon.setPosition(170, 469);
        this.addChild(energyIcon);

        var energyIconLabel = cc.LabelTTF.create("活力点:", "STHeitiTC-Medium", 25);
        energyIconLabel.setColor(cc.c3b(255, 239, 131));
        energyIconLabel.setAnchorPoint(cc.p(1, 0.5));
        energyIconLabel.setPosition(cc.p(280, 469));
        this.addChild(energyIconLabel);

        var energyLabel = cc.LabelTTF.create(player.get("energy"), "STHeitiTC-Medium", 25);
        energyLabel.setColor(cc.c3b(255, 239, 131));
        energyLabel.setAnchorPoint(cc.p(0, 0.5));
        energyLabel.setPosition(cc.p(320, 469));
        this.addChild(energyLabel);

        var powerIcon = cc.Sprite.create(main_scene_image.icon150);
        powerIcon.setPosition(170, 393);
        this.addChild(powerIcon);

        var powerIconLabel = cc.LabelTTF.create("体    力:", "STHeitiTC-Medium", 25);
        powerIconLabel.setColor(cc.c3b(255, 239, 131));
        powerIconLabel.setAnchorPoint(cc.p(1, 0.5));
        powerIconLabel.setPosition(cc.p(280, 393));
        this.addChild(powerIconLabel);

        this._powerLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 25);
        this._powerLabel.setColor(cc.c3b(255, 239, 131));
        this._powerLabel.setAnchorPoint(cc.p(0, 0.5));
        this._powerLabel.setPosition(cc.p(320, 393));
        this.addChild(this._powerLabel);

        var tipLabel = cc.LabelTTF.create("体力每 10 分钟恢复 5 点", "STHeitiTC-Medium", 25);
        tipLabel.setColor(cc.c3b(255, 239, 131));
        tipLabel.setAnchorPoint(cc.p(0, 0.5));
        tipLabel.setPosition(cc.p(160, 347));
        this.addChild(tipLabel);

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickClose,
            this
        );
        okItem.setPosition(cc.p(360, 275));

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(cc.p(650, 930));

        this._menu = cc.Menu.create(okItem, closeItem);
        this._menu.setPosition(cc.p(0, 0));
        this.addChild(this._menu);

        return true;
    },

    update: function () {
        var player = gameData.player;
        this._powerLabel.setString(player.get("power") + " / " + player.get("maxPower"));
    },

    _onClickClose: function () {
        cc.log("PlayerDetails _onClickClose");

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