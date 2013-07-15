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


var CustomTableViewCell = cc.TableViewCell.extend({
    draw:function (ctx) {
        this._super(ctx);
    }
});

var CardListLayer = cc.Layer.extend({
    _cardList: null,
    _sortType: null,
    _selectCount: 0,

    init: function (sortType, selectCount) {
        cc.log("CardListLayer init");

        if (!this._super()) return false;

        this._cardList = gameData.cardList;

        var tableView = cc.TableView.create(this, cc.size(60, 350));
        tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        tableView.setPosition(cc.p(winSize.width - 150, winSize.height / 2 - 150));
        tableView.setDelegate(this);
        tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.addChild(tableView);
        tableView.reloadData();

        return true;
    },

    toExtensionsMainLayer:function (sender) {
        var scene = new ExtensionsTestScene();
        scene.runThisTest();
    },

    scrollViewDidScroll:function (view) {
    },
    scrollViewDidZoom:function (view) {
    },

    tableCellTouched:function (table, cell) {
        cc.log("cell touched at index: " + cell.getIdx());
    },

    cellSizeForTable:function (table) {
        return cc.size(60, 60);
    },

    tableCellAtIndex:function (table, idx) {
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        var label;
        if (!cell) {
            cell = new CustomTableViewCell();
            var sprite = cc.Sprite.create(s_image_icon);
            sprite.setAnchorPoint(cc.p(0,0));
            sprite.setPosition(cc.p(0, 0));
            cell.addChild(sprite);

            label = cc.LabelTTF.create(strValue, "Helvetica", 20.0);
            label.setPosition(cc.p(0,0));
            label.setAnchorPoint(cc.p(0,0));
            label.setTag(123);
            cell.addChild(label);
        } else {
            label = cell.getChildByTag(123);
            label.setString(strValue);
        }

        return cell;
    },

    numberOfCellsInTableView:function (table) {
        return 25;
    },

    // 重新设置排序方式，读取卡牌列表，并更新到界面
    setSortType: function (sortType) {
        if (sortType != this._sortType) {
            this._sortType = sortType;
        }
    },

    setSelectCount: function(selectCount) {
        if(selectCount != this._selectCount) {
            this._selectCount = selectCount;
        }
    }
})


CardListLayer.create = function (sortType, selectCount) {
    var ret = new CardListLayer();

    if (ret && ret.init(sortType, selectCount)) {
        return ret;
    }

    return null;
}