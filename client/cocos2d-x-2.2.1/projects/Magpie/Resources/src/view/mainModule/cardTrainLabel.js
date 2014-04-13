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


var TRAIN_CARD_NULL = -1;
var TRAIN_CARD_HP = 0;
var TRAIN_CARD_ATK = 1;

var TRAIN_ZERO_COUNT = 0;
var TRAIN_ONE_COUNT = 1;
var TRAIN_TEN_COUNT = 10;

var CardTrainLabel = cc.Layer.extend({
    _cardTrainLabelFit: null,

    _trainType: TRAIN_CARD_NULL,
    _trainCount: TRAIN_ZERO_COUNT,
    _showTrain: false,
    _effect: null,

    onEnter: function () {
        cc.log("CardTrainLabel onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("卡牌培养界面");
    },

    onExit: function () {
        cc.log("CardTrainLabel onExit");

        this._super();

        lz.um.endLogPageView("卡牌培养界面");
    },

    init: function () {
        cc.log("CardTrainLabel init");

        if (!this._super()) return false;

        this._cardTrainLabelFit = gameFit.mainScene.cardTrainLabel;

        var cardItemBgSprite = cc.Sprite.create(main_scene_image.icon88);
        cardItemBgSprite.setPosition(this._cardTrainLabelFit.cardItemBgSpritePoint);
        this.addChild(cardItemBgSprite);

        var elixirIcon = cc.Sprite.create(main_scene_image.icon151);
        elixirIcon.setPosition(this._cardTrainLabelFit.elixirIconPoint);
        this.addChild(elixirIcon);

        var elixirIconLabel = cc.LabelTTF.create("仙丹:", "STHeitiTC-Medium", 20);
        elixirIconLabel.setColor(cc.c3b(255, 239, 131));
        elixirIconLabel.setAnchorPoint(cc.p(0, 0.5));
        elixirIconLabel.setPosition(this._cardTrainLabelFit.elixirIconLabelPoint);
        this.addChild(elixirIconLabel);

        this._elixirLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 20);
        this._elixirLabel.setAnchorPoint(cc.p(0, 0.5));
        this._elixirLabel.setPosition(this._cardTrainLabelFit.elixirLabelPoint);
        this.addChild(this._elixirLabel);

        var needElixirIcon = cc.Sprite.create(main_scene_image.icon151);
        needElixirIcon.setPosition(this._cardTrainLabelFit.needElixirIconPoint);
        this.addChild(needElixirIcon);

        var needElixirIconLabel = cc.LabelTTF.create("消耗:", "STHeitiTC-Medium", 20);
        needElixirIconLabel.setColor(cc.c3b(255, 239, 131));
        needElixirIconLabel.setAnchorPoint(cc.p(0, 0.5));
        needElixirIconLabel.setPosition(this._cardTrainLabelFit.needElixirIconLabelPoint);
        this.addChild(needElixirIconLabel);

        this._needElixirLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 20);
        this._needElixirLabel.setAnchorPoint(cc.p(0, 0.5));
        this._needElixirLabel.setPosition(this._cardTrainLabelFit.needElixirLabelPoint);
        this.addChild(this._needElixirLabel);

        this._resLabel = cc.Node.create();
        this._resLabel.setPosition(this._cardTrainLabelFit.resLabelPoint);
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

        this._atkLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 22);
        this._atkLabel.setPosition(cc.p(0, -35));
        this._resLabel.addChild(this._atkLabel);

        this._atkAdditionLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 22);
        this._atkAdditionLabel.setColor(cc.c3b(118, 238, 60));
        this._atkAdditionLabel.setPosition(cc.p(85, -35));
        this._resLabel.addChild(this._atkAdditionLabel);


        this._tipLabel = cc.Node.create();
        this._tipLabel.setPosition(this._cardTrainLabelFit.tipLabelPoint);
        this.addChild(this._tipLabel);

        var tipLabelBgSprite = cc.Sprite.create(main_scene_image.icon50);
        tipLabelBgSprite.setPosition(cc.p(0, 0));
        this._tipLabel.addChild(tipLabelBgSprite);

        var tipLabel1 = cc.LabelTTF.create("每消耗 20 点仙丹可提升 1 点攻击或 2 点生命", "STHeitiTC-Medium", 22);
        tipLabel1.setPosition(cc.p(0, 20));
        this._tipLabel.addChild(tipLabel1);

        var tipLabel2 = cc.LabelTTF.create("仙丹通过竞技场产出", "STHeitiTC-Medium", 22);
        tipLabel2.setPosition(cc.p(0, -20));
        this._tipLabel.addChild(tipLabel2);

        this._helpLabel = cc.Node.create();
        this._helpLabel.setPosition(this._cardTrainLabelFit.helpLabelPoint);
        this.addChild(this._helpLabel);

        var trainTypeLabel = cc.Sprite.create(main_scene_image.icon309);
        trainTypeLabel.setPosition(cc.p(0, 25));
        this._helpLabel.addChild(trainTypeLabel);

        var trainCountLabel = cc.Sprite.create(main_scene_image.icon309);
        trainCountLabel.setPosition(cc.p(0, -35));
        this._helpLabel.addChild(trainCountLabel);

        this._trainHpItem = cc.MenuItemImage.create(
            main_scene_image.button62,
            main_scene_image.button62,
            main_scene_image.button62s,
            this._onClickTrainHp,
            this
        );
        this._trainHpItem.setPosition(cc.p(-120, 25));

        this._trainAtkItem = cc.MenuItemImage.create(
            main_scene_image.button63,
            main_scene_image.button63,
            main_scene_image.button63s,
            this._onClickTrainAtk,
            this
        );
        this._trainAtkItem.setPosition(cc.p(110, 25));

        this._trainOneItem = cc.MenuItemImage.create(
            main_scene_image.button64,
            main_scene_image.button64,
            main_scene_image.button64s,
            this._onClickTrainOne,
            this
        );
        this._trainOneItem.setPosition(cc.p(-128, -35));

        this._trainTenItem = cc.MenuItemImage.create(
            main_scene_image.button65,
            main_scene_image.button65,
            main_scene_image.button65s,
            this._onClickTrainTen,
            this
        );
        this._trainTenItem.setPosition(cc.p(110, -35));

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
        selectLeadCardItem.setPosition(this._cardTrainLabelFit.selectLeadCardItemPoint);

        this._trainItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon89,
            this._onClickTrain,
            this
        );
        this._trainItem.setPosition(this._cardTrainLabelFit.trainItemPoint);

        this._extractItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button11,
            main_scene_image.button11s,
            main_scene_image.button9d,
            main_scene_image.icon368,
            this._onClickExtract,
            this
        );

        this._extractItem.setPosition(this._cardTrainLabelFit.extractItemPoint);

        var helpItem = cc.MenuItemImage.create(
            main_scene_image.button41,
            main_scene_image.button41s,
            this._onClickHelp,
            this
        );
        helpItem.setPosition(this._cardTrainLabelFit.helpItemPoint);

        var menu = cc.Menu.create(selectLeadCardItem, this._trainItem, this._extractItem, helpItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._selectLeadCardIcon = cc.Sprite.create(main_scene_image.icon51);
        this._selectLeadCardIcon.setPosition(this._cardTrainLabelFit.selectLeadCardIconPoint);
        this.addChild(this._selectLeadCardIcon);

        return true;
    },

    update: function () {
        cc.log("CardTrainLabel update");

        var elixir = gameData.player.get("elixir");
        var needElixir = this._trainCount * 20;

        this._elixirLabel.setString(elixir);
        this._needElixirLabel.setString(needElixir);

        if (elixir < needElixir) {
            this._needElixirLabel.setColor(cc.c3b(255, 40, 40));
        } else {
            this._needElixirLabel.setColor(cc.c3b(255, 255, 255));
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
            this._extractItem.setEnabled(false);
        } else {
            this._leadCardHalfNode = CardHalfNode.create(this._leadCard);
            this._leadCardHalfNode.setScale(1.1);
            this._leadCardHalfNode.setPosition(this._cardTrainLabelFit.leadCardHalfNodePoint);
            this.addChild(this._leadCardHalfNode, 1);

            this._resLabel.setVisible(true);
            this._nameLabel.setString(this._leadCard.get("name"));
            this._hpLabel.setString(this._leadCard.get("hp"));
            this._atkLabel.setString(this._leadCard.get("atk"));

            if (this._showTrain) {
                this._showTrain = false;
                var moveByAction = cc.Sequence.create(
                    cc.MoveBy.create(0.1, cc.p(5, 0)),
                    cc.MoveBy.create(0.1, cc.p(-5, 0)),
                    cc.MoveBy.create(0.1, cc.p(5, 0)),
                    cc.MoveBy.create(0.1, cc.p(-5, 0))
                );
                var scaleToAction = cc.Sequence.create(
                    cc.ScaleTo.create(0.1, 1.5),
                    cc.ScaleTo.create(0.1, 1),
                    cc.ScaleTo.create(0.1, 1.5),
                    cc.ScaleTo.create(0.1, 1)

                );
                var spawnAction = cc.Spawn.create(moveByAction, scaleToAction);
                if (this._trainType == TRAIN_CARD_ATK) {
                    this._atkLabel.runAction(spawnAction);
                } else {
                    this._hpLabel.runAction(spawnAction);
                }
            }

            if (this._trainType != TRAIN_CARD_NULL && this._trainCount != TRAIN_ZERO_COUNT) {
                if (this._trainType == TRAIN_CARD_HP) {
                    this._hpAdditionLabel.setString("+ " + (this._trainCount * 2));
                    this._atkAdditionLabel.setString("+ 0");

                    this._hpAdditionLabel.setVisible(true);
                    this._atkAdditionLabel.setVisible(false);
                } else if (this._trainType == TRAIN_CARD_ATK) {
                    this._hpAdditionLabel.setString("+ 0");
                    this._atkAdditionLabel.setString("+ " + this._trainCount);

                    this._hpAdditionLabel.setVisible(false);
                    this._atkAdditionLabel.setVisible(true);
                }

                if (mandatoryTeachingLayer) {
                    if (mandatoryTeachingLayer.isTeaching()) {
                        mandatoryTeachingLayer.clearAndSave();
                        mandatoryTeachingLayer.next();
                    }
                }

            } else {
                this._hpAdditionLabel.setVisible(false);
                this._atkAdditionLabel.setVisible(false);
                this._trainItem.setEnabled(false);
                this._extractItem.setEnabled(false);
            }

            this._trainItem.setEnabled(true);
            this._extractItem.setEnabled(true);
            this._tipLabel.setVisible(false);
            this._helpLabel.setVisible(true);
        }
    },

    _extract: function () {
        cc.log("CardTrainLabel _extract");

        if(this._extractEffect != null) {
            this._extractEffect.removeFromParent();
            this._extractEffect = null;
        }
        this._extractEffect = cc.BuilderReader.load(main_scene_image.uiEffect84, this);
        var animationManager = this._extractEffect.animationManager;
        animationManager.runAnimationsForSequenceNamedTweenDuration(this._cardTrainLabelFit.extractEffectUrl, 0);
        this._effectTime = animationManager.getSequenceDuration(
            animationManager.getRunningSequenceName()
        );
        var date = new Date();
        this._startTime = date.getTime();
        this._extractEffect.setPosition(this._cardTrainLabelFit.selectLeadCardItemPoint);
        this.addChild(this._extractEffect, 10);
    },

    ccbFnExtract: function () {
        cc.log("CardTrainLabel ccbFnExtract");

        var date = new Date();
        var useTime = this._effectTime - (date.getTime() - this._startTime) / 1000;
        var nowElixir = this._dummyCard.getElixir();
        var tmpTime = useTime / 0.05;
        var tmpElixir = nowElixir / tmpTime;

        var nowHp = this._dummyCard.get("hp");
        var nowAtk = this._dummyCard.get("atk");

        var tmpHp = (this._dummyCard.get("hp") - this._leadCard.get("hp")) / tmpTime;
        var tmpAtk = (this._dummyCard.get("atk") - this._leadCard.get("atk")) / tmpTime;

        this._hpAdditionLabel.setString("");
        this._atkAdditionLabel.setString("");

        var fn = function () {

            if (nowElixir < tmpElixir) {
                tmpElixir = nowElixir;
            }

            nowElixir -= tmpElixir;
            nowHp -= tmpHp;
            nowAtk -= tmpAtk;

            var elixir = gameData.player.get("elixir") - nowElixir;
            this._elixirLabel.setString(Math.round(elixir));
            this._hpLabel.setString(Math.round(nowHp));
            this._atkLabel.setString(Math.round(nowAtk));

            if (nowElixir <= 0) {
                this._elixirLabel.setString(gameData.player.get("elixir"));
                this._hpLabel.setString(this._leadCard.get("hp"));
                this._atkLabel.setString(this._leadCard.get("atk"));
                this.unschedule(fn);
                if (this._extractEffect != null) {
                    this._extractEffect.removeFromParent();
                    this._extractEffect = null;
                }

                var moveByAction = cc.Sequence.create(
                    cc.MoveBy.create(0.1, cc.p(5, 0)),
                    cc.MoveBy.create(0.1, cc.p(-5, 0)),
                    cc.MoveBy.create(0.1, cc.p(5, 0)),
                    cc.MoveBy.create(0.1, cc.p(-5, 0))
                );
                var scaleToAction = cc.Sequence.create(
                    cc.ScaleTo.create(0.1, 1.5),
                    cc.ScaleTo.create(0.1, 1),
                    cc.ScaleTo.create(0.1, 1.5),
                    cc.ScaleTo.create(0.1, 1)

                );

                var spawnAction = cc.Spawn.create(moveByAction, scaleToAction);
                this._hpLabel.runAction(spawnAction.clone());
                this._atkLabel.runAction(spawnAction.clone());
            }

        };

        this.schedule(fn, 0.05);
    },

    _onClickSelectLeadCard: function () {
        cc.log("CardTrainLabel _onClickSelectLeadCard");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._effect != null) {
            this._effect.removeFromParent();
            this._effect = null;
        }

        if(this._extractEffect != null) {
            this._extractEffect.removeFromParent();
            this._extractEffect = null;
        }

        if (mandatoryTeachingLayer) {
            if (mandatoryTeachingLayer.isTeaching()) {
                mandatoryTeachingLayer.clearAndSave();
                mandatoryTeachingLayer.next();
            }
        }

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_CARD_TRAIN_MASTER, function (data) {
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

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._trainType == TRAIN_CARD_NULL) {
            TipLayer.tip("请选择培养类型");
            return;
        }

        if (this._trainCount == TRAIN_ZERO_COUNT) {
            TipLayer.tip("请选择培养次数");
            return;
        }

        if (mandatoryTeachingLayer) {
            if (mandatoryTeachingLayer.isTeaching()) {
                mandatoryTeachingLayer.clearAndSave();
                mandatoryTeachingLayer.next();
            }
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

            if (that._effect != null) {
                that._effect.removeFromParent();
                that._effect = null;
            }

            that._effect = cc.BuilderReader.load(main_scene_image.uiEffect49, this);
            that._effect.setPosition(that._cardTrainLabelFit.selectLeadCardItemPoint);
            that._effect.animationManager.setCompletedAnimationCallback(this, function () {
                if (that._effect) {
                    that._effect.removeFromParent();
                    that._effect = null;
                }
            });
            that.addChild(that._effect, 10);
            that._showTrain = true;
            that.update();
        }, this._trainCount, this._trainType);
    },

    _onClickExtract: function () {
        cc.log("CardTrainLabel _onClickExtract");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._leadCard.getElixir() == 0) {
            TipLayer.tip("该卡没有可提取的仙丹");
            return;
        }

        var that = this;
        this._dummyCard = lz.clone(that._leadCard);

        var cb = function () {
            that._leadCard.extract(function () {
                that._extract();
            }, EXTRACT_ELIXIR);
        };

        ExtractTipLabel.pop({
            cb: cb,
            type: EXTRACT_ELIXIR,
            num: this._leadCard.getElixir()
        });
    },

    _onClickTrainHp: function () {
        cc.log("CardTrainLabel _onClickTrainHp");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._trainType = TRAIN_CARD_HP;
        this._trainHpItem.setEnabled(false);
        this._trainAtkItem.setEnabled(true);

        this.update();
    },

    _onClickTrainAtk: function () {
        cc.log("CardTrainLabel _onClickTrainAtk");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._trainType = TRAIN_CARD_ATK;
        this._trainHpItem.setEnabled(true);
        this._trainAtkItem.setEnabled(false);

        this.update();
    },

    _onClickTrainOne: function () {
        cc.log("CardTrainLabel _onClickTrainOne");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._trainCount = TRAIN_ONE_COUNT;
        this._trainOneItem.setEnabled(false);
        this._trainTenItem.setEnabled(true);

        this.update();
    },

    _onClickTrainTen: function () {
        cc.log("CardTrainLabel _onClickTrainTen");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._trainCount = TRAIN_TEN_COUNT;
        this._trainOneItem.setEnabled(true);
        this._trainTenItem.setEnabled(false);

        this.update();
    },

    _onClickHelp: function () {
        cc.log("CardTrainLabel _onClickHelp");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        GameHelpLabel.pop(gameHelp["cardTrain"]);
    }
});


CardTrainLabel.create = function () {
    var ret = new CardTrainLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};
