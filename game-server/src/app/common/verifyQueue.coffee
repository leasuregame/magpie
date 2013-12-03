class Queue
  constructor: (opts) ->
    @items = {}
    @ids = []

  init: (data) ->
    for d in data
      @ids.push d.id
      @items[d.id] = d

  push: (item) ->
    if item.id not in @ids
      @ids.push item.id
      item.doing = false
      @items[item.id] = item

  pop: () ->
    id = @ids.pop()
    @items[id]

  del: (id) ->
    idx = @ids.indexOf(id)
    @ids.splice idx, 1
    delete @items[id]

  waiting: () ->
    @len() > 0 and @_needToProcess().length > 0

  len: () ->
    @ids.length

  needToProcess: () ->
    _.values(@items).filter (i) -> not i.doing

module.exports = Queue