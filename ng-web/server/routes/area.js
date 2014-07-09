var fs = require('fs'),
    path = require('path');
var filter = require('../util/filter');
var AREA_PATH = path.join(__dirname, '..', '..', 'game-server', 'config', 'area.json');

var area = function(app) {

    /**
     * render area editor
     */
    app.get('/admin/areaeditor', filter.authorize, function (req, res) {
        if (!fs.existsSync(AREA_PATH)) {
            res.render('areaEditor', {
                error: '找不到区服列表信息',
                menu: 'area',
                user: req.session.user
            });
        } else {
            var areas = fs.readFileSync(AREA_PATH, 'utf8');

            console.log('areas: ', areas);
            res.render('areaEditor', {
                areas: areas,
                menu: 'area',
                user: req.session.user
            });
        }
    });

    /**
     * save area and return success or not
     */
    app.post('/admin/areaeditor/save', filter.authorize, function (req, res) {
        var areaValue = req.body.areas;
        fs.writeFile(AREA_PATH, areaValue, 'utf8', function (err) {
            if (err) {
                res.send({code: 500, msg: '保存失败！'})
            } else {
                res.send({code: 200, msg: '保存成功！'})
            }
        });
    });

};

module.exports = area;