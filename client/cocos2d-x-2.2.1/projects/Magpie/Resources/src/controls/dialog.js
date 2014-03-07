/**
 * Created by lcc3536 on 13-12-3.
 */


/*
 * dialog
 * */


var Dialog = LazyLayer.extend({
    _dialogFit: null,
    _cb: null,

    onEnter: function () {
        cc.log("Dialog onEnter");

        this._super();

        lz.um.beginLogPageView("对话框");
    },

    onExit: function () {
        cc.log("Dialog onExit");

        this._super();

        lz.um.endLogPageView("对话框");
    },

    init: function (msg, cb) {
        cc.log("Dialog init");

        if (!this._super()) return false;

        this.setTouchPriority(WAIT_LAYER_HANDLER_PRIORITY);

        this._dialogFit = gameFit.loginScene.dialog;
        this._cb = cb || null;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 640, 1136);
        bgLayer.setPosition(this._dialogFit.bgLayerPoint);
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(520, 260));
        bgSprite.setPosition(this._dialogFit.bgSpritePoint);
        this.addChild(bgSprite);

        var msgBgIcon = cc.Sprite.create(main_scene_image.icon175);
        msgBgIcon.setPosition(this._dialogFit.msgBgIconPoint);
        msgBgIcon.setScaleX(0.88);
        this.addChild(msgBgIcon);

        var msgLabel = cc.LabelTTF.create(msg, "STHeitiTC-Medium", 28);
        msgLabel.setPosition(this._dialogFit.msgLabelPoint);
        this.addChild(msgLabel);

        var cancelItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOk,
            this
        );
        cancelItem.setPosition(this._dialogFit.cancelItemPoint);

        var menu = cc.Menu.create(cancelItem);
        menu.setTouchPriority(WAIT_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    _onClickOk: function () {
        cc.log("Dialog _onClickOk");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();

        if (this._cb) {
            this._cb();
        }
    }
});


Dialog.create = function (msg, cb) {
    var ret = new Dialog();

    if (ret && ret.init(msg, cb)) {
        return ret;
    }

    return null;
};


Dialog.pop = function (msg, cb) {
    lz.scheduleOnce(function () {
        var dialog = Dialog.create(msg, cb);

        cc.Director.getInstance().getRunningScene().addChild(dialog, 10000);
    }, 0.01);
};