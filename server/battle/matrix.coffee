'''
  Matrix formation:
  4, 5, 6
  1, 2, 3

  1, 2, 3
  4, 5, 6
'''
ATTACKORDER = {
  1: [1,4,2,5,3,6]
  2: [2,5,1,4,3,6]
  3: [3,6,2,5,1,4]
  4: [1,4,2,5,3,6]
  5: [2,5,1,4,3,6]
  6: [3,6,2,5,1,4]
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
    if num < 1 and num > @matrixOrder.length
      throw new Error "Index Error: the given number #{num} out of Matrix index"
    @matrixOrder[ num - 1 ]

  positionToNumber: (pos) ->
    if pos not in @matrixOrder
      throw new Error "Invalid parameter, #{pos}"
    @matrixOrder.indexOf(pos) + 1

  attackElement: (pos) ->
    attackOrder = ATTACKORDER[ @positionToNumber(pos) ]
    for num in attackOrder
      index = @numberToPosition(num)
      el = @get(index)
      return el if el?
    null

  current: ->
    @elements[ @curIndex[0] ][ @curIndex[1] ]

  next: ->
    [row, col] = @nextIndex()
    @elements[ row ][ col ]

  nextIndex: ->
    len = @matrixOrder.length
    if len <= 1
      index = 0
    else
      index = @matrixOrder.indexOf( @curIndex )
      index = if index < len then index else 6%@len - 1
    @matrixOrder[index + 1]

  moveToNext: ->
    @curIndex = @nextIndex()
    @

  set: (row, col, el) ->
    if arguments.length == 2
      el = col
      [row, col] = row
    @elements[row][col] = el 
    @

  unset: (row, col) ->
    if arguments.length == 1
      [row, col] = row
    @set(row, col, null)
    @

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