#Boss相关接口文档
###Boss分为5个状态：沉睡，苏醒，逃走，死亡，消失
-   沉睡：玩家遇见Boss，还没发起第一次攻击之前
-   苏醒：第一次攻击之后，逃走或者死亡之前
-   逃走：Boss被攻击10次之后
-   超时：Boss被攻击了10次或被击杀之前，Boss最长存活时间12个小时之后
-   死亡：Boss被击杀之后，消失之前
-   消失：Boss已被击杀或者逃走，经过2个小时之后为消失状态
**Boss表：boss**

    id 自增索引id
    tableId boss在配置表的id
    playerId 玩家id
    atkCount 被攻击的次数
    hp boss剩余血量
    status boss当前的状态
    created boss出现的时间
**每次攻击记录表：bossAttack**

    id 自增索引id
    bossId 关联boss表的id
    playerId 攻击者id
    damage 伤害总值
    money 攻击者获得的仙币奖励
    honor 攻击者获得的荣誉点奖励
    moneyAdd 贡献奖励，仙币
    honorAdd 贡献奖励，荣誉点
    battleLogId 战报Id
**boss伤害排行榜：damageOfRank**

    id 自增索引id
    playerId 玩家Id
    week 周id，如201409表示2014年第9周
    damage 伤害总值
    kneelCount 被膜拜次数
    got 是否已领取排行榜奖励
    created 创建时间
**好友协助奖励：bossFriendReward**

    id 自增索引id
    playerId 玩家id
    friendId 好友Id
    money 仙币奖励
    honor 荣誉点奖励
    got 是否领取
    created 创建时间

**登录接口修改，添加以下字段：**

    {
        code: 200,
         msg:  player {
                ......
            honor: 102,
            superHonor: 34,
            bossInfo: {
                cd: 1010,
                  kneelCount: 2,
                   canReceive: true / false  //是否可以领取好友协助奖励标记
            }
        }， 
        user: {} 
    }
### 1. 探索触发Boss
-   修改探索接口，增加出现Boss功能
-   每次探索按5%的概率触发Boss，1~20次探索必然出现一次Boss
-   出现的Boss有三种类型，分别为蓝卡、紫卡、金卡。蓝卡BOSS随机概率：60%，紫卡BOSS随机概率：25%，金卡BOSS随机概率15%。
-   如果玩家已经有苏醒状态的Boss，则不会去触发新的Boss。也就是说同一时间，每个玩家只能有一个苏醒状态的Boss
-   出现的Boss存活时间为12小时，逃走或死亡之后可存在2小时，之后就消失掉，不能查看
-	探索返回结果增加一个节点：
    	
    	{
        	code: 200,
        	msg: {
	
    	        …
	            find_boss： {
                	bossId: 1,
                	finder: “嗜血狂人”,
                	killer: null,
	                countLeft: 5，
    	            status： 2,
        	        timeLeft: 600000， // boss剩余时间（毫秒数）
            	    tableId： 2
            	}
       		}
    	}
### 2. 查看Boss列表
-   接口名称：area.bossHandler.bossList
-   参数：无
-   描述：
		查看自己的和好友的未消失的Boss列表
		每个Boss包含的信息：bossId, finder(发现者),
		killer(击杀者)，countLeft(剩余攻击次数)，status(Boss状态)，boss剩余存活剩余时间（12小时），boss卡牌配置表id
-	若拿出来的Boss有超时的，则更新Boss状态
-	Boss的显示顺序为：
	（自己的）沉睡的、苏醒的、逃走的、超时的、死亡的Boss
	（好友的）苏醒的、逃走的、超时的、死亡的Boss
	
	**	Note: 按给出的状态顺序排序 **
