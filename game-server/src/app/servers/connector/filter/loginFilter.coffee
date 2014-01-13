
module.exports = ->
	new Filter()

class Filter
	before: (msg, session, next) ->
		next(new Error('can not login'), {code: 500, msg: '此请求被限制调用了'})
		

	after: (msg, session, next) ->