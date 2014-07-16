_ = require 'underscore'

###
  Matrix formation:
  4, 5, 6
  1, 2, 3

  1, 2, 3
  4, 5, 6
###
ATTACKORDER = {
  0: [0,3,1,4,2,5]
  1: [1,4,0,3,2,5]
  2: [2,5,1,4,0,3]
  3: [0,3,1,4,2,5]
  4: [1,4,0,3,2,5]
  5: [2,5,1,4,0,3]
}

class Matrix
  constructor: (elements) ->
    defautEl = [
      [null, null, null]
      [null, null, null]
    ]
    @elements = elements || defautEl
    @rows = @elements.length
    @cols = @elements[0]?.length

    @matrixOrder = ['00', '01', '02', '10', '11', '12']
    @curIndex = '00'

  numberToPosition: (num) ->
    if num < 0 or num > @matrixOrder.length - 1
      throw new Error "Index Error: the given number #{num} out of Matrix index"
    @matrixOrder[ num ]

  positionToNumber: (pos) ->
    if pos not in @matrixOrder
      throw new Error "Invalid parameter, #{pos}"
    @matrixOrder.indexOf(pos)

  attackElement: (scope, args, filter) ->
    try
      if scope of @
        els = @[scope](args, filter)
        els = [els] if not _.isArray(els)
        return _.filter els, (e) -> e? and not e.death?()
      else
        return null
    catch e
      throw e

  scope: (scope, args) ->
    @attackElement scope, args 

  getElement: (pos) ->
    # 根据对方给出的位置，找到可以被攻击的对象
    @get @_atkIndex(pos)

  _atkIndex: (pos) ->
    if _.isString(pos) and pos.length is 2
      attackOrder = ATTACKORDER[ @positionToNumber(pos) ]
    else if _.isNumber(pos) and pos < (@rows * @cols)
      attackOrder = ATTACKORDER[ pos ]
    else if pos is undefined
      attackOrder = ATTACKORDER[ @positionToNumber(@curIndex) ]
    else
      throw new Error("parameter 'pos' invalid, #{pos}")

    for num in attackOrder
      _pos = @numberToPosition(num)
      el = @get(_pos)
      
      if el? and not el.death?()
        return _pos

    null

  current: ->
    @curIndex and @get(@curIndex) or null

  next: ->
    max_count = @matrixOrder.length
    for i in [0...max_count]
      @moveToNext()
      _hero = @current()
      if not _hero
        continue

      if _.isObject(_hero) and not _hero.death()
        return _hero
    null

  nextIndex: (cindex = @curIndex) ->
    if not cindex
      return

    index = @matrixOrder.indexOf( cindex ) + 1
    if index is @matrixOrder.length
      return 

    @matrixOrder[index]

  moveToNext: ->
    @curIndex = @nextIndex()  
    @

  reset: ->
    allElements = @allWithNull()
    res = _.find allElements, (i) -> i? and not i.death?()
    @curIndex = if res? then @matrixOrder[ allElements.indexOf(res) ] else '00'
    @

  set: (row, col, el) ->
    if not el
      el = col      
      if _.isString(row) and row.length == 2
        [row, col] = row 
      else
        [row, col] = @numberToPosition(parseInt row) 

    el.setPos "#{row}#{col}" if _.isObject(el)
    @elements[row][col] = el
    @

  unset: (row, col) ->
    if arguments.length == 1
      [row, col] = row
    @set(row, col, null)
    @

  clear: ->
    @elements = [
      [null, null, null]
      [null, null, null]
    ]

  crosswaysFront: ->
    @row(0)

  crosswaysBack: ->
    @row(1)

  lengthways: (colIndex) ->
    if _.isString(colIndex) and colIndex.length == 2
      idx = parseInt(colIndex[1])
    else
      idx = parseInt(colIndex)
    @col(idx)

  all: ->
    _.filter @allWithNull(), (i) -> i?

  alive: ->
    _.filter @allWithNull(), (i) -> i? and not i.death?()

  allWithNull: ->
    _res = []
    _res = _res.concat(row) for row in @elements
    _res

  hp_max: ->
    items = @alive()
    return null if items.length == 0

    res = items[0]
    items.forEach (h) ->
      res = h if h.hp > res.hp
    res

  hp_min: ->
    items = @alive()
    return null if items.length == 0

    res = items[0]
    items.forEach (h) ->
      res = h if h.hp/h.init_hp < res.hp/res.init_hp
    res

  atk_max: ->
    items = @alive()
    return null if items.length == 0

    res = items[0]
    items.forEach (h) ->
      res = h if h.atk > res.atk
    res

  atk_min: ->
    items = @alive()
    return null if items.length == 0

    res = items[0]
    items.forEach (h) ->
      res = h if h.atk < res.atk
    res

  default: (pos) ->
    @getElement(pos)

  random: (num = 1, filter) ->    
    len = @rows * @cols
    indexs = _.range(len)
    if filter and _.isFunction(filter)
      items = []
      indexs = []
      allItems = @allWithNull()
      for i in _.range(len)
        if filter(allItems[i])
          items.push allItems[i] 
          indexs.push i
      len = items.length

    num = len if num > len    
    
    _res = []
    for i in _.range(num)
      rd_index = Math.floor(Math.random() * len--)
      _res.push( @get(@numberToPosition(indexs[rd_index])) )
      indexs = indexs.filter (i) -> indexs.indexOf(i) != rd_index

    _res

  latitude_line: (pos) ->
    matrix = [
      [0,1,2],
      [3,4,5]
    ]
    
    idxs = []    
    idx = @_atkIndex(pos)
    idxs.push idx
    idxs.push idx+3

    mIdx = idx <= 2 ? 0 : 1
    idxs.concat _.difference(matrix[mIdx], [idx])
    idxs.map (i) => @getElement(i)

  get: (row, col) ->
    if arguments.length == 1
      [row, col] = row
    @_checkRowAndCol(row, col)
    @elements[row][col]

  row: (rowIndex) ->
    @_checkRowAndCol(rowIndex, 0)
    @elements[rowIndex]

  col: (colIndex) ->
    @_checkRowAndCol(0, colIndex)
    item[colIndex] for item in @elements

  _checkRowAndCol: (row, col) ->
    row = parseInt(row)
    col = parseInt(col)
    if !(typeof row is 'number') and !(typeof col is 'number')
      throw new Error('Prameter row and col must be type of Number.')

    if row >= @rows and col >= @cols
      throw new Error('Prameter row and col must be less than rows and cols.')

exports = module.exports = Matrix