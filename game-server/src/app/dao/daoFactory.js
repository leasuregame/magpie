/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-27
 * Time: 上午1:47
 * To change this template use File | Settings | File Templates.
 */


(function () {
    var path = require("path");
    var fs = require("fs");

    var Factory = module.exports = {};

    Factory.init = function (type) {
        autoLoad(type);
        return Factory;
    };

    var autoLoad = function (type) {
        return fs.readdirSync(__dirname + "/" + type).forEach(function (filename) {
            var load, name;
            if (!/Dao\.js/.test(filename)) {
                return;
            }
            name = path.basename(filename, ".js");
            load = function () {
                return require("./" + type + "/" + name);
            };
            return Factory.__defineGetter__(name.slice(0, -3), load);
        });
    };

}).call(this);
