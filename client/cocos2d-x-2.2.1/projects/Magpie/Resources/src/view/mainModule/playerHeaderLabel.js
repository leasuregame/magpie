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
        this.setTouchMode(cc.TOUCHES_ONE_BY_ONE);

        var player = gameData.player;

        var nameLabel = StrokeLabel.create(player.get("name"), "STHeitiTC-Medium", 30);
        nameLabel.setColor(cc.c3b(255, 239, 131));
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(cc.p(130, 83));
        this.addChild(nameLabel);

        var expBg = cc.Sprite.create(main_scene_image.exp_bg);
        expBg.setPosition(cc.p(210, 36));
        this.addChild(expBg);

        var url = main_scene_image.exp;
        if (player.isFullLv()) {
            url = main_scene_image.exp_full;
        }

        this._expProgress = Progress.create(null, url, 0, 0, true);
        this._expProgress.setPosition(cc.p(214, 36));
        this.addChild(this._expProgress);

        var lvBg = cc.Sprite.create(main_scene_image.lv_bg);
        lvBg.setPosition(cc.p(60, 60));
        this.addChild(lvBg);

        this._lvLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 45);
        this._lvLabel.setPosition(cc.p(57, 58));
        this.addChild(this._lvLabel);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(cc.p(510, 85));
        this.addChild(goldIcon);

        this._goldLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._goldLabel.setAnchorPoint(cc.p(0, 0.5));
        this._goldLabel.setPosition(cc.p(535, 83));
        this.addChild(this._goldLabel);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
        moneyIcon.setPosition(cc.p(510, 38));
        this.addChild(moneyIcon);

        this._moneyLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._moneyLabel.setPosition(cc.p(535, 36));
        this.addChild(this._moneyLabel);

        var powerIcon = cc.Sprite.create(main_scene_image.icon150);
        powerIcon.setPosition(cc.p(360, 38));
        this.addChild(powerIcon);

        this._powerLabel = cc.LabelTTF.create("0 / 0", "STHeitiTC-Medium", 22);
        this._powerLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._powerLabel.setPosition(cc.p(427, 36));
        this.addChild(this._powerLabel);

        var vipLv = player.get("vip") || 0;
        var vipSprite = cc.Sprite.create(main_scene_image["vip" + vipLv]);
        vipSprite.setPosition(cc.p(410, 87));
        this.addChild(vipSprite);

        return true;
    },

    update: function () {
        var player = gameData.player;

        if (player.isFullLv()) {
            this._expProgress.setAllValue(0, 0);
        } else {
            this._expProgress.setAllValue(player.get("exp"), player.get("maxExp"));
        }

        this._lvLabel.setString(player.get("lv"));
        this._goldLabel.setString(player.get("gold"));
        this._moneyLabel.setString(player.get("money"));
        this._powerLabel.setString(player.get("power") + " / " + player.get("maxPower"));
    },

    _onClickPlayerDetails: function () {
        cc.log("MainLayer _onClickPlayerDetails");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        PlayerDetails.pop();
    },

    onTouchBegan: function (touch, event) {
        cc.log("PlayerHeaderLabel onTouchesBegan");

        var point = this.convertToNodeSpace(touch.getLocation());

        if (cc.rectContainsPoint(this._selectRect, point)) {
            this._isTouch = true;
            this._onClickPlayerDetails();
        }
    },

    onTouchEnded: function (touch, event) {
        cc.log("PlayerHeaderLabel onTouchesEnded");

        if (this._isTouch && touch != undefined) {
            var point = this.convertToNodeSpace(touch.getLocation());

            if (cc.rectContainsPoint(this._selectRect, point)) {
                cc.log("PlayerHeaderLabel _onClickPlayerDetails");
                this._isTouch = false;

                this._onClickPlayerDetails();
            }
        }
    },

    onTouchCancelled: function (touch, event) {
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
