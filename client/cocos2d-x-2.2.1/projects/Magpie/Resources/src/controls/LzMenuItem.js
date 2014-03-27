/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-11
 * Time: 上午11:21
 * To change this template use File | Settings | File Templates.
 */


/*
 * lz menu item
 * */

cc.MenuItemImage.createWithIcon = function (normalImage, selectedImage, three, four, five, six) {
    var len = arguments.length;
    var ret = null;
    var iconImage = null;

    if (len == 0) {
        ret = cc.MenuItemImage.create();
    }

    if (len == 3) {
        ret = cc.MenuItemImage.create(normalImage, selectedImage, three);
    }

    if (len == 4) {
        ret = cc.MenuItemImage.create(normalImage, selectedImage, three, four);
    }

    if (len == 5) {
        ret = cc.MenuItemImage.create(normalImage, selectedImage, four, five);
        iconImage = three;
    }

    if (len == 6) {
        ret = cc.MenuItemImage.create(normalImage, selectedImage, three, five, six);
        iconImage = four;
    }

    if (ret) {
        ret._iconImage = null;

        ret.setIconImage = function (iconImage, offset) {
            if (typeof iconImage == "string") {
                iconImage = cc.Sprite.create(iconImage);
            }

            if (ret._iconImage == iconImage)
                return;

            if (iconImage) {
                var contentSize = ret.getContentSize();
                var iconImageSize = iconImage.getContentSize();

                offset = offset || cc.p(0, 0);
                var position = cc.p(
                    contentSize.width / 2 - iconImageSize.width / 2 + offset.x,
                    contentSize.height / 2 - iconImageSize.height / 2 + offset.y
                );

                ret.addChild(iconImage);
                iconImage.setPosition(position);
                iconImage.setAnchorPoint(cc.p(0, 0));
            }

            if (ret._iconImage) {
                ret.removeChild(ret._strImage, true);
            }

            ret._iconImage = iconImage;
        };

        ret.getIconImage = function () {
            return (ret._iconImage || null);
        };

        ret.setOffset = function (offset) {
            var position = this._iconImage.getPosition();

            position.x += offset.x;
            position.y += offset.y;

            this._iconImage.setPosition(position);
        };

        ret.getOffset = function () {
            return this._iconImage.getPosition();
        };

        ret.showIconImage = function () {
            if (ret._iconImage) {
                ret._iconImage.setVisible(true);
            }
        };

        ret.hidIconImage = function () {
            if (ret._iconImage) {
                ret._iconImage.setVisible(false);
            }
        };

        ret._oldSetColor = ret.setColor;
        ret.setColor = function (color) {
            ret._oldSetColor(color);

            if (ret._iconImage) {
                ret._iconImage.setColor(color);
            }
        };

        ret._oldSetOpacity = ret.setOpacity;
        ret.setOpacity = function (opacity) {
            ret._oldSetOpacity(opacity);

            if (ret._iconImage) {
                ret._iconImage.setOpacity(opacity);
            }
        };

        ret.setIconImage(iconImage);
    }

    if (ret) {
        return ret;
    }

    return null;
};