-   返回值：

        { 
            code: 200,
            msg: {
                cd: 123123123,
                bossList: [
                    { * // 自己的，苏醒状态的Boss*
                        bossId: 1,
                        finder: “嗜血狂人”,
                        killer: null,
                        countLeft: 5，
                        status： 2,
                        timeLeft: 600000， // boss剩余时间（毫秒数）
                        tableId： 2
                    },
                    { * // 自己的，逃走状态的Boss*
                        bossId: 2,
                        finder: “嗜血狂人”,
                        killer: “大飞”,
                        countLeft: 0，
                        status： 3，
                        timeLeft: 600000, // boss剩余时间（毫秒数）
                        tableId： 2
                    }，
                    { * // 好友的苏醒状态的Boss*
                        bossId: 3,
                        finder: “鸟人”,
                        killer: null,
                        countLeft: 6,
                        status: 2，
                        timeLeft: 600000 // boss剩余时间（毫秒数）
                        tableId： 2
                    }，
                    { * // 好友的，死亡状态的Boss*
                        bossId: 4,
                        finder: “欧迪芬”,
                        killer: “嗜血狂人”,
                        countLeft: 0,
                        status: 4，
                        timeLeft: 600000 // boss剩余时间（毫秒数）
                        tableId： 2
                    }
                ]
            }
        }
### 3.攻击Boss、协助好友
-   接口名称：area.bossHandler.attack
-   参数：

        {
            bossId: 12,
            inspireCount：0  *// 鼓舞次数，默认值为0*
        }
-   描述：
    -   只能攻击自己的（沉睡、苏醒）或者好友的（苏醒）Boss
    -   每个Boss最多只能被攻击10次，10次之后逃走
    -   攻击时，可以话费魔石鼓舞卡牌，增加上阵卡牌的攻击力。一次鼓舞增加20%，最高提升100%，也就说每次攻击最多能买5次鼓舞。
    -   鼓舞消耗的魔石为阶梯性消耗，第一次20魔石，后续每次增加20魔石
    -   攻击后玩家进入攻击CD冷却时间30分钟
    -   CD冷却时间内，玩家不能对任何Boss发起攻击
    -   若为最后一次攻击Boss，奖励和贡献都翻倍。这里说的最后一次，指的是第10次攻击或者Boss被击杀的那次攻击
    -   若此次攻击为协助好友，攻击者自己获得100%的奖励，被协助的好友获得30%的奖励。并给在线好友推送一条消息，提示好友有奖励可领
    -   获得仙币和荣誉两种奖励，奖励是根据攻击者在本次攻击中所打出的总伤害值计算。（结果向上取整）
        1000点伤害 = 31点仙币
        2000点伤害 = 1点荣誉 
-   根基Boss的类型不同，奖励值也不同。蓝卡BOSS，无奖励加成。紫卡BOSS，每次50%的的奖励加成。金卡BOSS，每次150%的奖励加成。
-   好友协助奖励信息推送：

        名称：onFriendHelp
        消息内容：{ msg: {friendId: 384}}
-   返回值：

        若Boss不属于自己或好友的:
        {
            code: 501,
            msg: ‘不能攻击陌生人的Boss哦’
        }
        若Boss已位死亡、逃走、消失状态:
        {
            code: 501,
            msg: ‘Boss已结束’
        }
        若为好友沉睡的Boos:
        {
            code: 501,
            msg: ‘Boss未苏醒’
        }
        若在冷却时间内:
        {
            code: 501,
            msg: ‘不能攻击’
        }
        攻击成功：
        { 
            code: 200,
             
            msg: {
                boss: { // boss的最新信息
                    bossId: 4,
                    finder: “欧迪芬”,
                    killer: “嗜血狂人”,
                    countLeft: 0,
                    status: 4，
                    timeLeft: 600000, // boss剩余时间（毫秒数）
                    tableId： 2
                }
                gold: 123013 // 玩家魔石剩余总量
                damage： 230000 // 伤害总值
                cd: 300000 // 新的CD，毫秒数
                battleLog: {
                    ….
                    reward: {
                        money: 2030,
                        honor: 45
                    }
                }
            }
        }
### 4. 查看Boss被攻击的详细信息列表
-   接口名称：area.bossHandler.attackDetails
-   参数：{ bossId: 12 } // bossId 应为数据库的索引id
-   描述：获取Boss被攻击的详细信息。每行记录包括：攻击者，攻击者Id，伤害值，奖励值（和贡献值），战报Id
-   返回值：

    	{ 
        code: 200,
        msg:  
        [
            {
                playerId： 23, // 攻击者ID
                attaker: ‘德玛’， // 攻击者名称
                damage: 1232313, // 伤害总值
                money: 38201, // 仙币奖励
                honor: 323,
                  // 荣誉点奖励
                money_add: 1020, // 贡献仙币
                honor: 123, // 贡献荣誉点
                battleLogId: 23 // 战报Id
            }
        ]
    	}
