module.exports = (app) ->
  new Task(app)

class Task
  constructor: (@app) ->

  