var Url = require('url');
var filter = require('../util/filter');
var path = require('path');

var upload = function(app) {

    app.get('/upload', function(req, res) {
        res.render('upload', {
            menu: 'upload',
            title: 'upload',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.all('/admin/uploadWorldCupConfig', function(req, res) {
        var fs = require('fs');

        // 获得文件的临时路径
        var file = req.files.configFile;
        var tmp_path = file.path;
        // 指定文件上传后的目录 - 示例为"images"目录。
        var target_path = path.join(__dirname,'..','..','game-server','data','share','world_cup', file.name);

        // 移动文件
        fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
            // 删除临时文件夹文件,
            fs.unlink(tmp_path, function() {
                if (err) throw err;
                res.send('File uploaded to: ' + target_path + ' - ' + file.size + ' bytes');
            });
        });
        res.send([req.body, req.files]);
    });

};

module.exports = upload;