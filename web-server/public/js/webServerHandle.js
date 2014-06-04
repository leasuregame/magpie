
(function(){
    var util = window.wsUtil;

    var API_BASE_PATH = '/admin/';
    var API = {
        ACTOR_CARDS : API_BASE_PATH + 'actor-cards',
        CARD_LV_LIMIT : API_BASE_PATH + 'card-lv',
        PLAYER_NAMES : API_BASE_PATH + 'playerNames',
        PLAYER_IDS : API_BASE_PATH + 'playerId',
        RECORD_MSG_OPT : API_BASE_PATH + 'recordMsgOpt',
        GET_MSG_OPT : API_BASE_PATH + 'getSysMsgOpt',
        SYS_MSG : API_BASE_PATH + 'sysMsg'
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
     * @param scb
     * @param ecb
     */
    webAPI.getPlayerNames = function (param, scb, ecb) {
        ajax(API.PLAYER_NAMES, param, scb, ecb);
    };

    /**
     * 调用根据用户名获得id的接口
     * @param areaId
     * @param playerNames
     * @param scb
     * @param ecb
     */
    webAPI.getPlayerIdsByNames = function (areaId, playerNames, scb, ecb) {
        var param = {
            areaId : areaId,
            playerNames : playerNames
        };
        ajax(API.PLAYER_IDS, param, scb, ecb);
    };

    webAPI.recordSendMsgOpt = function (areaId, options, playerNames, status) {
        var param = {
            areaId : areaId,
            playerNames : playerNames,
            options : options,
            status : status
        };
        ajax(API.RECORD_MSG_OPT, param, null);
    };

    webAPI.getMsgOptions = function (createTime, scb, ecb) {
        createTime[0] = util.strDate2Ms(createTime[0]);
        createTime[1] = util.strDate2Ms(createTime[1]);

        var param = {
            createTime : createTime
        };
        ajax(API.GET_MSG_OPT, param, scb, ecb);
    };

    webAPI.getSysMessages = function (areaId, playerIds, createTime, scb, ecb) {
        createTime[0] = util.strDate2Ms(createTime[0]);
        createTime[1] = util.strDate2Ms(createTime[1]);

        var param = {
            areaId : areaId,
            playerIds : playerIds,
            createTime : createTime
        };
        ajax(API.SYS_MSG, param, scb, ecb);
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
