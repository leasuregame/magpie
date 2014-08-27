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

var UINodeContainerTest = UIScene.extend({
    init: function () {
        if (this._super()) {
            var widgetRect = this._widget.getRect();
            //init text
            this._topDisplayLabel.setText("");
            this._bottomDisplayLabel.setText("NodeContainer");

            // Create the ui node container
            var nodeContainer = ccs.UINodeContainer.create();
            nodeContainer.setPosition(cc.p(widgetRect.width / 2, widgetRect.height / 2));
            this._uiLayer.addWidget(nodeContainer);

            var sprite = cc.Sprite.create("res/cocosgui/ccicon.png");
            sprite.setPosition(cc.p(0, sprite.getBoundingBox().height / 4));
            nodeContainer.addCCNode(sprite);

            return true;
        }
        return false;
    }
});
