/**
 * Created by lcc3536 on 13-11-11.
 */


/*
 * new player layer
 * */


var NewPlayerLayer = cc.Layer.extend({
    _newPlayerLayerFit: null,

    onEnter: function () {
        cc.log("NewPlayerLayer onEnter");

        this._super();

        lz.dc.beginLogPageView("创建新玩家界面");
    },

    onExit: function () {
        cc.log("NewPlayerLayer onExit");

        this._super();

        lz.dc.endLogPageView("创建新玩家界面");
    },

    init: function () {
        cc.log("NewPlayerLayer init");

        if (!this._super()) return false;

        this._newPlayerLayerFit = gameFit.loginScene.newPlayerLayer;

        var newPlayerFrame = cc.BuilderReader.load(main_scene_image.uiEffect40, this);
        newPlayerFrame.setPosition(this._newPlayerLayerFit.newPlayerFramePoint);
        this.addChild(newPlayerFrame);

        var playerNameLabel = newPlayerFrame.controller.playerNameLabel;

        this._nameEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create(main_scene_image.edit3));
        this._nameEditBox.setPosition(cc.p(0, 0));
        this._nameEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._nameEditBox.setDelegate(this);
        this._nameEditBox.setFont("STHeitiTC-Medium", 35);
        this._nameEditBox.setMaxLength(6);
        playerNameLabel.addChild(this._nameEditBox);

        this._setRandomName();

        return true;
    },

    _setRandomName: function () {
        cc.log("NewPlayerLayer _setRandomName");

        var user = gameData.user;
        var name = user.getRandomName();

        while (!user.eligibleName(name)) {
            name = user.getRandomName();
        }

        this._nameEditBox.setText(name);
    },

    _onClickRandom: function () {
        cc.log("NewPlayerLayer _onClickRandom");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._setRandomName();
    },

    _onClickOk: function () {
        cc.log("NewPlayerLayer _onClickOk");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var name = this._nameEditBox.getText();
        var user = gameData.user;

        if (!user.eligibleName(name)) {
            TipLayer.tip("改名字被占用");
            return;
        }

        gameData.user.createPlayer(function () {
            cc.Director.getInstance().replaceScene(MainScene.getInstance());
        }, name);
    },

    _onClickBack: function () {
        cc.log("NewPlayerLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    }
});


NewPlayerLayer.create = function () {
    var ret = new NewPlayerLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};