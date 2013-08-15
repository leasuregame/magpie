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
var TRAIN_TEN_COUNT = 2;

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
        cardItemBgSprite.setPosition(cc.p(360, 632));
        this.addChild(cardItemBgSprite);

        var helpBgSprite = cc.Sprite.create(main_scene_image.icon50);
        helpBgSprite.setPosition(cc.p(360, 380));
        this.addChild(helpBgSprite);

        var elixirIcon = cc.Sprite.create(main_scene_image.icon89);
        elixirIcon.setAnchorPoint(cc.p(500, 700));
        this.addChild(elixirIcon);

        this._elixirLabel = cc.LabelTTF.create("0", '黑体', 25);
        this._elixirLabel.setAnchorPoint(cc.p(0, 0.5));
        this._elixirLabel.setPosition(cc.p(520, 700));
        this.addChild(this._elixirLabel);

        this._resLabel = cc.Node.create();
        this._resLabel.setPosition(cc.p(202, 445));
        this.addChild(this._resLabel, 1);

        var resLabelBgSprite = cc.Sprite.create(main_scene_image.icon49);
        resLabelBgSprite.setAnchorPoint(cc.p(0, 0));
        this._resLabel.addChild(resLabelBgSprite);

        var resLabelIcon = cc.Sprite.create(main_scene_image.icon90);
        resLabelIcon.setPosition(cc.p(90, 70));
        this._resLabel.addChild(resLabelIcon);

        this._hpLabel = cc.LabelTTF.create("0", '黑体', 25);
        this._hpLabel.setAnchorPoint(cc.p(0, 0.5));
        this._hpLabel.setPosition(cc.p(110, 112));
        this._resLabel.addChild(this._hpLabel);

        this._hpAdditionLabel = cc.LabelTTF.create("+0", '黑体', 25);
        this._hpAdditionLabel.setAnchorPoint(cc.p(0, 0.5));
        this._hpAdditionLabel.setColor(cc.c3b(118, 238, 60));
        this._hpAdditionLabel.setPosition(cc.p(180, 112));
        this._resLabel.addChild(this._hpAdditionLabel);

        this._atkLabel = cc.LabelTTF.create("0", '黑体', 25);
        this._atkLabel.setAnchorPoint(cc.p(0, 0.5));
        this._atkLabel.setPosition(cc.p(110, 78));
        this._resLabel.addChild(this._atkLabel);

        this._atkAdditionLabel = cc.LabelTTF.create("+0", '黑体', 25);
        this._atkAdditionLabel.setAnchorPoint(cc.p(0, 0.5));
        this._atkAdditionLabel.setColor(cc.c3b(118, 238, 60));
        this._atkAdditionLabel.setPosition(cc.p(180, 78));
        this._resLabel.addChild(this._atkAdditionLabel);

        this._needElixirLabel = cc.LabelTTF.create("0", '黑体', 25);
        this._needElixirLabel.setAnchorPoint(cc.p(0, 0.5));
        this._needElixirLabel.setPosition(cc.p(110, 30));
        this._resLabel.addChild(this._needElixirLabel);

        this._tipLabel = cc.Sprite.create(main_scene_image.icon91);
        this._tipLabel.setPosition(cc.p(360, 380));
        this.addChild(this._tipLabel);

        this._helpLabel = cc.Sprite.create(main_scene_image.icon92);
        this._helpLabel.setPosition(cc.p(380, 380));
        this.addChild(this._helpLabel);

        var selectLeadCardItem = cc.MenuItemImage.create(
            main_scene_image.card_frame1,
            main_scene_image.card_frame_s,
            this._onClickSelectLeadCard,
            this
        );
        selectLeadCardItem.setPosition(cc.p(354, 685));

        this._upgradeItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            this._onClickTrain,
            this
        );
        this._upgradeItem.setPosition(cc.p(360, 270));

        this._trainHpItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            this._onClickStopUntilYellow,
            this
        );
        this._trainHpItem.setPosition(cc.p(80, 96));
        this.addChild(this._trainHpItem);

        this._trainAtkItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            this._onClickStopUntilYellow,
            this
        );
        this._trainAtkItem.setPosition(cc.p(80, 96));
        this.addChild(this._trainAtkItem);

        this._trainOneItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            this._onClickStopUntilYellow,
            this
        );
        this._trainOneItem.setPosition(cc.p(80, 96));
        this.addChild(this._trainOneItem);

        this._trainTenItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            this._onClickStopUntilYellow,
            this
        );
        this._trainTenItem.setPosition(cc.p(80, 96));
        this.addChild(this._trainTenItem);


        var menu = cc.Menu.create(
            selectLeadCardItem,
            this._upgradeItem,
            this._trainHpItem,
            this._trainAtkItem,
            this._trainOneItem,
            this._trainTenItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);


        this._selectLeadCardIcon = cc.Sprite.create(main_scene_image.icon51);
        this._selectLeadCardIcon.setPosition(cc.p(354, 685));
        this.addChild(this._selectLeadCardIcon);

        var upgradeIcon = cc.Sprite.create(main_scene_image.icon52);
        upgradeIcon.setPosition(cc.p(360, 270));
        this.addChild(upgradeIcon);

        return true;
    },

    update: function () {
        cc.log("CardTrainLabel update");


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

            that.getParent()._backToThisLayer();

            cc.log("this._leadCard :");
            cc.log(that._leadCard);
        }, {
            leadCard: this._leadCard
        });

        this.getParent()._switchToCardListLayer(cardListLayer);
    },

    _onClickTrain: function () {
        cc.log("CardTrainLabel _onClickTrain");

        var cardIdList = [];
        var len = this._retinueCard.length;
        for (var i = 0; i < len; ++i) {
            cardIdList.push(this._retinueCard[i].get("id"));
        }

        var dummyCard = lz.clone(this._leadCard);

        var that = this;
        this._leadCard.upgrade(function (data) {
            cc.log(data);

            that._retinueCard = [];
            that._upgrade(dummyCard, data.exp, data.money, len);
        }, cardIdList);
    },

    _onClickTrainHp: function () {
        cc.log("CardTrainLabel _onClickTrainHp");

        if (this._trainType == TRAIN_CARD_NULL) {
            this._trainType = TRAIN_CARD_HP;
            this._trainHpItem.setVisible(true);
        } else if (this._trainType == TRAIN_CARD_HP) {
            this._trainType = TRAIN_CARD_NULL;
            this._trainHpItem.setVisible(false);
        } else if (this._trainType == TRAIN_CARD_ATK) {
            this._trainType = TRAIN_CARD_HP;
            this._trainHpItem.setVisible(true);
            this._trainAtkItem.setVisible(false);
        }
    },

    _onClickTrainAtk: function () {
        cc.log("CardTrainLabel _onClickTrainAtk");

    },

    _onClickTrainOne: function () {
        cc.log("CardTrainLabel _onClickTrainOne");

    },

    _onClickTrainTen: function () {
        cc.log("CardTrainLabel _onClickTrainTen");

    }
})


CardTrainLabel.create = function () {
    var ret = new CardTrainLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}