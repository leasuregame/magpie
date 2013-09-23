/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-24
 * Time: 上午11:33
 * To change this template use File | Settings | File Templates.
 */


/*
 * pass label
 * */


var PassLabel = cc.Node.extend({
    _index: 0,
    _passItem: null,

    onEnter: function () {
        cc.log("PassLabel onEnter");

        this._super();
        this.update();
    },

    init: function (index) {
        cc.log("PassLabel init");

        if (!this._super()) return false;

        this._index = index;

        var str = "button14";
        if (this._index % PASS_BOSS_SPACE == 0) str = "button13";

        this._passItem = cc.MenuItemImage.create(
            main_scene_image[str],
            main_scene_image[str + "s"],
            main_scene_image[str + "d"],
            this._onClickDefiance,
            this
        );
        this._passItem.setAnchorPoint(cc.p(0, 0));
        var menu = LazyMenu.create(this._passItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    update: function () {
        cc.log("PassLabel update");

        this._passItem.setEnabled(gameData.pass.getMarkByIndex(this._index));
    },

    _onClickDefiance: function () {
        cc.log("PassLayer _onClickDefiance " + this._index);

        var pass = gameData.pass;

        if (this._index > pass.get("passTop") + 1) {
            cc.log("can't Defiance");
            return;
        }

        pass.defiance(function (id) {
            BattlePlayer.getInstance().play(id);
        }, this._index);
    }
});


PassLabel.create = function (index) {
    var ret = new PassLabel();

    if (ret && ret.init(index)) {
        return ret;
    }

    return null;
};