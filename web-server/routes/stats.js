var onlineUserDao = require('../util/onlineUserDao');

exports.onlineUser = function(req, res) {
  var curDate = req.query.date;

  onlineUserDao.getRecords(curDate, function(err, items) {
    if (err) {
      return res.status(500).send('服务器出错'+err);
    }

    res.send(convertData(items));
  });
};

var convertData = function(items) {
  var list = items.map(function(item) {
    item.ct = new Date(item.ct).getHours();
    return [item.ct, item.qty];
  }).sort(function(x, y) {
    return y[0] - x[0];
  });
  list.push(['date', 'qty']);
  return list.reverse();
};