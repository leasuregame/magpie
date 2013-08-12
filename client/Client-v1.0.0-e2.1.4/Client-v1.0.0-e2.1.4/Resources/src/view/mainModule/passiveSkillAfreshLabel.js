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


var USE_NULL = 0;
var USE_MONEY = 1;
var USE_GOLD = 2;

var PassiveSkillAfreshLabel = cc.Layer.extend({
    _leadCard: null,
    _leadCardHeadNode: null,
    _nameLabel: null,
    _lvLabel: null,

    _useMoneyIcon: null,
    _useGoldIcon: null,
    _useType: USE_NULL,

    _passiveSkill: {},
    _passiveSkillList: [],

    _passiveSkillNameTexture: {},


    onEnter: function () {
        cc.log("PassiveSkillAfreshLabel onEnter");

        this._super();
        this.update();
    },


    init: function () {
        cc.log("PassiveSkillAfreshLabel init");

        if (!this._super()) return false;

        this._passiveSkillNameTexture = {
            atk_improve: cc.TextureCache.getInstance().addImage(main_scene_image.icon77),
            hp_improve: cc.TextureCache.getInstance().addImage(main_scene_image.icon76),
            crit: cc.TextureCache.getInstance().addImage(main_scene_image.icon78),
            dodge: cc.TextureCache.getInstance().addImage(main_scene_image.icon79),
            atk_reduce: cc.TextureCache.getInstance().addImage(main_scene_image.icon80)
        };

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

        var resMenu = cc.Menu.create();
        resMenu.setPosition(cc.p(0, 0));
        this._resLabel.addChild(resMenu);

        for (var i = 0; i < 3; ++i) {
            var nameLabel = cc.Sprite.create();
            nameLabel.setPosition(cc.p(100, (3 - i) * 100));
            this._resLabel.addChild(nameLabel);
//            nameLabel.setVisible(false);
            nameLabel.setTexture(this._passiveSkillNameTexture.atk_improve)


            var valueLabel = cc.LabelTTF.create("+ 5%", 'Times New Roman', 35);
            valueLabel.setPosition(cc.p(200, (3 - i) * 100));
            this._resLabel.addChild(valueLabel);
//            valueLabel.setVisible(false);

            var lockItem = cc.MenuItemImage.create(
                main_scene_image.button24,
                main_scene_image.button24s,
                this._onClickLock(i),
                this
            );
            lockItem.setPosition(cc.p(350, (3 - i) * 100));
            resMenu.addChild(lockItem);

            this._passiveSkillList[i] = {
                id: 0,
                nameLabel: nameLabel,
                valueLabel: valueLabel,
                lockItem: lockItem,
                isLock: false
            }
        }

        var useMoneyItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            this._onClickUseMoney,
            this
        );
        useMoneyItem.setPosition(cc.p(80, 100));
        resMenu.addChild(useMoneyItem);

        var useGoldItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            this._onClickUseGold,
            this
        );
        useGoldItem.setPosition(cc.p(290, 100));
        resMenu.addChild(useGoldItem);

        this._useMoneyIcon = cc.Sprite.create(main_scene_image.icon75);
        this._useMoneyIcon.setPosition(cc.p(100, 100));
        this._resLabel.addChild(this._useMoneyIcon);
        this._useMoneyIcon.setVisible(false);

        this._useGoldIcon = cc.Sprite.create(main_scene_image.icon75);
        this._useGoldIcon.setPosition(cc.p(300, 100));
        this._resLabel.addChild(this._useGoldIcon);
        this._useGoldIcon.setVisible(false);

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
        cc.log("PassiveSkillAfreshLabel update");

        if (this._leadCard == null) {
            this._nameLabel.setString("");
            this._nameLabel.setVisible(false);

            this._lvLabel.setString("LV: ");
            this._lvLabel.setVisible(false);
        } else {

        }
    },

    _clearPassiveSkill: function () {
        cc.log("PassiveSkillAfreshLabel _clearPassiveSkill");
    },

    _onClickSelectLeadCard: function () {
        cc.log("PassiveSkillAfreshLabel _onClickSelectLeadCard");

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

    _onClickLock: function (index) {
        return function () {
            cc.log("PassiveSkillAfreshLabel _onClickLock: " + index);
        }
    },

    _onClickUseMoney: function () {
        cc.log("PassiveSkillAfreshLabel _onClickUseMoney");

        if (this._useType == USE_NULL) {
            this._useType = USE_MONEY;
            this._useMoneyIcon.setVisible(true);
        } else if (this._useType == USE_MONEY) {
            this._useType = USE_NULL;
            this._useMoneyIcon.setVisible(false);
        } else if (this._useType == USE_GOLD) {
            this._useType = USE_MONEY;
            this._useMoneyIcon.setVisible(true);
            this._useGoldIcon.setVisible(false);
        }
    },

    _onClickUseGold: function () {
        cc.log("PassiveSkillAfreshLabel _onClickUseGold");

        if (this._useType == USE_NULL) {
            this._useType = USE_GOLD;
            this._useGoldIcon.setVisible(true);
        } else if (this._useType == USE_MONEY) {
            this._useType = USE_GOLD;
            this._useMoneyIcon.setVisible(false);
            this._useGoldIcon.setVisible(true);
        } else if (this._useType == USE_GOLD) {
            this._useType = USE_NULL;
            this._useGoldIcon.setVisible(false);
        }
    },

    _onClickAfresh: function () {
        cc.log("PassiveSkillAfreshLabel _onClickAfresh");

        var that = this;
        this._leadCard.upgradeSkill(function (data) {
            that.update();
        });
    },

    _onClickRepeatAfresh: function () {
        cc.log("PassiveSkillAfreshLabel _onClickRepeatAfresh");
    },

    _onClickStart: function () {
        cc.log("PassiveSkillAfreshLabel _onClickStart");
    },

    _onClickCancel: function () {
        cc.log("PassiveSkillAfreshLabel _onClickCancel");
    },

    _onClickStop: function () {
        cc.log("PassiveSkillAfreshLabel _onClickStop");
    }
})


PassiveSkillAfreshLabel.create = function () {
    var ret = new PassiveSkillAfreshLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}