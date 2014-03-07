/**
 * Created by lujunyu on 14-3-6.
 */

var BossHelpLabel = LazyLayer.extend({

    init: function () {
        cc.log("BossHelpLabel init");

        if (!this._super()) return false;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var layer = cc.Layer.create();
        layer.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(layer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(610, 700));
        bgSprite.setPosition(cc.p(0, 0));
        layer.addChild(bgSprite);

        var titleLabel = cc.LabelTTF.create("BOSS帮助", "STHeitiTC-Medium", 35);
        titleLabel.setColor(cc.c3b(255, 232, 75));
        titleLabel.setPosition(0, 300);
        layer.addChild(titleLabel);

        var msgBgIcon = cc.Scale9Sprite.create(main_scene_image.icon175);
        msgBgIcon.setPosition(cc.p(0, 10));
        msgBgIcon.setContentSize(cc.size(560, 500));
        layer.addChild(msgBgIcon);

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickClose,
            this
        );

        closeItem.setPosition(cc.p(0, -280));

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.p(0, 0));
        layer.addChild(menu);

        var tips = [
            "1、探索有概率触发BOSS，当前BOSS只有消失后，下个",
            "BOSS才可能被触发。",
            "2、BOSS存活时间12小时，超时后会自动逃走。",
            "3、BOSS最多可被攻击10次。10次之后，无论生死都会",
            "消失。每次攻击后进入CD，你可以花费魔石消除CD。",
            "4、奖励多少取决于你对BOSS以及附属小怪所造成的伤",
            "害，伤害越高，奖励越高。",
            "5、BOSS分为3个品质，由低到高依次为，蓝色，紫色，",
            "金色。品质越高，每次攻击奖励加成越高。",
            "6、攻击好友的BOSS，你可以获得100%的奖励，好友会",
            "获得30%的协助奖励。好友必须对自己的BOSS发起首次",
            "攻击后，才可以被协助。",
            "7、奖励包括仙币与荣誉两种。累计一定数量的荣誉，",
            "即可兑换精元，精元是高星级进阶的必须品。"
        ];

        var len = tips.length;
        var y = 230;
        for (var i = 0; i < len; i++) {
            var label = cc.LabelTTF.create(tips[i], "STHeitiTC-Medium", 22);
            label.setAnchorPoint(cc.p(0, 0.5));
            label.setPosition(-268, y);
            layer.addChild(label);

            y -= 33;
        }

        return true;
    },

    _onClickClose: function () {
        cc.log("GameHelpLabel _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this.removeFromParent();
    }

});

BossHelpLabel.create = function () {
    cc.log("BossHelpLabel create");

    var ref = new BossHelpLabel();
    if (ref && ref.init()) {
        return ref;
    }
    return null;
};

BossHelpLabel.pop = function () {
    cc.log("BossHelpLabel pop");

    var bossHelpLabel = BossHelpLabel.create();

    MainScene.getInstance().getLayer().addChild(bossHelpLabel, 10);
};