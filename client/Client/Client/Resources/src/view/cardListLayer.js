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
    _sortType: null,
    _cardListCell: {},
    _selectCount: 0,
    _selectType: SELECT_TYPE_DROP,

    init: function (sortType, selectCount) {
        cc.log("CardListLayer init");

        if (!this._super()) return false;

        this._cardList = gameData.cardList;
        this._sortType = sortType;
        this._selectCount = selectCount;

        var scrollViewLayer = cc.Layer.create();
        var len = this._cardList.get("length");
        var cardList = this._cardList.get("cardList");
        var key;
        var str;

        for(key in cardList) {
            var card = cardList[key];

            var cell = cc.LayerColor.create(cc.c4b(100, 100, 0, 100), GAME_WIDTH, 100);
            cell.setAnchorPoint(cc.p(0, 0));
            cell.setPosition(cc.p(0, 0));
            cell.isSelect = false;

            var cardItem = cc.MenuItemImage.create(s_h_hero_1, s_h_hero_1, function() {
                cc.log("click card Item" + key);
            }, this);
            cardItem.setPosition(cc.p(100, 50));

            var selectLabel = cc.LabelTTF.create("未选择", 'Times New Roman', 30);
            var selectItem = cc.MenuItemLabel.create(selectLabel, function() {
                cc.log("click selectItem");
                cell.isSelect = !cell.isSelect;
                var str = cell.isSelect ? "已选择" : "未选择";
                selectLabel.setString(str);
            }, this);
            selectItem.setPosition(cc.p(560, 50));

            var str = card.get("isUse") ? "已上阵" : "未上阵";
            var useLabel = cc.LabelTTF.create(str, 'Times New Roman', 30);
            var useItem = cc.MenuItemLabel.create(useLabel, function() {
                cc.log("click useItem");
                card.clickUse();
                var str = card.get("isUse") ? "已上阵" : "未上阵";
                useLabel.setString(str);
            }, this);
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

        var scrollView = cc.ScrollView.create(cc.size(GAME_WIDTH, 840), scrollViewLayer);
        scrollView.setContentSize(cc.size(GAME_WIDTH, 840));
        scrollView.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 150));
        scrollView.setBounceable(false);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        this.update();

        str = this._selectType == SELECT_TYPE_DROP ? "升序排列" : "降序排列";
        var selectTypeLabel = cc.LabelTTF.create(str, 'Times New Roman', 30);
        var selectTypeItem = cc.MenuItemLabel.create(selectTypeLabel, function() {
            cc.log("click selectTypeItem");
            this._selectType ^= 1;
            str = this._selectType == SELECT_TYPE_DROP ? "升序排列" : "降序排列";
            useLabel.setString(str);
        }, this);
        selectTypeItem.setPosition(cc.p(420, 50));

        var okItem = cc.MenuItemFont.create("确定", this._onClickOk, this);

        return true;
    },

    update: function () {
        cc.log("CardListLayer update");

        var cardListIndex = this._cardList.sortCardList(this._sortType);
        var len = cardListIndex.length;

        for(var i = 0; i < len; ++i) {
            this._cardListCell[cardListIndex[i]].setPosition(cc.p(0, i * 110));
        }
    },

    // 重新设置排序方式，读取卡牌列表，并更新到界面
    setSortType: function (sortType) {
        cc.log("CardListLayer setSortType");

        if (sortType != this._sortType) {
            this._sortType = sortType;
        }
    },

    setSelectCount: function (selectCount) {
        cc.log("CardListLayer setSelectCount");

        if (selectCount != this._selectCount) {
            this._selectCount = selectCount;
        }
    },

    _onClickOk: function() {
        cc.log("CardListLayer _onClickOk");
    }
})


CardListLayer.create = function (sortType, selectCount) {
    var ret = new CardListLayer();

    if (ret && ret.init(sortType, selectCount)) {
        return ret;
    }

    return null;
}