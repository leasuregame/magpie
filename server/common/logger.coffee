winston = require 'winston'

logger = new winston.logger({
  transports: [
    new winston.transports.Console({colorize: true}),
    new winston.transports.File({filename: '../logs/battle-log.log'})
  ],
  exceptionHandlers: [
    new winston.transports.File({filename: '../logs/exceptions.log'})
  ]
})

exports = module.exports = logger