var dbClient = require("pomelo").app.get("dbClient");
var sqlHelper = require('./mysql/sqlHelper');

module.exports = {
  multJobs: function(jobs, cb) {
    jobs = jobs.map(function(job) {
      return sqlHelper.updateSql(job.table, job.data);
    });

    return dbClient.queues(jobs, cb);
  }
};