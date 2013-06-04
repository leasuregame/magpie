# winston = require 'winston'

# logger = new (winston.Logger)({
#   transports: [
#     new winston.transports.Console({colorize: true, json: false})
#     new winston.transports.File({filename: 'battle-log.log', json: false})
#   ],
#   exceptionHandlers: [
#     new winston.transports.File({filename: 'exceptions.log'})
#   ]
# })


log4js = require 'log4js'

log4js.configure(
  appenders: [
    {
      category: "battle-log"
      type: "console"
    },
    {
      category: "battle-log"
      type: "file"
      filename: "battle-log.log"
    }
  ]
)

exports = module.exports = log4js.getLogger('battle-log')