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