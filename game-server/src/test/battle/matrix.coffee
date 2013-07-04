Matrix = require '../../app/battle/matrix'
should = require 'should'
_ = require 'underscore'

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
    @matrix.numberToPosition(1).should.equal('01')
    @matrix.numberToPosition(3).should.equal('10')
    @matrix.numberToPosition(5).should.equal('12')

  it 'position to number', ->
    @matrix.positionToNumber('00').should.equal(0)
    @matrix.positionToNumber('02').should.equal(2)
    @matrix.positionToNumber('12').should.equal(5)

  it 'get element by position', ->
    @matrix.getElement('00').should.equal(1)

    @matrix.unset('00').getElement('00').should.equal(4)
    @matrix.unset('10').getElement('00').should.equal(2)
    @matrix.unset('01').getElement('00').should.equal(5)
    @matrix.unset('11').getElement('00').should.equal(3)
    @matrix.unset('02').getElement('00').should.equal(6)
    @matrix.unset('12')
    should.strictEqual( @matrix.get('00'), null )

  it '.next(), return next not null element and set current index to the return element', ->
    @matrix.next().should.be.equal(2)
    @matrix.current().should.be.equal(2)

    @matrix.next().should.be.equal(3)
    @matrix.next().should.be.equal(4)
    @matrix.next().should.be.equal(5)
    @matrix.next().should.be.equal(6)

    @matrix.current().should.be.equal(6)


  it '.reset() current index to the element that not null and not death', ->
    @matrix.current().should.be.equal(1)
    @matrix.moveToNext().moveToNext()
    @matrix.current().should.be.equal(3)

    @matrix.reset()
    @matrix.current().should.be.equal(1)

    @matrix.moveToNext().moveToNext()
    @matrix.current().should.be.equal(3)
    @matrix.unset('00')

    @matrix.reset()
    @matrix.current().should.be.equal(2)


  it 'get crosswaysFront elements', ->
    @matrix.crosswaysFront().should.eql([1,2,3])

  it 'get crosswaysBack elements', ->
    @matrix.crosswaysBack().should.eql([4,5,6])

  it 'get lenthways elements', ->
    @matrix.lengthways(0).should.eql([1,4])

  it 'get all elements', ->
    @matrix.all().should.eql([1,2,3,4,5,6])

  it 'get hp_max, hp_min, atk_max, atk_min element', ->
    @matrix = new Matrix([
      [
        {id: 1, hp: 1, atk: 1}
        {id: 2, hp: 2, atk: 2}
        {id: 3, hp: 3, atk: 3}
      ],
      [
        {id: 4, hp: 4, atk: 4}
        {id: 5, hp: 5, atk: 5}
        {id: 6, hp: 6, atk: 6}
      ]
      ])
    @matrix.hp_max().should.eql({id: 6, hp: 6, atk: 6})
    @matrix.hp_min().should.eql({id: 1, hp: 1, atk: 1})
    @matrix.atk_max().should.eql({id: 6, hp: 6, atk: 6})
    @matrix.atk_min().should.eql({id: 1, hp: 1, atk: 1})

  it 'get default element by specific position', ->
    @matrix.default(1).should.equal(2)
    @matrix.default('02').should.equal(3)
    @matrix.default().should.equal(1)
    @matrix.default(3).should.equal(1)
    @matrix.default(4).should.equal(2)
    @matrix.default(5).should.equal(3)

    @matrix.unset('00')
    @matrix.default(0).should.equal(4)

  it 'get random element', ->
    check = (num) =>
      res = @matrix.random(num)
      res.length.should.equal(num)
      for i in res
        i.should.within(1,6)

      _res = _.uniq(res)
      _res.length.should.equal(res.length)


    check(1)
    check(2)
    check(3)
    check(4)
    check(5)
    check(6)

  it '.getElement(), ', ->



  