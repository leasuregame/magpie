var shortid = require('shortid');
var cdkeyDao = require('../dao/cdkeyDao');
var util = require('util');

var PAGE_COUNT = 20

var localDateString = function(date) {
  return util.format('%s-%s-%s', date.getFullYear(), date.getMonth() + 1, date.getDate());
};

var areaString = function(area) {
  if (area.length == 0) {
    return '所有';
  } 

  var _str = '';
  for (var i = 0; i < area.length; i++) {
    var a = area[i];
    _str += '' + a + '区, ';
  }
  return _str.slice(0, -2);
};

exports.manage = function(req, res) {
  var page = (req.query.page != null ? req.query.page : 1) || 1;
  var used = req.query.used != null ? req.query.used : -1;

  var limitStart = (page - 1) * PAGE_COUNT;
  var args = {};
  if (parseInt(used) >= 0) {
    args = { activate: parseInt(used)};
  }

  cdkeyDao.totalCount(args, function(err, count) {
    if (err) {
      return res.status(500).send(err);
    }

    cdkeyDao.query(args, limitStart, PAGE_COUNT, function(err, rows) {
      if (err) {
        return res.status(500).send(err);
      }
      res.render('cdkey', {
        menu: 'cdkey',
        hasPrevious: page==1?false:true,
        hasNext: parseInt(count/PAGE_COUNT)+1==page?false:true,
        used: used,
        curPage: page,
        totalPages: parseInt(count/PAGE_COUNT)+1,
        totalCount: count,
        rows: rows.map(function(r) {
          r.startDate = localDateString(r.startDate);
          r.endDate = localDateString(r.endDate);
          r.area = r.area != null && typeof r.area == 'string' ? areaString(JSON.parse(r.area)) : '所有';
          return r;
        })
      });
    });
  });
};

exports.pregenerate = function(req, res) {
  var prefix = req.query.prefix,
  startDate = req.query.startDate,
  endDate = req.query.endDate,
  qty = parseInt(req.query.qty),
  area = parseInt(req.query.area);

  var areaInfo = [];
  if (area > -1) {
    areaInfo.push(area);
  }

  if (qty == '') {
    qty = 1;
  } else {
    qty = qty;
  }

  uids = []
  for (var i = 0; i < qty; i++) {
    uids.push(prefix + shortid.generate().toUpperCase());
  }
  data = uids.map(function(id) {
    return {
      code: id,
      startDate: startDate,
      endDate: endDate,
      area: JSON.stringify(areaInfo)
    };
  })

  cdkeyDao.insert(data, function(err, rows) {
    console.log(err, rows);
    if (err) {
      res.send({
        success: false,
        msg: err
      });
    }
    res.send({
      success: true,
      count: rows.length
    });
  });
};

exports.generate = function(req, res) {
  res.send(shortid.generate());
};

exports.search = function(req, res) {
  var text = req.query.q;
  cdkeyDao.search(text, function(err, items) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (!!items && items.length > 0) {
        res.send(items.map(function(r) {
          r.startDate = localDateString(r.startDate);
          r.endDate = localDateString(r.endDate);
          return r;
        }));
      } else {
        res.send([]);
      }
    }
  });
};