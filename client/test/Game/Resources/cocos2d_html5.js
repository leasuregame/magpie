/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-20
 * Time: 下午11:31
 * To change this template use File | Settings | File Templates.
 */

/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

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
(function () {
    var d = document;
    var c = {
        COCOS2D_DEBUG:2, //0 to turn debug off, 1 for basic debug, and 2 for full debug
        box2d:false,
        chipmunk:false,
        showFPS:true,
        frameRate:60,
        loadExtension:true,
        tag:'gameCanvas', //the dom element to run cocos2d on
        engineDir:'../../../Cocos2d-html5-v2.1.3/cocos2d/',
        //SingleEngineFile:'',
        appFiles:[
            'src/resource.js',
            'src/actionFactory.js',
            'src/skillFactory.js',
            'src/model/singleton.js',
            'src/model/base.js',
            'src/model/gameConfig.js',
            'src/model/player.js',
            'src/controls/cloudLayer.js',
            'src/controls/progress.js',
            'src/controls/bgSprite.js',
            'src/controls/dialog.js',
            'src/view/battleLayer.js',
            'src/view/battleScene.js',
            'src/view/battlePlayer.js',
            'src/view/testLayer.js',
            'src/view/testScene.js',
            'src/view/mainMenuLayer.js',
            'src/view/mainBgLayer.js',
            'src/view/mainLayer.js',
            'src/view/shopLayer.js',
            'src/view/cardLibraryLayer.js',
            'src/view/rankLayer.js',
            'src/view/friendLayer.js',
            'src/view/messageLayer.js',

            'src/view/taskLayer.js',
            'src/view/lotteryLayer.js',
            'src/view/passLayer.js',
            'src/view/tournamentLayer.js',
            'src/view/strengthenLayer.js',

            'src/view/main.js',
            'src/myApp.js', //add your own files in order here
            'main_html5.js'
        ]
    };

    if(!d.createElement('canvas').getContext){
        var s = d.createElement('div');
        s.innerHTML = '<h2>Your browser does not support HTML5 canvas!</h2>' +
            '<p>Google Chrome is a browser that combines a minimal design with sophisticated technology to make the web faster, safer, and easier.Click the logo to download.</p>' +
            '<a href="http://www.google.com/chrome" target="_blank"><img src="http://www.google.com/intl/zh-CN/chrome/assets/common/images/chrome_logo_2x.png" border="0"/></a>';
        var p = d.getElementById(c.tag).parentNode;
        p.style.background = 'none';
        p.style.border = 'none';
        p.insertBefore(s);

        d.body.style.background = '#ffffff';
        return;
    }

    window.addEventListener('DOMContentLoaded', function () {
        //first load engine file if specified
        var s = d.createElement('script');
        /*********Delete this section if you have packed all files into one*******/
        if (c.SingleEngineFile && !c.engineDir) {
            s.src = c.SingleEngineFile;
        }
        else if (c.engineDir && !c.SingleEngineFile) {
            s.src = c.engineDir + 'platform/jsloader.js';
        }
        else {
            alert('You must specify either the single engine file OR the engine directory in "cocos2d.js"');
        }
        /*********Delete this section if you have packed all files into one*******/

            //s.src = 'Packed_Release_File.js'; //IMPORTANT: Un-comment this line if you have packed all files into one

        document.ccConfig = c;
        s.id = 'cocos2d-html5';
        d.body.appendChild(s);
        //else if single file specified, load singlefile
    });
})();
