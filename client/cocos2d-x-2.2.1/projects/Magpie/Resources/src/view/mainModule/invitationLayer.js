/**
 * Created by lcc3536 on 14-1-9.
 */


/*
 * invitation layer
 * */


var INVITATION_CODE_MAX_LEN = 30;

var InvitationLayer = cc.Layer.extend({
    _invitationLayerFit: null,

    _editBox: null,

    onEnter: function () {
        cc.log("InvitationLayer onEnter");

        this._super();

        lz.um.beginLogPageView("激活码兑换界面");
    },

    onExit: function () {
        cc.log("InvitationLayer onExit");

        this._super();

        lz.um.endLogPageView("激活码兑换界面");
    },

    init: function () {
        cc.log("InvitationLayer init");

        if (!this._super()) return false;

        this._invitationLayerFit = gameFit.mainScene.invitationLayer;

        var iconSprite = cc.Sprite.create(main_scene_image.icon4);
        iconSprite.setPosition(this._invitationLayerFit.iconSpritePoint);
        this.addChild(iconSprite);

        this._editBox = cc.EditBox.create(cc.size(345, 66), cc.Scale9Sprite.create(main_scene_image.edit));
        this._editBox.setPosition(this._invitationLayerFit.editBoxPoint);
        this._editBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._editBox.setDelegate({
            /**
             * This method is called when an edit box gains focus after keyboard is shown.
             * @param {cc.EditBox} sender
             */
            editBoxEditingDidBegin: function (sender) {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            }
        });
        this._editBox.setFont("STHeitiTC-Medium", 35);
        this.addChild(this._editBox);

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon28,
            this._onClickOk,
            this
        );
        okItem.setPosition(this._invitationLayerFit.okItemPoint);

        var menu = cc.Menu.create(okItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    _onClickOk: function () {
        cc.log("InvitationLayer _onClickOk");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var key = this._editBox.getText();

        if (key == null || key == "" || key.length > INVITATION_CODE_MAX_LEN) {
            TipLayer.tip("请输入有效邀请码");
            return;
        }

        gameData.player.invite(function (data) {
            cc.log(data);

            var cb = function() {
                lz.tipReward(data);
            };

            GiftBagLayer.pop({
                reward: data,
                cb: cb
            });
        }, key);
    }
});

InvitationLayer.create = function () {
    var ret = new InvitationLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};