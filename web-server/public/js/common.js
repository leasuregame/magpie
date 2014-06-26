/**
 * Created with JetBrains WebStorm.
 * User: xiejiayue
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function() {

    function initPlatformName(){
        var ipPlatfomNamePair = {
          "125.90.93.74:9090" : "YY大神",
          "115.29.12.178:9090" : "越狱平台",
          "115.29.12.80:9090" : "AppStore平台"
        };
        $('#platformName span').text(ipPlatfomNamePair[window.location.host]);
    }

    initPlatformName();
});