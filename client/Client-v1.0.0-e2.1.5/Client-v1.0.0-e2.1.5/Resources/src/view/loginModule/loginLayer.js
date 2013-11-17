/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午10:47
 * To change this template use File | Settings | File Templates.
 */


/*
 * login layer
 * */


var LoginLayer = cc.Layer.extend({
    _loginLayerFit: null,

    _selectAreaItem: null,
    _scrollView: null,
    _loginItem: null,
    _accountEditBox: null,
    _passwordEditBox: null,

    init: function () {
        cc.log("LoginLayer init");

        if (!this._super()) return false;

        this.updateAreaList();

        user = gameData.user;

        this._loginLayerFit = gameFit.loginScene.loginLayer;

        var accountLabel = cc.LabelTTF.create("账号:", "STHeitiTC-Medium", 30);
        accountLabel.setPosition(this._loginLayerFit.accountLabelPoint);
        this.addChild(accountLabel);

        var passwordLabel = cc.LabelTTF.create("密码:", "STHeitiTC-Medium", 30);
        passwordLabel.setPosition(this._loginLayerFit.passwordLabelPoint);
        this.addChild(passwordLabel);

        this._accountEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create(main_scene_image.edit2));
        this._accountEditBox.setPosition(this._loginLayerFit.accountEditBoxPoint);
        this._accountEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_EMAILADDR);
        this._accountEditBox.setDelegate(this);
        this._accountEditBox.setFont("STHeitiTC-Medium", 25);
        this._accountEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._accountEditBox.setMaxLength(18);
        this.addChild(this._accountEditBox);

        this._passwordEditBox = cc.EditBox.create(cc.size(380, 60), cc.Scale9Sprite.create(main_scene_image.edit1));
        this._passwordEditBox.setPosition(this._loginLayerFit.passwordEditBoxPoint);
        this._passwordEditBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._passwordEditBox.setDelegate(this);
        this._passwordEditBox.setFontColor(cc.c3b(200, 0, 250));
        this._passwordEditBox.setMaxLength(18);
        this.addChild(this._passwordEditBox);

        this._accountEditBox.setText(user.get("account"));
        this._passwordEditBox.setText(user.get("password"));

        var selectLabel = StrokeLabel.create("点击选区", "STHeitiTC-Medium", 35);
        this._selectAreaItem = cc.MenuItemLabel.create(selectLabel, this._onClickOpenArea, this);
        this._selectAreaItem.setPosition(cc.p(320, 800));

        this._loginItem = cc.MenuItemFont.create("登录", this._onClickLogin, this);
        this._loginItem.setFontSize(45);
        this._loginItem.setPosition(this._loginLayerFit.loginButtonPoint);

        var registerItem = cc.MenuItemFont.create("注册", this._onClickRegister, this);
        registerItem.setFontSize(45);
        registerItem.setPosition(this._loginLayerFit.registerButtonPoint);

        this.menu = cc.Menu.create(this._selectAreaItem, this._loginItem, registerItem);
        this.menu.setPosition(cc.p(0, 0));
        this.addChild(this.menu);

        return true
    },

    updateAreaList: function () {
        cc.log("LoginLayer upateAreaList");

        var that = this;
        lz.server.connectGateServer(function () {
            that.addAreaList();

            that.scheduleOnce(that.updateAreaList, GATE_SERVER_TIMEOUT);
        });

    },

    addAreaList: function () {
        cc.log("LoginLayer addAreaList");

        if (this._scrollView) {
            this._scrollView.removeFromParent();
            this._scrollView = null;
        }

        var server = lz.server;
        var user = gameData.user;

        var areaId = user.get("area") || server.getRecommendArea();
        user.set("area", areaId);
        var areaList = server.get("areaList");
        var len = areaList.length;

        var scrollViewHeight = len * 50 + 10;
        if (scrollViewHeight < 200) {
            scrollViewHeight = 200;
        }

        var scrollViewLayer = MarkLayer.create(cc.rect(0, 700, 640, 200));
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        for (var i = 0; i < len; ++i) {
            var area = areaList[i];

            if (areaId == area.id) {
                var label = ColorLabelTTF.create(
                    {
                        string: area.desc,
                        fontName: "STHeitiTC-Medium",
                        fontSize: 35,
                        isStroke: true,
                        color: area.color
                    },
                    {
                        string: "    点击选区",
                        fontName: "STHeitiTC-Medium",
                        fontSize: 35
                    }
                );
                label.setAnchorPoint(cc.p(0, 0));
                this._selectAreaItem.setLabel(label);
            }

            var areaLabel = StrokeLabel.create(area.desc, "STHeitiTC-Medium", 35);
            areaLabel.setColor(area.color);
            areaLabel.setAnchorPoint(cc.p(0, 0));

            var areaItem = cc.MenuItemLabel.create(areaLabel, this._onClickArea(i), this);
            areaItem.setAnchorPoint(cc.p(0.5, 0));
            areaItem.setPosition(cc.p(320, scrollViewHeight - i * 50 - 50));
            menu.addChild(areaItem);
        }

        this._scrollView = cc.ScrollView.create(cc.size(640, 200), scrollViewLayer);
        this._scrollView.setPosition(cc.p(0, 700));
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());

        this._scrollView.setVisible(!this._selectAreaItem.isVisible());
    },

    _onClickOpenArea: function () {
        cc.log("LoginLayer _onClickOpenArea");

        this._selectAreaItem.setVisible(false);
        this._scrollView.setVisible(true);
    },

    _onClickArea: function (id) {
        return function () {
            cc.log("LoginLayer _onClickArea: " + id);

            var area = lz.server.get("areaList")[id];
            var user = gameData.user;

            if (!area.canLogin) {
                cc.log("服务器正在维护");

                TipLayer.tip("服务器正在维护");

                return;
            }

            user.set("area", area.id);

            var label = ColorLabelTTF.create(
                {
                    string: area.desc,
                    fontName: "STHeitiTC-Medium",
                    fontSize: 35,
                    isStroke: true,
                    color: area.color
                },
                {
                    string: "    点击选区",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 35
                }
            );
            label.setAnchorPoint(cc.p(0, 0));
            this._selectAreaItem.setLabel(label);

            this._scrollView.setVisible(false);
            this._selectAreaItem.setVisible(true);
        }
    },

    _onClickLogin: function () {
        cc.log("LoginLayer _onClickLogin");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var user = gameData.user;

        user.set("account", this._accountEditBox.getText());
        user.set("password", this._passwordEditBox.getText());

        if (!user.canLogin()) {
            return;
        }

        var that = this;
        user.login(function (type) {
            cc.log(type);

            if (type == 1) {
                cc.Director.getInstance().replaceScene(MainScene.getInstance());
            } else if (type == 2) {
                that.getParent().switchLayer(NewPlayerLayer);
            }
        });
    },

    _onClickRegister: function () {
        cc.log("LoginLayer _onClickRegister");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.getParent().switchLayer(RegisterLayer);
    }
});

LoginLayer.create = function () {
    var ret = new LoginLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};