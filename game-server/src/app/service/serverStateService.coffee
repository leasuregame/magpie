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
    	@client.connect('gate-server', master.host, master.port, (err, res) => runCounter(@client))

  areaPlayerCount: (cb) ->
  	 @client.request 'loginsOnArea', null, (err, data) -> cb(err, data)

  connectCount: (cb) -> 
    @client.request 'onlineUser', null, (err, data) -> cb(err, data)

runCounter = (client) ->
  doCount = () ->
    client.request 'loginsOnArea', null, (err, data) -> #console.log err, data
    client.request 'onlineUser', null, (err, data) -> #console.log err, data

  setInterval doCount, 300000
