var mysqlConfig = require('../config/mysql');

var env = process.argv[2] || 'development';

var dbname = process.argv[3];

if (dbname) {
  
}

var now = new Date();
var prefix = '' + now.getFullYear() + '_' + (now.getMonth()+1) + '_' + now.getDate() + '_' + now.getHours() + '_' + now.getMinutes();

var params = '';
for (var n in mysqlConfig[env]) {
  var db = mysqlConfig[env][n];
  params += 'mysqldump --add-drop-table -u' + db.user + ' -p' + db.password + ' --database ' + db.database + ' > ' + db.database + '-' + prefix + '.sql && ';
}

console.log(params.slice(0, -3));

