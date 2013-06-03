winston = require 'winston'

logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console({colorize: true})
    new winston.transports.File({filename: 'battle-log.log'})
  ],
  exceptionHandlers: [
    new winston.transports.File({filename: 'exceptions.log'})
  ]
})

exports = module.exports = logger