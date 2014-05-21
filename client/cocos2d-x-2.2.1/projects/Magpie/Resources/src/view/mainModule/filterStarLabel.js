/**
 * Created by lujunyu on 14-5-21.
 */

var FilterStarLabel = LazyLayer.extend({

    _selectIcons: [],
    _starFlag: 0,
    _cb: null,

    onEnter: function () {
        cc.log("FilterStarLabel onEnter");

        this._super();
        this.update();
    },

    init: function (args) {
        cc.log("FilterStarLabel init");

        if (!this._super()) return false;

        this._starFlag = 0;
        this._cb = args.cb || null;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var frameLayer = cc.Node.create();
        frameLayer.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(frameLayer);

        var bgLabel = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgLabel.setContentSize(cc.size(580, 730));
        bgLabel.setPosition(cc.p(0, 0));
        frameLayer.addChild(bgLabel);

        var titleLabel = cc.LabelTTF.create("选择星级", "STHeitiTC-Medium", 22);
        titleLabel.setPosition(cc.p(-190, 330));
        frameLayer.addChild(titleLabel);

        var menu = cc.Menu.create();
        menu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);
        menu.setPosition(cc.p(0, 0));
        frameLayer.addChild(menu);

        for (var i = 1; i <= 7; i++) {

            var url = "button89";
            if (i == 1 || i == 7) {
                url = "button88";
            }

            var y = 350 - i * 85;

            var selectStarItem = cc.MenuItemImage.create(
                main_scene_image[url],
                main_scene_image[url + "s"],
                this._onClickSelect(i),
                this
            );
            selectStarItem.setPosition(cc.p(0, y));

            if (i == 7) {
                selectStarItem.setRotation(180);
            }

            var numLabel = cc.LabelTTF.create(i, "STHeitiTC-Medium", 30);
            numLabel.setPosition(cc.p(-230, y));
            numLabel.setColor(cc.c3b(254, 255, 178));
            frameLayer.addChild(numLabel);

            var starIcon = cc.Sprite.create(main_scene_image.star1);
            starIcon.setPosition(cc.p(-200, y));
            frameLayer.addChild(starIcon);

            var selectBgIcon = cc.Sprite.create(main_scene_image.icon27);
            selectBgIcon.setPosition(cc.p(200, y));
            frameLayer.addChild(selectBgIcon);

            var selectIcon = cc.Sprite.create(main_scene_image.icon20);
            selectIcon.setPosition(cc.p(200, y));
            frameLayer.addChild(selectIcon);

            this._selectIcons[i] = selectIcon;

            menu.addChild(selectStarItem);
        }

        var OKItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOK,
            this
        );
        OKItem.setPosition(cc.p(0, -315));
        menu.addChild(OKItem);

        return true;
    },

    update: function () {
        cc.log("FilterStarLabel update");

        for (var i = 1; i <= 7; i++) {
            var flag = this._starFlag >> i & 1;
            this._selectIcons[i].setVisible(flag);
        }
    },

    _onClickSelect: function (id) {
        var that = this;
        return function () {
            cc.log("FilterStarLabel _onClickSelect: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            that._starFlag = that._starFlag ^ (1 << id);
            that.update();

        }
    },

    _onClickOK: function () {
        cc.log("FilterStarLabel _onClickOK");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();

        if (this._cb) {
            this._cb(this._starFlag);
        }

    }
});

FilterStarLabel.create = function (args) {
    cc.log("FilterStarLabel create");

    var ret = new FilterStarLabel();
    if (ret && ret.init(args)) {
        return ret;
    }
    return null;
};

FilterStarLabel.pop = function (args) {
    cc.log("FilterStarLabel pop");

    var filterStarLabel = FilterStarLabel.create(args);
    MainScene.getInstance().getLayer().addChild(filterStarLabel, 10);
};