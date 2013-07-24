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


var SELECT_TYPE_LITER = 1;
var SELECT_TYPE_DROP = 0;

var CardListLayer = cc.Layer.extend({
    _cardList: null,
    _callback: null,
    _target: null,
    _sortType: null,
    _maxSelectCount: 0,
    _selectCount: 0,
    _cardListCell: {},
    _scrollViewHeight: 0,
    _selectType: SELECT_TYPE_DROP,

    onEnter: function () {
        cc.log("CardListLayer onEnter");

        this._super();
        this.update();
    },

    init: function (callback, target, maxSelectCount, sortType) {
        cc.log("CardListLayer init");

        if (!this._super()) return false;

        this._callback = callback || function () {
            MainScene.getInstance().switchLayer(MainLayer);
        };
        this._target = target || null;

        this._cardList = gameData.cardList;
        var len = this._cardList.get("length");
        this._sortType = sortType;
        this._maxSelectCount = maxSelectCount || len;

        var scrollViewLayer = cc.Layer.create();
        var cardList = this._cardList.get("cardList");
        var key;

        for (key in cardList) {
            var card = cardList[key];

            var cell = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 100);
            cell.setAnchorPoint(cc.p(0, 0));
            cell.setPosition(cc.p(0, 0));
            cell.isSelect = false;

            var cardItem = cc.MenuItemImage.create(s_h_hero_1, s_h_hero_1, this._onClickCardDetails(key), this);
            cardItem.setPosition(cc.p(100, 50));

            var selectLabel = cc.LabelTTF.create("未选择", 'Times New Roman', 30);
            var selectItem = cc.MenuItemLabel.create(selectLabel, this._onClickSelect(key, selectLabel), this);
            selectItem.setPosition(cc.p(560, 50));

            var str = card.get("isUse") ? "已上阵" : "未上阵";
            var useLabel = cc.LabelTTF.create(str, 'Times New Roman', 30);
            var useItem = cc.MenuItemLabel.create(useLabel, this._onClickUse(key, useLabel), this);
            useItem.setPosition(cc.p(420, 50));

            var lazyMenu = LazyMenu.create(cardItem, selectItem, useItem);
            lazyMenu.setPosition(cc.p(0, 0));
            cell.addChild(lazyMenu);

            var nameLabel = cc.LabelTTF.create("卡名：" + card.get("name"), 'Times New Roman', 30);
            nameLabel.setAnchorPoint(cc.p(0, 0));
            nameLabel.setPosition(cc.p(200, 70));
            cell.addChild(nameLabel);

            var lvLabel = cc.LabelTTF.create("等级：" + card.get("lv"), 'Times New Roman', 30);
            lvLabel.setAnchorPoint(cc.p(0, 0));
            lvLabel.setPosition(cc.p(200, 35));
            cell.addChild(lvLabel);

            var starLabel = cc.LabelTTF.create("星级：" + card.get("star"), 'Times New Roman', 30);
            starLabel.setAnchorPoint(cc.p(0, 0));
            starLabel.setPosition(cc.p(200, 0));
            cell.addChild(starLabel);

            scrollViewLayer.addChild(cell);

            this._cardListCell[key] = cell;
        }

        this._scrollViewHeight = 110 * len - 10;
        if (this._scrollViewHeight < 840) this._scrollViewHeight = 780;

        var scrollView = cc.ScrollView.create(cc.size(GAME_WIDTH, 780), scrollViewLayer);
        scrollView.setContentSize(cc.size(GAME_WIDTH, this._scrollViewHeight));
        scrollView.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 150));
        scrollView.setBounceable(false);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        var changeLineUpItem = cc.MenuItemFont.create("调整阵型", this._onClickChangeLineUp, this);
        changeLineUpItem.setPosition(cc.p(200, 1020));

        var okItem = cc.MenuItemFont.create("确定", this._onClickOk, this);
        okItem.setPosition(cc.p(550, 1020));

        var sellItem = cc.MenuItemFont.create("出售", this._onClickSell, this);
        sellItem.setPosition(cc.p(100, 980));

        var selectTypeLabel = cc.LabelTTF.create("升序排列", 'Times New Roman', 40);
        var selectTypeItem = cc.MenuItemLabel.create(selectTypeLabel, this._onClickChangeSelectType(selectTypeLabel), this);
        selectTypeItem.setPosition(cc.p(370, 980));

        var selectAllLowItem = cc.MenuItemFont.create("所有1/2星", this._onClickSelectAllLow, this);
        selectAllLowItem.setPosition(cc.p(590, 980));

        var menu = cc.Menu.create(changeLineUpItem, okItem, /*sellItem,*/ selectTypeItem, selectAllLowItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    update: function () {
        cc.log("CardListLayer update");

        var cardListIndex = this._cardList.sortCardList(this._sortType);
        var len = cardListIndex.length;

        for (var i = 0; i < len; ++i) {
            var index = this._selectType == SELECT_TYPE_DROP ? (len - i) : (i + 1);
            this._cardListCell[cardListIndex[i]].setPosition(cc.p(0, this._scrollViewHeight - index * 110));
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