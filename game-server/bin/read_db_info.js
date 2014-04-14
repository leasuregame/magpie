var fs = require('fs');
var path = require('path');
var mysqlConfig = require('../config/mysql');
var env = process.argv[2] || 'development';

var dir = path.join(__dirname, '../../..', 'backup');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

var now = new Date();
var dateString = '' + now.getFullYear() + '_' + (now.getMonth()+1) + '_' + now.getDate();
var prefix = now.getHours() + '_' + now.getMinutes();

var dateDir = path.join(dir, dateString);
if (!fs.existsSync(dateDir)) {
  fs.mkdirSync(dateDir);
}

var params = '';
for (var n in mysqlConfig[env]) {
  var db = mysqlConfig[env][n];
  params += 'mysqldump --add-drop-table -h' + db.host + ' -P' + db.port + ' -u' + db.user + ' -p' + db.password + ' --database ' + db.database + ' > ' + dateDir + '/' + db.database + '-' + prefix + '.sql && ';
}

console.log(params.slice(0, -3));