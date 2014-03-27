/**
 * Created by lujunyu on 14-2-28.
 */

var RemoveCdTipLabel = LazyLayer.extend({

    _cb: null,

    init: function (args) {
        cc.log("RemoveCdTipLabel init");

        if (!this._super()) return false;

        if (args && args.cb) {
            this._cb = args.cb;
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

        var needGold = gameData.boss.removeCdNeedGold();

        var testLabel = ColorLabelTTF.create(
            {
                string: "是否确定花费" + needGold,
                fontName: "STHeitiTC-Medium",
                fontSize: 25
            },
            {
                goodsName: "gold",
                scale: 0.7
            },
            {
                string: "消除CD?",
                fontName: "STHeitiTC-Medium",
                fontSize: 25
            }
        );
        testLabel.setPosition(cc.p(0, 30));
        testLabel.setAnchorPoint(cc.p(0.5, 0));
        node.addChild(testLabel);

        var oKItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOK,
            this
        );
        oKItem.setPosition(cc.p(-120, -60));

        var cancelItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon308,
            this._onClickCancel,
            this
        );
        cancelItem.setPosition(cc.p(120, -60));

        var menu = cc.Menu.create(cancelItem, oKItem);
        menu.setPosition(cc.p(0, 0));
        node.addChild(menu);

        return true;
    },

    _onClickCancel: function () {
        cc.log("RemoveCdTipLabel _onClickCancel");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this.removeFromParent();
    },

    _onClickOK: function () {
        cc.log("RemoveCdTipLabel _onClickOK");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this.removeFromParent();

        var needGold = gameData.boss.removeCdNeedGold();
        if (gameData.player.get("gold") < needGold) {
            TipLayer.tip("魔石不足");
            return;
        }

        if (this._cb) {
            this._cb();
        }

    }

});

RemoveCdTipLabel.create = function (args) {
    cc.log("RemoveCdTipLabel create");

    var ref = new RemoveCdTipLabel();

    if (ref && ref.init(args)) {
        return ref;
    }

    return null;
};

RemoveCdTipLabel.pop = function (args) {
    cc.log("RemoveCdTipLabel pop");

    var removeCdTipLabel = RemoveCdTipLabel.create(args);

    MainScene.getInstance().getLayer().addChild(removeCdTipLabel, 10);
};
