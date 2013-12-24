utility = require('./utility')

class MarkGroup	
	constructor: (value = [], length = 30) ->
		@length = length
		@value = value

	hasMark: (num) ->
		utility.hasMark @_getItem(num), @_val(num)

	mark: (num) ->
		val = utility.mark @_getItem(num), @_val(num)
		@_setItem(num, val)

	setValue: (val) ->
		@value = val
		@

	markPositions: () ->
		### 返回所有已经标记为1的位置 ###
		return [] if @value.length is 0

		num = @length*@value.length
		results = []
		for i in [1..num]
			results.push i if @hasMark(i)
		results

	_getItem: (num) ->
		idx = @_idx(num)
		if @value[idx]? then @value[idx] else 0

	_setItem: (num, val) ->
		@value[@_idx(num)] = val

	_idx: (num) ->
		parseInt (num-1)/@length

	_val: (num) ->
		if num > 0 and num%@length is 0
			return @length
		else 
			num%@length

module.exports = MarkGroup