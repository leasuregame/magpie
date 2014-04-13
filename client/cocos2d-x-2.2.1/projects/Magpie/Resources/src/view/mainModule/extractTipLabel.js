/**
 * Created by lujunyu on 14-2-12.
 */

var ExtractTipLabel = LazyLayer.extend({

    _cb: null,

    init: function (args) {
        cc.log("ExtractTipLabel init");

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
        msgBgIcon.setScaleX(0.9);
        node.addChild(msgBgIcon);

        var needGold = outputTables.values.rows["extractConsumeGold"].value;
        var tipLabel1 = cc.LabelTTF.create("是否确定花费" + needGold, "STHeitiTC-Medium", 25);
        tipLabel1.setPosition(cc.p(-80, 50));
        node.addChild(tipLabel1);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setScale(0.7);
        goldIcon.setPosition(cc.p(35, 50));
        node.addChild(goldIcon);

        var tips = (args.type == EXTRACT_ELIXIR) ? " 提取仙丹?" : " 提取技能点?";

        var tipLabel2 = cc.LabelTTF.create(tips, "STHeitiTC-Medium", 25);
        tipLabel2.setAnchorPoint(cc.p(0, 0.5));
        tipLabel2.setPosition(cc.p(50, 50));
        node.addChild(tipLabel2);

        var gotLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 22);
        gotLabel.setPosition(cc.p(0, 15));
        node.addChild(gotLabel);

        if (args.type == EXTRACT_ELIXIR) {
            gotLabel.setString("当前可提取: " + args.num + " 点仙丹");
        } else {
            gotLabel.setString("当前可提取: " + args.num + " 技能点");
        }

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
        cc.log("ExtractTipLabel _onClickCancel");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this.removeFromParent();
    },

    _onClickOK: function () {
        cc.log("ExtractTipLabel _onClickContinue");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this.removeFromParent();

        var needGold = outputTables.values.rows["extractConsumeGold"].value;
        if (gameData.player.get("gold") < needGold) {
            TipLayer.tip("魔石不足");
            return;
        }

        if (this._cb) {
            this._cb();
        }

    }

});

ExtractTipLabel.create = function (args) {
    cc.log("ExtractTipLabel create");

    var ref = new ExtractTipLabel();

    if (ref && ref.init(args)) {
        return ref;
    }

    return null;
};

ExtractTipLabel.pop = function (args) {
    cc.log("ExtractTipLabel pop");

    var extractTipLabel = ExtractTipLabel.create(args);

    MainScene.getInstance().getLayer().addChild(extractTipLabel, 10);
};
