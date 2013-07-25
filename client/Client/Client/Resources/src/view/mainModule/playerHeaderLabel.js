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

        this._nameLabel = cc.LabelTTF.create("0", 'Times New Roman', 30);
        this._nameLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._nameLabel.setPosition(cc.p(90, 90));
        this.addChild(this._nameLabel);

        var lvBg = cc.Sprite.create(main_scene_image.lv_bg);
        lvBg.setPosition(cc.p());
        this.addChild(lvBg);

        this._lvLabel = cc.LabelTTF.create("0", 'Times New Roman', 30);
        this._lvLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._lvLabel.setPosition(cc.p(305, 150));
        lvBg.addChild(this._lvLabel);

//        this._vipLabel = cc.LabelTTF.create("0", 'Times New Roman', 30);
//        this._vipLabel.setAnchorPoint(cc.p(0.5, 0.5));
//        this._vipLabel.setPosition(535, 150);
//        this.addChild(this._vipLabel);

        this._goldLabel = cc.LabelTTF.create("", 'Times New Roman', 30);
        this._goldLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._goldLabel.setPosition(cc.p(305, 90));
        this.addChild(this._goldLabel);

        this._moneyLabel = cc.LabelTTF.create("0", 'Times New Roman', 30);
        this._moneyLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._moneyLabel.setPosition(cc.p(535, 90));
        this.addChild(this._moneyLabel);

//        this._expLabel = cc.LabelTTF.create("经验：", 'Times New Roman', 30);
//        this._expLabel.setAnchorPoint(cc.p(0.5, 0.5));
//        this._expLabel.setPosition(cc.p(305, 30));
//        this.addChild(this._expLabel);

        this._powerLabel = cc.LabelTTF.create("0", 'Times New Roman', 30);
        this._powerLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._powerLabel.setPosition(cc.p(535, 30));
        this.addChild(this._powerLabel);

        return true;
    },

    update: function () {
        cc.log("PlayerHeaderLabel update");
        cc.log(this._player);

        this._nameLabel.setString(this._player.get("name"));
        this._lvLabel.setString(this._player.get("lv"));
//        this._vipLabel.setString(this._player.get("vip"));
        this._goldLabel.setString(this._player.get("gold"));
        this._moneyLabel.setString(this._player.get("money"));
//        this._expLabel.setString("经验：" + this._player.get("exp") + " / " + this._player.get("maxExp"));
        this._powerLabel.setString(this._player.get("power"));
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