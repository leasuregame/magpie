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

var UIButtonTest = UIScene.extend({
    init: function () {
        if (this._super()) {
            //init text
            this._topDisplayLabel.setText("No Event");
            this._bottomDisplayLabel.setText("Button");

            var widgetRect = this._widget.getRect();
            // Create the button
            var button = ccs.UIButton.create();
            button.setTouchEnable(true);
            button.loadTextures("res/cocosgui/animationbuttonnormal.png", "res/cocosgui/animationbuttonpressed.png", "");
            button.setPosition(cc.p(widgetRect.width / 2.0, widgetRect.height / 2.0));
            button.addTouchEventListener(this.touchEvent ,this);
            this._uiLayer.addWidget(button);

            return true;
        }
        return false;
    },

    touchEvent: function (sender, type) {
        switch (type) {
            case ccs.TouchEventType.began:
                this._topDisplayLabel.setText("Touch Down");
                break;

            case ccs.TouchEventType.moved:
                this._topDisplayLabel.setText("Touch Move");
                break;

            case ccs.TouchEventType.ended:
                this._topDisplayLabel.setText("Touch Up");
                break;

            case ccs.TouchEventType.canceled:
                this._topDisplayLabel.setText("Touch Cancelled");
                break;

            default:
                break;
        }
    }
});
var UIButtonTest_Scale9 = UIScene.extend({
    init: function () {
        if (this._super()) {
            //init text
            this._topDisplayLabel.setText("No Event");
            this._bottomDisplayLabel.setText("Button scale9 render");

            var widgetRect = this._widget.getRect();
            // Create the button
            var button = ccs.UIButton.create();
            button.setTouchEnable(true);
            button.setScale9Enabled(true);
            button.loadTextures("res/cocosgui/button.png", "res/cocosgui/buttonHighlighted.png", "");
            button.setPosition(cc.p(widgetRect.width / 2.0, widgetRect.height / 2.0));
            button.setSize(cc.size(150, button.getContentSize().height * 1.5));
            button.addTouchEventListener(this.touchEvent ,this);
            this._uiLayer.addWidget(button);

            return true;
        }
        return false;
    },

    touchEvent: function (sender, type) {
        switch (type) {
            case ccs.TouchEventType.began:
                this._topDisplayLabel.setText("Touch Down");
                break;
            case ccs.TouchEventType.moved:
                this._topDisplayLabel.setText("Touch Move");
                break;
            case ccs.TouchEventType.ended:
                this._topDisplayLabel.setText("Touch Up");
                break;
            case ccs.TouchEventType.canceled:
                this._topDisplayLabel.setText("Touch Cancelled");
                break;

            default:
                break;
        }
    }
});

var UIButtonTest_PressedAction = UIScene.extend({
    init: function () {
        if (this._super()) {
            //init text
            this._topDisplayLabel.setText("No Event");
            this._bottomDisplayLabel.setText("Button Pressed Action");

            var widgetRect = this._widget.getRect();
            // Create the button
            var button = ccs.UIButton.create();
            button.setTouchEnable(true);
            button.setPressedActionEnabled(true);
            button.loadTextures("res/cocosgui/animationbuttonnormal.png", "res/cocosgui/animationbuttonpressed.png", "");
            button.setPosition(cc.p(widgetRect.width / 2, widgetRect.height / 2));
            button.addTouchEventListener(this.touchEvent ,this);
            this._uiLayer.addWidget(button);
            return true;
        }
        return false;
    },

    touchEvent: function (sender, type) {
        switch (type) {
            case ccs.TouchEventType.began:
                this._topDisplayLabel.setText("Touch Down");
                break;
            case ccs.TouchEventType.moved:
                this._topDisplayLabel.setText("Touch Move");
                break;
            case ccs.TouchEventType.ended:
                this._topDisplayLabel.setText("Touch Up");
                break;
            case ccs.TouchEventType.canceled:
                this._topDisplayLabel.setText("Touch Cancelled");
                break;
            default:
                break;
        }
    }
});