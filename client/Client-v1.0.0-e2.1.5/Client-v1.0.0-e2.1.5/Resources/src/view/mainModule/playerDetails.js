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
    _goldLabel: null,
    _moneyLabel: null,
    _skillPointLabel: null,
    _elixirLabel: null,
    _energyLabel: null,
    _powerLabel: null,
    _menu: null,

    onEnter: function () {
        cc.log("PlayerDetails onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("PlayerDetails init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.player_details_bg);
        bgSprite.setPosition(GAME_MIDPOINT);
        this.addChild(bgSprite);

        this._goldLabel = cc.LabelTTF.create("0", '黑体', 30);
        this._goldLabel.setAnchorPoint(cc.p(0, 0.5));
        this._goldLabel.setPosition(cc.p(240, 843));
        this.addChild(this._goldLabel);

        this._moneyLabel = cc.LabelTTF.create("0", '黑体', 30);
        this._moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._moneyLabel.setPosition(cc.p(240, 782));
        this.addChild(this._moneyLabel);

        this._skillPointLabel = cc.LabelTTF.create("0", '黑体', 30);
        this._skillPointLabel.setAnchorPoint(cc.p(0, 0.5));
        this._skillPointLabel.setPosition(cc.p(240, 610));
        this.addChild(this._skillPointLabel);

        this._elixirLabel = cc.LabelTTF.create("0", '黑体', 30);
        this._elixirLabel.setAnchorPoint(cc.p(0, 0.5));
        this._elixirLabel.setPosition(cc.p(240, 550));
        this.addChild(this._elixirLabel);

        this._energyLabel = cc.LabelTTF.create("0", '黑体', 30);
        this._energyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._energyLabel.setPosition(cc.p(240, 490));
        this.addChild(this._energyLabel);

        this._powerLabel = cc.LabelTTF.create("0", '黑体', 30);
        this._powerLabel.setAnchorPoint(cc.p(0, 0.5));
        this._powerLabel.setPosition(cc.p(240, 305));
        this.addChild(this._powerLabel);

        var tipLabel = cc.LabelTTF.create("体力每10分钟恢复10点", '黑体', 28);
        tipLabel.setAnchorPoint(cc.p(0, 0.5));
        tipLabel.setPosition(cc.p(150, 250));
        this.addChild(tipLabel);

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button0,
            main_scene_image.button0s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(cc.p(620, 1000));

        this._menu = cc.Menu.create(closeItem);
        this._menu.setPosition(cc.p(0, 0));
        this.addChild(this._menu);

        return true;
    },

    update: function () {
        cc.log("PlayerDetails update");

        var player = gameData.player;

        this._goldLabel.setString(player.get("gold"));
        this._moneyLabel.setString(player.get("money"));
        this._skillPointLabel.setString(player.get("skillPoint"));
        this._elixirLabel.setString(player.get("elixir"));
        this._energyLabel.setString(player.get("energy"));
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