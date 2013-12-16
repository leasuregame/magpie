http = require 'http'

module.exports = (app, opts) ->
  return new Component(app, opts)

class Component
  constructor: (@app, opts={}) ->

  @name = '__simpleWeb__'

  start: (cb) ->
    http.createServer (req, res) =>
      res.write('ok'+@app.getServerId())
      res.end()
    .listen(5050, '127.0.0.1')
    console.log 'create web on 5050...............'
    process.nextTick cb

  afterStart: (cb) ->
    process.nextTick cb

  stop: (force, cb) ->
    process.nextTick cb