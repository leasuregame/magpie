/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-7
 * Time: 上午10:25
 * To change this template use File | Settings | File Templates.
 */


/*
 * passive skill upgrade label
 * */


var SELECT_NULL = 0;
var SELECT_MONEY = 1;
var SELECT_GOLD = 2;

var PassiveSkillUpgradeLabel = cc.Layer.extend({
    _leadCard: null,
    _leadCardHeadNode: null,
    _cardNameLabel: null,
    _cardLvLabel: null,

    _useMoneyItem: null,
    _useGoldItem: null,


    _selectType: SELECT_NULL,


    onEnter: function () {
        cc.log("PassiveSkillUpgradeLabel onEnter");

        this._super();
        this.update();
    },


    init: function () {
        cc.log("PassiveSkillUpgradeLabel init");

        if (!this._super()) return false;

        var cardItemBgSprite = cc.Sprite.create(main_scene_image.icon68);
        cardItemBgSprite.setPosition(cc.p(328, 725));
        this.addChild(cardItemBgSprite);

        this._resLabel = cc.Node.create();
        this._resLabel.setAnchorPoint(cc.p(0, 0));
        this._resLabel.setPosition(cc.p(137, 300));
        this.addChild(this._resLabel, 1);

        var resLabelBgSprite = cc.Sprite.create(main_scene_image.icon66);
        resLabelBgSprite.setAnchorPoint(cc.p(0, 0));
        this._resLabel.addChild(resLabelBgSprite);

        var resLabelIcon = cc.Sprite.create(main_scene_image.icon67);
        resLabelIcon.setAnchorPoint(cc.p(0, 0));
        this._resLabel.addChild(resLabelIcon);

//        this._skillNameLabel = cc.LabelTTF.create("xxxx", 'Times New Roman', 40);
//        this._skillNameLabel.setPosition(cc.p(158, 120));
//        this._resLabel.addChild(this._skillNameLabel);
//
//        this._skillLvLabel = cc.LabelTTF.create("0", 'Times New Roman', 25);
//        this._skillLvLabel.setPosition(cc.p(125, 85));
//        this._resLabel.addChild(this._skillLvLabel);
//
//        this._nextSkillLvLabel = cc.LabelTTF.create("0", 'Times New Roman', 25);
//        this._nextSkillLvLabel.setColor(cc.c3b(118, 238, 60));
//        this._nextSkillLvLabel.setPosition(cc.p(190, 85));
//        this._resLabel.addChild(this._nextSkillLvLabel);
//
//        this._skillHarmLabel = cc.LabelTTF.create("0%", 'Times New Roman', 25);
//        this._skillHarmLabel.setPosition(cc.p(115, 30));
//        this._resLabel.addChild(this._skillHarmLabel);
//
//        this._nextSkillHarmLabel = cc.LabelTTF.create("0%", 'Times New Roman', 25);
//        this._nextSkillHarmLabel.setColor(cc.c3b(118, 238, 60));
//        this._nextSkillHarmLabel.setPosition(cc.p(200, 30));
//        this._resLabel.addChild(this._nextSkillHarmLabel);

//        this._arrowLabel1 = cc.Sprite.create(main_scene_image.icon63);
//        this._arrowLabel1.setPosition(cc.p(158, 85));
//        this._resLabel.addChild(this._arrowLabel1);
//
//        this._arrowLabel2 = cc.Sprite.create(main_scene_image.icon63);
//        this._arrowLabel2.setPosition(cc.p(158, 30));
//        this._resLabel.addChild(this._arrowLabel2);

//        this._tipLabel = cc.Sprite.create(main_scene_image.icon65);
//        this._tipLabel.setPosition(cc.p(360, 380));
//        this.addChild(this._tipLabel);

//        this._helpLabel = cc.Sprite.create(main_scene_image.icon64);
//        this._helpLabel.setPosition(cc.p(320, 380));
//        this.addChild(this._helpLabel);

        var selectLeadCardItem = cc.MenuItemImage.create(
            main_scene_image.card_item_bg1,
            main_scene_image.card_item_bg_s,
            this._onClickSelectLeadCard,
            this
        );
        selectLeadCardItem.setPosition(cc.p(191, 724));

        this._upgradeItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            this._onClickUpgrade,
            this
        );
        this._upgradeItem.setPosition(cc.p(360, 270));


        var menu = cc.Menu.create(selectLeadCardItem, this._upgradeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

//        this._skillPointLabel = cc.LabelTTF.create("0", 'Times New Roman', 25);
//        this._skillPointLabel.setAnchorPoint(cc.p(0, 0.5));
//        this._skillPointLabel.setPosition(cc.p(243, 382));
//        this.addChild(this._skillPointLabel);
//
//        this._needSkillPointLabel = cc.LabelTTF.create("0", 'Times New Roman', 25);
//        this._needSkillPointLabel.setAnchorPoint(cc.p(0, 0.5));
//        this._needSkillPointLabel.setPosition(cc.p(512, 382));
//        this.addChild(this._needSkillPointLabel);

        var selectLeadCardIcon = cc.Sprite.create(main_scene_image.icon11);
        selectLeadCardIcon.setPosition(cc.p(188, 727));
        this.addChild(selectLeadCardIcon);

        var selectLeadCardIconAction = cc.Sequence.create(
            cc.FadeOut.create(1),
            cc.FadeIn.create(1)
        );

        selectLeadCardIcon.runAction(cc.RepeatForever.create(selectLeadCardIconAction));

        var upgradeIcon = cc.Sprite.create(main_scene_image.icon52);
        upgradeIcon.setPosition(cc.p(360, 270));
        this.addChild(upgradeIcon);

        return true;
    },

    update: function () {
        cc.log("PassiveSkillUpgradeLabel update");


    },

    _onClickLock: function(id) {
        return function() {
            cc.log("PassiveSkillUpgradeLabel _onClickLock: " + id);


        };
    },

    _onClickSelectLeadCard: function () {
        cc.log("SkillUpgradeLabel _onClickSelectLeadCard");

        var selectList = this._leadCard ? [this._leadCard.get("id")] : null;

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_MASTER, null, selectList, function (data) {
            cc.log(data);

            if (data) {
                that._leadCard = data[0] || null;
            }

            that.getParent()._backToThisLayer();

            cc.log("this._leadCard :");
            cc.log(that._leadCard);
        });

        this.getParent()._switchToCardListLayer(cardListLayer);
    },

    _onClickUpgrade: function () {
        cc.log("SkillUpgradeLabel _onClickUpgrade");

        var that = this;
        this._leadCard.upgradeSkill(function (data) {
            that.update();
        });
    }
})


PassiveSkillUpgradeLabel.create = function () {
    var ret = new PassiveSkillUpgradeLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}