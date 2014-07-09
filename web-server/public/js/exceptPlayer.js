/**
 * 读取与记录'需排除用户'相关控件
 */

var ctrlExcPlayer = null;

(function(){
    var excPlayer = {};
    var $box = $('#exceptPlayerBox');
    var exceptedPlayers = [];
    var need2ExceptPlayer = false;

    /**
     * 初始化已记录的用户
     * @param cb
     */
    function initExceptedPlayers(cb) {
        if(!$.isEmptyObject(serverNamePair)){
            window.webAPI.getExcPlayer(function(data){
                exceptedPlayers = data;
                var excPlayers = exceptedPlayers;
                var tagArea = $box.find('.tagArea');
                tagArea.empty();
                var tagTemp = $('#excPlayerTemp').html();
                for(var i in excPlayers) {
                    var player = excPlayers[i];
                    var $tmpTag = $(tagTemp);
                    var txt = serverNamePair[player.areaId] + '--' + player.name;
                    $tmpTag.find('.name').text(txt);
                    $tmpTag.data('idx', i);
                    tagArea.append($tmpTag);
                }
                cb && cb();
            });
        } else {
            setTimeout(function(){
                initExceptedPlayers(cb);
            }, 100);
        }
    }

    /**
     * 初始化开关状态
     */
    function initExcPlayerSwitch (){
//    enableExcPlayer();
        disableExcPlayer();
    }

    /**
     * 启用排除
     */
    function enableExcPlayer() {
        need2ExceptPlayer = true;
        $box.find('.excPlayerDL').addClass('hide');
        $box.find('.switch').removeClass('btn-danger').addClass('btn-success').text('已启用');
    }

    /**
     * 禁用排除
     */
    function disableExcPlayer() {
        need2ExceptPlayer = false;
        $box.find('.excPlayerDL').removeClass('hide');
        $box.find('.switch').removeClass('btn-success').addClass('btn-danger').text('已禁用');

    }

    /**
     * 增加一个玩家的tag
     * @param player
     */
    function appendExcPlayer(player){
        var tagArea = $('#exceptPlayerBox .tagArea');
        var tagTemp = $('#excPlayerTemp').html();
        var $tmpTag = $(tagTemp);
        var txt = serverNamePair[player.areaId] + '--' + player.name;
        $tmpTag.find('.name').text(txt);
        $tmpTag.data('idx', exceptedPlayers.length);
        exceptedPlayers.push(player);
        tagArea.append($tmpTag);
    }

    /**
     * 获取数据,供外部调用
     * @returns {{}}
     */
    excPlayer.getExcPlayerIds = function(){
        var ret = {};
        if(need2ExceptPlayer) {
            for(var i in exceptedPlayers) {
                var player = exceptedPlayers[i];
                for(var key in ret) {
                    if(key == player.areaId) {
                        ret[key].push(player.id);
                        player = null;
                        break;
                    }
                }
                if(!!player) {
                    ret[player.areaId] = [player.id];
                }
            }
        }
        return ret;
    };

    /**
     * 调用初始化事件与事件绑定
     */
    $(document).ready(function() {
        initExceptedPlayers(initExcPlayerSwitch);

        $box.find('.addExcPlayer').click(function(){
            var nameStr = $box.find('.exceptPlayer').val();
            if(nameStr.length > 0) {
                var $this = $(this);
                var names = nameStr.split(';');
                $this.attr('disabled', 'disabled');
                window.webAPI.addExcPlayer(names, function(data){
                    $box.find('.addExcPlayer').removeAttr('disabled');
                    if(data.code == 200) {
                        for(var i in data.msg) {
                            appendExcPlayer(data.msg[i]);
                        }
                    } else {
                        alert(data.msg);
                    }
                });
            }
        });
        $box.find('.tagArea').delegate('.remove', 'click', function(){
            var tag = $(this).parent();
            var pIdx = tag.data('idx');
            var player = exceptedPlayers.splice(pIdx, 1);

            window.webAPI.delExcPlayer(player, function(data){
                if(data.code == 200) {
                    tag.remove();
                } else {
                    alert(data.msg);
                }
            });
        });
        $box.find('.switch').click(function(){
            if(need2ExceptPlayer) {
                disableExcPlayer();
            } else {
                enableExcPlayer();
            }
        });
    });

    ctrlExcPlayer = excPlayer;
})();