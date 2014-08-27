/****************************************************************************
 Copyright (c) 2013 cocos2d-x.org

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var UIImageViewTest = UIScene.extend({
    init: function () {
        if (this._super()) {
            //init text
            this._topDisplayLabel.setText("");
            this._bottomDisplayLabel.setText("ImageView");

            var widgetRect = this._widget.getRect();
            // Create the imageview
            var imageView = ccs.UIImageView.create();
            imageView.loadTexture("res/cocosgui/ccicon.png");
            imageView.setPosition(cc.p(widgetRect.width / 2, widgetRect.height / 2 + imageView.getRect().height / 4));
            this._uiLayer.addWidget(imageView);

            return true;
        }
        return false;
    }
});

var UIImageViewTest_Scale9 = UIScene.extend({
    init: function () {
        if (this._super()) {
            var widgetRect = this._widget.getRect();
            //init text
            this._topDisplayLabel.setText("");
            this._bottomDisplayLabel.setText("ImageView scale9 render");

            // Create the imageview
            var imageView = ccs.UIImageView.create();
            imageView.setScale9Enabled(true);
            imageView.loadTexture("res/cocosgui/buttonHighlighted.png");
            imageView.setSize(cc.size(200, 85));
            imageView.setPosition(cc.p(widgetRect.width / 2, widgetRect.height / 2 + imageView.getRect().height / 4));
            this._uiLayer.addWidget(imageView);

            return true;
        }
        return false;
    }
});