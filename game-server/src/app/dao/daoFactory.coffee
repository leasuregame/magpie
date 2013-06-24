path = require 'path'
fs = require 'fs'
logger = require('pomelo-logger').getLogger(__filename)

instance = null;

module.exports = (app) ->
  if instance?
    return instance
  
  instance = new Factory(app)
  instance

class Factory
  constructor: (@app) ->
    @daoType = @app.get('daoType')

  get: (name) ->
    if not name
      logger.warn("can not get dao object by undefined name: #{name}")
      return

    require(daoPath(this) + "/#{name}Dao")

daoPath = (self)->
  _path = path.join(__dirname, self.daoType)
  if not fs.existsSync(_path)
    logger.error("dao path is not exsits: #{_path}")
    throw new Error("#{_path} not exsits")

  return _path