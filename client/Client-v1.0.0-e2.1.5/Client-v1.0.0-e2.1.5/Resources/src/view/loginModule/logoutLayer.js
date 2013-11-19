/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-10-17
 * Time: 下午5:13
 * To change this template use File | Settings | File Templates.
 */


/*
 * logout layer
 * */


var LogoutLayer = LazyLayer.extend({
    _logoutLayerFit: null,

    onEnter: function () {
        cc.log("LogoutLayer onEnter");

        this._super();

        lz.dc.beginLogPageView("退出登录界面");
    },

    onExit: function () {
        cc.log("LogoutLayer onExit");

        this._super();

        lz.dc.endLogPageView("退出登录界面");
    },

    init: function (msg) {
        cc.log("LogoutLayer init");

        if (!this._super()) return false;

        this._logoutLayerFit = gameFit.loginScene.logoutLayer;

        this.setTouchPriority(WAIT_LAYER_HANDLER_PRIORITY);

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 640, 1136);
        bgLayer.setPosition(this._logoutLayerFit.bgLayerPoint);
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(520, 260));
        bgSprite.setPosition(this._logoutLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var msgBgIcon = cc.Sprite.create(main_scene_image.icon175);
        msgBgIcon.setPosition(this._logoutLayerFit.msgBgIconPoint);
        msgBgIcon.setScaleX(0.88);
        this.addChild(msgBgIcon);

        var msgLabel = cc.LabelTTF.create(msg, "STHeitiTC-Medium", 28);
        msgLabel.setPosition(this._logoutLayerFit.msgLabelPoint);
        this.addChild(msgLabel);

        var cancelItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOk,
            this
        );
        cancelItem.setPosition(this._logoutLayerFit.cancelItemPoint);

        var menu = cc.Menu.create(cancelItem);
        menu.setTouchPriority(WAIT_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    _onClickOk: function () {
        cc.log("LogoutLayer _onClickOk");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();

        MainScene.destroy();

        cc.Director.getInstance().replaceScene(LoginScene.create());
    }
});


LogoutLayer.create = function (msg) {
    var ret = new LogoutLayer();

    if (ret && ret.init(msg)) {
        return ret;
    }

    return null;
};


LogoutLayer.pop = function (msg) {
    var logoutLayer = LogoutLayer.create(msg);

    cc.Director.getInstance().getRunningScene().addChild(logoutLayer, 500);
};
