/**
 * Created by lujunyu on 14-2-9.
 */

var GameHelpLabel = LazyLayer.extend({

    init: function (arg) {
        cc.log("GameHelpLabel init");

        if (!this._super()) return false;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var title = arg.title;
        var descriptions = arg.descriptions;

        var node = cc.Node.create();
        node.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(node);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(510, 530));
        bgSprite.setPosition(cc.p(0, 0));
        node.addChild(bgSprite);

        var titleLabel = cc.LabelTTF.create(title, "STHeitiTC-Medium", 35);
        titleLabel.setColor(cc.c3b(255, 232, 75));
        titleLabel.setPosition(0, 215);
        node.addChild(titleLabel);

        var msgBgIcon = cc.Scale9Sprite.create(main_scene_image.icon175);
        msgBgIcon.setPosition(cc.p(0, 10));
        msgBgIcon.setContentSize(cc.size(460, 330));
        node.addChild(msgBgIcon);

        var len = descriptions.length;
        var y = 145;
        for (var i = 0; i < len; i++) {
            var description = lz.format(descriptions[i], 19);
            var len2 = description.length;
            for (var j = 0; j < len2; j++) {
                var itemText = cc.LabelTTF.create(description[j], "STHeitiTC-Medium", 22);
                itemText.setAnchorPoint(cc.p(0, 0.5));
                itemText.setPosition(cc.p(-210, y - j * 30));
                node.addChild(itemText);
            }
            y -= description.length * 35;
        }

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickClose,
            this
        );
        closeItem.setPosition(cc.p(0, -195));

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.p(0, 0));
        node.addChild(menu);

        return true;
    },

    _onClickClose: function () {
        cc.log("GameHelpLabel _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this.removeFromParent();
    }

});

GameHelpLabel.create = function (arg) {
    cc.log("GameHelpLabel create");

    var ref = new GameHelpLabel();
    if (ref && ref.init(arg)) {
        return ref;
    }

    return null;
};

GameHelpLabel.pop = function (arg) {
    cc.log("GameHelpLabel pop");

    var gameHelpLabel = GameHelpLabel.create(arg);
    MainScene.getInstance().getLayer().addChild(gameHelpLabel, 10);
};