
exports.buildBetweenWhere = function(key, val) {
    var where = " and " + key;
    if(val instanceof Array) {
        where += " between '" + val[0] + "' and '" + val[1] + "'";
    } else {
        where += " = '" + val + "'";
    }
    return where;
};

exports.buildInWhere = function(key, val, isNot) {
    var where = '';
    if(isNot) {
        where = ' and ' + key + ' not in (';
    } else {
        where = ' and ' + key + ' in (';
    }

    if(val instanceof Array) {
        for(var i in val) {
            where += " '" + val[i] + "',";
        }
        where = where.substr(0, where.length - 1);
    } else {
        where += " '" + val + "'";
    }
    where += ')';

    return where;
};