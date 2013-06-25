SpecialProperty = require '../../app/battle/special_property'

describe 'Special Property', ->
  it 'init', ->
    sp = new SpecialProperty([{name: 'crit', value: 100}])
    sp.should.be.instanceof(SpecialProperty)
    sp.has('crit').should.be.ok
    sp.isCrit().should.be.ok
    sp.get('crit').should.be.equal(100)
  
  