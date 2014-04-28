module.exports = ->
  new Filter()

class Filter
  before: (msg, session, next) ->
    route = msg.__route__

    if route is 'area.greetingHandler.send'
      msg.content = replaceSensitiveWord(msg.content)

    next()

replaceSensitiveWord = (content) ->
  return content