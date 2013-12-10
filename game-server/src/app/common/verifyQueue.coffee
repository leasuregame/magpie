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

  len: () ->
    @ids.length

  needToProcess: () ->
    results = []
    for id, item of @items
      if not item.doing and results.length <= 10
        item.doing = true
        results.push item
    results

module.exports = Queue