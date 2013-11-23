module.exports = {
    // 战斗力兑换系数
    ABILIGY_EXCHANGE: {
        atk: 1, // 1点攻击力 = 1点战斗力
        hp: 2,  // 3点生命值 = 1点攻击力
        crit: 80,  // 1%暴击率 = 80点攻击力
        dodge: 80,  // 1%闪避率 = 80点攻击力
        dmg_reduce: 80,  // 1%减伤率 = 80点攻击力
        star: {
            3: 150, // 3星每级技能 = 150点攻击力
            4: 200, // 4星每级技能 = 200点攻击力
            5: 250  // 5星每级技能 = 250点攻击力
        },
        spiritor_per_lv: 300  // 元神每1级 = 300点攻击力
    },

    // 经验卡牌配置表ID
    EXP_CARD_ID: 30000,
    /*
     * 抽卡参数配置
     */
    /*"STAR": {       // 抽卡时得到卡牌的星级的概率
     "LOWER": {    // 低级抽卡
     "1": 50,
     "2": 45,
     "3": 4.5,
     "4": 0.5
     },
     "MEDIUM": {   // 中级抽卡
     "2": 70,
     "3": 28,
     "4": 1.95,
     "5": 0.05
     },
     "HIGHT": {    // 高级抽卡
     "3": 95,
     "4": 4.9,
     "5": 0.1
     }
     },*/

    "STAR": {
        "LOWER": {
            "1": 60,
            "2": 25,
            "3": 14,
            "4": 1
        },

        "HIGHT": {    // 高级抽卡
            "3": 95,
            "4": 5,
            "5": 0
        }

    },

    "HIGHT_DRAWCARD_MARGIN": [   //高级抽卡概率变化幅度
        {
            "3": 90,
            "4": 10,
            "5": 0,
            "COUNTS": 1,
            "MARGIN": 0
        },
        {
            "3": 89.9,
            "4": 10,
            "5": 0.1,
            "COUNTS": 51,
            "MARGIN": 0.1
        },
        {
            "3": 80,
            "4": 10,
            "5": 10,
            "COUNTS": 151,
            "MARGIN": 1
        }
    ],

    "MAX_HIGHT_DRAWCARD_COUNT": 240,


    "HIGHT_LEVEL_INIT": 1,    // 抽到高级卡牌（3、4、5星卡牌）的等级的初始值
    "LOWER_LEVEL_INIT": {     // 抽到低级卡牌（1、2星卡牌）的等级的初始值，以及对应的概率
        "1": 60,                // key, value 分别表示 星级 和 对应得到的概率
        "2": 10,
        "3": 10,
        "4": 10,
        "5": 10
    },

    "FRAGMENT": {             // 抽卡获得卡牌碎片的概率变化幅度
        "1": {
            "COUNTS": 50,
            "MARGIN": 2
        },
        "2": {
            "COUNTS": 20,
            "MARGIN": 5
        }
    },
    "LOTTERY_CONSUME": {
        "1": {
            "1": 39,
            "2": 199
        },
        "0": {
            "1": 200,
            "2": 1000
        }
    },

    /*
     * 被动技能的类型，和卡牌出生时获得的值的范围
     */
    "PASSIVESKILL": {
        TYPE: [
            'crit',
            'dodge',
            'dmg_reduce',
            'atk_improve',
            'hp_improve'
        ],
        VALUE_SCOPE: '1-4'
    },
    /*
     * 卡牌级别范围上限
     * key 代表卡牌星级，value 代表对应星级所能达到的最高级
     */
    MAX_LEVEL: {
        1: 30,
        2: 40,
        3: 50,
        4: 55,
        5: 60
    },

    /*
     * 卡牌点亮后可领取的活力值
     */
    LIGHT_UP_ENERGY: {
        1: 50,
        2: 80,
        3: 100,
        4: 300,
        5: 500
    },
    /*
     * 卡牌碎片兑换配置信息
     */
    CARD_EXCHANGE: {
        4: 15,
        5: 40
    }
}