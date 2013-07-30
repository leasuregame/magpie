var dbClient = require("pomelo").app.get("dbClient");
var sqlHelper = require('./mysql/sqlHelper');

module.exports = {
  multJobs: function(jobs, cb) {
    jobs = jobs.map(function(job) {
      return sqlHelper.generateSql(job.type, job.options);
    });

    return dbClient.queues(jobs, cb);
  }
};