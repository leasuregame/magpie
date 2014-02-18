/**
 * Created by lujunyu on 14-1-24.
 */

var UseCardsTipLabel = LazyLayer.extend({

    _cb: null,

    init: function (cb) {
        cc.log("UseCardsTipLabel init");

        if (!this._super()) return false;

        if (cb) {
            this._cb = cb;
        }

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var node = cc.Node.create();
        node.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(node);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(550, 250));
        bgSprite.setPosition(cc.p(0, 0));
        node.addChild(bgSprite);

        var msgBgIcon = cc.Sprite.create(main_scene_image.icon175);
        msgBgIcon.setPosition(cc.p(0, 30));
        msgBgIcon.setScaleX(0.9);
        node.addChild(msgBgIcon);

        var tipLabel = cc.LabelTTF.create("所选中卡牌中有4/5星卡，确定继续么", "STHeitiTC-Medium", 25);
        tipLabel.setPosition(cc.p(0, 30));
        node.addChild(tipLabel);

        var cancelItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon308,
            this._onClickCancel,
            this
        );
        cancelItem.setPosition(cc.p(-120, -60));

        var continueItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickContinue,
            this
        );
        continueItem.setPosition(cc.p(120, -60));

        var menu = cc.Menu.create(cancelItem, continueItem);
        menu.setPosition(cc.p(0, 0));
        node.addChild(menu);

        return true;
    },

    _onClickCancel: function () {
        cc.log("UseCardsTipLabel _onClickCancel");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this.removeFromParent();
    },

    _onClickContinue: function () {
        cc.log("UseCardsTipLabel _onClickContinue");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._cb) {
            this._cb();
        }

        this.removeFromParent();
    }

});

UseCardsTipLabel.create = function (cb) {
    cc.log("UseCardsTipLabel create");

    var ref = new UseCardsTipLabel();

    if (ref && ref.init(cb)) {
        return ref;
    }

    return null;
};

UseCardsTipLabel.pop = function (cb) {
    cc.log("UseCardsTipLabel pop");

    var useCardsTipLabel = UseCardsTipLabel.create(cb);

    MainScene.getInstance().getLayer().addChild(useCardsTipLabel, 10);
};