### 5. 产看上周Boss伤害排行版
按上周boss伤害总值排名，获取前5名玩家信息
-   接口名称：area.bossHandler.lastWeek
-   参数：无
-   返回值：

        {
            code: 200,
            msg: {
                damageList: [
                    {
                        playerId: 1,
                          // 玩家ID
                        name: ‘多发发’, // 玩家名称
                        damage: 1231232343， // 伤害总值
                        kneelCount: 122 // 被膜拜次数
                    }，
                    {
                        playerId: 2,
                        name: ‘哦排队即可’,
                        damage: 293848581,
                        kneelCount: 34
                    }…
                ],
                lastWeek: { // 若没有上周排行，则 lastWeek = null
                    rank: 10,
                    money: 123123,
                    honor: 1232
                }
            }
        }
### 6. 产看本周Boss伤害排行版
按本周boss伤害总值排名，获取前5名玩家信息
-   接口名称：area.bossHandler.thisWeek
-   参数：无
-   返回值：

        {
            code: 200,
            msg: {
                damageList: [
                    {
                        playerId: 1,
                        name: ‘多发发’,
                        damage: 1231232343,
                        kneelCount: 123
                    }，
                    {
                        playerId: 2,
                        name: ‘哦排队即可’,
                        damage: 293848581,
                        kneelCount: 1234
                    }…
                ],
                thisWeek: {
                    rank: 472,
                    money: 0,
                    honor: 12
                }
            }
        }
### 7. 领取上周排行榜奖励
若玩家没有进入前5名，则根据每周伤害总量的排名，只能获得少量的荣誉奖励，没有仙币和活力了。
依照8000点荣誉计算，名次每降低20名，奖励减少0.3%。最低奖励为2000点荣誉。（5000名以外的，每周至少可获得2000点额外的荣誉排名奖励。）
-   接口名称：area.bossHandler.getLastWeekReward
-   参数：无
-   返回值：

        若上周没有奖励可领:
        { code: 501, msg: ‘上周没有奖励可领’}
        领取奖励成功：
        {
            code: 200,
            msg: {
                money: 5000,
                honor: 2000,
                energy: 2030
            }
        }
### 8. 领取好友协助Boss奖励
-   接口名称：area.bossHandler.getFriendReward
-   参数：无
-   返回值：

        若无奖励可领：
        { code: 501, msg: ‘无奖励可领’}
        领取成功：
        {
            code: 200,
            msg: { money: 12312, honor: 12}
        }
### 9. 荣誉点兑换成精元
客户端根据当前荣誉点计算可兑换的精元数，由玩家决定要兑换多少精元。
每6000点荣誉可兑换1枚精元。精元是星级进阶的必备品。
-   接口名称：area.bossHandler.convertHonor
-   参数：{number: 12} // 兑换的精元数
-   返回值：
        
        { code: 200, msg: {superHonor: 23, honor: 123232}}
### 10. 消CD
第一次消除CD需要消耗：20魔石，后续每次增加消耗20魔石。最高每次消耗限制为200魔石。（无次数上限）
-   接口名称：area.bossHandler.removeTimer
-   参数：无
-   返回值：

        若无CD可消除：
        {code: 501, msg: ‘无CD可消除’}
        消除成功：
        {code：200, msg: {gold：12312}}
### 11. 膜拜
（本周）上榜的玩家可以被膜拜，每名玩家（一天）只能膜拜3次。膜拜可获得15点体力，75点活力，同时显示该前5名玩家每名被膜拜的累计次数。
-   接口名称：area.bossHandler.kneel
-   参数：{playerId: 12}
-   返回值：

        若玩家当前不是前5名：
        {code: 501, msg: ‘玩家没上榜，不能膜拜’}
        若膜拜次数已用完：
        {code：501，msg：‘膜拜次数已用完’}
        膜拜成功：
        {
            code: 200,
            msg: {
                power: 15,
                energy: 75
            }
        }
