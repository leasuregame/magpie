var shortid = require('shortid');
var cdkeyDao = require('../util/cdkeyDao');

exports.manage = function(req, res) {
  cdkeyDao.query({}, function(err, rows) {
    if (err) {
      return res.status(500).send(err);
    }
    res.render('cdkey', {rows: rows});  
  });  
};

exports.pregenerate = function(req, res) {
  var prefix = req.query.prefix;
  	startDate = req.query.startDate;
  	endDate = req.query.endDate;
  	qty = req.query.qty;

  if (qty == '') {
  	qty = 1;
  } else {
  	qty = parseInt(qty);
  }

  uids = []
  for (var i = 0; i < qty; i++) {
  	uids.push(prefix + shortid.generate());
  }
  data = uids.map(function(id) {
  	return {
  		code: id,
  		startDate: startDate,
  		endDate: endDate
  	};
  })

  cdkeyDao.insert(data, function(err, rows) {
    console.log(err, rows);
  	if (err) {
  		res.send({success: false, msg: err});
  	}
  	res.send({success: true, count: rows.length});
  });
};

exports.generate = function(req, res) {
  console.log(req.body);
  res.send(shortid.generate());
};