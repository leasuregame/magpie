/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-13
 * Time: 下午5:00
 * To change this template use File | Settings | File Templates.
 */


/*
 * card train label
 * */


var TRAIN_CARD_NULL = 0;
var TRAIN_CARD_HP = 1;
var TRAIN_CARD_ATK = 2;

var TRAIN_ZERO_COUNT = 0;
var TRAIN_ONE_COUNT = 1;
var TRAIN_TEN_COUNT = 10;

var CardTrainLabel = cc.Layer.extend({
    _trainType: TRAIN_CARD_NULL,
    _trainCount: TRAIN_ZERO_COUNT,

    onEnter: function () {
        cc.log("CardTrainLabel onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("CardTrainLabel init");

        if (!this._super()) return false;

        var cardItemBgSprite = cc.Sprite.create(main_scene_image.icon88);
        cardItemBgSprite.setPosition(cc.p(364, 613));
        this.addChild(cardItemBgSprite);

        var elixirIcon = cc.LabelTTF.create("仙丹:", "STHeitiTC-Medium", 20);
        elixirIcon.setColor(cc.c3b(255, 239, 131));
        elixirIcon.setAnchorPoint(cc.p(0, 0.5));
        elixirIcon.setPosition(cc.p(510, 755));
        this.addChild(elixirIcon);

        this._elixirLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 20);
        this._elixirLabel.setColor(cc.c3b(255, 248, 69));
        this._elixirLabel.setAnchorPoint(cc.p(0, 0.5));
        this._elixirLabel.setPosition(cc.p(605, 753));
        this.addChild(this._elixirLabel);

        var needElixirIcon = cc.LabelTTF.create("消耗仙丹:", "STHeitiTC-Medium", 20);
        needElixirIcon.setColor(cc.c3b(255, 239, 131));
        needElixirIcon.setAnchorPoint(cc.p(0, 0.5));
        needElixirIcon.setPosition(cc.p(510, 724));
        this.addChild(needElixirIcon);

        this._needElixirLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 20);
        this._needElixirLabel.setColor(cc.c3b(255, 248, 69));
        this._needElixirLabel.setAnchorPoint(cc.p(0, 0.5));
        this._needElixirLabel.setPosition(cc.p(605, 722));
        this.addChild(this._needElixirLabel);

        this._resLabel = cc.Node.create();
        this._resLabel.setPosition(cc.p(360, 510));
        this.addChild(this._resLabel);

        var resLabelBgSprite = cc.Sprite.create(main_scene_image.icon49);
        this._resLabel.addChild(resLabelBgSprite);

        this._nameLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 25);
        this._nameLabel.setColor(cc.c3b(255, 239, 131));
        this._nameLabel.setPosition(cc.p(0, 40));
        this._resLabel.addChild(this._nameLabel);

        var hpIcon = cc.LabelTTF.create("生命:", "STHeitiTC-Medium", 22);
        hpIcon.setColor(cc.c3b(255, 239, 131));
        hpIcon.setPosition(cc.p(-85, 2));
        this._resLabel.addChild(hpIcon);

        this._hpLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._hpLabel.setColor(cc.c3b(255, 239, 131));
        this._hpLabel.setPosition(cc.p(0, 0));
        this._resLabel.addChild(this._hpLabel);

        this._hpAdditionLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._hpAdditionLabel.setColor(cc.c3b(118, 238, 60));
        this._hpAdditionLabel.setPosition(cc.p(85, 0));
        this._resLabel.addChild(this._hpAdditionLabel);

        var atkIcon = cc.LabelTTF.create("攻击:", "STHeitiTC-Medium", 22);
        atkIcon.setColor(cc.c3b(255, 239, 131));
        atkIcon.setPosition(cc.p(-85, -33));
        this._resLabel.addChild(atkIcon);

        this._atkLabel = cc.LabelTTF.create("0%", "STHeitiTC-Medium", 22);
        this._atkLabel.setColor(cc.c3b(255, 239, 131));
        this._atkLabel.setPosition(cc.p(0, -35));
        this._resLabel.addChild(this._atkLabel);

        this._atkAdditionLabel = cc.LabelTTF.create("0%", "STHeitiTC-Medium", 22);
        this._atkAdditionLabel.setColor(cc.c3b(118, 238, 60));
        this._atkAdditionLabel.setPosition(cc.p(85, -35));
        this._resLabel.addChild(this._atkAdditionLabel);


        this._tipLabel = cc.Node.create();
        this._tipLabel.setPosition(cc.p(360, 380));
        this.addChild(this._tipLabel);

        var tipLabelBgSprite = cc.Sprite.create(main_scene_image.icon50);
        tipLabelBgSprite.setPosition(cc.p(0, 0));
        this._tipLabel.addChild(tipLabelBgSprite);

        var tipLabel = cc.LabelTTF.create("每消耗 10 点仙丹可提升 1 点攻击或 2 点生命", "STHeitiTC-Medium", 22);
        tipLabel.setColor(cc.c3b(255, 239, 131));
        tipLabel.setPosition(cc.p(0, 0));
        this._tipLabel.addChild(tipLabel);


        this._helpLabel = cc.Node.create();
        this._helpLabel.setPosition(cc.p(360, 380));
        this.addChild(this._helpLabel);

        var trainTypeLabel = cc.Sprite.create(main_scene_image.icon50);
        trainTypeLabel.setScaleY(0.4);
        trainTypeLabel.setPosition(cc.p(0, 25));
        this._helpLabel.addChild(trainTypeLabel);

        var trainCountLabel = cc.Sprite.create(main_scene_image.icon50);
        trainCountLabel.setScaleY(0.4);
        trainCountLabel.setPosition(cc.p(0, -25));
        this._helpLabel.addChild(trainCountLabel);

        var trainHpIcon = cc.LabelTTF.create("培养生命", "STHeitiTC-Medium", 22);
        trainHpIcon.setColor(cc.c3b(255, 239, 131));
        trainHpIcon.setAnchorPoint(cc.p(0, 0.5));
        trainHpIcon.setPosition(cc.p(-130, 25));
        this._helpLabel.addChild(trainHpIcon);

        var trainAtkIcon = cc.LabelTTF.create("培养攻击", "STHeitiTC-Medium", 22);
        trainAtkIcon.setColor(cc.c3b(255, 239, 131));
        trainAtkIcon.setAnchorPoint(cc.p(0, 0.5));
        trainAtkIcon.setPosition(cc.p(110, 25));
        this._helpLabel.addChild(trainAtkIcon);

        var trainOneIcon = cc.LabelTTF.create("培养 1 次", "STHeitiTC-Medium", 22);
        trainOneIcon.setColor(cc.c3b(255, 239, 131));
        trainOneIcon.setAnchorPoint(cc.p(0, 0.5));
        trainOneIcon.setPosition(cc.p(-130, -25));
        this._helpLabel.addChild(trainOneIcon);

        var trainTenIcon = cc.LabelTTF.create("培养 10 次", "STHeitiTC-Medium", 22);
        trainTenIcon.setColor(cc.c3b(255, 239, 131));
        trainTenIcon.setAnchorPoint(cc.p(0, 0.5));
        trainTenIcon.setPosition(cc.p(110, -25));
        this._helpLabel.addChild(trainTenIcon);

        this._trainHpItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            main_scene_image.button25d,
            this._onClickTrainHp,
            this
        );
        this._trainHpItem.setPosition(cc.p(-160, 25));

        this._trainAtkItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            main_scene_image.button25d,
            this._onClickTrainAtk,
            this
        );
        this._trainAtkItem.setPosition(cc.p(80, 25));

        this._trainOneItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            main_scene_image.button25d,
            this._onClickTrainOne,
            this
        );
        this._trainOneItem.setPosition(cc.p(-160, -25));

        this._trainTenItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            main_scene_image.button25d,
            this._onClickTrainTen,
            this
        );
        this._trainTenItem.setPosition(cc.p(80, -25));

        var helpMenu = cc.Menu.create(
            this._trainHpItem,
            this._trainAtkItem,
            this._trainOneItem,
            this._trainTenItem
        );
        helpMenu.setPosition(cc.p(0, 0));
        this._helpLabel.addChild(helpMenu);


        var selectLeadCardItem = cc.MenuItemImage.create(
            main_scene_image.card_frame1,
            main_scene_image.card_frame_s,
            this._onClickSelectLeadCard,
            this
        );
        selectLeadCardItem.setScale(1.1);
        selectLeadCardItem.setPosition(cc.p(360, 685));

        this._trainItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon89,
            this._onClickTrain,
            this
        );
        this._trainItem.setPosition(cc.p(360, 270));


        var menu = cc.Menu.create(selectLeadCardItem, this._trainItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._selectLeadCardIcon = cc.Sprite.create(main_scene_image.icon51);
        this._selectLeadCardIcon.setPosition(cc.p(360, 685));
        this.addChild(this._selectLeadCardIcon);

        return true;
    },

    update: function () {
        cc.log("CardTrainLabel update");

        var elixir = gameData.player.get("elixir");
        var needElixir = this._trainCount * 10;

        this._elixirLabel.setString(elixir);
        this._needElixirLabel.setString(needElixir);

        if (elixir < needElixir) {
            this._needElixirLabel.setColor(cc.c3b(255, 40, 40));
        } else {
            this._needElixirLabel.setColor(cc.c3b(255, 248, 69));
        }

        if (this._leadCardHalfNode != null) {
            this._leadCardHalfNode.removeFromParent();
            this._leadCardHalfNode = null;
        }

        if (this._leadCard == null) {
            this._resLabel.setVisible(false);
            this._tipLabel.setVisible(true);
            this._helpLabel.setVisible(false);

            this._selectLeadCardIcon.runAction(
                cc.RepeatForever.create(
                    cc.Sequence.create(
                        cc.FadeOut.create(1),
                        cc.FadeIn.create(1)
                    )
                )
            );

            this._trainItem.setEnabled(false);
        } else {
            this._leadCardHalfNode = CardHalfNode.create(this._leadCard);
            this._leadCardHalfNode.setScale(1.1);
            this._leadCardHalfNode.setPosition(cc.p(360, 685));
            this.addChild(this._leadCardHalfNode, 1);

            this._resLabel.setVisible(true);
            this._nameLabel.setString(this._leadCard.get("name"));
            this._hpLabel.setString(this._leadCard.get("hp"));
            this._atkLabel.setString(this._leadCard.get("atk"));

            if (this._trainType != TRAIN_CARD_NULL && this._trainCount != TRAIN_ZERO_COUNT) {
                if (this._trainType == TRAIN_CARD_HP) {
                    this._hpAdditionLabel.setString("+ " + (this._trainCount * 3));
                    this._atkAdditionLabel.setString("+ 0");

                    this._hpAdditionLabel.setVisible(true);
                    this._atkAdditionLabel.setVisible(false);
                } else if (this._trainType == TRAIN_CARD_ATK) {
                    this._hpAdditionLabel.setString("+ 0");
                    this._atkAdditionLabel.setString("+ " + this._trainCount);

                    this._hpAdditionLabel.setVisible(false);
                    this._atkAdditionLabel.setVisible(true);
                }
            } else {
                this._hpAdditionLabel.setVisible(false);
                this._atkAdditionLabel.setVisible(false);
                this._trainItem.setEnabled(false);
            }

            this._trainItem.setEnabled(true);
            this._tipLabel.setVisible(false);
            this._helpLabel.setVisible(true);
        }
    },

    _onClickSelectLeadCard: function () {
        cc.log("CardTrainLabel _onClickSelectLeadCard");

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_CARD_UPGRADE_MASTER, function (data) {
            cc.log(data);

            if (data) {
                that._leadCard = data[0] || null;
                that._retinueCard = [];
            }

            that.getParent().backToThisLayer();

            cc.log("this._leadCard :");
            cc.log(that._leadCard);
        }, {
            leadCard: this._leadCard
        });

        this.getParent().switchToCardListLayer(cardListLayer);
    },

    _onClickTrain: function () {
        cc.log("CardTrainLabel _onClickTrain");

        if (this._trainType == TRAIN_CARD_NULL) {
            TipLayer.tip("请选择培养类型");
            return;
        }

        if (this._trainCount == TRAIN_ZERO_COUNT) {
            TipLayer.tip("请选择培养次数");
            return;
        }

        var elixir = gameData.player.get("elixir");
        var needElixir = this._trainCount * 10;

        if (elixir < needElixir) {
            TipLayer.tip("仙丹不足");
            return;
        }

        var that = this;
        this._leadCard.train(function (data) {
            cc.log(data);

            that.update();
        }, this._trainCount, this._trainType);
    },

    _onClickTrainHp: function () {
        cc.log("CardTrainLabel _onClickTrainHp");

        this._trainType = TRAIN_CARD_HP;
        this._trainHpItem.setEnabled(false);
        this._trainAtkItem.setEnabled(true);

        this.update();
    },

    _onClickTrainAtk: function () {
        cc.log("CardTrainLabel _onClickTrainAtk");

        this._trainType = TRAIN_CARD_ATK;
        this._trainHpItem.setEnabled(true);
        this._trainAtkItem.setEnabled(false);

        this.update();
    },

    _onClickTrainOne: function () {
        cc.log("CardTrainLabel _onClickTrainOne");

        this._trainCount = TRAIN_ONE_COUNT;
        this._trainOneItem.setEnabled(false);
        this._trainTenItem.setEnabled(true);

        this.update();
    },

    _onClickTrainTen: function () {
        cc.log("CardTrainLabel _onClickTrainTen");

        this._trainCount = TRAIN_TEN_COUNT;
        this._trainOneItem.setEnabled(true);
        this._trainTenItem.setEnabled(false);

        this.update();
    }
});


CardTrainLabel.create = function () {
    var ret = new CardTrainLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};