/*
 * GET users listing.
 */

var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var dataUtil = require('../util/dataUtil');
var filter = require('../util/filter');


var SIZE_MAP = {
  '1024x768': '18px', 
  '2048x1536': '18px',
  
  '480x320': '12px', 
  '960x640': '12px', 
  '1136x640': '12px'
};

var notice = function(app) {

    var readFile = function (name) {
        return fs.readFileSync(path.join(__dirname, '..', 'views', name), 'utf8');
    };

    var writeFile = function (name, text) {
        fs.writeFileSync(path.join(__dirname, '..', 'views', name), text);
    };

    exports.admin = function (req, res) {
        res.render('admin', {
            title: '公告编辑',
            menu: 'notice',
            content: readFile('notice.html')
        });
    };

    /**
     * render noticeList
     */
    app.get('/admin/notice', filter.authorize, function (req, res) {
        res.render('noticeList', {
            notices: dataUtil.getJson('notice'),
            menu: 'notice'
        });
    });

    /**
     * make newNotice
     */
    app.post('/admin/notice', filter.authorize, function (req, res) {
        var data = dataUtil.getJson('notice');
        if (!req.body.inputName || !req.body.inputPlatform) {
            return res.status(400);
        }

        var item = {
            'name': req.body.inputName,
            'platform': req.body.inputPlatform,
            'filename': req.body.inputPlatform + '_notice.html'
        };
        data.push(item);
        dataUtil.setJson('notice', data);
        res.redirect('/admin/notice');
    });

    /**
     * render Notices by platform
     */
    app.get('/admin/notice/:platform', filter.authorize, function (req, res) {
        var platform = req.params.platform;

        var notices = dataUtil.getJson('notice').filter(function (i) {
            return i.platform == platform;
        });

        if (notices.length == 0) {
            return res.status(404).send('Not found notice by ' + platform);
        } else {
            ntc = notices[0];
        }

        res.render('noticeChange', {
            title: '公告编辑',
            menu: 'notice',
            platform: platform,
            content: dataUtil.html(platform + '_notice')
        });
    });

    /**
     * save Notice
     */
    app.post('/admin/notice/:platform', filter.authorize, function (req, res) {
        var platform = req.params.platform;

        var notices = dataUtil.getJson('notice').filter(function (i) {
            return i.platform == platform;
        });

        if (notices.length == 0) {
            return res.status(404).send(platform + ' not exists');
        }

        console.log('before content', req.body.content);
        if (req.body.content) {
            console.log('save content');
            dataUtil.saveHtml(platform + '_notice', req.body.content);
        }
        res.end();
    });

    /**
     * delete Notice
     */
    app.delete('/admin/notice/:platform', filter.authorize, function (req, res) {
        var platform = req.params.platform;
        var data = dataUtil.getJson('notice');

        var idx = 0,
            i, item;
        for (i = 0; i < data.length; i++) {
            item = data[i];
            if (item.platform == platform) {
                idx = i;
                break;
            }
        }
        data.splice(idx, 1);
        dataUtil.setJson('notice', data);
        dataUtil.delFile(platform + '_notice.html');
        res.send('ok');
    });

    /**
     * api for game client
     */
    app.get('/api/:platform/notice', function (req, res) {
        var platform = req.params.platform;
        var w = req.query.w;
        var h = req.query.h;
        var key = h + 'x' + w;

        res.render('notice', {
            title: platform + '公告',
            content: dataUtil.html(platform + '_notice'),
            size: SIZE_MAP[key] || '12px'
        });
    });

};

module.exports = notice;