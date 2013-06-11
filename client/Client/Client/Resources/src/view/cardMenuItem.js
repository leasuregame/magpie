/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-3
 * Time: 下午3:31
 * To change this template use File | Settings | File Templates.
 */


/*
 * card menu item
 * */


var CardMenuItem = cc.MenuItem.extend({
    init: function (card) {
        if (!this._super()) return false;

        return true;
    }
})


CardMenuItem.create = function (card) {
    var ret = new CardMenuItem();

    if (ret && ret.init(card)) {
        return ret;
    }

    return null;
}

