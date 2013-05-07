Matrix = require '../battle/matrix'
should = require 'should'

describe 'A Matrix, for holding player cards with heros', ->

  beforeEach ->
    @matrix = new Matrix(
      [
        [1,2,3]
        [4,5,6]
      ]
    )

  it 'default elements of a Matrix', ->
    matrix = new Matrix()
    expect = [[null, null, null], [null, null, null]]
    matrix.elements.should.eql(expect)
    matrix.rows.should.equal(2)
    matrix.cols.should.equal(3)

    matrix.matrixOrder.should.eql( ['00', '01', '02', '10', '11', '12'] )
    matrix.curIndex.should.equal('00')

  it 'current element', ->
    @matrix.current().should.equal(1)

  it 'next element', ->
    @matrix.next().should.equal(2)

  it 'get next element index', ->
    @matrix.nextIndex().should.equal('01')

  it 'move index to next', ->
    @matrix.moveToNext()
    @matrix.curIndex.should.equal('01')

  it 'get element by [row, col]', ->
    @matrix.get(1, 1).should.equal(5)

  it "get element by string position ['str_pos']", ->
    @matrix.get('11').should.equal(5)

  it 'set element by position [row, col, element]', ->
    @matrix.set(1, 1, 10).get(1, 1).should.equal(10)

  it 'set element by string position [str_pos, element]', ->
    @matrix.set('11', 20).get('11').should.equal(20)

  it 'unset element by position', ->
    should.strictEqual( @matrix.unset(1, 1).get(1, 1), null )

  it 'unset element by string position [str_pos, element]', ->
    should.strictEqual( @matrix.unset('11').get('11'), null )

  it 'get elements of a row by row index', ->
    [1, 2, 3].forEach (i) =>
      @matrix.row(0).should.include(i)

  it 'get elements of a column by column index', ->
    [1, 4].forEach (i) =>
      @matrix.col(0).should.include(i)

  it 'number to position', ->
    @matrix.numberToPosition(1).should.equal('00')
    @matrix.numberToPosition(3).should.equal('02')
    @matrix.numberToPosition(6).should.equal('12')

  it 'position to number', ->
    @matrix.positionToNumber('00').should.equal(1)
    @matrix.positionToNumber('02').should.equal(3)
    @matrix.positionToNumber('12').should.equal(6)

  it 'get attack element by position', ->
    @matrix.attackElement('00').should.equal(1)

    @matrix.unset('00').attackElement('00').should.equal(4)
    @matrix.unset('10').attackElement('00').should.equal(2)
    @matrix.unset('01').attackElement('00').should.equal(5)
    @matrix.unset('11').attackElement('00').should.equal(3)
    @matrix.unset('02').attackElement('00').should.equal(6)
    @matrix.unset('12')
    should.strictEqual( @matrix.get('00'), null )




  