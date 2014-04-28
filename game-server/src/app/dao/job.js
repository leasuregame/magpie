var dbClient = require("pomelo").app.get("dbClient");
var sqlHelper = require('./mysql/sqlHelper');

/*
 *  job type: insert, update, select, delete, exists
 *  job options: where, data, table, fields, orderBy, limit 
 */


module.exports = {
  multJobs: function(jobs, cb) {
  	if (jobs.length == 0) {
  	  return cb(null, false)
    }
    
    jobs = jobs.map(function(job) {
      return sqlHelper.generateSql(job.type, job.options);
    });

    return dbClient.queues(jobs, cb);
  }
};