
exports.buildBetweenWhere = function(key, val) {
    var where = '';
    if(val instanceof Array) {
        where += " and " + key + " between '" + val[0] + "' and '" + val[1] + "'";
    } else {
        where += " and " + key + " = '" + val + "'";
    }
    return where;
};