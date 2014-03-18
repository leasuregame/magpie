/**
 * Created by lujunyu on 14-1-24.
 */

var TYPE_CARD_TIPS = 0;
var TYPE_PASSIVE_SKILL_TIPS = 1;

var AdvancedTipsLabel = LazyLayer.extend({

    _cb: null,

    _tips: {
        0: "所选中卡牌中有4或5星卡，确定继续么",
        1: "当前卡牌有金色属性，是否要继续洗练"
    },

    init: function (args) {
        cc.log("AdvancedTipsLabel init");

        if (!this._super()) return false;

        if (args.cb) {
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
        msgBgIcon.setScaleX(0.95);
        node.addChild(msgBgIcon);

        var tipLabel = cc.LabelTTF.create(this._tips[args.type], "STHeitiTC-Medium", 25);
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
        cc.log("AdvancedTipsLabel _onClickCancel");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this.removeFromParent();
    },

    _onClickContinue: function () {
        cc.log("AdvancedTipsLabel _onClickContinue");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();

        if (this._cb) {
            this._cb();
        }
    }

});

AdvancedTipsLabel.create = function (args) {
    cc.log("AdvancedTipsLabel create");

    var ref = new AdvancedTipsLabel();

    if (ref && ref.init(args)) {
        return ref;
    }

    return null;
};

AdvancedTipsLabel.pop = function (args) {
    cc.log("AdvancedTipsLabel pop");

    var advancedTipsLabel = AdvancedTipsLabel.create(args);

    MainScene.getInstance().getLayer().addChild(advancedTipsLabel, 10);
};
