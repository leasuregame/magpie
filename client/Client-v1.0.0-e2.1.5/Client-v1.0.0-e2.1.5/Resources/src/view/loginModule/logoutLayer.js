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
    init: function (msg) {
        cc.log("LogoutLayer init");

        if (!this._super()) return false;

        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 640, 1136);
        bgLayer.setPosition(cc.p(40, 0));
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(520, 300));
        bgSprite.setPosition(cc.p(363, 600));
        this.addChild(bgSprite);

        var msgLabel = cc.LabelTTF.create(msg, "STHeitiTC-Medium", 25);
        msgLabel.setPosition(cc.p(360, 620));
        this.addChild(msgLabel);

        var cancelItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOk,
            this
        );
        cancelItem.setPosition(cc.p(360, 500));

        var menu = cc.Menu.create(cancelItem);
        menu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    _onClickOk: function () {
        cc.log("LogoutLayer _onClickOk");

        this.removeFromParent();

        MainScene.destroy();
        TipLayer.destroy();

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

    MainScene.getInstance().addChild(logoutLayer, 1);
};
