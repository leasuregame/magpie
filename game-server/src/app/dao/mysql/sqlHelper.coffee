module.exports = 
  insertSql: (table, fields) ->
    _fields = _args = ""
    _values = []
    for key, value of fields
      _fields += "`" + key + "`,"
      _args += "?,"
      _values.push value

    sql = "insert into #{table} (#{_fields.slice(0, -1)}) values (#{_args.slice(0, -1)})"
    [sql, _values]

  updateSql: (table, id, fields) ->
    _sets = ""
    _values = []

    for name, val of fields
      -sets += "`#{name}`=?,"
      _values.push val

    _values.push id
    sql = "update #{table} #{_sets.slice(0, -1)} where id = ?"
    [sql, _values]

  selectSql: (table, id) ->
    sql = "select * from #{table} where id = ?"
    [sql, [id]]