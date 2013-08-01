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
var SELECT_TYPE_MASTER = 2;
var SELECT_TYPE_EXP = 3;
var SELECT_TYPE_MONEY = 4;
var SELECT_TYPE_ELIXIR = 5;


var SORT_TYPE_LITER = 1;
var SORT_TYPE_DROP = 0;

var CardListLayer = cc.Layer.extend({
    _cb: null,
    _selectType: null,       // 选择界面类型
    _sortType: SORT_TYPE_DROP,              // 排序方式
    _excludeList: [],                        // 不能选择列表
    _maxSelectCount: 0,
    _selectCount: 0,
    _cardLabelList: {},
    _scrollViewHeight: 0,
    _scrollView: null,
    _otherLayer: null,

    onEnter: function () {
        cc.log("CardListLayer onEnter");

        this._super();
        this.update();
    },

    init: function (selectType, excludeList, cb) {
        cc.log("CardListLayer init");

        if (!this._super()) return false;

        var cardCount = gameData.cardList.get("length");
        this._cb = cb || function () {
        };

        this._sortType = SORT_TYPE_DROP;
        this._excludeList = excludeList || [];
        this._maxSelectCount = cardCount;

        selectType = selectType || SELECT_TYPE_DEFAULT;

        var bgSprite = cc.Sprite.create(main_scene_image.bg2);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var cardList = gameData.cardList.get("cardList");
        var scrollViewLayer = cc.Layer.create();

        for (var key in cardList) {
            var card = cardList[key];

            var cardLabel = CardLabel.create(this, card, selectType);
            cardLabel.setAnchorPoint(cc.p(0, 0));
            cardLabel.setPosition(cc.p(0, 0));

            scrollViewLayer.addChild(cardLabel);

            this._cardLabelList[key] = cardLabel;
        }

        this._scrollViewHeight = 124 * cardCount;
        if (this._scrollViewHeight < 620) this._scrollViewHeight = 620;

        this._scrollView = cc.ScrollView.create(cc.size(586, 620), scrollViewLayer);
        this._scrollView.setContentSize(cc.size(GAME_WIDTH, this._scrollViewHeight));
        this._scrollView.setPosition(cc.p(67, 260));
//        this._scrollView.setBounceable(false);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._otherLayer = cc.Layer.create();
        this.addChild(this._otherLayer);

//        this.setSelectType(selectType);

        return true;
    },

    update: function () {
        cc.log("CardListLayer update");

        var cardListIndex = gameData.cardList.sortCardList(this._sortType);
        var len = cardListIndex.length;

        for (var i = 0; i < len; ++i) {
            var index = this._selectType == SORT_TYPE_DROP ? (len - i) : (i + 1);
            this._cardLabelList[cardListIndex[i]].setPosition(cc.p(0, this._scrollViewHeight - index * 124));
        }

        var offsetPoint = this._scrollView.minContainerOffset();
        this._scrollView.setContentOffset(cc.p(0, offsetPoint.y));
    },

    selectCallback: function (index) {
        cc.log("CardListLayer selectCallback");

        var isSelect = this._cardLabelList[index].isSelect();

        if (isSelect) {
            this._selectCount += 1;

            if (this._selectCount == this._maxSelectCount) {
                cc.log("set enabled false");

                for (var key in this._cardLabelList) {
                    if (!this._cardLabelList[key].isSelect()) {
                        this._cardLabelList[key].setEnabled(false);
                    }
                }
            }
        } else {
            if (this._selectCount == this._maxSelectCount) {
                cc.log("set enabled true");

                for (var key in this._cardLabelList) {
                    if (this._isCanSelect(key)) {
                        this._cardLabelList[key].setEnabled(true);
                    }
                }
            }

            this._selectCount -= 1;
        }
    },

    _isCanSelect: function (index) {
        var len = this._excludeList.length;

        for (var i = 0; i < len; ++i) {
            if (this._excludeList[i] == index) {
                return false;
            }
        }

        return true;
    },

    _initDefault: function () {
        cc.log("CardListLayer _initDefault");

        this._clearOtherLayer();

        var titleLabel = cc.Sprite.create(main_scene_image.icon23);
        titleLabel.setPosition(cc.p(360, 1000));
        this._otherLayer.addChild(titleLabel);

        var lineUpItem = cc.MenuItemImage.create(main_scene_image.button16, main_scene_image.button16s, this._onClickLineUp, this);
        lineUpItem.setPosition(cc.p(160, 920));

        var sellItem = cc.MenuItemImage.create(main_scene_image.button9, main_scene_image.button9s, this._onClickOk, this);
        sellItem.setPosition(cc.p(560, 920));

        var menu = cc.Menu.create(sellItem, lineUpItem);
        menu.setPosition(cc.p(0, 0));
        this._otherLayer.addChild(menu);

        var sellLabel = cc.Sprite.create(main_scene_image.icon22);
        sellLabel.setPosition(cc.p(560, 920));
        this._otherLayer.addChild(sellLabel);
    },

    _initLineUp: function () {
        cc.log("CardListLayer _initLineUp");

        this._clearOtherLayer();

        var titleLabel = cc.Sprite.create(main_scene_image.icon24);
        titleLabel.setPosition(cc.p(360, 1000));
        this._otherLayer.addChild(titleLabel);

        var okItem = cc.MenuItemImage.create(main_scene_image.button9, main_scene_image.button9s, this._onClickOk, this);
        okItem.setPosition(cc.p(560, 920));

        var lineUpItem = cc.MenuItemImage.create(main_scene_image.button16, main_scene_image.button16s, this._onClickLineUp, this);
        lineUpItem.setPosition(cc.p(160, 920));

        var backItem = cc.MenuItemImage.create(main_scene_image.button8, main_scene_image.button8s, function () {
            MainScene.getInstance().switchLayer(MainLayer);
        }, this);
        backItem.setPosition(cc.p(100, 1000));

        var menu = cc.Menu.create(okItem, lineUpItem, backItem);
        menu.setPosition(cc.p(0, 0));
        this._otherLayer.addChild(menu);

        var okLabel = cc.Sprite.create(main_scene_image.icon32);
        okLabel.setPosition(cc.p(560, 920));
        this._otherLayer.addChild(okLabel);

        this._maxSelectCount = MAX_LINE_UP_CARD;

        var lineUp = gameData.lineUp.getLineUpList();
        var len = lineUp.length;

        for (var i = 0; i < len; ++i) {
            this._cardLabelList[lineUp[i]].select();
        }

    },

    _initMaster: function () {
        cc.log("CardListLayer _initMaster");

        var okItem = cc.MenuItemImage();
        okItem.setPosition(cc.p());

        var lineUpItem = cc.MenuItemImage();
        lineUpItem.setPosition(cc.p());

        var menu = cc.Menu.create(lineUpItem, sellItem);

        this._otherLayer.addChild(menu);
    },

    _initExp: function () {
        cc.log("CardListLayer _initExp");

        var okItem = cc.MenuItemImage();
        okItem.setPosition(cc.p());

        var lineUpItem = cc.MenuItemImage();
        lineUpItem.setPosition(cc.p());

        var menu = cc.Menu.create(lineUpItem, sellItem);

        this._otherLayer.addChild(menu);
    },

    _initMoney: function () {
        cc.log("CardListLayer _initMoney");

        var okItem = cc.MenuItemImage();
        okItem.setPosition(cc.p());

        var lineUpItem = cc.MenuItemImage();
        lineUpItem.setPosition(cc.p());

        var menu = cc.Menu.create(lineUpItem, sellItem);

        this._otherLayer.addChild(menu);
    },

    _initElixir: function () {
        cc.log("CardListLayer _initElixir");

        var okItem = cc.MenuItemImage();
        okItem.setPosition(cc.p());

        var lineUpItem = cc.MenuItemImage();
        lineUpItem.setPosition(cc.p());

        var menu = cc.Menu.create(lineUpItem, sellItem);

        this._otherLayer.addChild(menu);
    },

    _clearOtherLayer: function () {
        cc.log("CardListLayer _clearOtherLayer");

        if (this._otherLayer != null) {
            this._otherLayer.removeAllChildren();
        }
    },

    setSelectType: function (selectType) {
        cc.log("CardListLayer setSelectType");

        if (selectType != this._selectType) {
            this._selectType = selectType;

            if (this._selectType == SELECT_TYPE_DEFAULT) {
                this._initDefault();
            } else if (this._selectType == SELECT_TYPE_LINEUP) {
                this._initLineUp();
            } else if (this._selectType == SELECT_TYPE_MASTER) {
                this._initMaster();
            } else if (this._selectType == SELECT_TYPE_EXP) {
                this._initExp();
            } else if (this._selectType == SELECT_TYPE_MONEY) {
                this._initMoney();
            } else if (this._selectType == SELECT_TYPE_ELIXIR) {
                this._initElixir();
            }
        }
    },

    // 重新设置排序方式，读取卡牌列表，并更新到界面
    setSortType: function (sortType) {
        cc.log("CardListLayer setSortType");

        if (sortType != this._sortType) {
            this._sortType = sortType;
            this.update();
        }
    },

    _onClickOk: function () {
        cc.log("CardListLayer _onClickOk");

//        var selectIndex = [];
//        var key;
//
//        for (key in this._cardListCell) {
//            if (this._cardListCell[key].isSelect) selectIndex.push(this._cardList.getCardByIndex(key));
//        }
//
//        cc.log("select idnex");
//        cc.log(selectIndex);
//
//        if (this._target) this._callback.call(this._target, selectIndex);
//        else this._callback(selectIndex);
    },

    _onClickSell: function() {
        cc.log("CardListLayer _onClickSell");
    },

    _onClickLineUp: function () {
        cc.log("CardListLayer _onClickChangeLineUp");

        this.addChild(LineUpLayer.create(), 1);
    },

    _onClickChangeSelectType: function (selectTypeLabel) {
        return function () {
            cc.log("CardListLayer _onClickChangeSelectType");

            this._selectType ^= 1;

            this.update();
        }
    },

    _onClickSelectAllLow: function () {
        cc.log("CardListLayer _onClickAllLow");
    }
})


CardListLayer.create = function (selectType, excludeList, callback) {
    var ret = new CardListLayer();

    if (ret && ret.init(selectType, excludeList, callback)) {
        return ret;
    }

    return null;
}