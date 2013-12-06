module.exports = (app) ->
  new Service(app) 

class Service
  constructor: (@app) ->

  