
class User
  constructor: (opts) ->
    @id = opts.id
    @account = opts.account
    @name = opts.name
    @from = opts.last_login_device or ''
    @password = opts.password
    @loginCount = opts.login_count
    @lastLoginTime = opts.last_login_time

module.exports = User