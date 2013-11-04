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
    _selectRect: cc.rect(0, 0, 640, 120),
    _isTouch: false,
    _expProgress: null,
    _lvLabel: null,
    _vipSprite: null,
    _goldLabel: null,
    _moneyLabel: null,
    _powerLabel: null,

    onEnter: function () {
        cc.log("PlayerHeaderLabel onEnter");

        this._super();
        this.update();

        this.schedule(this.update, 1);
    },

    init: function () {
        cc.log("PlayerHeaderLabel init");

        if (!this._super()) return false;

        this.setTouchEnabled(true);

        var player = gameData.player;

        var nameLabel = StrokeLabel.create(player.get("name"), "STHeitiTC-Medium", 30);
        nameLabel.setColor(cc.c3b(255, 239, 131));
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(cc.p(130, 83));
        this.addChild(nameLabel);

        var expBg = cc.Sprite.create(main_scene_image.exp_bg);
        expBg.setPosition(cc.p(210, 36));
        this.addChild(expBg);

        this._expProgress = Progress.create(null, main_scene_image.exp, 0, 0, true);
        this._expProgress.setPosition(cc.p(214, 36));
        this.addChild(this._expProgress);

        var lvBg = cc.Sprite.create(main_scene_image.lv_bg);
        lvBg.setPosition(cc.p(60, 60));
        this.addChild(lvBg);

        this._lvLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 45);
        this._lvLabel.setPosition(cc.p(57, 58));
        this.addChild(this._lvLabel);

        this._goldLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._goldLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._goldLabel.setPosition(cc.p(580, 83));
        this.addChild(this._goldLabel);

        this._moneyLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._moneyLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._moneyLabel.setPosition(cc.p(580, 36));
        this.addChild(this._moneyLabel);

        this._powerLabel = cc.LabelTTF.create("0 / 0", "STHeitiTC-Medium", 22);
        this._powerLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._powerLabel.setPosition(cc.p(427, 36));
        this.addChild(this._powerLabel);

        var vipLv = player.get("vip");
        if (vipLv) {
            var vipSprite = cc.Sprite.create(main_scene_image["vip" + vipLv]);
            vipSprite.setPosition(cc.p(410, 83));
            this.addChild(vipSprite);
        }

        return true;
    },

    update: function () {
        cc.log("PlayerHeaderLabel update");

        var player = gameData.player;

        this._expProgress.setAllValue(player.get("exp"), player.get("maxExp"));
        this._lvLabel.setString(player.get("lv"));
        this._goldLabel.setString(player.get("gold"));
        this._moneyLabel.setString(player.get("money"));
        this._powerLabel.setString(player.get("power") + " / " + player.get("maxPower"));
    },

    _onClickPlayerDetails: function () {
        cc.log("MainLayer _onClickPlayerDetails");

        MainScene.getInstance().getLayer().addChild(PlayerDetails.create(), 10);
    },

    onTouchesBegan: function (touches, event) {
        cc.log("PlayerHeaderLabel onTouchesBegan");

        var point = this.convertToNodeSpace(touches[0].getLocation());

        if (cc.rectContainsPoint(this._selectRect, point)) {
            this._isTouch = true;
        }
    },


    onTouchesEnded: function (touches, event) {
        cc.log("PlayerHeaderLabel onTouchesEnded");

        if (this._isTouch) {
            var point = this.convertToNodeSpace(touches[0].getLocation());

            if (cc.rectContainsPoint(this._selectRect, point)) {
                cc.log("PlayerHeaderLabel _onClickPlayerDetails");
                this._isTouch = false;

                this._onClickPlayerDetails();
            }
        }
    },

    onTouchesCancelled: function (touches, event) {
        cc.log("PlayerHeaderLabel onTouchesCancelled");

        this._isTouch = false;
    }
});


PlayerHeaderLabel.create = function () {
    var ret = new PlayerHeaderLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};