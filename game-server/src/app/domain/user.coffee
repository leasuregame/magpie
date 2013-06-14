
class User
  constructor: (opts) ->
    @id = opts.id
    @name = opts.name
    @from = opts.from or ''
    @password = opts.password
    @loginCount = opts.loginCount
    @lastLoginTime = opts.lastLoginTime

module.exports = User