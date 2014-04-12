var onlineUserDao = require('../util/onlineUserDao');
var _ = require('underscore');

exports.onlineUser = function(req, res) {
  var curDate = req.query.date;
  console.log('curDate', curDate);
  onlineUserDao.getRecords(curDate, function(err, items) {
    if (err) {
      return res.status(500).send('服务器出错'+err);
    }

    res.send({
      items: convertData(items),
      curDate: new Date(curDate).toLocaleDateString()
    });
  });
};

var convertData = function(items) {
  var list = items.map(function(item) {
    return [item.ct, item.qty];
  }).sort(function(x, y) {
    return y[0] - x[0];
  });
  return list.reverse();
};