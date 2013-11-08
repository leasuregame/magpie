/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-13
 * Time: 下午6:28
 * To change this template use File | Settings | File Templates.
 */


/*
 * card list layer
 * */


var SELECT_TYPE_DEFAULT = 0;
var SELECT_TYPE_LINEUP = 1;
var SELECT_TYPE_CARD_UPGRADE_MASTER = 2;
var SELECT_TYPE_CARD_EVOLUTION_MASTER = 3;
var SELECT_TYPE_SKILL_UPGRADE_MASTER = 4;
var SELECT_TYPE_PASSIVE_SKILL_AFRESH_MASTER = 5;
var SELECT_TYPE_CARD_TRAIN_MASTER = 6;
var SELECT_TYPE_CARD_UPGRADE_RETINUE = 7;
var SELECT_TYPE_CARD_EVOLUTION_RETINUE = 8;
var SELECT_TYPE_SELL = 9;

var SORT_TYPE_DROP = 0;
var SORT_TYPE_LITER = 1;

var CardListLayer = cc.Layer.extend({
    _cardListLayerFit: null,

    _cb: null,                      // 回调函数
    _selectType: null,              // 选择界面类型
    _sortType: SORT_TYPE_DROP,      // 卡牌排序方式
    _excludeList: [],               // 不能选择卡牌列表
    _maxSelectCount: 0,             // 最大选择卡牌个数
    _selectCount: 0,                // 已经选个卡牌个数
    _cardLabel: {},                 // 卡牌模块对象
    _scrollViewHeight: 0,           // 滑动列表高度
    _scrollView: null,              // 滑动列表
    _otherData: {},                 // 可变数据
    _otherLabel: null,              // 可变模块
    _isSelectAllLow: false,         // 是否选择全部低星卡
    _sortItem1: null,
    _sortItem2: null,

    onEnter: function () {
        cc.log("CardListLayer onEnter");

        this._super();
        this.update();
    },

    init: function (selectType, cb, otherData) {
        cc.log("CardListLayer init");

        if (!this._super()) return false;

        this._cardListLayerFit = gameFit.mainScene.cardListLayer;

        var cardCount = gameData.cardList.get("length");

        this._cardLabel = {};
        this._otherData = {};
        this._excludeList = [];
        this._cb = cb;
        this._otherData = otherData;
        this._maxSelectCount = cardCount;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._cardListLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._cardListLayerFit.headIconPoint);
        this.addChild(headIcon);

        var lineIcon = cc.Sprite.create(main_scene_image.icon18);
        lineIcon.setPosition(this._cardListLayerFit.lineIconPoint);
        this.addChild(lineIcon);

        var cardList = gameData.cardList.get("cardList");
        var scrollViewLayer = MarkLayer.create(this._cardListLayerFit.scrollViewLayerRect);

        for (var key in cardList) {
            var card = cardList[key];

            var cardLabel = CardLabel.create(this, card, selectType);
            cardLabel.setAnchorPoint(cc.p(0, 0));
            cardLabel.setPosition(cc.p(0, 0));

            scrollViewLayer.addChild(cardLabel);

            this._cardLabel[key] = cardLabel;
        }

        this._scrollView = cc.ScrollView.create(this._cardListLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._cardListLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._sortItem1 = cc.MenuItemImage.create(
            main_scene_image.button30,
            main_scene_image.button30,
            this._onClickSortType,
            this
        );
        this._sortItem1.setPosition(this._cardListLayerFit.sortItemPoint);

        this._sortItem2 = cc.MenuItemImage.create(
            main_scene_image.button31,
            main_scene_image.button31,
            this._onClickSortType,
            this
        );
        this._sortItem2.setPosition(this._cardListLayerFit.sortItemPoint);

        this._onSelectAllLowItem = cc.MenuItemImage.create(
            main_scene_image.button32,
            main_scene_image.button32,
            this._onClickSelectAllLow,
            this
        );
        this._onSelectAllLowItem.setPosition(this._cardListLayerFit.onSelectAllLowItemPoint);
        this._onSelectAllLowItem.setVisible(false);

        var menu = cc.Menu.create(this._sortItem1, this._sortItem2, this._onSelectAllLowItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._selectAllLowHookIcon = cc.Sprite.create(main_scene_image.icon20);
        this._selectAllLowHookIcon.setPosition(this._cardListLayerFit.selectAllLowHookIconPoint);
        this.addChild(this._selectAllLowHookIcon);
        this._selectAllLowHookIcon.setVisible(false);

        this._otherLabel = cc.Layer.create();
        this.addChild(this._otherLabel);

        this.setSelectType(selectType);
        this._excludeList.distinct();

        return true;
    },

    update: function () {
        cc.log("CardListLayer update");

        this._sortItem1.setVisible(this._sortType == SORT_TYPE_DROP);
        this._sortItem2.setVisible(this._sortType == SORT_TYPE_LITER);

        this._updateScrollViewHeight();
        this._sortCardLabel();
    },

    _updateScrollViewHeight: function () {
        cc.log("CardListLayer _updateScrollViewHeight");

        var cardCount = gameData.cardList.get("count");

        this._scrollViewHeight = 135 * cardCount;

        if (this._scrollViewHeight < 620) this._scrollViewHeight = 620;

        this._scrollView.setContentSize(cc.size(585, this._scrollViewHeight));
        this._scrollView.updateInset();

        var offsetPoint = this._scrollView.minContainerOffset();
        this._scrollView.setContentOffset(cc.p(0, offsetPoint.y));
    },

    _sortCardLabel: function () {
        cc.log("CardListLayer _sortCardLabel");

        var flag = {};

        var cardListIndex = gameData.cardList.sortCardList(SORT_CARD_LIST_BY_STAR);
        var cardCount = cardListIndex.length;

        var canSelectCardListIndex = [];
        var noSelectCardListIndex = [];
        var i;

        for (i = 0; i < cardCount; ++i) {
            if (this._isCanSelect(cardListIndex[i])) {
                canSelectCardListIndex.push(cardListIndex[i]);
            } else {
                noSelectCardListIndex.push(cardListIndex[i]);
            }
        }

        if (this._sortType == SORT_TYPE_DROP) {
            cardListIndex = noSelectCardListIndex.concat(canSelectCardListIndex);
        } else {
            cardListIndex = canSelectCardListIndex.concat(noSelectCardListIndex);
        }

        for (i = 0; i < cardCount; ++i) {
            var index = this._sortType == SORT_TYPE_DROP ? (cardCount - i) : (i + 1);
            this._cardLabel[cardListIndex[i]].setPosition(this._getCardLocation(index));
            flag[cardListIndex[i]] = true;
        }

        var len = this._excludeList.length;
        for (i = 0; i < len; ++i) {
            this._cardLabel[this._excludeList[i]].setEnabled(false);
        }

        for (var key in this._cardLabel) {
            if (!flag[key]) {
                cc.log(key);

                this._cardLabel[key].removeFromParent();
                delete this._cardLabel[key];
            }
        }
    },

    _getCardLocation: function (index) {
        cc.log("CardListLayer _getCardLocation");

        return cc.p(0, this._scrollViewHeight - index * 135);
    },

    selectCallback: function (cardId) {
        cc.log("CardListLayer selectCallback");

        var isSelect = this._cardLabel[cardId].isSelect();

        if (isSelect) {
            this._selectCount += 1;

            if (this._selectCount == this._maxSelectCount) {
                cc.log("set enabled false");

                for (var key in this._cardLabel) {
                    if (!this._cardLabel[key].isSelect()) {
                        this._cardLabel[key].setEnabled(false);
                    }
                }
            }
        } else {
            if (this._selectCount == this._maxSelectCount) {
                cc.log("set enabled true");

                for (var key in this._cardLabel) {
                    if (this._isCanSelect(key)) {
                        this._cardLabel[key].setEnabled(true);
                    }
                }
            }

            this._selectCount -= 1;
        }

        this._updateTip();
    },

    _isCanSelect: function (cardId) {
        var len = this._excludeList.length;

        for (var i = 0; i < len; ++i) {
            if (this._excludeList[i] == cardId) {
                return false;
            }
        }

        return true;
    },

    _updateTip: function () {
        cc.log("CardListLayer _updateTip default");
    },

    _initDefault: function () {
        cc.log("CardListLayer _initDefault");

        this._clearOtherLayer();

        var titleLabel = cc.Sprite.create(main_scene_image.icon23);
        titleLabel.setPosition(this._cardListLayerFit.titleLabelPoint);
        this._otherLabel.addChild(titleLabel);

        var lineUpItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon24,
            this._onClickLineUp,
            this);
        lineUpItem.setPosition(this._cardListLayerFit.lineUpItemPoint);

        var sellItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon22,
            this._onClickSell,
            this
        );
        sellItem.setPosition(this._cardListLayerFit.sellItemPoint);

        var menu = cc.Menu.create(sellItem, lineUpItem);
        menu.setPosition(cc.p(0, 0));
        this._otherLabel.addChild(menu);
    },

    _initLineUp: function () {
        cc.log("CardListLayer _initLineUp");

        this._clearOtherLayer();

        var titleLabel = cc.Sprite.create(main_scene_image.icon250);
        titleLabel.setPosition(this._cardListLayerFit.titleLabelPoint);
        this._otherLabel.addChild(titleLabel);

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickChangeLineUp,
            this
        );
        okItem.setPosition(this._cardListLayerFit.okItemPoint);

        var lineUpItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon24,
            this._onClickLineUp,
            this
        );
        lineUpItem.setPosition(this._cardListLayerFit.lineUpItemPoint);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            function () {
                MainScene.getInstance().switchLayer(MainLayer);
            },
            this
        );
        backItem.setPosition(this._cardListLayerFit.backItemPoint);

        var menu = cc.Menu.create(okItem, lineUpItem, backItem);
        menu.setPosition(cc.p(0, 0));
        this._otherLabel.addChild(menu);

        this._maxSelectCount = MAX_LINE_UP_CARD;

        var lineUp = gameData.lineUp.getLineUpList();
        var len = lineUp.length;

        for (var i = 0; i < len; ++i) {
            if (this._cardLabel[lineUp[i]] !== undefined) {
                this._cardLabel[lineUp[i]].select();
            }
        }
    },

    _initMaster: function () {
        cc.log("CardListLayer _initMaster");

        var titleLabel = cc.Sprite.create(main_scene_image.icon25);
        titleLabel.setPosition(this._cardListLayerFit.titleLabelPoint);
        this._otherLabel.addChild(titleLabel);

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOk,
            this
        );
        okItem.setPosition(this._cardListLayerFit.okItemPoint);

        var backItem = cc.MenuItemImage.create(main_scene_image.button8, main_scene_image.button8s, function () {
            this._cb(null);
        }, this);
        backItem.setPosition(this._cardListLayerFit.backItemPoint);

        var menu = cc.Menu.create(okItem, backItem);
        menu.setPosition(cc.p(0, 0));
        this._otherLabel.addChild(menu);

        this._maxSelectCount = 1;
    },

    _initCardUpgradeMaster: function () {
        cc.log("CardListLayer _initCardUpgradeMaster");

        this._initMaster();

        if (this._otherData.leadCard) {
            this._cardLabel[this._otherData.leadCard.get("id")].select();
        }
    },

    _initCardEvolutionMaster: function () {
        cc.log("CardListLayer _initCardEvolutionMaster");

        this._initMaster();

        var cardList = gameData.cardList.get("cardList");

        for (var key in cardList) {
            if (!cardList[key].canEvolution()) {
                this._excludeList.push(key);
            }
        }

        if (this._otherData.leadCard && this._otherData.leadCard.canEvolution()) {
            this._cardLabel[this._otherData.leadCard.get("id")].select();
        }
    },

    _initSkillUpgradeMaster: function () {
        cc.log("CardListLayer _initSkillUpgradeMaster");

        this._initMaster();

        var cardList = gameData.cardList.get("cardList");

        for (var key in cardList) {
            if (!cardList[key].canUpgradeSkill()) {
                this._excludeList.push(key);
            }
        }

        if (this._otherData.leadCard && this._otherData.leadCard.canUpgradeSkill()) {
            this._cardLabel[this._otherData.leadCard.get("id")].select();
        }
    },

    _initPassiveSkillAfreshMaster: function () {
        cc.log("CardListLayer _initPassiveSkillAfreshMaster");

        this._initMaster();

        var cardList = gameData.cardList.get("cardList");

        for (var key in cardList) {
            if (!cardList[key].canAfreshPassiveSkill()) {
                this._excludeList.push(key);
            }
        }

        if (this._otherData.leadCard && this._otherData.leadCard.canAfreshPassiveSkill()) {
            this._cardLabel[this._otherData.leadCard.get("id")].select();
        }
    },

    _initCardTrainMaster: function () {
        cc.log("CardListLayer _initCardTrainMaster");

        this._initMaster();

        var cardList = gameData.cardList.get("cardList");

        for (var key in cardList) {
            if (!cardList[key].canTrain()) {
                this._excludeList.push(key);
            }
        }

        if (this._otherData.leadCard && this._otherData.leadCard.canTrain()) {
            this._cardLabel[this._otherData.leadCard.get("id")].select();
        }
    },

    _initRetinue: function () {
        cc.log("CardListLayer _initRetinue");

        this._clearOtherLayer();

        this._sortType = SORT_TYPE_LITER;

        var titleLabel = cc.Sprite.create(main_scene_image.icon25);
        titleLabel.setPosition(this._cardListLayerFit.titleLabelPoint);
        this._otherLabel.addChild(titleLabel);

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOk,
            this
        );
        okItem.setPosition(this._cardListLayerFit.okItemPoint);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            function () {
                this._cb(null);
            },
            this
        );
        backItem.setPosition(this._cardListLayerFit.backItemPoint);

        var menu = cc.Menu.create(okItem, backItem);
        menu.setPosition(cc.p(0, 0));
        this._otherLabel.addChild(menu);

        var lineUp = gameData.lineUp.getLineUpList();
        var len = lineUp.length;
        for (var i = 0; i < len; ++i) {
            if (this._cardLabel[lineUp[i]] !== undefined) {
                this._excludeList.push(lineUp[i]);
            }
        }

        if (this._otherData.leadCard) {
            this._excludeList.push(this._otherData.leadCard.get("id"));
        }

        if (this._otherData.retinueCard) {
            var retinueCard = this._otherData.retinueCard;
            var len = retinueCard.length;

            for (var i = 0; i < len; ++i) {
                this._cardLabel[retinueCard[i].get("id")].select();
            }
        }
    },

    _initCardUpgradeRetinue: function () {
        cc.log("CardListLayer _initCardUpgradeRetinue");

        this._initRetinue();

        this._onSelectAllLowItem.setVisible(true);

        var tipLabel = cc.Sprite.create(main_scene_image.icon58);
        tipLabel.setAnchorPoint(cc.p(0, 0.5));
        tipLabel.setPosition(this._cardListLayerFit.tipLabelPoint);
        this._otherLabel.addChild(tipLabel);

        var countLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 25);
        countLabel.setPosition(this._cardListLayerFit.countLabelPoint);
        this.addChild(countLabel);

        var expLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 25);
        expLabel.setPosition(this._cardListLayerFit.expLabelPoint);
        this.addChild(expLabel);

        this._updateTip = function () {
            cc.log("CardListLayer _initCardUpgradeRetinue update");

            var selectList = this._getSelectCardList();
            var len = selectList.length;
            var exp = 0;

            for (var i = 0; i < len; ++i) {
                exp += selectList[i].getCardExp();
            }

            countLabel.setString(len);
            expLabel.setString(exp);
        };
    },

    _initCardEvolutionRetinue: function () {
        cc.log("CardListLayer _initCardEvolutionRetinue");

        this._initRetinue();

        var cardList = gameData.cardList.get("cardList");
        var leadCardStar = this._otherData.leadCard.get("star");

        for (var key in cardList) {
            if (cardList[key].get("star") != leadCardStar) {
                this._excludeList.push(key);
            }
        }

        var tipLabel = cc.Sprite.create(main_scene_image.icon94);
        tipLabel.setAnchorPoint(cc.p(0, 0.5));
        tipLabel.setPosition(this._cardListLayerFit.tipLabelPoint);
        this._otherLabel.addChild(tipLabel);

        var countLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 25);
        countLabel.setPosition(this._cardListLayerFit.countLabelPoint);
        this.addChild(countLabel);

        var rateLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 25);
        rateLabel.setPosition(this._cardListLayerFit.rateLabelPoint);
        this.addChild(rateLabel);

        this._updateTip = function () {
            cc.log("CardListLayer _initCardEvolutionRetinue update");

            var selectList = this._getSelectCardList();
            var len = selectList.length;
            var rate = len * this._otherData.leadCard.getPreCardRate();
            rate = rate < 100 ? rate : 100;

            countLabel.setString(len);
            rateLabel.setString(rate + "%");
        };
    },

    _initSell: function () {
        cc.log("CardListLayer _initSell");

        this._clearOtherLayer();

        this._sortType = SORT_TYPE_LITER;

        this._onSelectAllLowItem.setVisible(true);

        var titleLabel = cc.Sprite.create(main_scene_image.icon23);
        titleLabel.setPosition(this._cardListLayerFit.titleLabelPoint);
        this._otherLabel.addChild(titleLabel);

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickSellOk,
            this
        );
        okItem.setPosition(this._cardListLayerFit.okItemPoint);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            function () {
                MainScene.getInstance().switch(CardListLayer.create());
            },
            this
        );
        backItem.setPosition(this._cardListLayerFit.backItemPoint);

        var menu = cc.Menu.create(okItem, backItem);
        menu.setPosition(cc.p(0, 0));
        this._otherLabel.addChild(menu);

        var lineUp = gameData.lineUp.getLineUpList();
        var len = lineUp.length;
        for (var i = 0; i < len; ++i) {
            if (this._cardLabel[lineUp[i]] !== undefined) {
                this._excludeList.push(lineUp[i]);
            }
        }

        var tipLabel = cc.Sprite.create(main_scene_image.icon57);
        tipLabel.setAnchorPoint(cc.p(0, 0.5));
        tipLabel.setPosition(this._cardListLayerFit.tipLabelPoint);
        this._otherLabel.addChild(tipLabel);

        var countLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 25);
        countLabel.setPosition(this._cardListLayerFit.countLabelPoint);
        this.addChild(countLabel);

        var moneyLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 25);
        moneyLabel.setPosition(this._cardListLayerFit.moneyLabelPoint);
        this.addChild(moneyLabel);

        this._updateTip = function () {
            cc.log("CardListLayer _initSell _initCardUpgradeRetinue update");

            var selectList = this._getSelectCardList();
            var len = selectList.length;
            var money = 0;

            for (var i = 0; i < len; ++i) {
                money += selectList[i].getSellCardMoney();
            }

            countLabel.setString(len);
            moneyLabel.setString(money);
        };
    },

    _clearOtherLayer: function () {
        cc.log("CardListLayer _clearOtherLayer");

        if (this._otherLabel != null) {
            this._otherLabel.removeAllChildren();
        }
    },

    setSelectType: function (selectType) {
        cc.log("CardListLayer setSelectType");

        if (selectType != this._selectType) {
            this._selectType = selectType;

            switch (this._selectType) {
                case SELECT_TYPE_LINEUP :
                    this._initLineUp();
                    break;
                case SELECT_TYPE_CARD_UPGRADE_MASTER :
                    this._initCardUpgradeMaster();
                    break;
                case SELECT_TYPE_CARD_EVOLUTION_MASTER :
                    this._initCardEvolutionMaster();
                    break;
                case SELECT_TYPE_SKILL_UPGRADE_MASTER :
                    this._initSkillUpgradeMaster();
                    break;
                case SELECT_TYPE_PASSIVE_SKILL_AFRESH_MASTER :
                    this._initPassiveSkillAfreshMaster();
                    break;
                case SELECT_TYPE_CARD_TRAIN_MASTER :
                    this._initCardTrainMaster();
                    break;
                case SELECT_TYPE_CARD_UPGRADE_RETINUE :
                    this._initCardUpgradeRetinue();
                    break;
                case SELECT_TYPE_CARD_EVOLUTION_RETINUE :
                    this._initCardEvolutionRetinue();
                    break;
                case SELECT_TYPE_SELL :
                    this._initSell();
                    break;
                default :
                    this._initDefault();
                    break;
            }
        }
    },

    setSortType: function (sortType) {
        cc.log("CardListLayer setSortType");

        if (sortType != this._sortType) {
            this._sortType = sortType;
            this.update();
        }
    },

    _getSelectCardList: function () {
        cc.log("CardListLayer getSelectCardList");

        var selectCardList = [];
        var cardList = gameData.cardList;

        for (var key in this._cardLabel) {
            if (this._cardLabel[key].isSelect()) selectCardList.push(cardList.getCardByIndex(key));
        }

        return selectCardList;
    },

    _onClickOk: function () {
        cc.log("CardListLayer _onClickOk");

        this._cb(this._getSelectCardList());

    },

    _onClickSell: function () {
        cc.log("CardListLayer _onClickSell");

        MainScene.getInstance().switch(CardListLayer.create(SELECT_TYPE_SELL));
    },

    _onClickSellOk: function () {
        cc.log("CardListLayer _onClickSellOk");

        var selectCardList = this._getSelectCardList();
        var cardIdList = [];
        var len = selectCardList.length;

        for (var i = 0; i < len; ++i) {
            cardIdList.push(selectCardList[i].get("id"));
        }

        gameData.cardList.sell(function () {
            MainScene.getInstance().switch(CardListLayer.create());
        }, cardIdList);
    },

    _onClickChangeLineUp: function () {
        cc.log("CardListLayer _onClickChangeLineUp");

        var lineUp = lz.clone(gameData.lineUp.get("lineUp"));
        var cardList = this._getSelectCardList();
        var i, key, len;
        cc.log(lineUp);
        len = cardList.length;
        for (i = 0; i < len; ++i) {
            cardList[i] = cardList[i].get("id");
        }

        for (key in lineUp) {
            if (lineUp[key] == SPIRIT_ID) {
                continue;
            }

            var isLineUpCard = false;

            for (i = 0; i < cardList.length; ++i) {
                if (lineUp[key] == cardList[i]) {
                    cardList.splice(i, 1);
                    isLineUpCard = true;
                    break;
                }
            }

            if (!isLineUpCard) {
                delete lineUp[key];
            }
        }

        len = cardList.length;
        for (i = 0, key = 1; i < len && key <= MAX_LINE_UP_SIZE; ++i) {
            while (key <= MAX_LINE_UP_SIZE) {
                if (lineUp[key] == undefined) {
                    lineUp[key] = cardList[i];
                    key += 1;
                    break;
                }

                key += 1;
            }
        }

        gameData.lineUp.changeLineUp(function (data) {
            MainScene.getInstance().switchLayer(MainLayer);

            if (NoviceTeachingLayer.getInstance().isNoviceTeaching()) {
                NoviceTeachingLayer.getInstance().clearAndSave();
                NoviceTeachingLayer.getInstance().next();
            }
        }, lineUp);

    },

    _onClickLineUp: function () {
        cc.log("CardListLayer _onClickChangeLineUp");

        LineUpLayer.pop();
    },

    _onClickSortType: function () {
        cc.log("CardListLayer _onClickSortType");

        this.setSortType(this._sortType ^ 1);
    },

    _onClickSelectAllLow: function () {
        cc.log("CardListLayer _onClickAllLow");

        this._isSelectAllLow = !this._isSelectAllLow;

        this._selectAllLowHookIcon.setVisible(this._isSelectAllLow);

        var cardList = gameData.cardList;

        for (var key in this._cardLabel) {
            if (cardList.getCardByIndex(key).get("star") <= 2) {
                if (this._cardLabel[key].isEnabled()) {
                    if (this._isSelectAllLow) {
                        if (!this._cardLabel[key].isSelect()) {
                            this._cardLabel[key].select();
                        }
                    } else {
                        if (this._cardLabel[key].isSelect()) {
                            this._cardLabel[key].select();
                        }
                    }
                }
            }
        }

    }
});


CardListLayer.create = function (selectType, cb, otherData) {
    var ret = new CardListLayer();

    selectType = selectType || SELECT_TYPE_DEFAULT;
    otherData = otherData || {};
    cb = cb || function () {
    };

    if (ret && ret.init(selectType, cb, otherData)) {
        return ret;
    }

    return null;
};