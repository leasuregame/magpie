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
    var strImage = null;

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
        strImage = three;
    }

    if (len == 6) {
        ret = cc.MenuItemImage.create(normalImage, selectedImage, three, five, six);
        strImage = four;
    }

    if (ret && strImage) {
        ret._strImage = null;
        strImage = cc.Sprite.create(strImage);

        ret.setStrImage = function (strImage) {
            if (ret._strImage == strImage)
                return;

            if (strImage) {
                var contentSize = ret.getContentSize();
                var strImageSize = strImage.getContentSize();
                var position = cc.p(
                    contentSize.width / 2 - strImageSize.width / 2,
                    contentSize.height / 2 - strImageSize.height / 2
                );

                ret.addChild(strImage);
                strImage.setPosition(position);
                strImage.setAnchorPoint(cc.p(0, 0));
            }

            if (ret._strImage) {
                ret.removeChild(ret._strImage, true);
            }

            ret._strImage = strImage;
        };

        ret._oldSetColor = ret.setColor;
        ret.setColor = function (color) {
            ret._oldSetColor(color);

            if (ret._strImage) {
                ret._strImage.setColor(color);
            }
        };

        ret._oldSetOpacity = ret.setOpacity;
        ret.setOpacity = function (opacity) {
            ret._oldSetOpacity(opacity);

            if (ret._strImage) {
                ret._strImage.setOpacity(opacity);
            }
        };

        ret.setStrImage(strImage);
    }

    if (ret) {
        return ret;
    }

    return null;
};