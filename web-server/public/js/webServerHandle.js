
(function(){
    var util = window.wsUtil;

    var API_BASE_PATH = '/admin/api/';
    var API = {
        ACTOR_CARDS : API_BASE_PATH + 'getActorCards',
        CARD_LV_LIMIT : API_BASE_PATH + 'getCardLv',
        RECHARGE_PRODUCT : API_BASE_PATH + 'rechargeProduct',
        CONSUME_SOURCE : API_BASE_PATH + 'getConsumeSource',
        PLAYER_NAMES : API_BASE_PATH + 'getPlayerNames',
        PLAYER_IDS : API_BASE_PATH + 'getPlayerId',
        RECORD_MSG_OPT : API_BASE_PATH + 'recordMsgOpt',
        RECORD_RCHG_OPT : API_BASE_PATH + 'recordRchgOpt',
        GET_MSG_OPT : API_BASE_PATH + 'getSysMsgOpt',
        GET_RCHG_OPT : API_BASE_PATH + 'getRchgOpt',
        SYS_MSG : API_BASE_PATH + 'getSysMsg',
        RECHARGE_RECORD : API_BASE_PATH + 'getRechargeRecord',
        WASTAGE_RATE_ON_LV : API_BASE_PATH + 'getWastageRateOnLv',
        PLAYER_CONSUMPTION : API_BASE_PATH + 'getPlayerConsumption',
        DOWNLOAD_PLAYER_CONSUMPTION : API_BASE_PATH + 'download/playerConsumption',
        DOWNLOAD_WASTAGE_RATE_ON_LV : API_BASE_PATH + 'download/wastageRateOnLv',
        GET_RCHG_SIG : API_BASE_PATH + 'getRchgSig'
    };

    var webAPI = {};

    /**
     * 获得神仙卡配置
     * @param cb
     */
    webAPI.getActorCards = function (cb) {
        ajax(API.ACTOR_CARDS, cb);
    };

    /**
     * 获得卡牌每个星级等级上限配置
     * @param cb
     */
    webAPI.getCardLvLimit = function (cb) {
        ajax(API.CARD_LV_LIMIT, cb);
    };

    /**
     * 获得充值项目
     * @param cb
     */
    webAPI.getRechargeProduct = function (cb) {
        ajax(API.RECHARGE_PRODUCT, cb);
    };

    /**
     * 获得消费魔石来源的配置
     * @param cb
     */
    webAPI.getConsumeSource = function (cb) {
        ajax(API.CONSUME_SOURCE, cb);
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

    /**
     * 记录发送奖励操作
     * @param areaId
     * @param options
     * @param playerNames
     * @param status
     */
    webAPI.recordSendMsgOpt = function (areaId, options, playerNames, status) {
        var param = {
            areaId : areaId,
            playerNames : playerNames,
            options : options,
            status : status
        };
        ajax(API.RECORD_MSG_OPT, param, null);
    };

    /**
     * 获取系统消息操作记录
     * @param createTime
     * @param scb
     * @param ecb
     */
    webAPI.getMsgOptions = function (createTime, scb, ecb) {
        createTime[0] = util.strDate2Ms(createTime[0]);
        createTime[1] = util.strDate2Ms(createTime[1]);

        var param = {
            createTime : createTime
        };
        ajax(API.GET_MSG_OPT, param, scb, ecb);
    };

    /**
     * 记录后台充值操作
     * @param areaId
     * @param options
     * @param playerNames
     * @param status
     */
    webAPI.recordRechargeOpt = function (areaId, options, playerNames, status) {
        var param = {
            areaId : areaId,
            playerNames : playerNames,
            options : options,
            status : status
        };
        ajax(API.RECORD_RCHG_OPT, param, null);
    };

    /**
     * 获取后台充值操作记录
     * @param createTime
     * @param scb
     * @param ecb
     */
    webAPI.getRechargeOptions = function (createTime, scb, ecb) {
        createTime[0] = util.strDate2Ms(createTime[0]);
        createTime[1] = util.strDate2Ms(createTime[1]);

        var param = {
            createTime : createTime
        };
        ajax(API.GET_RCHG_OPT, param, scb, ecb);
    };

    /**
     * 获取后台充值记录
     * @param areaId
     * @param playerIds
     * @param createTime
     * @param scb
     * @param ecb
     */
    webAPI.getRechargeRecord = function (areaId, playerIds, createTime, scb, ecb) {
        var param = {
            areaId : areaId,
            playerIds : playerIds,
            createTime : createTime
        };
        ajax(API.RECHARGE_RECORD, param, scb, ecb);
    };

    /**
     * 获取系统消息
     * @param areaId
     * @param playerIds
     * @param createTime
     * @param scb
     * @param ecb
     */
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

    /**
     * 获取玩家等级流失率
     * @param areaId
     * @param created
     * @param createTime
     * @param scb
     * @param ecb
     */
    webAPI.getLvWastageRate = function (areaId, created, recordDate, scb, ecb) {
        var param = {
            areaId : areaId,
            created : created, // player创建时间
            recordDate : recordDate
        };
        ajax(API.WASTAGE_RATE_ON_LV, param, scb, ecb);
    };

    /**
     * 获取魔石使用占比
     * @param areaId
     * @param createTime
     * @param scb
     * @param ecb
     */
    webAPI.getConsumptionRate = function (areaId, createTime, scb, ecb) {
        var param = {
            areaId : areaId,
            createTime : createTime
        };
        ajax(API.PLAYER_CONSUMPTION, param, scb, ecb);
    };

    /**
     * 获取充值签名
     * @param param
     * @param scb
     * @param ecb
     */
    webAPI.getRchgSig = function (param, scb, ecb) {
        ajax(API.GET_RCHG_SIG, param, scb, ecb);
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
    window.webAPI.API = API;
}());
