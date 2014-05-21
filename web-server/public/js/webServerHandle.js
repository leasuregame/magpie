
(function(){
    var API_BASE_PATH = '/api/';
    var API = {
        ACTOR_CARDS : API_BASE_PATH + 'actor-cards',
        CARD_LV_LIMIT : API_BASE_PATH + 'card-lv'
    };

    var webAPI = {};

    webAPI.getActorCards = function (cb) {
        ajax(API.ACTOR_CARDS, cb);
    };

    webAPI.getCardLvLimit = function (cb) {
        ajax(API.CARD_LV_LIMIT, cb);
    };

    function ajax(url, successCb) {
        $.ajax({
            url: url,
            success: function (data) {
                successCb(data);
            }
        })
    }


    window.webAPI = webAPI;

}());
