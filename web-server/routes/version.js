var filter = require('../util/filter');
var helper = require('../../shared/version_helper');
var KSS_HOST = 'http://kss.ksyun.com';
var updateRecordDao = require('../dao/updateRecordDao');
var async = require('async');
var util = require('util');

var version = function(app) {

    var localDateString = function (date) {
        return util.format('%s-%s-%s %d:%d:%d', date.getFullYear(), date.getMonth() + 1,
            date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
    };

    /**
     * render version
     */
    app.get('/admin/version', filter.authorize, function (req, res) {
        res.render('manage', {
            menu: 'version',
            version: helper.versionData()
        });
    });

    /**
     * update version
     */
    app.post('/admin/version', filter.authorize, function (req, res) {
        helper.updateVersions(req.body);
        res.redirect('/admin/version');
    });

    /**
     * render version detail
     */
    app.get('/admin/version/details/:version', filter.authorize, function (req, res) {
        var version = req.params.version;

        async.parallel([
            function (cb) {
                updateRecordDao.period(version, cb);
            },
            function (cb) {
                updateRecordDao.getByVersion(version, cb);
            },
            function (cb) {
                updateRecordDao.versionCounts(cb);
            },
            function (cb) {
                updateRecordDao.getUserCount(cb);
            }
        ], function (err, results) {
            if (err) {
                return res.status(500).send('服务器出错');
            }
            var period = results[0];
            var rows = results[1];
            var counts = results[2];
            var userNum = results[3];

            res.render('versionDetails', {
                maxDate: localDateString(period[0].maxDate),
                minDate: localDateString(period[0].minDate),
                counts: counts,
                version: version,
                userNum: userNum[0].num,
                rows: rows.map(function (r) {
                    return {
                        version: r.version,
                        created: localDateString(r.created).split(' ')[0],
                        num: r.num
                    };
                })
            });
        });
    });


    function getVersion4Api (req, res) {
        var platform = req.params.platform;
        helper.version(platform, function (err, ver) {
            if (err != null) {
                res.status(404).send(err);
            } else {
                res.send(ver);
            }
        });
    }

    function updateVersion4Api (req, res) {
        var ver = req.params.version;
        var platform = req.params.platform;
        var vData = helper.versionData();
        if (!platform in vData) {
            return res.status(404).send('找不到版本信息' + platform);
        }

        if (ver != null && ver != '' && !/^\d{1,2}.\d{1,2}.\d{1,2}$/.test(ver)) {
            return res.status(400).send('版本号格式错误');
        }

        var lastVersion = helper.lastVersion(platform);
        if (!lastVersion) {
            return res.status(400).send('找不到上一版本号')
        }

        var filename = vData[platform].filename;
        if (helper.versionCompare(ver, lastVersion) < 0) {
            filename = vData[platform].lastFilename;
        }

        res.redirect(helper.make_request_url('GET', 'magpie', filename, KSS_HOST));
    }

    // api for game client
    app.get('/api/:platform/version', getVersion4Api);
    app.get('/api/:platform/update', updateVersion4Api);
    app.get('/api/:platform/update/:version', updateVersion4Api);

};

module.exports = version;