var Url = require('url');
var filter = require('../util/filter');
var path = require('path');
var _ = require('underscore');

var upload = function(app) {

    app.get('/admin/uploadWCConfig', function(req, res) {
        res.render('upload', {
            menu: 'upload',
            title: '世界杯赛果上传',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.all('/admin/doUploadWorldCupConfig', function(req, res) {
        var fs = require('fs');

        // 获得文件的临时路径
        var file = req.files.configFile;
        var tmp_path = file.path;
        // 指定文件上传后的目录 - 示例为"images"目录。
        var target_path = path.join(__dirname,'..','..','game-server','data','share','world_cup', file.name);

        // 移动文件
        fs.rename(tmp_path, target_path, function(err) {
            if (err) return res.status(500).send('上传失败!')
            // 删除临时文件夹文件,
            fs.unlink(tmp_path, function() {
                if (err) return res.status(500).send('上传失败!')
            });
        });

        res.send(["成功上传配置文件,详细信息如下", _.omit(req.files.configFile, 'ws')]);

    });

};

module.exports = upload;