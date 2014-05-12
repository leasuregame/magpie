var fs = require('fs'),
    path = require('path');

var AREA_PATH = path.join(__dirname, '..', '..', 'game-server', 'config', 'area.json');
var WHITELIST_PATH = path.join(__dirname, '..', '..', 'shared', 'whiteList.json');

exports.editor = function(req, res) {
  if (!fs.existsSync(AREA_PATH)) {
    res.render('areaEditor', {
      error: '找不到区服列表信息',
      menu: 'area'
    });
  } else {
    var areas = fs.readFileSync(AREA_PATH, 'utf8');
    var whiteList = fs.readFileSync(WHITELIST_PATH, 'utf8');

    console.log('areas: ', areas);
    res.render('areaEditor', {
      areas: areas,
      whiteList: JSON.stringify(whiteList),
      menu: 'area'
    });
  }
};

exports.save = function(req, res) {
  var areaValue = req.body.areas;
  fs.writeFile(AREA_PATH, areaValue, 'utf8', function(err) {
    if (err) {
      res.send({code: 500, msg: '保存失败！'})
    } else {
      res.send({code: 200, msg: '保存成功！'})
    }
  });
};