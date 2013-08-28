/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-8-24
 * Time: 下午2:10
 * To change this template use File | Settings | File Templates.
 */

var path = require('path');
var dir = path.join('../config/area');
var areasInfo = require (dir);

function Area(area) {
    this.name = area.name;
    this.id = area.id;
};

Area.getAreasList = function(cb) {

    var areas = [];
    areasInfo.forEach(function(area){
        areas.push(new Area(area));
    });

    return cb(areas);

};

module.exports = Area;
