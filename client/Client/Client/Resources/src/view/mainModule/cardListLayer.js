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
    _selectType: SELECT_TYPE_DEFAULT,       // 选择界面类型
    _sortType: SORT_TYPE_DROP,              // 排序方式
    _excludeList:[],                        // 不能选择列表
    _maxSelectCount: 0,
    _selectCount: 0,
    _cardCount: 0,
    _cardLabelList: {},
    _scrollViewHeight: 0,
    _scrollView: null,
    _otherLayer: null,

    onEnter: function () {
        cc.log("CardListLayer onEnter");

        this._super();
        this.update();
    },

    init: function (selectType, sortType, excludeList, cb) {
        cc.log("CardListLayer init");

        if (!this._super()) return false;

        this._cardCount = gameData.cardList.get("length");
        this._selectType = selectType || SELECT_TYPE_DEFAULT;
        this._sortType = sortType || SORT_TYPE_DROP;
        this._excludeList = excludeList || [];
        this._maxSelectCount = this._cardCount;

        var bgSprite = cc.Sprite.create(main_scene_image.bg2);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        return true;
    },

    update: function () {
        cc.log("CardListLayer update");

        if(this._scrollView != null) {
            this._scrollView.removeFromParent();
            this._scrollView = null;
        }

        var cardList = gameData.cardList.get("cardList");
        var scrollViewLayer = cc.Layer.create();

        for (var key in cardList) {
            var card = cardList[key];

            var cardLabel = CardLabel.create(card, this._selectType);
            cardLabel.setAnchorPoint(cc.p(0, 0));
            cardLabel.setPosition(cc.p(0, 0));

            scrollViewLayer.addChild(cardLabel);

            this._cardLabelList[key] = cardLabel;
        }

        this._scrollViewHeight = 124 * this._cardCount;
        if (this._scrollViewHeight < 620) this._scrollViewHeight = 620;

        var scrollView = cc.ScrollView.create(cc.size(586, 620), scrollViewLayer);
        scrollView.setContentSize(cc.size(GAME_WIDTH, this._scrollViewHeight));
        scrollView.setPosition(cc.p(67, 260));
//        scrollView.setBounceable(false);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        var cardListIndex = gameData.cardList.sortCardList(this._sortType);
        var len = cardListIndex.length;

        for (var i = 0; i < len; ++i) {
            var index = this._selectType == SORT_TYPE_DROP ? (len - i) : (i + 1);
            this._cardLabelList[cardListIndex[i]].setPosition(cc.p(0, this._scrollViewHeight - index * 124));
        }
    },

    _initDefault: function () {
        cc.log("CardListLayer _initDefault");

        this._clearOtherLayer();

        var lineUpItem = cc.MenuItemImage();
        lineUpItem.setPosition(cc.p());

        var sellItem = cc.MenuItemImage();
        sellItem.setPosition(cc.p());

        var menu = cc.Menu.create(lineUpItem, sellItem);

        this._otherLayer.addChild(menu);
    },

    _initLineUp: function () {
        cc.log("CardListLayer _initLineUp");

        var okItem = cc.MenuItemImage();
        okItem.setPosition(cc.p());

        var lineUpItem = cc.MenuItemImage();
        lineUpItem.setPosition(cc.p());

        var menu = cc.Menu.create(lineUpItem, sellItem);

        this._otherLayer.addChild(menu);
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



    _clearOtherLayer: function() {
        cc.log("CardListLayer _clearOtherLayer");

        if(this._otherLayer != null) {
            this._otherLayer.removeAllChildren();
        }
    },

    setSelectType: function(selectType) {
        cc.log("CardListLayer setSelectType");

        if(selectType != this._selectType) {
            this._selectType = selectType;


        }
    },

    // 重新设置排序方式，读取卡牌列表，并更新到界面
    setSortType: function (sortType) {
        cc.log("CardListLayer setSortType");

        if (sortType != this._sortType) {
            this._sortType = sortType;
        }

        this.update();
    },

    setSelectCount: function (selectCount) {
        cc.log("CardListLayer setSelectCount");

        if (selectCount != this._maxSelectCount) {
            this._maxSelectCount = selectCount;
        }
    },

    _onClickCardDetails: function (id) {
        return function () {
            cc.log("CardListLayer _onClickCardDetails " + id);
        }
    },

    _onClickSelect: function (id, selectLabel) {
        return function () {
            cc.log("CardListLayer _onClickSelect");

            var isSelect = !this._cardListCell[id].isSelect;

            if (isSelect) {
                if (this._selectCount < this._maxSelectCount) {
                    this._selectCount++;
                    this._cardListCell[id].isSelect = isSelect;
                    selectLabel.setString("已选择");
                }
            } else {
                this._selectCount--;
                this._cardListCell[id].isSelect = isSelect;
                selectLabel.setString("未选择");
            }

            cc.log("select count " + this._selectCount + " / " + this._maxSelectCount);
        }
    },

    _onClickUse: function (id, useLabel) {
        return function () {
            cc.log("CardListLayer _onClickUse");

            var isUse = this._cardList.changeUseCardByIndex(id)
            var str = isUse ? "已上阵" : "未上阵";
            useLabel.setString(str);
        }
    },

    _onClickOk: function () {
        cc.log("CardListLayer _onClickOk");

        var selectIndex = [];
        var key;

        for (key in this._cardListCell) {
            if (this._cardListCell[key].isSelect) selectIndex.push(this._cardList.getCardByIndex(key));
        }

        cc.log("select idnex");
        cc.log(selectIndex);

        if (this._target) this._callback.call(this._target, selectIndex);
        else this._callback(selectIndex);
    },

    _onClickChangeLineUp: function () {
        cc.log("CardListLayer _onClickChangeLineUp");
    },

    _onClickChangeSelectType: function (selectTypeLabel) {
        return function () {
            cc.log("CardListLayer _onClickChangeSelectType");

            this._selectType ^= 1;
            str = this._selectType == SELECT_TYPE_DROP ? "升序排列" : "降序排列";
            selectTypeLabel.setString(str);
            this.update();
        }
    },

    _onClickSell: function () {
        cc.log("CardListLayer _onClickSell");
    },

    _onClickSelectAllLow: function () {
        cc.log("CardListLayer _onClickAllLow");
    }
})


CardListLayer.create = function (callback, target, maxSelectCount, sortType) {
    cc.log(target);
    var ret = new CardListLayer();

    if (ret && ret.init(callback, target, maxSelectCount, sortType)) {
        return ret;
    }

    return null;
}