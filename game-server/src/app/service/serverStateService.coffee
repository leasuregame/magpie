Client = require('pomelo-admin').adminClient

module.exports = (app) ->
  new Service(app) 

class Service
  constructor: (@app) ->
    	@client = new Client({
    		username: 'admin',
    		password: 'admin'
    		})

    	master = @app.getMaster()
    	@client.connect('gate-server', master.host, master.port, (err, res) -> console.log err, res)

  areaPlayerCount: (cb) ->
  	 @client.request 'loginsOnArea', null, (err, data) ->
      cb(err, data)