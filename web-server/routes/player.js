var db = require('../util/db');

exports.get = function(req, res) {
  console.log(req.query, req.params, req.body);
  var name = req.query.name;
  var areaId = req.query.areaId;
  var sql = "select id from player where name = '" + name + "' and areaId = " + areaId;

  db(areaId).query(sql, [], function(err, row) {
    if (err) {
      res.status(500).send('error when select playerId, ' + err);
    }

    if (!!row && row.length > 0) {
      res.send({id: row[0].id})  
    } else {
      res.status(404).send('can not find player id');
    }
    
  });
};