/**
 * Created by xiaoyu on 2014/10/28.
 */
/**
 * Created by lujunyu on 14-1-24.
 */

var TYPE_UNION_QUIT = 0;
var TYPE_UNION_DISMISS = 1;
var TYPE_UNION_KICK = 2;    

var UnionTipsLabel = LazyLayer.extend({

    _cb: null,
    _spend: null,
    _frameLayer: null,
    _otherData: null,

    init: function (type, cb, otherData) {
        cc.log("UnionTipsLabel init");

        if (!this._super()) return false;

        this._cb = cb;
        this._otherData = otherData || {};

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        this._frameLayer = cc.Node.create();
        this._frameLayer.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(this._frameLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(550, 250));
        bgSprite.setPosition(cc.p(0, 0));
        this._frameLayer.addChild(bgSprite);

        var msgBgIcon = cc.Sprite.create(main_scene_image.icon175);
        msgBgIcon.setPosition(cc.p(0, 30));
        msgBgIcon.setScaleX(0.95);
        this._frameLayer.addChild(msgBgIcon);

        this._cancelItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon308,
            this._onClickCancel,
            this
        );
        this._cancelItem.setPosition(cc.p(120, -60));

        this._continueItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickContinue,
            this
        );
        this._continueItem.setPosition(cc.p(-120, -60));


        var menu = cc.Menu.create(this._cancelItem, this._continueItem);
        menu.setPosition(cc.p(0, 0));
        this._frameLayer.addChild(menu);

        this._initWithTipsType(type);

        return true;
    },

    _initWithTipsType: function (tipsType) {
        switch (tipsType) {
            case TYPE_UNION_QUIT:
                this._initUnionQuitTips();
                break;
            case TYPE_UNION_DISMISS:
                this._initUnionDismissTips();
                break;
            case TYPE_UNION_KICK:
                this._initUnionKickoutTips();
        }
    },

    _initUnionQuitTips: function () {
        cc.log("UnionTipsLabel _initUnionQuitTips");

        var tipLabel = cc.LabelTTF.create("你确定要退出公会么", "STHeitiTC-Medium", 25);
        tipLabel.setPosition(cc.p(0, 30));
        this._frameLayer.addChild(tipLabel);
    },

    _initUnionDismissTips: function () {
        cc.log("UnionTipsLabel _initUnionDismissTips");
        var tipLabel = cc.LabelTTF.create("你确定要解散公会么", "STHeitiTC-Medium", 25);
        tipLabel.setPosition(cc.p(0, 30));
        this._frameLayer.addChild(tipLabel);
    },

    _initUnionKickoutTips: function() {
        cc.log("UnionTipsLabel _initUnionDismissTips");
        var tipLabel = cc.LabelTTF.create("你确定要将辞退该玩家么", "STHeitiTC-Medium", 25);
        tipLabel.setPosition(cc.p(0, 30));
        this._frameLayer.addChild(tipLabel);
    },

    _onClickCancel: function () {
        cc.log("UnionTipsLabel _onClickCancel");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    },

    _onClickContinue: function () {
        cc.log("UnionTipsLabel _onClickContinue");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();

        if (this._cb) {
            this._cb();
        }
    }
});

UnionTipsLabel.create = function (type, cb, otherData) {
    cc.log("UnionTipsLabel create");

    var ref = new UnionTipsLabel();

    if (ref && ref.init(type, cb, otherData)) {
        return ref;
    }

    return null;
};

UnionTipsLabel.pop = function (type, cb, otherData) {
    cc.log("UnionTipsLabel pop");

    var unionTipsLabel = UnionTipsLabel.create(type, cb, otherData);
    MainScene.getInstance().getLayer().addChild(unionTipsLabel, 10);

};
