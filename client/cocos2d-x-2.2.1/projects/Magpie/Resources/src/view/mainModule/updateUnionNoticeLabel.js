/**
 * Created by xiaoyu on 2014/10/20.
 */

var UpdateUnionNoticeLabel = LazyLayer.extend({
    _cb: null,

    init: function (cb) {
        if (!this._super()) return false;

        this._cb = cb || function () {
        };

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 720, 1136);
        bgLayer.setPosition(cc.p(0, 88));
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(600, 350));
        bgSprite.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(bgSprite);

        var titleLabel = cc.LabelTTF.create("公会宣言", "STHeitiTC-Medium", 35);
        titleLabel.setPosition(cc.p(300, 300));
        bgSprite.addChild(titleLabel);

        var nameEditBoxIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
        nameEditBoxIcon.setContentSize(cc.size(520, 60));
        nameEditBoxIcon.setPosition(cc.p(300, 200));
        bgSprite.addChild(nameEditBoxIcon);

        this._nameEditBox = cc.EditBox.create(cc.size(520, 70), cc.Scale9Sprite.create(main_scene_image.edit));
        this._nameEditBox.setPosition(cc.p(300, 200));
        this._nameEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._nameEditBox.setDelegate(this);
        this._nameEditBox.setFont("STHeitiTC-Medium", 25);
        this._nameEditBox.setPlaceHolder("最多输入二十个中文或字母");
        bgSprite.addChild(this._nameEditBox);

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOk,
            this
        );
        okItem.setPosition(cc.p(200, 100));

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon36,
            this._onClickClose,
            this
        );
        closeItem.setPosition(cc.p(400, 100));

        var menu = cc.Menu.create(okItem, closeItem);
        menu.setPosition(cc.p(0, 0));
        bgSprite.addChild(menu);

        return true;
    },

    _onClickOk: function () {
        cc.log("UpdateUnionNoticeLabel _onClickOk");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var text = this._nameEditBox.getText();
        cc.log("create union's name: " + text);

        if (text == null || text == "") {
            TipLayer.tip("请先输入宣言");
            return;
        }

        if (text.length > 20) {
            TipLayer.tip("宣言长度不得超过20字符");
            return;
        }

        this._cb(text);
        this.removeFromParent();
    },

    _onClickClose: function () {
        cc.log("UpdateUnionNoticeLabel _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    }
});

UpdateUnionNoticeLabel.create = function (cb) {
    var ret = new UpdateUnionNoticeLabel();

    if (ret && ret.init(cb)) {
        return ret;
    }

    return null;
};

UpdateUnionNoticeLabel.pop = function (cb) {
    var updateUnionNoticeLabel = UpdateUnionNoticeLabel.create(cb);

    MainScene.getInstance().getLayer().addChild(updateUnionNoticeLabel, 10);

    return updateUnionNoticeLabel;
};