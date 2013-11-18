Client = require('pomelo-admin').adminClient

module.exports = (app) ->
  new Service(app) 

class Service
  constructor: (@app) ->
  	@client = new Client({
  		username: 'admin',
  		password: 'admin'
  		})

  start: ->
  	sv = @app.getServersByType('master')
  	@client.connect('gate-server', sv.host, sv.port)