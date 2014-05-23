
(function(){
    var API_BASE_PATH = '/admin/';
    var API = {
        ACTOR_CARDS : API_BASE_PATH + 'actor-cards',
        CARD_LV_LIMIT : API_BASE_PATH + 'card-lv',
        PLAYER_NAMES : API_BASE_PATH + 'playerNames',
        PLAYER_IDS : API_BASE_PATH + 'playerId',
        LOG_REWARD : API_BASE_PATH + 'logger4Reward'
    };

    var webAPI = {};

    webAPI.getActorCards = function (cb) {
        ajax(API.ACTOR_CARDS, cb);
    };

    webAPI.getCardLvLimit = function (cb) {
        ajax(API.CARD_LV_LIMIT, cb);
    };

    /**
     * 调用获得用户名的接口
     * @param param {areaId, lv , vip, amount, payTime} 其中除了areaId, key : number | [number1, number2]
     * @param cb
     */
    webAPI.getPlayerNames = function (param, cb) {
        ajax(API.PLAYER_NAMES, param, cb);
    };

    /**
     * 调用根据用户名获得id的接口
     * @param areaId
     * @param playerNames
     * @param cb
     */
    webAPI.getPlayerIdsByNames = function (areaId, playerNames, cb) {
        var param = {
            areaId : areaId,
            playerNames : playerNames
        };
        ajax(API.PLAYER_IDS, param, cb);
    };

    webAPI.logReward = function (area, data, player) {
        var param = {
            area : area,
            data : data,
            player : player
        };
        ajax(API.LOG_REWARD, param, null);
    };

    function ajax(url, data, successCb, errorCb) {
        if(arguments.length == 2) {
            errorCb = successCb;
            successCb = data;
            data = {};
        }
        $.ajax({
            url: url,
            data: data,
            type: 'post',
            success: successCb,
            error: errorCb
        })
    }


    window.webAPI = webAPI;

}());
