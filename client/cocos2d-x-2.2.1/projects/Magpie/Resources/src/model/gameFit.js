/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-11-5
 * Time: 下午4:48
 * To change this template use File | Settings | File Templates.
 */


var gameFit = null;
var gameDevice = "Unknown";

var gameFitAdapter = function () {
    cc.log("gameFitAdapter");

    var size = cc.Director.getInstance().getWinSize();
    var height = size.height;

    cc.log("宽度: " + size.width + " | 高度: " + size.height);

    if (height == 1136) {
        gameFit = fit4Iphone5;
        gameDevice = "Iphone5";
    } else {
        gameFit = fit4Iphone4;
        gameDevice = "Other";
    }
};
