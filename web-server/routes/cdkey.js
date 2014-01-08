var shortid = require('shortid');
var cdkeyDao = require('../util/cdkeyDao');

exports.manage = function(req, res) {
  res.render('cdkey');
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
  	if (err) {
  		console.log(err);
  		res.status(500).send('error to generate cdkeys');
  	}
  	res.send(JSON.stringify(rows));
  });
};

exports.generate = function(req, res) {
  console.log(req.body);
  res.send(shortid.generate());
};