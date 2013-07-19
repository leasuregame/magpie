/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-15
 * Time: 下午2:05
 * To change this template use File | Settings | File Templates.
 */


/*
 * player header label
 * */


var PlayerHeaderLabel = cc.Layer.extend({
    _player: null,
    _selectRect: cc.rect(40, 818, GAME_WIDTH, 180),
    _isMouseDown: false,
    _nameLabel: null,
    _lvLabel: null,
    _vipLabel: null,
    _goldLabel: null,
    _moneyLabel: null,
    _expLabel: null,
    _powerLabel: null,

    onEnter: function () {
        cc.log("PlayerHeaderLabel onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("PlayerHeaderLabel init");

        if (!this._super()) return false;

        this._player = gameData.player;

        this.setTouchEnabled(true);

        bg = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 180);
        bg.ignoreAnchorPointForPosition(false);
        bg.setAnchorPoint(cc.p(0, 0));
        this.addChild(bg);

        var nameLabel = cc.LayerColor.create(cc.c4b(100, 100, 100, 100), 180, 180);
        nameLabel.ignoreAnchorPointForPosition(false);
        nameLabel.setAnchorPoint(cc.p(0, 0));
        this.addChild(nameLabel);

        this._nameLabel = cc.LabelTTF.create("名字", 'Times New Roman', 30);
        this._nameLabel.setFontSize(25);
        this._nameLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._nameLabel.setPosition(90, 90);
        this.addChild(this._nameLabel);

        var lvLabel = cc.LayerColor.create(cc.c4b(100, 50, 100, 100), 230, 60);
        lvLabel.ignoreAnchorPointForPosition(false);
        lvLabel.setAnchorPoint(cc.p(0, 0));
        lvLabel.setPosition(180, 120);
        this.addChild(lvLabel);

        this._lvLabel = cc.LabelTTF.create("等级：", 'Times New Roman', 30);
        this._lvLabel.setFontSize(25);
        this._lvLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._lvLabel.setPosition(305, 150);
        this.addChild(this._lvLabel);

        var vipLabel = cc.LayerColor.create(cc.c4b(100, 100, 50, 100), 230, 60);
        vipLabel.ignoreAnchorPointForPosition(false);
        vipLabel.setAnchorPoint(cc.p(0, 0));
        vipLabel.setPosition(410, 120);
        this.addChild(vipLabel);

        this._vipLabel = cc.LabelTTF.create("VIP：", 'Times New Roman', 30);
        this._vipLabel.setFontSize(25);
        this._vipLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._vipLabel.setPosition(535, 150);
        this.addChild(this._vipLabel);

        var goldLabel = cc.LayerColor.create(cc.c4b(50, 100, 100, 100), 230, 60);
        goldLabel.ignoreAnchorPointForPosition(false);
        goldLabel.setAnchorPoint(cc.p(0, 0));
        goldLabel.setPosition(180, 60);
        this.addChild(goldLabel);

        this._goldLabel = cc.LabelTTF.create("元宝：", 'Times New Roman', 30);
        this._goldLabel.setFontSize(25);
        this._goldLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._goldLabel.setPosition(305, 90);
        this.addChild(this._goldLabel);

        var moneyLabel = cc.LayerColor.create(cc.c4b(50, 100, 50, 100), 230, 60);
        moneyLabel.ignoreAnchorPointForPosition(false);
        moneyLabel.setAnchorPoint(cc.p(0, 0));
        moneyLabel.setPosition(410, 60);
        this.addChild(moneyLabel);

        this._moneyLabel = cc.LabelTTF.create("铜板：", 'Times New Roman', 30);
        this._moneyLabel.setFontSize(25);
        this._moneyLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._moneyLabel.setPosition(535, 90);
        this.addChild(this._moneyLabel);

        var expLabel = cc.LayerColor.create(cc.c4b(100, 50, 50, 100), 230, 60);
        expLabel.ignoreAnchorPointForPosition(false);
        expLabel.setAnchorPoint(cc.p(0, 0));
        expLabel.setPosition(180, 0);
        this.addChild(expLabel);

        this._expLabel = cc.LabelTTF.create("经验：", 'Times New Roman', 30);
        this._expLabel.setFontSize(25);
        this._expLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._expLabel.setPosition(305, 30);
        this.addChild(this._expLabel);

        var powerLabel = cc.LayerColor.create(cc.c4b(50, 50, 100, 100), 230, 60);
        powerLabel.ignoreAnchorPointForPosition(false);
        powerLabel.setAnchorPoint(cc.p(0, 0));
        powerLabel.setPosition(410, 0);
        this.addChild(powerLabel);

        this._powerLabel = cc.LabelTTF.create("体力：", 'Times New Roman', 30);
        this._powerLabel.setFontSize(25);
        this._powerLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._powerLabel.setPosition(535, 30);
        this.addChild(this._powerLabel);

        return true;
    },

    update: function () {
        cc.log("PlayerHeaderLabel update");
        cc.log(this._player);

        this._nameLabel.setString(this._player.get("name"));
        this._lvLabel.setString("等级：" + this._player.get("lv"));
        this._vipLabel.setString("VIP：" + this._player.get("vip"));
        this._goldLabel.setString("元宝：" + this._player.get("gold"));
        this._moneyLabel.setString("铜板：" + this._player.get("money"));
        this._expLabel.setString("经验：" + this._player.get("exp") + " / " + this._player.get("maxExp"));
        this._powerLabel.setString("体力：" + this._player.get("power") + " / " + this._player.get("maxPower"));
    },

    onTouchesBegan: function (touches, event) {
        var point = touches[0].getLocation();
        if (cc.rectContainsPoint(this._selectRect, point)) {
            this._isMouseDown = true;
        }
    },

    onTouchesMoved: function (touches, event) {
    },

    onTouchesEnded: function (touches, event) {
        if (this._isMouseDown) {
            var point = touches[0].getLocation();

            if (cc.rectContainsPoint(this._selectRect, point)) {
                cc.log("PlayerHeaderLabel select");
                this._isMouseDown = false;
                this.addChild(CardListLayer.create());
            }
        }
    },

    onTouchesCancelled: function (touches, event) {
        this._isMouseDown = false;
    }
});


PlayerHeaderLabel.create = function () {
    var ret = new PlayerHeaderLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}