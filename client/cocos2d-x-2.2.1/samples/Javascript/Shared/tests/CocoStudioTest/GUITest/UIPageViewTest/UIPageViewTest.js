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

var UIPageViewTest = UIScene.extend({
    init: function () {
        if (this._super()) {
            var widgetRect = this._widget.getRect();
            //init text
            this._topDisplayLabel.setText("Move by horizontal direction");
            this._topDisplayLabel.setPosition(cc.p(widgetRect.width / 2.0,  widgetRect.height / 2.0 + this._topDisplayLabel.getContentSize().height * 1.5));
            this._bottomDisplayLabel.setText("PageView");
            this._bottomDisplayLabel.setPosition(cc.p(widgetRect.width / 2, widgetRect.height / 2 - this._bottomDisplayLabel.getRect().height * 3));

            var background = this._uiLayer.getWidgetByName("background_Panel");

            // Create the page view
            var pageView = ccs.UIPageView.create();
            pageView.setTouchEnable(true);
            pageView.setSize(cc.size(240, 130));
            var backgroundSize = background.getContentSize();
            pageView.setPosition(cc.p((widgetRect.width - backgroundSize.width) / 2 +
                (backgroundSize.width - pageView.getRect().width) / 2,
                (widgetRect.height - backgroundSize.height) / 2 +
                    (backgroundSize.height - pageView.getRect().height) / 2));

            for (var i = 0; i < 3; ++i) {
                var layout = ccs.UILayout.create();
                layout.setSize(cc.size(240, 130));
                var layoutRect = layout.getRect();

                var imageView = ccs.UIImageView.create();
                imageView.setTouchEnable(true);
                imageView.setScale9Enabled(true);
                imageView.loadTexture("res/cocosgui/scrollviewbg.png");
                imageView.setSize(cc.size(240, 130));
                imageView.setPosition(cc.p(layoutRect.width / 2, layoutRect.height / 2));
                layout.addChild(imageView);

                var label = ccs.UILabel.create();
                label.setText("page" + (i + 1));
                label.setFontName("Marker Felt");
                label.setFontSize(30);
                label.setColor(cc.c3b(192, 192, 192));
                label.setPosition(cc.p(layoutRect.width / 2, layoutRect.height / 2));
                layout.addChild(label);

                pageView.addPage(layout);
            }
            pageView.addEventListenerPageView(this.pageViewEvent, this);
            var a = ccs.UILayout.create();
            this._uiLayer.addWidget(pageView);

            return true;
        }
        return false;
    },

    pageViewEvent: function (sender, type) {
        switch (type) {
            case ccs.PageViewEventType.turning:
                var pageView = sender;
                this._topDisplayLabel.setText("page = " + (pageView.getCurPageIndex() + 1));
                break;
            default:
                break;
        }
    }
});
