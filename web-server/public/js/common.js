/**
 * Created with JetBrains WebStorm.
 * User: xiejiayue
 * To change this template use File | Settings | File Templates.
 */

window.wsConst = {};

$(document).ready(function() {

    function initPlatformName(){
        var ipPlatformNamePair = {
          "125.90.93.74:9090" : "YY大神",
          "115.29.12.178:9090" : "越狱平台",
          "115.29.12.80:9090" : "AppStore平台"
        };
        $('#platformName span').text(ipPlatformNamePair[window.location.host]);
    }

    initPlatformName();
});