pomelo = require 'pomelo'
app = pomelo.createApp()
app.loadConfig('mysql', app.getBase() + '/config/mysql.json')
app.set('dbClient', require('../../app/dao/mysql/mysql').init(app))

dao = require('../../app/dao').init('mysql')
app.set('dao', dao)