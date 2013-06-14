EventEmitter = require('events').EventEmitter
logger = require('../common/logger').getLogger('application')

###
  Application states
###
STATE_INITED = 1
STATE_START = 2    # app start
STATE_STARTED = 3  # app has started
STATE_STOPED  = 4  # app has stoped

class Application
  constructor: (opts) ->
    opts = opts or {}
    @loaded = []
    @components = {}
    @settings = {}
    @set('base', opts.base);
    @event = new EventEmitter()

    # current server info
    @serverId = null
    @serverType = null
    @curServer = null

    # global server infos
    @servers = {}            # current global server info maps, id -> info
    @serverTypeMaps = {}    # current global type maps, type -> [info]
    @serverTypes = []        # current global server type list

    @state = STATE_INITED
    logger.info('application inited: %j', @getServerId())

  getBase: ->
    @get('base') or process.cwd()

  load: (name, component, opts) ->
    if typeof name isnt 'string'
      opts = component
      component = name
      name = null

      if typeof component.name is 'string'
        name = component.name

    if typeof component is 'function'
      component = component(@, opts)

    if not name && component.name is 'string'
      name = component.name

    if name && @.components[name]
      logger.warn 'ignore duplicate component: %j', name
      return 

    @loaded.push component

    if name 
      this.components[name] = component

    this

  loadConfig: (key, val) ->
    env = @get 'env'
    val = require(val)
    if val[env]
      val = val[env]
    @set key, val

  route: (serverType, routeFunc) ->
    routes = @get('__routes__')
    if not routes
      routes = {}
      @set '__routes__', routes
    routes[serverType] = routeFunc

    this

  start: (cb) ->
    if @state > STATE_INITED
      cb(new Error('application has already start.'))
      return 

    loadDefaultComponents(this)
    processComponents @loaded, 'start', (err) =>
      @state = STATE_START
      if err
        cb(err)
      else
        logger.info '%j start'

    stop: (force) ->
      if @state > STATE_STARTED
        logger.warn 'Applicaiton is not running now.'
        return 

      @state = STATE_STOPED
      stopComps @loaded, 0, force, ->
        process.exit(0) if force

    set: (setting, val, attach) ->
      if arguments.length is 1
        return @settings[setting]

      @settings[setting] = val
      if attach
        @[setting] = val

      this

    get: (setting) ->
      @settings[setting]

    enabled: (setting) ->
      !!@get setting

    disabled: (setting) ->
      !@get setting

    enable: (setting) ->
      @set setting, true

    disable: (setting) ->
      @set setting, false

    ###
     * Configure callback for the specified env and server type.
     * When no env is specified that callback will
     * be invoked for all environments and when no type is specified
     * that callback will be invoked for all server types.
     *
     * Examples:
     *
     *  app.configure(function(){
     *    // executed for all envs and server types
     *  });
     *
     *  app.configure('development', function(){
     *    // executed development env
     *  });
     *
     *  app.configure('development', 'connector', function(){
     *    // executed for development env and connector server type
     *  });
     *
     * @param {String} env application environment
     * @param {Function} fn callback function
     * @param {String} type server type
     * @return {Application} for chaining
     * @memberOf Application
    ###
    configure: (env, type, fn) ->
      args = [].slice.call arguments
      fn = args.pop()
      env = 'all'
      type = 'all'

      if args.length > 0
        env = args[0]

      if args.length > 1
        type = args[1]

      if env is 'all' or contains(@settings.env, env)
        if type is 'all' or contains(@settings.serverType, type)
          fn.call(this)

      this

    getCurServer: ->
      @curServer

    getServerId: ->
      @serverId

    getServerType: ->
      @serverType

    getServers: ->
      @servers

    getServersFromConfig: ->
      @get('__serverMap__')

    getServerTypes: ->
      @serverTypes

    getServerById: (serverId) ->
      @servers[serverId]

    getServerFromConfig: (serverId) ->
      @get('__serverMap__')[serverId]

    getServersByType: (serverType) ->
      @serverTypeMaps[serverType]

    addServers: (servers) ->
      if not servers or not servers.length
        return 

      for item in servers
        @servers[item.id] = item

        slist = @serverTypeMaps[item.serverType]
        if not slist
          @serverTypeMaps[item.serverType] = slist = []

        replaceServer slist, item

        if item.serverType not in @serverTypes
          @serverTypes.push item.serverType

      @event.emit 'add_servers', servers

    removeServer: (ids) ->
      if not ids or not ids.length
        return 

      for id in ids
        item = @servers[id]
        if not item
          continue

        delete @servers[id]

        slist = @serverTypeMaps[item.serverType]
        removeServer(slist, id)

      @event.emit 'remove_servers', ids

replaceServer = (slist, serverInfo) ->
  for item in slist
    if item.id is serverInfo.id
      item = serverInfo
      return 

  slist.push serverInfo

removeServer = (slist, id) ->
  if not slist or not slist.length
    return

  l = slist.length
  for i in [0...l]
    if slist[i].id == id
      slist.splice(i, 1)
      return 

contains = (str, settings) ->
  if not settings
    return false

  ts = settings.split('|')
  for item in ts
    if str is item
      return true

  return false

module.exports = Application