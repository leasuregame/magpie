/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-15
 * Time: 下午3:09
 * To change this template use File | Settings | File Templates.
 */


/*
 * player details layer
 * */


var PlayerDetailsLayer = LazyLayer.extend({
    _goldLabel: null,
    _moneyLabel: null,
    _skillPointLabel: null,


    init: function () {
        cc.log("PlayerDetailsLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.player_details_bg);
        bgSprite.setPosition(GAME_MIDPOINT);
        this.addChild(bgSprite);

        var closeItem = cc.MenuItemImage.create(main_scene_image.button0, main_scene_image.button0s, this._onClickClose, this);
        closeItem.setPosition(cc.p(620, 1000));
        this.addMenuItem(closeItem);

        return true;
    },

    _onClickClose: function () {
        cc.log("PlayerDetailsLayer _onClickClose");

        this.setCanClick(false);
        this.removeFromParent();
    }
})


PlayerDetailsLayer.create = function () {
    var ret = new PlayerDetailsLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}