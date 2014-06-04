/**
 * Created with JetBrains WebStorm.
 * User: xiejiayue
 * To change this template use File | Settings | File Templates.
 */

(function(){

    var wsUtil = {};

    /**
     * 构造select中的option
     * @param names
     * @param vals (非必须)
     * @returns {string}
     */
    wsUtil.buildSelOpts = function (names, vals) {
        var ret = '';
        if(arguments.length == 1) {
            vals = names;
        }
        if(names.length == vals.length) {
            for(var i = 0; i < names.length; i++) {
                ret += "<option value='" + vals[i] + "'>" + names[i] + "</option>"
            }
        }
        return ret;
    };

    wsUtil.splitNoBlank = function (str, separator) {
        return $.grep(str.split(separator), function(n) {
            return $.trim(n).length > 0;
        });
    };

    /**
     * 日期字符串转毫秒数
     * @param str 格式(YYYY-MM-DD hh:mm:ss | YYYY/MM/DD hh:mm:ss)
     * @returns {*}
     */
    wsUtil.strDate2Ms = function (str) {
        if(/^(\d{4})[-,/](\d{1,2})[-,/](\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/.test(str)) {
            return new Date(RegExp.$1,RegExp.$2 - 1,RegExp.$3,RegExp.$4,RegExp.$5,RegExp.$6).getTime();
        }
        return null;
    };

    wsUtil.isNotEmptyObj = function (obj) {
        if(typeof obj == 'object') {
            for(var i in obj) {
                return true;
            }
        }
        return false;
    };

    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return wsUtil;
        });
    }
    // Node.js
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = wsUtil;
    }
    // included directly via <script> tag
    else {
        window.wsUtil = wsUtil;
    }

}());