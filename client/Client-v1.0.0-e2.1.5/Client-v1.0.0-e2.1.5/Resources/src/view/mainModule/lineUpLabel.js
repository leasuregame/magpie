/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-15
 * Time: 上午10:32
 * To change this template use File | Settings | File Templates.
 */


/*
 * line up label
 * */


var LineUpLabel = cc.Layer.extend({
    _cardList: null,
    _lineUp: null,

    _card3Guide: null,
    _card4Guide: null,
    _card5Guide: null,

    onEnter: function () {
        cc.log("LineUpLabel onEnter");

        this._super();
        this.update();
        this.updateGuide();
    },

    init: function () {
        cc.log("LineUpLabel init");

        if (!this._super()) return false;

        this._cardList = gameData.cardList;
        this._lineUp = gameData.lineUp;

        return true;
    },

    update: function () {
        cc.log("LineUpLabel update");

        this.removeAllChildren();

        var lineUpCardList = this._lineUp.getLineUpCardList();

        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        for (var i = 0; i < 5; ++i) {
            var cardHeadItem = null;
            var effect = null;
            if (i < MAX_LINE_UP_CARD) {
                cardHeadItem = CardHeadNode.getCardHeadItem(lineUpCardList[i], this._onClickCard, this);

                if (lineUpCardList[i]) {
                    effect = cc.BuilderReader.load(main_scene_image.uiEffect44, this);
                    effect.setPosition(cc.p(79 + 122 * i, 0));
                    this.addChild(effect, 2);
                }

            } else {
                cardHeadItem = CardHeadNode.getCardHeadItem(-1, this._onClickLock(i), this);
            }
            cardHeadItem.setPosition(cc.p(79 + 122 * i, 0));
            menu.addChild(cardHeadItem);

        }
    },

    updateGuide: function () {
        cc.log("LineUpLabel updateGuide");

        if (gameGuide.get("card5Guide") && !this._card5Guide) {
            this._card5Guide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._card5Guide.setPosition(cc.p(79 + 122 * 4, 0));
            this.addChild(this._card5Guide, 10);
        } else if (gameGuide.get("card4Guide") && !this._card4Guide) {
            this._card4Guide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._card4Guide.setPosition(cc.p(79 + 122 * 3, 0));
            this.addChild(this._card4Guide, 10);
        } else if (gameGuide.get("card3Guide") && !this._card3Guide) {
            this._card3Guide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._card3Guide.setPosition(cc.p(79 + 122 * 2, 0));
            this.addChild(this._card3Guide, 10);
        }

    },

    _onClickCard: function () {
        cc.log("LineUpLabel _onClickCard");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._card5Guide) {
            this._card5Guide.removeFromParent();
            this._card5Guide = null;
            gameGuide.set("card5Guide", false);
        }

        if (this._card4Guide) {
            this._card4Guide.removeFromParent();
            this._card4Guide = null;
            gameGuide.set("card4Guide", false);
        }

        if (this._card3Guide) {
            this._card3Guide.removeFromParent();
            this._card3Guide = null;
            gameGuide.set("card3Guide", false);
        }

        MainScene.getInstance().switch(CardListLayer.create(SELECT_TYPE_LINEUP));

        if (noviceTeachingLayer.isNoviceTeaching()) {
            noviceTeachingLayer.clearAndSave();
            noviceTeachingLayer.next();
        }
    },

    _onClickLock: function (index) {
        var table = outputTables.function_limit.rows[1];

        return function () {
            cc.log("LineUpLabel _onClickLock");

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            if (index == 2) {
                TipLayer.tip(table.card3_position + " 级开启");
            } else if (index == 3) {
                TipLayer.tip(table.card4_position + " 级开启");
            } else if (index == 4) {
                TipLayer.tip(table.card5_position + " 级开启");
            }
        }
    }
});


LineUpLabel.create = function () {
    var ret = new LineUpLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};