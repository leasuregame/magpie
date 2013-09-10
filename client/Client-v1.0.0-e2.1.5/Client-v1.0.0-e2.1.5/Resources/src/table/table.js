var nameChanged = {
    "skills": "技能配置表",
    "技能配置表": "skills",
    "skill_type": "技能类型表",
    "技能类型表": "skill_type",
    "scope": "卡牌范围表",
    "卡牌范围表": "scope",
    "skill_upgrade": "卡牌技能升级表",
    "卡牌技能升级表": "skill_upgrade",
    "elixir": "仙丹配置表",
    "仙丹配置表": "elixir",
    "star_upgrade": "卡牌进阶配置表",
    "卡牌进阶配置表": "star_upgrade",
    "card_lv_limit": "卡牌等级限制表",
    "卡牌等级限制表": "card_lv_limit",
    "card_grow": "卡牌升级表",
    "卡牌升级表": "card_grow",
    "factors": "基础属性成长表",
    "基础属性成长表": "factors",
    "cards": "神仙卡牌配置表",
    "神仙卡牌配置表": "cards",
    "pass_reward": "关卡产出表",
    "关卡产出表": "pass_reward",
    "pass_config": "关卡卡牌配置表",
    "关卡卡牌配置表": "pass_config",
    "task_card": "任务怪物属性表",
    "任务怪物属性表": "task_card",
    "task_config": "任务卡牌配置表",
    "任务卡牌配置表": "task_config",
    "wipe_out": "任务扫荡产出表",
    "任务扫荡产出表": "wipe_out",
    "chapter": "大章表",
    "大章表": "chapter",
    "chapter_title": "总章表",
    "总章表": "chapter_title",
    "task": "任务奖励表",
    "任务奖励表": "task",
    "player_upgrade": "玩家升级经验表",
    "玩家升级经验表": "player_upgrade",
    "title": "竞技称号表",
    "竞技称号表": "title",
    "rank": "竞技产出表",
    "竞技产出表": "rank",
    "treasure_hunt": "寻宝配置表",
    "寻宝配置表": "treasure_hunt",
    "spirit_pool": "灵气池配置表",
    "灵气池配置表": "spirit_pool",
    "spirit": "元神配置表",
    "元神配置表": "spirit",
    "signIn_rewards": "签到奖励",
    "签到奖励": "signIn_rewards",
    "recharge": "充值类型",
    "充值类型": "recharge",
    "vip_privilege": "vip特权",
    "vip特权": "vip_privilege",
    "vip_box": "vip礼包赠品",
    "vip礼包赠品": "vip_box",
    "vip": "vip",
    "achievement": "成就配置表",
    "成就配置表": "achievement"
};

var outputTables = {
    "skills": {
        "colComment": {
            "type": {
                "table": "技能类型表",
                "key_index": "id",
                "value_index": "name",
                "withPound": false
            },
            "scope": {
                "table": "卡牌范围表",
                "key_index": "id",
                "value_index": "name",
                "withPound": false
            }
        },
        "rows": {
            "1": {
                "id": 1,
                "description": "单体攻击，对敌方卡牌造成大量伤害。",
                "type": 1,
                "scope": 1,
                "star3": "130,5",
                "rate3": 30,
                "star4": "140,5",
                "rate4": 35,
                "star5": "150,5",
                "rate5": 40
            },
            "2": {
                "id": 2,
                "description": "横向攻击，对敌方前排每张卡牌造成一定伤害。",
                "type": 2,
                "scope": 2,
                "star3": "35,5",
                "rate3": 30,
                "star4": "45,5",
                "rate4": 35,
                "star5": "55,5",
                "rate5": 40
            },
            "3": {
                "id": 3,
                "description": "横向攻击，对敌方后排每张卡牌造成一定伤害。",
                "type": 2,
                "scope": 3,
                "star3": "35,5",
                "rate3": 30,
                "star4": "45,5",
                "rate4": 35,
                "star5": "55,5",
                "rate5": 40
            },
            "4": {
                "id": 4,
                "description": "纵向攻击，对敌方纵列每张卡牌造成一定伤害。。",
                "type": 2,
                "scope": 4,
                "star3": "45,5",
                "rate3": 30,
                "star4": "55,5",
                "rate4": 35,
                "star5": "65,5",
                "rate5": 40
            },
            "5": {
                "id": 5,
                "description": "随机攻击敌方2张卡牌，对每张卡牌造成一定伤害。",
                "type": 2,
                "scope": 5,
                "target_num": 2,
                "star3": "45,5",
                "rate3": 30,
                "star4": "50,5",
                "rate4": 35,
                "star5": "55,5",
                "rate5": 40
            },
            "6": {
                "id": 6,
                "description": "随机攻击敌方3张卡牌，对每张卡牌造成一定伤害。",
                "type": 2,
                "scope": 5,
                "target_num": 3,
                "star3": "35,5",
                "rate3": 30,
                "star4": "45,5",
                "rate4": 35,
                "star5": "55,5",
                "rate5": 40
            },
            "7": {
                "id": 7,
                "description": "为当前血量最低的上阵卡牌恢复生命值。治疗量取决于拥有该治疗技能卡牌的生命值上限。",
                "type": 3,
                "scope": 7,
                "star3": "40,5",
                "rate3": 30,
                "star4": "50,5",
                "rate4": 35,
                "star5": "60,5",
                "rate5": 40
            },
            "8": {
                "id": 8,
                "description": "为前排卡牌恢复生命值。治疗量取决于拥有该治疗技能卡牌的生命值上限。",
                "type": 4,
                "scope": 2,
                "star3": "25,5",
                "rate3": 30,
                "star4": "35,5",
                "rate4": 35,
                "star5": "45,5",
                "rate5": 40
            },
            "9": {
                "id": 9,
                "description": "为后排卡牌恢复生命值。治疗量取决于拥有该治疗技能卡牌的生命值上限。",
                "type": 4,
                "scope": 3,
                "star3": "25,5",
                "rate3": 30,
                "star4": "35,5",
                "rate4": 35,
                "star5": "45,5",
                "rate5": 40
            },
            "10": {
                "id": 10,
                "description": "为当前上阵的所有卡牌恢复生命值。治疗量取决于拥有该治疗技能卡牌的生命值上限。",
                "type": 4,
                "scope": 6,
                "star3": "10,5",
                "rate3": 30,
                "star4": "20,5",
                "rate4": 35,
                "star5": "30,5",
                "rate5": 40
            }
        }
    },
    "skill_type": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "name": "single_fight",
                "chinese": "单体攻击"
            },
            "2": {
                "id": 2,
                "name": "aoe",
                "chinese": "群体攻击"
            },
            "3": {
                "id": 3,
                "name": "single_heal",
                "chinese": "单体治疗"
            },
            "4": {
                "id": 4,
                "name": "mult_heal",
                "chinese": "群体治疗"
            }
        }
    },
    "scope": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "name": "default",
                "value": 1,
                "desc": "默认出手顺序"
            },
            "2": {
                "id": 2,
                "name": "crossways_front",
                "value": 2,
                "desc": "前排所有"
            },
            "3": {
                "id": 3,
                "name": "crossways_back",
                "value": 3,
                "desc": "后排所有"
            },
            "4": {
                "id": 4,
                "name": "lengthways",
                "value": 4,
                "desc": "纵向所有"
            },
            "5": {
                "id": 5,
                "name": "random",
                "value": 5,
                "desc": "随机卡牌"
            },
            "6": {
                "id": 6,
                "name": "all",
                "value": 6,
                "desc": "所有卡牌"
            },
            "7": {
                "id": 7,
                "name": "hp_min",
                "value": 7,
                "desc": "血量最低卡牌"
            }
        }
    },
    "skill_upgrade": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "star3": 3000,
                "star4": 5000,
                "star5": 10000
            },
            "2": {
                "id": 2,
                "star3": 6000,
                "star4": 15000,
                "star5": 30000
            },
            "3": {
                "id": 3,
                "star3": 9000,
                "star4": 30000,
                "star5": 60000
            },
            "4": {
                "id": 4,
                "star3": 12000,
                "star4": 80000,
                "star5": 120000
            },
            "5": {
                "id": 5,
                "star3": 15000,
                "star4": 120000,
                "star5": 200000
            }
        }
    },
    "elixir": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "elixir": 5,
                "atk": 1,
                "hp": 3,
                "star3_max": 20000,
                "star4_max": 50000,
                "star5_max": 10000
            }
        }
    },
    "star_upgrade": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "star": 1,
                "money_need": 3000,
                "rate_per_card": 7,
                "max_num": 15
            },
            "2": {
                "id": 2,
                "star": 2,
                "money_need": 5000,
                "rate_per_card": 6,
                "max_num": 17
            },
            "3": {
                "id": 3,
                "star": 3,
                "money_need": 10000,
                "rate_per_card": 5,
                "max_num": 20
            },
            "4": {
                "id": 4,
                "star": 4,
                "money_need": 20000,
                "rate_per_card": 3,
                "max_num": 34
            }
        }
    },
    "card_lv_limit": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "max_lv": 30
            },
            "2": {
                "id": 2,
                "max_lv": 40
            },
            "3": {
                "id": 3,
                "max_lv": 50
            },
            "4": {
                "id": 4,
                "max_lv": 55
            },
            "5": {
                "id": 5,
                "max_lv": 60
            }
        }
    },
    "card_grow": {
        "colComment": {},
        "rows": {
            "0": {
                "id": 0,
                "lv": 0,
                "exp_need": 100,
                "money_need": 110,
                "cur_exp": 0
            },
            "1": {
                "id": 1,
                "lv": 1,
                "exp_need": 110,
                "money_need": 115,
                "cur_exp": 100
            },
            "2": {
                "id": 2,
                "lv": 2,
                "exp_need": 121,
                "money_need": 132,
                "cur_exp": 210
            },
            "3": {
                "id": 3,
                "lv": 3,
                "exp_need": 133,
                "money_need": 152,
                "cur_exp": 331
            },
            "4": {
                "id": 4,
                "lv": 4,
                "exp_need": 146,
                "money_need": 175,
                "cur_exp": 464
            },
            "5": {
                "id": 5,
                "lv": 5,
                "exp_need": 161,
                "money_need": 201,
                "cur_exp": 610
            },
            "6": {
                "id": 6,
                "lv": 6,
                "exp_need": 177,
                "money_need": 231,
                "cur_exp": 771
            },
            "7": {
                "id": 7,
                "lv": 7,
                "exp_need": 195,
                "money_need": 266,
                "cur_exp": 948
            },
            "8": {
                "id": 8,
                "lv": 8,
                "exp_need": 215,
                "money_need": 306,
                "cur_exp": 1143
            },
            "9": {
                "id": 9,
                "lv": 9,
                "exp_need": 237,
                "money_need": 352,
                "cur_exp": 1358
            },
            "10": {
                "id": 10,
                "lv": 10,
                "exp_need": 261,
                "money_need": 405,
                "cur_exp": 1595
            },
            "11": {
                "id": 11,
                "lv": 11,
                "exp_need": 287,
                "money_need": 466,
                "cur_exp": 1856
            },
            "12": {
                "id": 12,
                "lv": 12,
                "exp_need": 316,
                "money_need": 536,
                "cur_exp": 2143
            },
            "13": {
                "id": 13,
                "lv": 13,
                "exp_need": 348,
                "money_need": 616,
                "cur_exp": 2459
            },
            "14": {
                "id": 14,
                "lv": 14,
                "exp_need": 383,
                "money_need": 708,
                "cur_exp": 2807
            },
            "15": {
                "id": 15,
                "lv": 15,
                "exp_need": 421,
                "money_need": 814,
                "cur_exp": 3190
            },
            "16": {
                "id": 16,
                "lv": 16,
                "exp_need": 463,
                "money_need": 936,
                "cur_exp": 3611
            },
            "17": {
                "id": 17,
                "lv": 17,
                "exp_need": 509,
                "money_need": 1076,
                "cur_exp": 4074
            },
            "18": {
                "id": 18,
                "lv": 18,
                "exp_need": 560,
                "money_need": 1237,
                "cur_exp": 4583
            },
            "19": {
                "id": 19,
                "lv": 19,
                "exp_need": 616,
                "money_need": 1423,
                "cur_exp": 5143
            },
            "20": {
                "id": 20,
                "lv": 20,
                "exp_need": 678,
                "money_need": 1636,
                "cur_exp": 5759
            },
            "21": {
                "id": 21,
                "lv": 21,
                "exp_need": 746,
                "money_need": 1881,
                "cur_exp": 6437
            },
            "22": {
                "id": 22,
                "lv": 22,
                "exp_need": 821,
                "money_need": 2163,
                "cur_exp": 7183
            },
            "23": {
                "id": 23,
                "lv": 23,
                "exp_need": 903,
                "money_need": 2487,
                "cur_exp": 8004
            },
            "24": {
                "id": 24,
                "lv": 24,
                "exp_need": 993,
                "money_need": 2860,
                "cur_exp": 8907
            },
            "25": {
                "id": 25,
                "lv": 25,
                "exp_need": 1092,
                "money_need": 3289,
                "cur_exp": 9900
            },
            "26": {
                "id": 26,
                "lv": 26,
                "exp_need": 1201,
                "money_need": 3782,
                "cur_exp": 10992
            },
            "27": {
                "id": 27,
                "lv": 27,
                "exp_need": 1321,
                "money_need": 4349,
                "cur_exp": 12193
            },
            "28": {
                "id": 28,
                "lv": 28,
                "exp_need": 1453,
                "money_need": 5001,
                "cur_exp": 13514
            },
            "29": {
                "id": 29,
                "lv": 29,
                "exp_need": 1598,
                "money_need": 5751,
                "cur_exp": 14967
            },
            "30": {
                "id": 30,
                "lv": 30,
                "exp_need": 1758,
                "money_need": 6614,
                "cur_exp": 16565
            },
            "31": {
                "id": 31,
                "lv": 31,
                "exp_need": 1934,
                "money_need": 7606,
                "cur_exp": 18323
            },
            "32": {
                "id": 32,
                "lv": 32,
                "exp_need": 2127,
                "money_need": 8747,
                "cur_exp": 20257
            },
            "33": {
                "id": 33,
                "lv": 33,
                "exp_need": 2340,
                "money_need": 10059,
                "cur_exp": 22384
            },
            "34": {
                "id": 34,
                "lv": 34,
                "exp_need": 2574,
                "money_need": 11568,
                "cur_exp": 24724
            },
            "35": {
                "id": 35,
                "lv": 35,
                "exp_need": 2831,
                "money_need": 13303,
                "cur_exp": 27298
            },
            "36": {
                "id": 36,
                "lv": 36,
                "exp_need": 3114,
                "money_need": 15298,
                "cur_exp": 30129
            },
            "37": {
                "id": 37,
                "lv": 37,
                "exp_need": 3425,
                "money_need": 17593,
                "cur_exp": 33243
            },
            "38": {
                "id": 38,
                "lv": 38,
                "exp_need": 3768,
                "money_need": 20232,
                "cur_exp": 36668
            },
            "39": {
                "id": 39,
                "lv": 39,
                "exp_need": 4145,
                "money_need": 23267,
                "cur_exp": 40436
            },
            "40": {
                "id": 40,
                "lv": 40,
                "exp_need": 4560,
                "money_need": 26757,
                "cur_exp": 44581
            },
            "41": {
                "id": 41,
                "lv": 41,
                "exp_need": 5016,
                "money_need": 30771,
                "cur_exp": 49141
            },
            "42": {
                "id": 42,
                "lv": 42,
                "exp_need": 5518,
                "money_need": 35387,
                "cur_exp": 54157
            },
            "43": {
                "id": 43,
                "lv": 43,
                "exp_need": 6070,
                "money_need": 40695,
                "cur_exp": 59675
            },
            "44": {
                "id": 44,
                "lv": 44,
                "exp_need": 6677,
                "money_need": 46799,
                "cur_exp": 65745
            },
            "45": {
                "id": 45,
                "lv": 45,
                "exp_need": 7345,
                "money_need": 53819,
                "cur_exp": 72422
            },
            "46": {
                "id": 46,
                "lv": 46,
                "exp_need": 8080,
                "money_need": 61892,
                "cur_exp": 79767
            },
            "47": {
                "id": 47,
                "lv": 47,
                "exp_need": 8888,
                "money_need": 71176,
                "cur_exp": 87847
            },
            "48": {
                "id": 48,
                "lv": 48,
                "exp_need": 9777,
                "money_need": 81852,
                "cur_exp": 96735
            },
            "49": {
                "id": 49,
                "lv": 49,
                "exp_need": 10755,
                "money_need": 94130,
                "cur_exp": 106512
            },
            "50": {
                "id": 50,
                "lv": 50,
                "exp_need": 11831,
                "money_need": 108250,
                "cur_exp": 117267
            },
            "51": {
                "id": 51,
                "lv": 51,
                "exp_need": 13014,
                "money_need": 124488,
                "cur_exp": 129098
            },
            "52": {
                "id": 52,
                "lv": 52,
                "exp_need": 14315,
                "money_need": 143161,
                "cur_exp": 142112
            },
            "53": {
                "id": 53,
                "lv": 53,
                "exp_need": 15747,
                "money_need": 164635,
                "cur_exp": 156427
            },
            "54": {
                "id": 54,
                "lv": 54,
                "exp_need": 17322,
                "money_need": 189330,
                "cur_exp": 172174
            },
            "55": {
                "id": 55,
                "lv": 55,
                "exp_need": 19054,
                "money_need": 217730,
                "cur_exp": 189496
            },
            "56": {
                "id": 56,
                "lv": 56,
                "exp_need": 20959,
                "money_need": 250390,
                "cur_exp": 208550
            },
            "57": {
                "id": 57,
                "lv": 57,
                "exp_need": 23055,
                "money_need": 287949,
                "cur_exp": 229509
            },
            "58": {
                "id": 58,
                "lv": 58,
                "exp_need": 25361,
                "money_need": 331141,
                "cur_exp": 252564
            },
            "59": {
                "id": 59,
                "lv": 59,
                "exp_need": 27897,
                "money_need": 380812,
                "cur_exp": 277925
            },
            "60": {
                "id": 60,
                "lv": 60,
                "exp_need": 30687,
                "money_need": 437934,
                "cur_exp": 305822
            }
        }
    },
    "factors": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "lv": 1,
                "base": 1.1,
                "factor": 1
            },
            "2": {
                "id": 2,
                "lv": 2,
                "base": 1.099,
                "factor": 1.1
            },
            "3": {
                "id": 3,
                "lv": 3,
                "base": 1.098,
                "factor": 1.209
            },
            "4": {
                "id": 4,
                "lv": 4,
                "base": 1.097,
                "factor": 1.327
            },
            "5": {
                "id": 5,
                "lv": 5,
                "base": 1.096,
                "factor": 1.456
            },
            "6": {
                "id": 6,
                "lv": 6,
                "base": 1.095,
                "factor": 1.596
            },
            "7": {
                "id": 7,
                "lv": 7,
                "base": 1.094,
                "factor": 1.748
            },
            "8": {
                "id": 8,
                "lv": 8,
                "base": 1.093,
                "factor": 1.912
            },
            "9": {
                "id": 9,
                "lv": 9,
                "base": 1.092,
                "factor": 2.09
            },
            "10": {
                "id": 10,
                "lv": 10,
                "base": 1.091,
                "factor": 2.282
            },
            "11": {
                "id": 11,
                "lv": 11,
                "base": 1.09,
                "factor": 2.49
            },
            "12": {
                "id": 12,
                "lv": 12,
                "base": 1.089,
                "factor": 2.714
            },
            "13": {
                "id": 13,
                "lv": 13,
                "base": 1.088,
                "factor": 2.956
            },
            "14": {
                "id": 14,
                "lv": 14,
                "base": 1.087,
                "factor": 3.216
            },
            "15": {
                "id": 15,
                "lv": 15,
                "base": 1.086,
                "factor": 3.496
            },
            "16": {
                "id": 16,
                "lv": 16,
                "base": 1.085,
                "factor": 3.797
            },
            "17": {
                "id": 17,
                "lv": 17,
                "base": 1.084,
                "factor": 4.12
            },
            "18": {
                "id": 18,
                "lv": 18,
                "base": 1.083,
                "factor": 4.466
            },
            "19": {
                "id": 19,
                "lv": 19,
                "base": 1.082,
                "factor": 4.837
            },
            "20": {
                "id": 20,
                "lv": 20,
                "base": 1.081,
                "factor": 5.234
            },
            "21": {
                "id": 21,
                "lv": 21,
                "base": 1.08,
                "factor": 5.658
            },
            "22": {
                "id": 22,
                "lv": 22,
                "base": 1.079,
                "factor": 6.111
            },
            "23": {
                "id": 23,
                "lv": 23,
                "base": 1.078,
                "factor": 6.594
            },
            "24": {
                "id": 24,
                "lv": 24,
                "base": 1.077,
                "factor": 7.108
            },
            "25": {
                "id": 25,
                "lv": 25,
                "base": 1.076,
                "factor": 7.655
            },
            "26": {
                "id": 26,
                "lv": 26,
                "base": 1.075,
                "factor": 8.237
            },
            "27": {
                "id": 27,
                "lv": 27,
                "base": 1.074,
                "factor": 8.855
            },
            "28": {
                "id": 28,
                "lv": 28,
                "base": 1.073,
                "factor": 9.51
            },
            "29": {
                "id": 29,
                "lv": 29,
                "base": 1.072,
                "factor": 10.204
            },
            "30": {
                "id": 30,
                "lv": 30,
                "base": 1.071,
                "factor": 10.939
            },
            "31": {
                "id": 31,
                "lv": 31,
                "base": 1.07,
                "factor": 11.716
            },
            "32": {
                "id": 32,
                "lv": 32,
                "base": 1.069,
                "factor": 12.536
            },
            "33": {
                "id": 33,
                "lv": 33,
                "base": 1.068,
                "factor": 13.401
            },
            "34": {
                "id": 34,
                "lv": 34,
                "base": 1.067,
                "factor": 14.312
            },
            "35": {
                "id": 35,
                "lv": 35,
                "base": 1.066,
                "factor": 15.271
            },
            "36": {
                "id": 36,
                "lv": 36,
                "base": 1.065,
                "factor": 16.279
            },
            "37": {
                "id": 37,
                "lv": 37,
                "base": 1.064,
                "factor": 17.337
            },
            "38": {
                "id": 38,
                "lv": 38,
                "base": 1.063,
                "factor": 18.447
            },
            "39": {
                "id": 39,
                "lv": 39,
                "base": 1.062,
                "factor": 19.609
            },
            "40": {
                "id": 40,
                "lv": 40,
                "base": 1.061,
                "factor": 20.825
            },
            "41": {
                "id": 41,
                "lv": 41,
                "base": 1.06,
                "factor": 22.095
            },
            "42": {
                "id": 42,
                "lv": 42,
                "base": 1.059,
                "factor": 23.421
            },
            "43": {
                "id": 43,
                "lv": 43,
                "base": 1.058,
                "factor": 24.803
            },
            "44": {
                "id": 44,
                "lv": 44,
                "base": 1.057,
                "factor": 26.242
            },
            "45": {
                "id": 45,
                "lv": 45,
                "base": 1.05600000000001,
                "factor": 27.738
            },
            "46": {
                "id": 46,
                "lv": 46,
                "base": 1.05500000000001,
                "factor": 29.291
            },
            "47": {
                "id": 47,
                "lv": 47,
                "base": 1.05400000000001,
                "factor": 30.902
            },
            "48": {
                "id": 48,
                "lv": 48,
                "base": 1.05300000000001,
                "factor": 32.571
            },
            "49": {
                "id": 49,
                "lv": 49,
                "base": 1.05200000000001,
                "factor": 34.297
            },
            "50": {
                "id": 50,
                "lv": 50,
                "base": 1.05100000000001,
                "factor": 36.08
            },
            "51": {
                "id": 51,
                "lv": 51,
                "base": 1.05000000000001,
                "factor": 37.92
            },
            "52": {
                "id": 52,
                "lv": 52,
                "base": 1.04900000000001,
                "factor": 39.816
            },
            "53": {
                "id": 53,
                "lv": 53,
                "base": 1.04800000000001,
                "factor": 41.767
            },
            "54": {
                "id": 54,
                "lv": 54,
                "base": 1.04700000000001,
                "factor": 43.772
            },
            "55": {
                "id": 55,
                "lv": 55,
                "base": 1.04600000000001,
                "factor": 45.829
            },
            "56": {
                "id": 56,
                "lv": 56,
                "base": 1.04500000000001,
                "factor": 47.937
            },
            "57": {
                "id": 57,
                "lv": 57,
                "base": 1.04400000000001,
                "factor": 50.094
            },
            "58": {
                "id": 58,
                "lv": 58,
                "base": 1.04300000000001,
                "factor": 52.298
            },
            "59": {
                "id": 59,
                "lv": 59,
                "base": 1.04200000000001,
                "factor": 54.547
            },
            "60": {
                "id": 60,
                "lv": 60,
                "base": 1.04100000000001,
                "factor": 56.838
            }
        }
    },
    "cards": {
        "colComment": {
            "skill_id": {
                "table": "技能配置表",
                "key_index": "id",
                "value_index": "id",
                "withPound": false
            }
        },
        "rows": {
            "1": {
                "id": 1,
                "number": 1,
                "name": "石猴·孙悟空",
                "star": 1,
                "lv": 1,
                "atk": 59,
                "hp": 103,
                "description": "不要老是跟我提五百年后的事情，烦不烦啊！",
                "url": 1
            },
            "2": {
                "id": 2,
                "number": 1,
                "name": "美猴王·孙悟空",
                "star": 2,
                "lv": 1,
                "atk": 109,
                "hp": 125,
                "description": "凭什么我是妖，你是仙，户口本上有写么？",
                "url": 2
            },
            "3": {
                "id": 3,
                "number": 1,
                "name": "齐天大圣·孙悟空",
                "star": 3,
                "lv": 1,
                "atk": 155,
                "hp": 352,
                "skill_name": "七十二变",
                "skill_id": 3,
                "description": "从今往后一万年，你们都会记住我的名字，齐天大圣孙悟空。",
                "url": 3
            },
            "4": {
                "id": 4,
                "number": 1,
                "name": "行者·孙悟空",
                "star": 4,
                "lv": 1,
                "atk": 210,
                "hp": 503,
                "skill_name": "七十二变",
                "skill_id": 3,
                "description": "你是谁的亲戚，麻烦打架前先报上来，免得俺老孙白费力气。",
                "url": 4
            },
            "5": {
                "id": 5,
                "number": 1,
                "name": "斗战圣佛·孙悟空",
                "star": 5,
                "lv": 1,
                "atk": 280,
                "hp": 651,
                "skill_name": "七十二变",
                "skill_id": 3,
                "description": "一沙一世界，一树一菩提，妖即是色，色即是空，空即是佛。",
                "url": 5
            },
            "6": {
                "id": 6,
                "number": 2,
                "name": "猪刚鬣·猪八戒",
                "star": 1,
                "lv": 1,
                "atk": 45,
                "hp": 129,
                "description": "当你不能够再拥有，你唯一可以做的，就是令自己不要忘记。",
                "url": 6
            },
            "7": {
                "id": 7,
                "number": 2,
                "name": "高庄主·猪八戒",
                "star": 2,
                "lv": 1,
                "atk": 91,
                "hp": 275,
                "description": "第一次见到翠兰，我就想起了你，就像每次抬头看到月亮一样。",
                "url": 1
            },
            "8": {
                "id": 8,
                "number": 2,
                "name": "二师兄·猪八戒",
                "star": 3,
                "lv": 1,
                "atk": 142,
                "hp": 398,
                "skill_name": "倒打一耙",
                "skill_id": 5,
                "description": "猴子说我呆，沙僧说我二，其实我只是不想做这些无意义的事情。",
                "url": 2
            },
            "9": {
                "id": 9,
                "number": 2,
                "name": "净坛使者·猪八戒",
                "star": 4,
                "lv": 1,
                "atk": 182,
                "hp": 543,
                "skill_name": "倒打一耙",
                "skill_id": 5,
                "description": "连如来也当我是个吃货，其实我唯有不停的吃，才能让自己不去想她。",
                "url": 3
            },
            "10": {
                "id": 10,
                "number": 2,
                "name": "天蓬元帅·猪八戒",
                "star": 5,
                "lv": 1,
                "atk": 255,
                "hp": 713,
                "skill_name": "倒打一耙",
                "skill_id": 5,
                "description": "那年，我管银河系。",
                "url": 4
            },
            "11": {
                "id": 11,
                "number": 3,
                "name": "流沙河·沙悟净",
                "star": 1,
                "lv": 1,
                "atk": 51,
                "hp": 122,
                "description": "昨日像那东流水，离我远去不可留，今日乱我心，多烦忧。",
                "url": 5
            },
            "12": {
                "id": 12,
                "number": 3,
                "name": "骷髅九·沙悟净",
                "star": 2,
                "lv": 1,
                "atk": 97,
                "hp": 246,
                "description": "我脖子上九个骷髅可不是塑料的，哥也是在道上混的。",
                "url": 6
            },
            "13": {
                "id": 13,
                "number": 3,
                "name": "沙和尚·沙悟净",
                "star": 3,
                "lv": 1,
                "atk": 148,
                "hp": 372,
                "skill_name": "流沙搅风",
                "skill_id": 1,
                "description": "大师兄，师傅被抓走了！大师兄，二师兄和师傅被抓走了！",
                "url": 1
            },
            "14": {
                "id": 14,
                "number": 3,
                "name": "卷帘大将·沙悟净",
                "star": 4,
                "lv": 1,
                "atk": 202,
                "hp": 518,
                "skill_name": "流沙搅风",
                "skill_id": 1,
                "description": "我这职位就像领导司机，比较敏感，容易说错话做错事。",
                "url": 2
            },
            "15": {
                "id": 15,
                "number": 3,
                "name": "金身罗汉·沙悟净",
                "star": 5,
                "lv": 1,
                "atk": 273,
                "hp": 674,
                "skill_name": "流沙搅风",
                "skill_id": 1,
                "description": "我是要告诉人家，我失去的东西一定要拿回来！",
                "url": 3
            },
            "16": {
                "id": 16,
                "number": 4,
                "name": "大力·牛魔王",
                "star": 1,
                "lv": 1,
                "atk": 50,
                "hp": 121,
                "description": "力气大不是罪，不能什么脏活累活都叫我做啊！",
                "url": 4
            },
            "17": {
                "id": 17,
                "number": 4,
                "name": "芭蕉洞主·牛魔王",
                "star": 2,
                "lv": 1,
                "atk": 95,
                "hp": 151,
                "description": "我按照芭蕉叶的样子，给你铸了把扇子，妹纸，你喜欢么？",
                "url": 5
            },
            "18": {
                "id": 18,
                "number": 4,
                "name": "平天大圣·牛魔王",
                "star": 3,
                "lv": 1,
                "atk": 151,
                "hp": 373,
                "skill_name": "群牛乱舞",
                "skill_id": 5,
                "description": "看清楚是平天不是齐天！猴子是我小弟，不要总拿他压我！",
                "url": 6
            },
            "19": {
                "id": 19,
                "number": 4,
                "name": "众神之神·牛魔王",
                "star": 4,
                "lv": 1,
                "atk": 203,
                "hp": 520,
                "skill_name": "群牛乱舞",
                "skill_id": 5,
                "description": "我宁愿做一日英雄，都不想成世做条虫，放马过来吧！",
                "url": 1
            },
            "20": {
                "id": 20,
                "number": 4,
                "name": "放下屠刀·牛魔王",
                "star": 5,
                "lv": 1,
                "atk": 275,
                "hp": 675,
                "skill_name": "群牛乱舞",
                "skill_id": 5,
                "description": "孩子被你们带走了，老婆也离我而去，你要我放下，我还有什么可放？",
                "url": 2
            },
            "21": {
                "id": 21,
                "number": 5,
                "name": "唐僧·金蝉子",
                "star": 1,
                "lv": 1,
                "atk": 49,
                "hp": 120,
                "description": "那年，我徒步去阿三国，没有导游，只有三个同样不认识路的驴友。",
                "url": 3
            },
            "22": {
                "id": 22,
                "number": 5,
                "name": "普渡众佛·金蝉子",
                "star": 2,
                "lv": 1,
                "atk": 99,
                "hp": 249,
                "description": "江湖谣言吃了我的肉可以长生不老，你看我年龄就知道是假的了。",
                "url": 4
            },
            "23": {
                "id": 23,
                "number": 5,
                "name": "燃灯道人·金蝉子",
                "star": 3,
                "lv": 1,
                "atk": 148,
                "hp": 377,
                "skill_name": "普度众生",
                "skill_id": 10,
                "description": "我知道在雷音寺宣传道教等于去踢馆，所以如来直接把我给转世到了人间。",
                "url": 5
            },
            "24": {
                "id": 24,
                "number": 5,
                "name": "功德佛·金蝉子",
                "star": 4,
                "lv": 1,
                "atk": 201,
                "hp": 522,
                "skill_name": "普度众生",
                "skill_id": 10,
                "description": "我心里清楚，我的功德是奶了雷音寺这帮人，而不是因为取经。",
                "url": 6
            },
            "25": {
                "id": 25,
                "number": 5,
                "name": "真身·金蝉子",
                "star": 5,
                "lv": 1,
                "atk": 272,
                "hp": 676,
                "skill_name": "普度众生",
                "skill_id": 10,
                "description": "我吃素，却总是被人当肉吃，我只想做回我自己。",
                "url": 1
            },
            "26": {
                "id": 26,
                "number": 6,
                "name": "龟兹公主·铁扇公主",
                "star": 1,
                "lv": 1,
                "atk": 60,
                "hp": 105,
                "description": "那一年，我在龟兹，那一年，我是公主。",
                "url": 2
            },
            "27": {
                "id": 27,
                "number": 6,
                "name": "罗刹女·铁扇公主",
                "star": 2,
                "lv": 1,
                "atk": 111,
                "hp": 225,
                "description": "嫁给老牛后，我有了另一个名字，罗莎女。",
                "url": 3
            },
            "28": {
                "id": 28,
                "number": 6,
                "name": "芭蕉扇·铁扇公主",
                "star": 3,
                "lv": 1,
                "atk": 161,
                "hp": 341,
                "skill_name": "浴火重生",
                "skill_id": 2,
                "description": "你热么？我给你扇扇？",
                "url": 4
            },
            "29": {
                "id": 29,
                "number": 6,
                "name": "牛夫人·铁扇公主",
                "star": 4,
                "lv": 1,
                "atk": 216,
                "hp": 501,
                "skill_name": "浴火重生",
                "skill_id": 2,
                "description": "以前看月亮的时候叫人家小甜甜，原来都是假的。",
                "url": 5
            },
            "30": {
                "id": 30,
                "number": 6,
                "name": "情比金坚·铁扇公主",
                "star": 5,
                "lv": 1,
                "atk": 288,
                "hp": 630,
                "skill_name": "浴火重生",
                "skill_id": 2,
                "description": "孩子已被掳走，再不能让他们把我们夫妻分离了。",
                "url": 6
            },
            "31": {
                "id": 31,
                "number": 7,
                "name": "天将·巨灵神",
                "star": 1,
                "lv": 1,
                "atk": 53,
                "hp": 125,
                "description": "当天将不是那么容易的，得通过天将考试，录取比例很低。",
                "url": 1
            },
            "32": {
                "id": 32,
                "number": 7,
                "name": "门卫·巨灵神",
                "star": 2,
                "lv": 1,
                "atk": 101,
                "hp": 251,
                "description": "我不喜欢门卫这个称呼，我更喜欢大家叫我天宫天门守将。",
                "url": 2
            },
            "33": {
                "id": 33,
                "number": 7,
                "name": "搬山救民·巨灵神",
                "star": 3,
                "lv": 1,
                "atk": 151,
                "hp": 371,
                "skill_name": "雷霆之怒",
                "skill_id": 3,
                "description": "想搬家么？找我吧！什么？房子很大？我可以把你家对面那条河一起搬走。",
                "url": 3
            },
            "34": {
                "id": 34,
                "number": 7,
                "name": "急先锋·巨灵神",
                "star": 4,
                "lv": 1,
                "atk": 205,
                "hp": 519,
                "skill_name": "雷霆之怒",
                "skill_id": 3,
                "description": "先锋这个职业，基本就是送死+被黑锅的意思，你懂的。",
                "url": 4
            },
            "35": {
                "id": 35,
                "number": 7,
                "name": "神斧·巨灵神",
                "star": 5,
                "lv": 1,
                "atk": 277,
                "hp": 677,
                "skill_name": "雷霆之怒",
                "skill_id": 3,
                "description": "斧头帮知道吧，那是我开创的。",
                "url": 5
            },
            "36": {
                "id": 36,
                "number": 8,
                "name": "神二代·红孩儿",
                "star": 1,
                "lv": 1,
                "atk": 49,
                "hp": 122,
                "description": "我爸是牛魔，我妈是铁扇，我是神二代！",
                "url": 6
            },
            "37": {
                "id": 37,
                "number": 8,
                "name": "火云洞·红孩儿",
                "star": 2,
                "lv": 1,
                "atk": 100,
                "hp": 248,
                "description": "我有一所房子，面朝大海，春暖花开，4M宽带，能叫外卖。",
                "url": 1
            },
            "38": {
                "id": 38,
                "number": 8,
                "name": "三味真火·红孩儿",
                "star": 3,
                "lv": 1,
                "atk": 145,
                "hp": 376,
                "skill_name": "三味真火",
                "skill_id": 3,
                "description": "这门神功的唯一的缺点是使用前要先把自己打出鼻血来……",
                "url": 2
            },
            "39": {
                "id": 39,
                "number": 8,
                "name": "圣婴大王·红孩儿",
                "star": 4,
                "lv": 1,
                "atk": 206,
                "hp": 519,
                "skill_name": "三味真火",
                "skill_id": 3,
                "description": "虽然我长个正太样儿，却有颗大叔的心。",
                "url": 3
            },
            "40": {
                "id": 40,
                "number": 8,
                "name": "善财童子·红孩儿",
                "star": 5,
                "lv": 1,
                "atk": 273,
                "hp": 671,
                "skill_name": "三味真火",
                "skill_id": 3,
                "description": "厌倦了打打杀杀、尔虞我诈的日子，我决定从事更有前途的金融行业。",
                "url": 4
            },
            "41": {
                "id": 41,
                "number": 9,
                "name": "冀州侯·黄飞虎",
                "star": 1,
                "lv": 1,
                "atk": 43,
                "hp": 113,
                "description": "我爹说，老虎要会飞，谁都挡不住，所以我叫黄飞虎。",
                "url": 5
            },
            "42": {
                "id": 42,
                "number": 9,
                "name": "夜奔·黄飞虎",
                "star": 2,
                "lv": 1,
                "atk": 106,
                "hp": 244,
                "description": "领导给我戴个绿帽子也就忍了，还杀我妹妹，下一个是不是轮到我了？",
                "url": 6
            },
            "43": {
                "id": 43,
                "number": 9,
                "name": "复仇·黄飞虎",
                "star": 3,
                "lv": 1,
                "atk": 156,
                "hp": 371,
                "skill_name": "兽之元神",
                "skill_id": 1,
                "description": "当仇恨成为了信仰，我就变成了复仇的恶魔。",
                "url": 1
            },
            "44": {
                "id": 44,
                "number": 9,
                "name": "武成王·黄飞虎",
                "star": 4,
                "lv": 1,
                "atk": 204,
                "hp": 525,
                "skill_name": "兽之元神",
                "skill_id": 1,
                "description": "我对这次的任命很满意，感谢姬总对我的信任！",
                "url": 2
            },
            "45": {
                "id": 45,
                "number": 9,
                "name": "仁圣大帝·黄飞虎",
                "star": 5,
                "lv": 1,
                "atk": 278,
                "hp": 680,
                "skill_name": "兽之元神",
                "skill_id": 1,
                "description": "嫌我名字长？和慈禧比起来，我这个只能算缩写。",
                "url": 3
            },
            "46": {
                "id": 46,
                "number": 10,
                "name": "阿哥·雷震子",
                "star": 1,
                "lv": 1,
                "atk": 53,
                "hp": 119,
                "description": "我爹战斗力强，排到我，已经是第一百个孩子了。",
                "url": 4
            },
            "47": {
                "id": 47,
                "number": 10,
                "name": "羽人·雷震子",
                "star": 2,
                "lv": 1,
                "atk": 103,
                "hp": 244,
                "description": "虽然我有一对翅膀，但请不要叫我鸟人，你可以叫我X-man。",
                "url": 5
            },
            "48": {
                "id": 48,
                "number": 10,
                "name": "救父·雷震子",
                "star": 3,
                "lv": 1,
                "atk": 151,
                "hp": 373,
                "skill_name": "雷音破",
                "skill_id": 1,
                "description": "走的匆忙，忘记问师父我爹长啥样了，这是要闹哪样呀！",
                "url": 6
            },
            "49": {
                "id": 49,
                "number": 10,
                "name": "出五关·雷震子",
                "star": 4,
                "lv": 1,
                "atk": 206,
                "hp": 519,
                "skill_name": "雷音破",
                "skill_id": 1,
                "description": "一条命通五关不难，难的是还要背个人一起过，不服你试试？",
                "url": 1
            },
            "50": {
                "id": 50,
                "number": 10,
                "name": "金刚·雷震子",
                "star": 5,
                "lv": 1,
                "atk": 281,
                "hp": 651,
                "skill_name": "雷音破",
                "skill_id": 1,
                "description": "你感觉不到我的体温，因为我全身都是金刚，没有血肉。",
                "url": 2
            },
            "51": {
                "id": 51,
                "number": 11,
                "name": "羽麟奴·妲己",
                "star": 1,
                "lv": 1,
                "atk": 59,
                "hp": 125,
                "description": "那年我和大家一起高歌：从我羽麟，北平成汤！",
                "url": 3
            },
            "52": {
                "id": 52,
                "number": 11,
                "name": "轩辕坟·妲己",
                "star": 2,
                "lv": 1,
                "atk": 111,
                "hp": 255,
                "description": "南巢一役后，我躲进了轩辕坟，千年修行，千年孤独。",
                "url": 4
            },
            "53": {
                "id": 53,
                "number": 11,
                "name": "彰德夫人·妲己",
                "star": 3,
                "lv": 1,
                "atk": 161,
                "hp": 368,
                "skill_name": "红颜祸水",
                "skill_id": 6,
                "description": "商朝的后宫也演甄嬛传啊有木有，刚进宫皇后就训话，本宫心累啊！",
                "url": 5
            },
            "54": {
                "id": 54,
                "number": 11,
                "name": "醉生梦死·妲己",
                "star": 4,
                "lv": 1,
                "atk": 216,
                "hp": 516,
                "skill_name": "红颜祸水",
                "skill_id": 6,
                "description": "我不懂什么红颜祸水，我只是棋盘中的一颗棋子，但我知道我们是真爱！",
                "url": 6
            },
            "55": {
                "id": 55,
                "number": 11,
                "name": "九尾天狐·妲己",
                "star": 5,
                "lv": 1,
                "atk": 283,
                "hp": 670,
                "skill_name": "红颜祸水",
                "skill_id": 6,
                "description": "千年修白，万年修黑。女娲娘娘，真的是这样子的么？",
                "url": 1
            },
            "56": {
                "id": 56,
                "number": 12,
                "name": "隐士·姜子牙",
                "star": 1,
                "lv": 1,
                "atk": 60,
                "hp": 121,
                "description": "山上啥都有，一分钱不用花，还能赚个隐居的好名声。",
                "url": 2
            },
            "57": {
                "id": 57,
                "number": 12,
                "name": "渔者·姜子牙",
                "star": 2,
                "lv": 1,
                "atk": 115,
                "hp": 260,
                "description": "我每次打开陌陌，向周围的美女打招呼，嘴里都会默念“愿者上钩”。",
                "url": 3
            },
            "58": {
                "id": 58,
                "number": 12,
                "name": "占卜师·姜子牙",
                "star": 3,
                "lv": 1,
                "atk": 162,
                "hp": 370,
                "skill_name": "太公之悲",
                "skill_id": 7,
                "description": "施主印堂发黑，带有凶兆，必有大波，不如让贫道为你算上一卦。",
                "url": 4
            },
            "59": {
                "id": 59,
                "number": 12,
                "name": "尚父·姜子牙",
                "star": 4,
                "lv": 1,
                "atk": 219,
                "hp": 522,
                "skill_name": "太公之悲",
                "skill_id": 7,
                "description": "我孙子和姬发差不多大，他封我为尚父，我总觉得哪里不对劲。",
                "url": 5
            },
            "60": {
                "id": 60,
                "number": 12,
                "name": "齐祖·姜子牙",
                "star": 5,
                "lv": 1,
                "atk": 285,
                "hp": 677,
                "skill_name": "太公之悲",
                "skill_id": 7,
                "description": "齐祖是说我是齐国创始人，不是说我长的像齐达内。",
                "url": 6
            },
            "61": {
                "id": 61,
                "number": 13,
                "name": "总兵·李靖",
                "star": 1,
                "lv": 1,
                "atk": 62,
                "hp": 130,
                "description": "兄弟我在陈塘关当总兵的时候，吃西瓜从来不花钱。",
                "url": 1
            },
            "62": {
                "id": 62,
                "number": 13,
                "name": "人父·李靖",
                "star": 2,
                "lv": 1,
                "atk": 113,
                "hp": 259,
                "description": "我有三子一女，但我还是最喜欢我的干女儿，你懂的。",
                "url": 2
            },
            "63": {
                "id": 63,
                "number": 13,
                "name": "降魔大元帅·李靖",
                "star": 3,
                "lv": 1,
                "atk": 155,
                "hp": 380,
                "skill_name": "失魂引",
                "skill_id": 1,
                "description": "这帮天兵天将下凡连城管都打不过，还想我去收孙悟空！",
                "url": 3
            },
            "64": {
                "id": 64,
                "number": 13,
                "name": "保卫天庭·李靖",
                "star": 4,
                "lv": 1,
                "atk": 219,
                "hp": 529,
                "skill_name": "失魂引",
                "skill_id": 1,
                "description": "天庭的九门提督可不好当，你知道隆科多是怎么挂的么？",
                "url": 4
            },
            "65": {
                "id": 65,
                "number": 13,
                "name": "托塔天王·李靖",
                "star": 5,
                "lv": 1,
                "atk": 288,
                "hp": 680,
                "skill_name": "失魂引",
                "skill_id": 1,
                "description": "每天托着个十几斤重的塔走来走去，我的手臂都快骨质增生了。",
                "url": 5
            },
            "66": {
                "id": 66,
                "number": 14,
                "name": "快枪手·赵公民",
                "star": 1,
                "lv": 1,
                "atk": 51,
                "hp": 122,
                "description": "天下武功，无坚不破，唯快不破，所以先下手总是没错。",
                "url": 6
            },
            "67": {
                "id": 67,
                "number": 14,
                "name": "神鞭·赵公民",
                "star": 2,
                "lv": 1,
                "atk": 99,
                "hp": 243,
                "description": "想歪的给我面壁去，我说的是武器。",
                "url": 1
            },
            "68": {
                "id": 68,
                "number": 14,
                "name": "大罗金仙·赵公明",
                "star": 3,
                "lv": 1,
                "atk": 149,
                "hp": 374,
                "skill_name": "五音诀",
                "skill_id": 8,
                "description": "我能有今天的成就，要感谢我的粑粑和麻麻，还有CCTV。",
                "url": 2
            },
            "69": {
                "id": 69,
                "number": 14,
                "name": "玄坛真君·赵公明",
                "star": 4,
                "lv": 1,
                "atk": 205,
                "hp": 518,
                "skill_name": "五音诀",
                "skill_id": 8,
                "description": "当不当教主真的不重要，看一看这花花世界，就像梦一场。",
                "url": 3
            },
            "70": {
                "id": 70,
                "number": 14,
                "name": "财神·赵公明",
                "star": 5,
                "lv": 1,
                "atk": 271,
                "hp": 672,
                "skill_name": "五音诀",
                "skill_id": 8,
                "description": "我就是一ATM，关键还得你卡里有钱，不然我也帮不了你。",
                "url": 4
            },
            "71": {
                "id": 71,
                "number": 15,
                "name": "异类·申公豹",
                "star": 1,
                "lv": 1,
                "atk": 48,
                "hp": 121,
                "description": "虽然我们是修炼成仙，但我知道他们看不起我的异类出身。",
                "url": 5
            },
            "72": {
                "id": 72,
                "number": 15,
                "name": "铁齿铜牙·申公豹",
                "star": 2,
                "lv": 1,
                "atk": 102,
                "hp": 244,
                "description": "就算我能把死的说成活的，也无法改变阐教的种族主义思想。",
                "url": 6
            },
            "73": {
                "id": 73,
                "number": 15,
                "name": "雷公鞭·申公豹",
                "star": 3,
                "lv": 1,
                "atk": 144,
                "hp": 369,
                "skill_name": "玄冥寒",
                "skill_id": 1,
                "description": "没有人能分辨出这究竟是一道影，还是一堵墙，其实它是我的鞭。",
                "url": 1
            },
            "74": {
                "id": 74,
                "number": 15,
                "name": "万妖之王·申公豹",
                "star": 4,
                "lv": 1,
                "atk": 206,
                "hp": 525,
                "skill_name": "玄冥寒",
                "skill_id": 1,
                "description": "只有和它们在一起，我才能感觉到那种无私的信任与关怀。",
                "url": 2
            },
            "75": {
                "id": 75,
                "number": 15,
                "name": "分水将军·申公豹",
                "star": 5,
                "lv": 1,
                "atk": 279,
                "hp": 666,
                "skill_name": "玄冥寒",
                "skill_id": 1,
                "description": "成王败寇，我的实力无需封神榜上的职位来证明。",
                "url": 3
            },
            "76": {
                "id": 76,
                "number": 16,
                "name": "瞬移·土行孙",
                "star": 1,
                "lv": 1,
                "atk": 49,
                "hp": 120,
                "description": "我可以瞬间从移动到你面前，但你不能站在水泥地上！",
                "url": 4
            },
            "77": {
                "id": 77,
                "number": 16,
                "name": "遁神·土行孙",
                "star": 2,
                "lv": 1,
                "atk": 103,
                "hp": 247,
                "description": "我不仅会土遁，水遁、火遁、尿遁也是样样精通。",
                "url": 5
            },
            "78": {
                "id": 78,
                "number": 16,
                "name": "捆仙绳·土行孙",
                "star": 3,
                "lv": 1,
                "atk": 156,
                "hp": 380,
                "skill_name": "土遁",
                "skill_id": 1,
                "description": "我这根捆仙绳，平时可以当领带，战时可以当武器，多功能用途。",
                "url": 6
            },
            "79": {
                "id": 79,
                "number": 16,
                "name": "地行仙·土行孙",
                "star": 4,
                "lv": 1,
                "atk": 210,
                "hp": 520,
                "skill_name": "土遁",
                "skill_id": 1,
                "description": "地行比飞行安全多了，最多撞个石头啥的，不会坠机。",
                "url": 1
            },
            "80": {
                "id": 80,
                "number": 16,
                "name": "土府星君·土行孙",
                "star": 5,
                "lv": 1,
                "atk": 277,
                "hp": 681,
                "skill_name": "土遁",
                "skill_id": 1,
                "description": "我最大的成就不是封神，而是娶了心中的女神邓婵玉。",
                "url": 2
            },
            "81": {
                "id": 81,
                "number": 17,
                "name": "捕蛇者·法海",
                "star": 1,
                "lv": 1,
                "atk": 50,
                "hp": 123,
                "description": "我只是把捉到的白蛇卖了而已，谁想会记恨我几辈子。",
                "url": 3
            },
            "82": {
                "id": 82,
                "number": 17,
                "name": "苦修·法海",
                "star": 2,
                "lv": 1,
                "atk": 104,
                "hp": 251,
                "description": "好不容易炼成的丹药被她偷吃了，我这辈子又白练了。",
                "url": 4
            },
            "83": {
                "id": 83,
                "number": 17,
                "name": "金山住持·法海",
                "star": 3,
                "lv": 1,
                "atk": 144,
                "hp": 384,
                "skill_name": "苦海无边",
                "skill_id": 9,
                "description": "没想到隔了几辈子再遇到白蛇，已经修炼成了女神模样。",
                "url": 5
            },
            "84": {
                "id": 84,
                "number": 17,
                "name": "雷峰塔·法海",
                "star": 4,
                "lv": 1,
                "atk": 209,
                "hp": 525,
                "skill_name": "苦海无边",
                "skill_id": 9,
                "description": "人蛇恋是不会有结果的，她应该呆在我的身边修炼。",
                "url": 6
            },
            "85": {
                "id": 85,
                "number": 17,
                "name": "升仙·法海",
                "star": 5,
                "lv": 1,
                "atk": 279,
                "hp": 685,
                "skill_name": "苦海无边",
                "skill_id": 9,
                "description": "没想到会和他们一起升仙，看着他们甜蜜的样子，我有点失落。",
                "url": 1
            },
            "86": {
                "id": 86,
                "number": 18,
                "name": "青城山·白素贞",
                "star": 1,
                "lv": 1,
                "atk": 55,
                "hp": 131,
                "description": "我在青城山宅了1800多年才修炼成女神，你会羡慕我么？",
                "url": 2
            },
            "87": {
                "id": 87,
                "number": 18,
                "name": "断桥·白素贞",
                "star": 2,
                "lv": 1,
                "atk": 106,
                "hp": 254,
                "description": "为什么会一见钟情呢，或许因为他是我下山后见得第一个男人。",
                "url": 3
            },
            "88": {
                "id": 88,
                "number": 18,
                "name": "盗草·白素贞",
                "star": 3,
                "lv": 1,
                "atk": 143,
                "hp": 369,
                "skill_name": "水漫金山",
                "skill_id": 4,
                "description": "没灵芝仙草许仙就活不了，许仙不在了我就得回青城山继续宅了！",
                "url": 4
            },
            "89": {
                "id": 89,
                "number": 18,
                "name": "水漫金山·白素贞",
                "star": 4,
                "lv": 1,
                "atk": 206,
                "hp": 524,
                "skill_name": "水漫金山",
                "skill_id": 4,
                "description": "白素贞你住手吧，许仙真的不在珠海金山！",
                "url": 5
            },
            "90": {
                "id": 90,
                "number": 18,
                "name": "紫微星·白素贞",
                "star": 5,
                "lv": 1,
                "atk": 265,
                "hp": 689,
                "skill_name": "水漫金山",
                "skill_id": 4,
                "description": "尔康，你不能恨我，你不能因为我这么爱你而恨我。",
                "url": 6
            },
            "91": {
                "id": 91,
                "number": 19,
                "name": "青蛇·小青",
                "star": 1,
                "lv": 1,
                "atk": 53,
                "hp": 126,
                "description": "我修行了一千年，孤独了一千年。",
                "url": 1
            },
            "92": {
                "id": 92,
                "number": 19,
                "name": "变身·小青",
                "star": 2,
                "lv": 1,
                "atk": 106,
                "hp": 244,
                "description": "既然无法娶女神，我宁愿化为女儿身终身跟随。",
                "url": 2
            },
            "93": {
                "id": 93,
                "number": 19,
                "name": "斗法海·小青",
                "star": 3,
                "lv": 1,
                "atk": 152,
                "hp": 372,
                "skill_name": "黯然销魂",
                "skill_id": 4,
                "description": "法海你不懂爱，姐姐不要你，我也不会从。",
                "url": 3
            },
            "94": {
                "id": 94,
                "number": 19,
                "name": "烧塔·小青",
                "star": 4,
                "lv": 1,
                "atk": 203,
                "hp": 515,
                "skill_name": "黯然销魂",
                "skill_id": 4,
                "description": "法海，要么你跟我走，要么你放过我姐姐！",
                "url": 4
            },
            "95": {
                "id": 95,
                "number": 19,
                "name": "青蛇大仙·小青",
                "star": 5,
                "lv": 1,
                "atk": 268,
                "hp": 677,
                "skill_name": "黯然销魂",
                "skill_id": 4,
                "description": "一起升仙的那天，我和他是最落寞的，只羡鸳鸯不羡仙。",
                "url": 5
            },
            "96": {
                "id": 96,
                "number": 20,
                "name": "秀姑·何仙姑",
                "star": 1,
                "lv": 1,
                "atk": 60,
                "hp": 118,
                "description": "洞宾走后，家里要我嫁人，内心犹如奔过一万头草泥马。",
                "url": 6
            },
            "97": {
                "id": 97,
                "number": 20,
                "name": "辟谷·何仙姑",
                "star": 2,
                "lv": 1,
                "atk": 111,
                "hp": 239,
                "description": "一开始我只是想节食减肥，后来发现习惯了就不饿了……",
                "url": 1
            },
            "98": {
                "id": 98,
                "number": 20,
                "name": "凌风驾云·何仙姑",
                "star": 3,
                "lv": 1,
                "atk": 161,
                "hp": 370,
                "skill_name": "莲花心经",
                "skill_id": 7,
                "description": "那天我花7分钱买了本《筋斗云》，然后我就会飞了。",
                "url": 2
            },
            "99": {
                "id": 99,
                "number": 20,
                "name": "风凰台·何仙姑",
                "star": 4,
                "lv": 1,
                "atk": 221,
                "hp": 522,
                "skill_name": "莲花心经",
                "skill_id": 7,
                "description": "凤凰台上凤凰花，凤凰花开飞凤凰。",
                "url": 3
            },
            "100": {
                "id": 100,
                "number": 20,
                "name": "碧波仙子·何仙姑",
                "star": 5,
                "lv": 1,
                "atk": 290,
                "hp": 662,
                "skill_name": "莲花心经",
                "skill_id": 7,
                "description": "让我们荡起双桨，小船儿推开波浪~~~轻点！",
                "url": 4
            },
            "101": {
                "id": 101,
                "number": 21,
                "name": "黄粱梦·吕洞宾",
                "star": 1,
                "lv": 1,
                "atk": 55,
                "hp": 122,
                "description": "黄粱一梦告诉我：睡前一定要吃饱，不然美梦都会被饿醒。",
                "url": 5
            },
            "102": {
                "id": 102,
                "number": 21,
                "name": "双修·吕洞宾",
                "star": 2,
                "lv": 1,
                "atk": 108,
                "hp": 240,
                "description": "双修就像结对编程，要两个人一起搞，你懂的。",
                "url": 6
            },
            "103": {
                "id": 103,
                "number": 21,
                "name": "纯阳子·吕洞宾",
                "star": 3,
                "lv": 1,
                "atk": 155,
                "hp": 360,
                "skill_name": "流云诀",
                "skill_id": 8,
                "description": "开导劝化风尘女子是我的业余爱好，虽然她们都说我虚伪。",
                "url": 1
            },
            "104": {
                "id": 104,
                "number": 21,
                "name": "剑仙·吕洞宾",
                "star": 4,
                "lv": 1,
                "atk": 210,
                "hp": 512,
                "skill_name": "流云诀",
                "skill_id": 8,
                "description": "这年头，我一跟人说自己是剑仙，他们就流露出诡异的笑容。",
                "url": 2
            },
            "105": {
                "id": 105,
                "number": 21,
                "name": "吕祖·吕洞宾",
                "star": 5,
                "lv": 1,
                "atk": 280,
                "hp": 676,
                "skill_name": "流云诀",
                "skill_id": 8,
                "description": "我有个徒孙叫王重阳，他拿过一个叫华山论剑的武术冠军。",
                "url": 3
            },
            "106": {
                "id": 106,
                "number": 22,
                "name": "神游·铁拐李",
                "star": 1,
                "lv": 1,
                "atk": 56,
                "hp": 137,
                "description": "你可以把神游理解为隐形人，想去哪就去哪……你懂的！",
                "url": 4
            },
            "107": {
                "id": 107,
                "number": 22,
                "name": "借尸还魂·铁拐李",
                "star": 2,
                "lv": 1,
                "atk": 111,
                "hp": 241,
                "description": "为了不辜负大家对神仙相貌的期待，我只能说自己以前是很帅的。",
                "url": 5
            },
            "108": {
                "id": 108,
                "number": 22,
                "name": "化龙·铁拐李",
                "star": 3,
                "lv": 1,
                "atk": 159,
                "hp": 358,
                "skill_name": "流星拐",
                "skill_id": 1,
                "description": "扮猪吃老虎是我的最爱，比如在大街上的人堆里变条龙飞走。",
                "url": 6
            },
            "109": {
                "id": 109,
                "number": 22,
                "name": "呼风唤雨·铁拐李",
                "star": 4,
                "lv": 1,
                "atk": 221,
                "hp": 516,
                "skill_name": "流星拐",
                "skill_id": 1,
                "description": "有人找我求雨，我都要求他舔我的烂腿，没办法，好这口。",
                "url": 1
            },
            "110": {
                "id": 110,
                "number": 22,
                "name": "东华教主·铁拐李",
                "star": 5,
                "lv": 1,
                "atk": 276,
                "hp": 683,
                "skill_name": "流星拐",
                "skill_id": 1,
                "description": "我们教主圈从不缺新闻，最近的咆哮教主你知道么？",
                "url": 2
            },
            "111": {
                "id": 111,
                "number": 23,
                "name": "散汉·汉钟离",
                "star": 1,
                "lv": 1,
                "atk": 52,
                "hp": 129,
                "description": "以前管我们这种人叫散汉，现在叫屌丝。",
                "url": 3
            },
            "112": {
                "id": 112,
                "number": 23,
                "name": "征讨将军·汉钟离",
                "star": 2,
                "lv": 1,
                "atk": 105,
                "hp": 242,
                "description": "我学文的，偏要我去当领兵打仗，真当我是袁崇焕啊。",
                "url": 4
            },
            "113": {
                "id": 113,
                "number": 23,
                "name": "十日试·汉钟离",
                "star": 3,
                "lv": 1,
                "atk": 160,
                "hp": 363,
                "skill_name": "行云流水",
                "skill_id": 9,
                "description": "《十日谈》这样的少儿不宜的书籍都能出名，何况我的是日试呢！",
                "url": 5
            },
            "114": {
                "id": 114,
                "number": 23,
                "name": "炼金术·汉钟离",
                "star": 4,
                "lv": 1,
                "atk": 211,
                "hp": 522,
                "skill_name": "行云流水",
                "skill_id": 9,
                "description": "呐，当差人是要拜关二哥，你要是炒黄金，当然得拜我啦。",
                "url": 6
            },
            "115": {
                "id": 115,
                "number": 23,
                "name": "正阳真人·汉钟离",
                "star": 5,
                "lv": 1,
                "atk": 282,
                "hp": 674,
                "skill_name": "行云流水",
                "skill_id": 9,
                "description": "当了神仙，就跟童话里说的一样，从此过上了幸福的生活。",
                "url": 1
            },
            "116": {
                "id": 116,
                "number": 24,
                "name": "驴友·张果老",
                "star": 1,
                "lv": 1,
                "atk": 39,
                "hp": 128,
                "description": "骑驴比骑马有个性多了，况且有户口的马，那才是驴嘛！",
                "url": 2
            },
            "117": {
                "id": 117,
                "number": 24,
                "name": "歌手·张果老",
                "star": 2,
                "lv": 1,
                "atk": 89,
                "hp": 269,
                "description": "我的歌路很广，穷则乞讨时用，达则可开演唱会。",
                "url": 3
            },
            "118": {
                "id": 118,
                "number": 24,
                "name": "通玄先生·张果老",
                "star": 3,
                "lv": 1,
                "atk": 138,
                "hp": 388,
                "skill_name": "人驴合一",
                "skill_id": 1,
                "description": "我也不记得我多少岁了，名字里就有个老字，咱能不比老么？",
                "url": 4
            },
            "119": {
                "id": 119,
                "number": 24,
                "name": "广宗道人·张果老",
                "star": 4,
                "lv": 1,
                "atk": 182,
                "hp": 555,
                "skill_name": "人驴合一",
                "skill_id": 1,
                "description": "折个驴、变个狗啥的我最在行了，人都说我可以去马戏团工作。",
                "url": 5
            },
            "120": {
                "id": 120,
                "number": 24,
                "name": "冲妙真人·张果老",
                "star": 5,
                "lv": 1,
                "atk": 249,
                "hp": 709,
                "skill_name": "人驴合一",
                "skill_id": 1,
                "description": "我总觉得我的封号有点娘，不过他们说听起来很有冲劲。",
                "url": 6
            },
            "121": {
                "id": 121,
                "number": 25,
                "name": "不羁·韩湘子",
                "star": 1,
                "lv": 1,
                "atk": 41,
                "hp": 130,
                "description": "原谅我这一生不羁放纵爱自由，也会怕有一天会跌倒。",
                "url": 6
            },
            "122": {
                "id": 122,
                "number": 25,
                "name": "天花引·韩湘子",
                "star": 2,
                "lv": 1,
                "atk": 92,
                "hp": 275,
                "description": "我一辈子只写了这一曲，却流传了几辈子。"
            },
            "123": {
                "id": 123,
                "number": 25,
                "name": "点化·韩湘子",
                "star": 3,
                "lv": 1,
                "atk": 144,
                "hp": 390,
                "skill_name": "天籁之音",
                "skill_id": 9,
                "description": "不要信什么只可意会不可言传的烂话，那是人家不想告诉你。"
            },
            "124": {
                "id": 124,
                "number": 25,
                "name": "箫中情·韩湘子",
                "star": 4,
                "lv": 1,
                "atk": 179,
                "hp": 556,
                "skill_name": "天籁之音",
                "skill_id": 9,
                "description": "你会吹箫？是呀！你会吹箫啊？哈哈，有空教你啊！"
            },
            "125": {
                "id": 125,
                "number": 25,
                "name": "尸解仙·韩湘子",
                "star": 5,
                "lv": 1,
                "atk": 255,
                "hp": 702,
                "skill_name": "天籁之音",
                "skill_id": 9,
                "description": "离开的那天，我的爱与肉身一起，在风中化去了。"
            },
            "126": {
                "id": 126,
                "number": 26,
                "name": "行医采药·蓝采和",
                "star": 1,
                "lv": 1,
                "atk": 40,
                "hp": 130,
                "description": "我们那时候行医不用上学，有点植物学基础，会烹饪就行。"
            },
            "127": {
                "id": 127,
                "number": 26,
                "name": "流浪汉·蓝采和",
                "star": 2,
                "lv": 1,
                "atk": 90,
                "hp": 270,
                "description": "想和你就这样流浪，一起看雪看星星看月亮，从诗词歌赋谈到人生哲学。"
            },
            "128": {
                "id": 128,
                "number": 26,
                "name": "万花篮·蓝采和",
                "star": 3,
                "lv": 1,
                "atk": 140,
                "hp": 390,
                "skill_name": "吐气如兰",
                "skill_id": 7,
                "description": "这些年看到好玩的好看的东西，就对着他们念咒语：快到篮里来！"
            },
            "129": {
                "id": 129,
                "number": 26,
                "name": "阴阳体·蓝采和",
                "star": 4,
                "lv": 1,
                "atk": 180,
                "hp": 560,
                "skill_name": "吐气如兰",
                "skill_id": 7,
                "description": "他们说我是阴阳调和于一体，其实我只是有点伪娘控而已。"
            },
            "130": {
                "id": 130,
                "number": 26,
                "name": "度仙·蓝采和",
                "star": 5,
                "lv": 1,
                "atk": 250,
                "hp": 710,
                "skill_name": "吐气如兰",
                "skill_id": 7,
                "description": "汉钟离要我跟他走，我知道他的意思，但我还是从了。"
            },
            "131": {
                "id": 131,
                "number": 27,
                "name": "农夫·牛郎",
                "star": 1,
                "lv": 1,
                "atk": 43,
                "hp": 125,
                "description": "给地主打工不轻松，不过地主也不容易，省吃俭用才有了这么多地。"
            },
            "132": {
                "id": 132,
                "number": 27,
                "name": "神牛·牛郎",
                "star": 2,
                "lv": 1,
                "atk": 92,
                "hp": 266,
                "description": "大哥，你是神牛早点说嘛，能不能给我变个十万八万花花先！"
            },
            "133": {
                "id": 133,
                "number": 27,
                "name": "更衣室の恋·牛郎",
                "star": 3,
                "lv": 1,
                "atk": 144,
                "hp": 384,
                "skill_name": "织女情",
                "skill_id": 9,
                "description": "死牛给我出的馊主意，要我去偷妹纸的衣服，岛国动作片看多了吧！"
            },
            "134": {
                "id": 134,
                "number": 27,
                "name": "天庭驸马·牛郎",
                "star": 4,
                "lv": 1,
                "atk": 186,
                "hp": 549,
                "skill_name": "织女情",
                "skill_id": 9,
                "description": "我们驸马界一直都是比较低调的，除了出了个叫陈世美的。"
            },
            "135": {
                "id": 135,
                "number": 27,
                "name": "牵牛星·牛郎",
                "star": 5,
                "lv": 1,
                "atk": 255,
                "hp": 719,
                "skill_name": "织女情",
                "skill_id": 9,
                "description": "一年才见一次面，见面的时候还被围观，这让我们夫妻情何以堪啊！"
            },
            "136": {
                "id": 136,
                "number": 28,
                "name": "女红·织女",
                "star": 1,
                "lv": 1,
                "atk": 42,
                "hp": 122,
                "description": "我做的针线是极好的，针脚密色彩新，配上这图案，是最好不过的了。"
            },
            "137": {
                "id": 137,
                "number": 28,
                "name": "天浴·织女",
                "star": 2,
                "lv": 1,
                "atk": 92,
                "hp": 262,
                "description": "我们七姐妹都有个重口味爱好：喜欢去水库里裸泳。"
            },
            "138": {
                "id": 138,
                "number": 28,
                "name": "天伦·织女",
                "star": 3,
                "lv": 1,
                "atk": 132,
                "hp": 382,
                "skill_name": "鹊桥泪",
                "skill_id": 4,
                "description": "突然有一天有了家有了孩子，你会觉得这世界变得不一样了。"
            },
            "139": {
                "id": 139,
                "number": 28,
                "name": "七仙姑·织女",
                "star": 4,
                "lv": 1,
                "atk": 182,
                "hp": 552,
                "skill_name": "鹊桥泪",
                "skill_id": 4,
                "description": "牛郎走的第一天，想他；牛郎走的第二天，想他想他；牛郎走的第三天，想他想他想他。"
            },
            "140": {
                "id": 140,
                "number": 28,
                "name": "七星娘娘·织女",
                "star": 5,
                "lv": 1,
                "atk": 242,
                "hp": 712,
                "skill_name": "鹊桥泪",
                "skill_id": 4,
                "description": "这是个集御姐、人妻、熟女、OL于一身的封号，牛郎肯定会喜欢的。"
            },
            "141": {
                "id": 141,
                "number": 29,
                "name": "决斗·吴刚",
                "star": 1,
                "lv": 1,
                "atk": 33,
                "hp": 123,
                "description": "偷情也就算了，还生了三个娃，让我喜当爹三次！"
            },
            "142": {
                "id": 142,
                "number": 29,
                "name": "刺配·吴刚",
                "star": 2,
                "lv": 1,
                "atk": 83,
                "hp": 263,
                "description": "我被发配到月球，成为当地第一个原住民，比嫦娥都早。"
            },
            "143": {
                "id": 143,
                "number": 29,
                "name": "樵夫·吴刚",
                "star": 3,
                "lv": 1,
                "atk": 133,
                "hp": 383,
                "skill_name": "桂花情",
                "skill_id": 7,
                "description": "无聊的时候我就砍砍桂花树，反正砍得没有长得快。"
            },
            "144": {
                "id": 144,
                "number": 29,
                "name": "逆袭·吴刚",
                "star": 4,
                "lv": 1,
                "atk": 183,
                "hp": 553,
                "skill_name": "桂花情",
                "skill_id": 7,
                "description": "你能理解单身几百年后突然来一个女神和你共处的感受么？"
            },
            "145": {
                "id": 145,
                "number": 29,
                "name": "桂花仙·吴刚",
                "star": 5,
                "lv": 1,
                "atk": 243,
                "hp": 703,
                "skill_name": "桂花情",
                "skill_id": 7,
                "description": "桂花树下桃花仙，桂花仙人种桂花；从此不砍桂花树，抱得嫦娥躲在家。"
            },
            "146": {
                "id": 146,
                "number": 30,
                "name": "天书·鬼谷子",
                "star": 1,
                "lv": 1,
                "atk": 46,
                "hp": 133,
                "description": "不是说好发教材的么？咋发下来的都是白纸？太黑了！"
            },
            "147": {
                "id": 147,
                "number": 30,
                "name": "纵横术·鬼谷子",
                "star": 2,
                "lv": 1,
                "atk": 95,
                "hp": 262,
                "description": "作为靠嘴皮子吃饭的鼻祖，我深知其中的不易啊！"
            },
            "148": {
                "id": 148,
                "number": 30,
                "name": "鬼谷井·鬼谷子",
                "star": 3,
                "lv": 1,
                "atk": 145,
                "hp": 385,
                "skill_name": "鬼脚七",
                "skill_id": 2,
                "description": "我发现一口井，每天晚上播天气预报，然后我就出名了。"
            },
            "149": {
                "id": 149,
                "number": 30,
                "name": "斩草撒豆·鬼谷子",
                "star": 4,
                "lv": 1,
                "atk": 188,
                "hp": 556,
                "skill_name": "鬼脚七",
                "skill_id": 2,
                "description": "只要你有了想象力，草就可以变成马，豆就可以变成兵。"
            },
            "150": {
                "id": 150,
                "number": 30,
                "name": "玄微真人·鬼谷子",
                "star": 5,
                "lv": 1,
                "atk": 244,
                "hp": 721,
                "skill_name": "鬼脚七",
                "skill_id": 2,
                "description": "当了神仙后，玉帝给我分了一套别墅，有产权的哦！"
            },
            "151": {
                "id": 151,
                "number": 31,
                "name": "生老病死·黑无常",
                "star": 1,
                "lv": 1,
                "atk": 50,
                "hp": 131,
                "description": "相比梅花三弄，我更喜欢保安三问：你是谁？你从哪里来？你要去哪里？"
            },
            "152": {
                "id": 152,
                "number": 31,
                "name": "爱别离·黑无常",
                "star": 2,
                "lv": 1,
                "atk": 102,
                "hp": 279,
                "description": "我能想到最浪漫的事，就是和你一起卖卖电脑。"
            },
            "153": {
                "id": 153,
                "number": 31,
                "name": "怨憎会·黑无常",
                "star": 3,
                "lv": 1,
                "atk": 149,
                "hp": 378,
                "skill_name": "招魂蟠",
                "skill_id": 2,
                "description": "别老练少林72绝技了，多看苍老师的片子可以下火去戾气。"
            },
            "154": {
                "id": 154,
                "number": 31,
                "name": "求不得·黑无常",
                "star": 4,
                "lv": 1,
                "atk": 201,
                "hp": 549,
                "skill_name": "招魂蟠",
                "skill_id": 2,
                "description": "巨龙巨龙你差两年，永永远远的差两年。"
            },
            "155": {
                "id": 155,
                "number": 31,
                "name": "五阴盛·黑无常",
                "star": 5,
                "lv": 1,
                "atk": 265,
                "hp": 719,
                "skill_name": "招魂蟠",
                "skill_id": 2,
                "description": "抽刀断水水更流，举杯消愁愁更愁，吃多吃少难吃足。"
            },
            "156": {
                "id": 156,
                "number": 32,
                "name": "地狱道·白无常",
                "star": 1,
                "lv": 1,
                "atk": 53,
                "hp": 126,
                "description": "在这里先八寒再八热，经历冰火九重天！……别想歪了。"
            },
            "157": {
                "id": 157,
                "number": 32,
                "name": "恶鬼道·白无常",
                "star": 2,
                "lv": 1,
                "atk": 105,
                "hp": 277,
                "description": "咱这儿天天饿着不给你吃饭，但就是饿不死，减肥者禁入！"
            },
            "158": {
                "id": 158,
                "number": 32,
                "name": "畜生道·白无常",
                "star": 3,
                "lv": 1,
                "atk": 154,
                "hp": 369,
                "skill_name": "哭丧棒",
                "skill_id": 1,
                "description": "我们这儿都是牛啊马啊狗啊啥的，重口味者禁入！"
            },
            "159": {
                "id": 159,
                "number": 32,
                "name": "阿修罗道·白无常",
                "star": 4,
                "lv": 1,
                "atk": 206,
                "hp": 556,
                "skill_name": "哭丧棒",
                "skill_id": 1,
                "description": "这里打斗比较激烈一些，需要用到皮鞭、绳索、蜡烛等物品。"
            },
            "160": {
                "id": 160,
                "number": 32,
                "name": "人间道·白无常",
                "star": 5,
                "lv": 1,
                "atk": 266,
                "hp": 666,
                "skill_name": "哭丧棒",
                "skill_id": 1,
                "description": "我们终于回归正常了，各位有特殊癖好的也可以再回去。"
            },
            "161": {
                "id": 161,
                "number": 33,
                "name": "科员·日游神",
                "star": 1,
                "lv": 1,
                "atk": 62,
                "hp": 125,
                "description": "我怎么也是个有编制的神，可不是临时工。"
            },
            "162": {
                "id": 162,
                "number": 33,
                "name": "副科长·日游神",
                "star": 2,
                "lv": 1,
                "atk": 112,
                "hp": 244,
                "description": "终于走上领导岗位了，虽然还是要整天出来巡街。"
            },
            "163": {
                "id": 163,
                "number": 33,
                "name": "科长·日游神",
                "star": 3,
                "lv": 1,
                "atk": 159,
                "hp": 374,
                "skill_name": "日炎拳",
                "skill_id": 1,
                "description": "这次能提拔，多亏巨灵神他们给我指了条路。"
            },
            "164": {
                "id": 164,
                "number": 33,
                "name": "副处长·日游神",
                "star": 4,
                "lv": 1,
                "atk": 222,
                "hp": 519,
                "skill_name": "日炎拳",
                "skill_id": 1,
                "description": "众仙们，我们要以高度负责的精神，认真组织和开展好学习实践活动！"
            },
            "165": {
                "id": 165,
                "number": 33,
                "name": "处长·日游神",
                "star": 5,
                "lv": 1,
                "atk": 268,
                "hp": 669,
                "skill_name": "日炎拳",
                "skill_id": 1,
                "description": "再过两年要退居二线了，我儿子的仙籍得抓紧办了。"
            },
            "166": {
                "id": 166,
                "number": 34,
                "name": "士官·夜游神",
                "star": 1,
                "lv": 1,
                "atk": 60,
                "hp": 122,
                "description": "终于吃上公家饭了，偶尔还可以欺负一下新神仙。"
            },
            "167": {
                "id": 167,
                "number": 34,
                "name": "中尉·夜游神",
                "star": 2,
                "lv": 1,
                "atk": 115,
                "hp": 246,
                "skill_id": 1,
                "description": "相比副连这个很娘的称呼，我更喜欢大家叫我captain。"
            },
            "168": {
                "id": 168,
                "number": 34,
                "name": "少校·夜游神",
                "star": 3,
                "lv": 1,
                "atk": 162,
                "hp": 373,
                "skill_name": "流星击",
                "skill_id": 1,
                "description": "其实神仙的夜生活很丰富的，很庆幸我负责夜里的巡逻，你懂的。"
            },
            "169": {
                "id": 169,
                "number": 34,
                "name": "上校·夜游神",
                "star": 4,
                "lv": 1,
                "atk": 223,
                "hp": 515,
                "skill_name": "流星击",
                "skill_id": 1,
                "description": "为啥那个唱歌的神仙升的比我快那么多!"
            },
            "170": {
                "id": 170,
                "number": 34,
                "name": "大校·夜游神",
                "star": 5,
                "lv": 1,
                "atk": 279,
                "hp": 668,
                "skill_name": "流星击",
                "description": "笑什么笑，是大校不是大笑，严肃点！"
            },
            "171": {
                "id": 171,
                "number": 35,
                "name": "瑶草·瑶姬",
                "star": 1,
                "lv": 1,
                "atk": 48,
                "hp": 135,
                "description": "我是一株吃了会让你幸福的草，唯一不幸福的就是我本身。"
            },
            "172": {
                "id": 172,
                "number": 35,
                "name": "神女峰·瑶姬",
                "star": 2,
                "lv": 1,
                "atk": 95,
                "hp": 256,
                "description": "我化作一道险峰，等着真心的你来攀登。"
            },
            "173": {
                "id": 173,
                "number": 35,
                "name": "巫山云雨·瑶姬",
                "star": 3,
                "lv": 1,
                "atk": 145,
                "hp": 380,
                "skill_name": "巫山云雨",
                "skill_id": 8,
                "description": "巫山朝云暮雨的天气很适合野合么？什么大家都跑我这儿来？"
            },
            "174": {
                "id": 174,
                "number": 35,
                "name": "神女赋·瑶姬",
                "star": 4,
                "lv": 1,
                "atk": 201,
                "hp": 535,
                "skill_name": "巫山云雨",
                "skill_id": 8,
                "description": "我鄙视那些YY我的文章，再经典也是对我的伤害。"
            },
            "175": {
                "id": 175,
                "number": 35,
                "name": "巫山神女·瑶姬",
                "star": 5,
                "lv": 1,
                "atk": 275,
                "hp": 730,
                "skill_name": "巫山云雨",
                "skill_id": 8,
                "description": "曾经沧海难为水，除却巫山不是云。"
            },
            "176": {
                "id": 176,
                "number": 36,
                "name": "公主驾到·精卫",
                "star": 1,
                "lv": 1,
                "atk": 45,
                "hp": 136,
                "description": "虽然咱们部落没多少人，但我也算是个公主呀！"
            },
            "177": {
                "id": 177,
                "number": 36,
                "name": "海泳·精卫",
                "star": 2,
                "lv": 1,
                "atk": 106,
                "hp": 258,
                "description": "这么多姐姐在湖里洗个澡就泡到了帅哥，那我必须得去海里啊。"
            },
            "178": {
                "id": 178,
                "number": 36,
                "name": "东海遇·精卫",
                "star": 3,
                "lv": 1,
                "atk": 151,
                "hp": 381,
                "skill_name": "碧波滔天",
                "skill_id": 3,
                "description": "不喜欢就是不喜欢，龙王太子又如何！"
            },
            "179": {
                "id": 179,
                "number": 36,
                "name": "逼婚·精卫",
                "star": 4,
                "lv": 1,
                "atk": 200,
                "hp": 536,
                "skill_name": "碧波滔天",
                "skill_id": 3,
                "description": "再逼我就跳海，死了我也不放过你！"
            },
            "180": {
                "id": 180,
                "number": 36,
                "name": "化鸟·精卫",
                "star": 5,
                "lv": 1,
                "atk": 280,
                "hp": 721,
                "skill_name": "碧波滔天",
                "skill_id": 3,
                "description": "我知道海不可能被填平，我只是想告诉后面的姐妹他是个什么样的男人。"
            },
            "181": {
                "id": 181,
                "number": 37,
                "name": "巨人·夸父",
                "star": 1,
                "lv": 1,
                "atk": 53,
                "hp": 133,
                "description": "不是每一瓶牛奶都可以叫特仑苏，不是每一个巨人都可以成为夸父。"
            },
            "182": {
                "id": 182,
                "number": 37,
                "name": "守护者·夸父",
                "star": 2,
                "lv": 1,
                "atk": 99,
                "hp": 261,
                "description": "我不是你的优乐美，我是你的守护神！"
            },
            "183": {
                "id": 183,
                "number": 37,
                "name": "星降术·夸父",
                "star": 3,
                "lv": 1,
                "atk": 150,
                "hp": 391,
                "skill_name": "大地之怒",
                "skill_id": 5,
                "description": "快使用星将术，哼哼哈嘿，快爆发小宇宙，伊莫拉沙！"
            },
            "184": {
                "id": 184,
                "number": 37,
                "name": "神行·夸父",
                "star": 4,
                "lv": 1,
                "atk": 202,
                "hp": 540,
                "skill_name": "大地之怒",
                "skill_id": 5,
                "description": "田径运动员比赛前都会拜拜我，我是他们这行的祖师爷。"
            },
            "185": {
                "id": 185,
                "number": 37,
                "name": "逐日·夸父",
                "star": 5,
                "lv": 1,
                "atk": 279,
                "hp": 731,
                "skill_name": "大地之怒",
                "skill_id": 5,
                "description": "别问我为什么要追日，除非你不抗日！"
            },
            "186": {
                "id": 186,
                "number": 38,
                "name": "箭客·后羿",
                "star": 1,
                "lv": 1,
                "atk": 44,
                "hp": 141,
                "description": "我喜欢射，我喜欢箭，我是箭客！"
            },
            "187": {
                "id": 187,
                "number": 38,
                "name": "失嫦娥·后羿",
                "star": 2,
                "lv": 1,
                "atk": 93,
                "hp": 261,
                "description": "那天，她要我跟她走，我没答应，她太自信了，以为我一定会跟她走。"
            },
            "188": {
                "id": 188,
                "number": 38,
                "name": "七弦·后羿",
                "star": 3,
                "lv": 1,
                "atk": 144,
                "hp": 388,
                "skill_name": "穿云箭",
                "skill_id": 4,
                "description": "当我第一次见到宓妃时，她在弹一把七弦琴，后来她有一个好听的名字：洛神。"
            },
            "189": {
                "id": 189,
                "number": 38,
                "name": "射日·后羿",
                "star": 4,
                "lv": 1,
                "atk": 205,
                "hp": 541,
                "skill_name": "穿云箭",
                "skill_id": 4,
                "description": "唯有射下那九个太阳，才能压下我内心的怒火。"
            },
            "190": {
                "id": 190,
                "number": 38,
                "name": "宗布神·后羿",
                "star": 5,
                "lv": 1,
                "atk": 277,
                "hp": 729,
                "skill_name": "穿云箭",
                "skill_id": 4,
                "description": "有人在我坟前的桃树下唱歌：我在这儿等着你回来……"
            },
            "191": {
                "id": 191,
                "number": 39,
                "name": "郎才女貌·嫦娥",
                "star": 1,
                "lv": 1,
                "atk": 62,
                "hp": 122,
                "description": "后羿是个神射手，嫁给他我很幸福，你懂的。"
            },
            "192": {
                "id": 192,
                "number": 39,
                "name": "奔月·嫦娥",
                "star": 2,
                "lv": 1,
                "atk": 105,
                "hp": 233,
                "description": "老公出差不在家，我出去happy嗑个药就飞到了月亮上。"
            },
            "193": {
                "id": 193,
                "number": 39,
                "name": "捣药·嫦娥",
                "star": 3,
                "lv": 1,
                "atk": 159,
                "hp": 352,
                "skill_name": "天音玄",
                "skill_id": 10,
                "description": "天杀的王母，跟我演甄嬛传，让我天天在月宫捣药！"
            },
            "194": {
                "id": 194,
                "number": 39,
                "name": "真爱·嫦娥",
                "star": 4,
                "lv": 1,
                "atk": 212,
                "hp": 502,
                "skill_name": "天音玄",
                "skill_id": 10,
                "description": "命运让我离开了后羿，却又给我送来了吴刚，我只能呵呵。"
            },
            "195": {
                "id": 195,
                "number": 39,
                "name": "月光女神·嫦娥",
                "star": 5,
                "lv": 1,
                "atk": 290,
                "hp": 647,
                "skill_name": "天音玄",
                "skill_id": 10,
                "description": "想我的时候，打一盘Luna地图或是看看钱包。"
            },
            "196": {
                "id": 196,
                "number": 40,
                "name": "无名巨人·刑天",
                "star": 1,
                "lv": 1,
                "atk": 61,
                "hp": 120,
                "description": "我的身材和我的名字一样威武。"
            },
            "197": {
                "id": 197,
                "number": 40,
                "name": "文艺青年·刑天",
                "star": 2,
                "lv": 1,
                "atk": 103,
                "hp": 230,
                "description": "业余时间我也写写诗歌，在微博上发发鸡汤文。"
            },
            "198": {
                "id": 198,
                "number": 40,
                "name": "求战·刑天",
                "star": 3,
                "lv": 1,
                "atk": 160,
                "hp": 350,
                "skill_name": "天杀",
                "skill_id": 1,
                "description": "出来混的就是要讲义气嘛，打个架婆婆妈妈的最不爽了。"
            },
            "199": {
                "id": 199,
                "number": 40,
                "name": "永不妥协·刑天",
                "star": 4,
                "lv": 1,
                "atk": 215,
                "hp": 500,
                "skill_name": "天杀",
                "skill_id": 1,
                "description": "虽千万人吾往矣，这才是亮剑精神！"
            },
            "200": {
                "id": 200,
                "number": 40,
                "name": "无首战神·刑天",
                "star": 5,
                "lv": 1,
                "atk": 299,
                "hp": 644,
                "skill_name": "天杀",
                "skill_id": 1,
                "description": "自从没了脑袋，打架灵活多了，也不用护头护脑了。"
            },
            "201": {
                "id": 201,
                "number": 41,
                "name": "拜师·沉香",
                "star": 1,
                "lv": 1,
                "atk": 55,
                "hp": 119,
                "description": "我师父早年跳霹雳舞，成仙后大家都叫他霹雳大仙。"
            },
            "202": {
                "id": 202,
                "number": 41,
                "name": "宣花斧·沉香",
                "star": 2,
                "lv": 1,
                "atk": 109,
                "hp": 234,
                "description": "幸福生活不能光靠手，所以师父给了我把宣花斧。"
            },
            "203": {
                "id": 203,
                "number": 41,
                "name": "战三眼·沉香",
                "star": 3,
                "lv": 1,
                "atk": 162,
                "hp": 355,
                "skill_name": "开山裂地",
                "skill_id": 6,
                "description": "你能救母，我也能救母，我是沉香，我为我自己代言。"
            },
            "204": {
                "id": 204,
                "number": 41,
                "name": "劈山·沉香",
                "star": 4,
                "lv": 1,
                "atk": 221,
                "hp": 498,
                "skill_name": "开山裂地",
                "skill_id": 6,
                "description": "别人走路我爬山，别人劈柴我劈山。"
            },
            "205": {
                "id": 205,
                "number": 41,
                "name": "宝莲灯·沉香",
                "star": 5,
                "lv": 1,
                "atk": 296,
                "hp": 644,
                "skill_name": "开山裂地",
                "skill_id": 6,
                "description": "每次点上这个灯，都会发出悦耳的音乐：等灯等灯。"
            },
            "206": {
                "id": 206,
                "number": 42,
                "name": "修缘·济公",
                "star": 1,
                "lv": 1,
                "atk": 58,
                "hp": 125,
                "description": "呐，不要说我没有提醒你，修行呢，最要紧的是开心！"
            },
            "207": {
                "id": 207,
                "number": 42,
                "name": "颠·济公",
                "star": 2,
                "lv": 1,
                "atk": 106,
                "hp": 235,
                "description": "别人笑我太疯癫，我笑他人看不穿。"
            },
            "208": {
                "id": 208,
                "number": 42,
                "name": "酒肉和尚·济公",
                "star": 3,
                "lv": 1,
                "atk": 155,
                "hp": 355,
                "skill_name": "舍生取义",
                "skill_id": 8,
                "description": "别以为喝酒吃肉就能修成正果，你看鲁智深就知道了。"
            },
            "209": {
                "id": 209,
                "number": 42,
                "name": "降龙罗汉·济公",
                "star": 4,
                "lv": 1,
                "atk": 216,
                "hp": 505,
                "skill_name": "舍生取义",
                "skill_id": 8,
                "description": "左右两边是十八罗汉，降龙伏虎在这一边，至于求子就要拜观音大士。"
            },
            "210": {
                "id": 210,
                "number": 42,
                "name": "降龙尊者·济公",
                "star": 5,
                "lv": 1,
                "atk": 288,
                "hp": 660,
                "skill_name": "舍生取义",
                "skill_id": 8,
                "description": "我想代表天宫向凡间宣扬爱心，让他们明白只要有爱，哪里都是天堂。"
            },
            "211": {
                "id": 211,
                "number": 43,
                "name": "错嫁·宓妃",
                "star": 1,
                "lv": 1,
                "atk": 51,
                "hp": 121,
                "description": "嫁给河伯是我一生最大的错。"
            },
            "212": {
                "id": 212,
                "number": 43,
                "name": "洛书·宓妃",
                "star": 2,
                "lv": 1,
                "atk": 101,
                "hp": 251,
                "description": "我献出洛书，只是想离开这个人。"
            },
            "213": {
                "id": 213,
                "number": 43,
                "name": "真爱·宓妃",
                "star": 3,
                "lv": 1,
                "atk": 151,
                "hp": 371,
                "skill_name": "水乳之欢",
                "skill_id": 2,
                "description": "第一次见到他的时候，我就记住了他的名字：后羿。"
            },
            "214": {
                "id": 214,
                "number": 43,
                "name": "洛水三千·宓妃",
                "star": 4,
                "lv": 1,
                "atk": 201,
                "hp": 521,
                "skill_name": "水乳之欢",
                "skill_id": 2,
                "description": "既然无法陪伴左右，不如化为这护城的洛水守护你。"
            },
            "215": {
                "id": 215,
                "number": 43,
                "name": "洛神·宓妃",
                "star": 5,
                "lv": 1,
                "atk": 271,
                "hp": 671,
                "skill_name": "水乳之欢",
                "skill_id": 2,
                "description": "仿佛兮若轻云之蔽月，飘飘兮若流风之回雪。"
            },
            "216": {
                "id": 216,
                "number": 44,
                "name": "长生之道·张道陵",
                "star": 1,
                "lv": 1,
                "atk": 49,
                "hp": 126,
                "description": "大叔说我骨骼惊奇，是练丹的奇才，才卖我一本《九鼎炼丹秘方》。"
            },
            "217": {
                "id": 217,
                "number": 44,
                "name": "神医·张道陵",
                "star": 2,
                "lv": 1,
                "atk": 106,
                "hp": 248,
                "description": "不听话就会生病，生病就要找我，找我就要听话，这个逻辑你懂的吧？"
            },
            "218": {
                "id": 218,
                "number": 44,
                "name": "授术·张道陵",
                "star": 3,
                "lv": 1,
                "atk": 158,
                "hp": 374,
                "skill_name": "无米之炊",
                "skill_id": 1,
                "description": "考验徒弟说到底就是洗脑，能洗的就教，不能洗的咱就说考验没通过。"
            },
            "219": {
                "id": 219,
                "number": 44,
                "name": "五斗米·张道陵",
                "star": 4,
                "lv": 1,
                "atk": 203,
                "hp": 531,
                "skill_name": "无米之炊",
                "skill_id": 1,
                "description": "想入会？交五斗米。慢着，这是报名费，交学费后面排队去。"
            },
            "220": {
                "id": 220,
                "number": 44,
                "name": "天师·张道陵",
                "star": 5,
                "lv": 1,
                "atk": 274,
                "hp": 678,
                "skill_name": "无米之炊",
                "skill_id": 1,
                "description": "我是五斗米教扛把子，你知道什么叫不准勾引二嫂么？"
            },
            "221": {
                "id": 221,
                "number": 45,
                "name": "日高一平·修罗王",
                "star": 1,
                "lv": 1,
                "atk": 48,
                "hp": 123,
                "description": "师父曾经说过，如果把我和阿凯加起来，再除二就是十全十美了。"
            },
            "222": {
                "id": 222,
                "number": 45,
                "name": "变身·修罗王",
                "star": 2,
                "lv": 1,
                "atk": 99,
                "hp": 256,
                "description": "我肚子一饿就会失去战意，连脱战甲的时间都等不了。"
            },
            "223": {
                "id": 223,
                "number": 45,
                "name": "魔破拳·修罗王",
                "star": 3,
                "lv": 1,
                "atk": 153,
                "hp": 374,
                "skill_name": "五世修罗",
                "skill_id": 6,
                "description": "这拳打出来之前，得先做一次全身运动，比较费时间。"
            },
            "224": {
                "id": 224,
                "number": 45,
                "name": "梵天战甲·修罗王",
                "star": 4,
                "lv": 1,
                "atk": 203,
                "hp": 531,
                "skill_name": "五世修罗",
                "skill_id": 6,
                "description": "这战甲酷毙了！就是穿着太占地方，容易卡门，脱了也不能缩小存放。"
            },
            "225": {
                "id": 225,
                "number": 45,
                "name": "创造神·修罗王",
                "star": 5,
                "lv": 1,
                "atk": 274,
                "hp": 675,
                "skill_name": "五世修罗",
                "skill_id": 6,
                "description": "有创造神就会有破坏神，还会有调和神，我们都只是棋子。"
            },
            "226": {
                "id": 226,
                "number": 46,
                "name": "力伽·迦楼罗王",
                "star": 1,
                "lv": 1,
                "atk": 45,
                "hp": 115,
                "description": "我是迦楼罗王力迦，天空界最帅的男人，没有之一。"
            },
            "227": {
                "id": 227,
                "number": 46,
                "name": "凤凰·迦楼罗王",
                "star": 2,
                "lv": 1,
                "atk": 106,
                "hp": 256,
                "description": "凤凰会涅槃，我没有那么容易死。"
            },
            "228": {
                "id": 228,
                "number": 46,
                "name": "羽吹雪·迦楼罗王",
                "star": 3,
                "lv": 1,
                "atk": 155,
                "hp": 379,
                "skill_name": "罗汉印",
                "skill_id": 1,
                "description": "我吹的是血，不是雪。"
            },
            "229": {
                "id": 229,
                "number": 46,
                "name": "火翼阵·迦楼罗王",
                "star": 4,
                "lv": 1,
                "atk": 208,
                "hp": 530,
                "skill_name": "罗汉印",
                "skill_id": 1,
                "description": "就像飞蛾扑火，明知不可能，还是要义无反顾的燃烧自己。"
            },
            "230": {
                "id": 230,
                "number": 46,
                "name": "众鸟之王·迦楼罗王",
                "star": 5,
                "lv": 1,
                "atk": 280,
                "hp": 689,
                "skill_name": "罗汉印",
                "skill_id": 1,
                "description": "每个人都有一个大鸟梦，而我的是众鸟之王。"
            },
            "231": {
                "id": 231,
                "number": 47,
                "name": "莲伽·紧那罗王",
                "star": 1,
                "lv": 1,
                "atk": 55,
                "hp": 116,
                "description": "谁说女孩不能做神将，我就是神将中的神将——八部众！"
            },
            "232": {
                "id": 232,
                "number": 47,
                "name": "爱与恨·紧那罗王",
                "star": 2,
                "lv": 1,
                "atk": 106,
                "hp": 254,
                "description": "我无法说服自己爱上一个浪子，对不起，马里千。"
            },
            "233": {
                "id": 233,
                "number": 47,
                "name": "天王情·紧那罗王",
                "star": 3,
                "lv": 1,
                "atk": 147,
                "hp": 376,
                "skill_name": "八部众",
                "skill_id": 1,
                "description": "如果非要做一个选择，就让我死在乔伽的手下吧。"
            },
            "234": {
                "id": 234,
                "number": 47,
                "name": "宿命·紧那罗王",
                "star": 4,
                "lv": 1,
                "atk": 206,
                "hp": 523,
                "skill_name": "八部众",
                "skill_id": 1,
                "description": "屈服黑暗是他的宿命，执迷不悟是我的宿命。"
            },
            "235": {
                "id": 235,
                "number": 47,
                "name": "无双环·紧那罗王",
                "star": 5,
                "lv": 1,
                "atk": 265,
                "hp": 670,
                "skill_name": "八部众",
                "skill_id": 1,
                "description": "既然无法在一起，那就把我的武器叫做无双环吧。"
            },
            "236": {
                "id": 236,
                "number": 48,
                "name": "三眼·杨戬",
                "star": 1,
                "lv": 1,
                "atk": 44,
                "hp": 133,
                "description": "他们笑我三只眼，是嫉妒我比他们看的更清楚，可这也是我的烦恼。"
            },
            "237": {
                "id": 237,
                "number": 48,
                "name": "啸天·杨戬",
                "star": 2,
                "lv": 1,
                "atk": 89,
                "hp": 285,
                "description": "当所有的人，离开我的时候，你劝我要安静从容。谢谢你，哮天犬。"
            },
            "238": {
                "id": 238,
                "number": 48,
                "name": "仙·杨戬",
                "star": 3,
                "lv": 1,
                "atk": 138,
                "hp": 402,
                "skill_name": "三只眼",
                "skill_id": 4,
                "description": "在小庙里当神仙没什么不好，大庙里的神仙很大，心眼却很小。"
            },
            "239": {
                "id": 239,
                "number": 48,
                "name": "神·杨戬",
                "star": 4,
                "lv": 1,
                "atk": 180,
                "hp": 555,
                "skill_name": "三只眼",
                "skill_id": 4,
                "description": "英雄惜英雄只是电影里的桥段，你挑衅我的狗我就跟你拼命！"
            },
            "240": {
                "id": 240,
                "number": 48,
                "name": "二郎神·杨戬",
                "star": 5,
                "lv": 1,
                "atk": 250,
                "hp": 718,
                "skill_name": "三只眼",
                "skill_id": 4,
                "description": "很多年之后，我有个绰号叫“二郎神”，其实我不二。"
            },
            "241": {
                "id": 241,
                "number": 49,
                "name": "异人·哪吒",
                "star": 1,
                "lv": 1,
                "atk": 46,
                "hp": 140,
                "description": "他们说我爹不喜欢我，是因为我不姓李，可名字是谁起的呢？"
            },
            "242": {
                "id": 242,
                "number": 49,
                "name": "小仙·哪吒",
                "star": 2,
                "lv": 1,
                "atk": 92,
                "hp": 290,
                "description": "我知道我的兵器看起来有点娘，你如果不服，可以来试试。"
            },
            "243": {
                "id": 243,
                "number": 49,
                "name": "神臂·哪吒",
                "star": 3,
                "lv": 1,
                "atk": 141,
                "hp": 410,
                "skill_name": "龙骨枪",
                "skill_id": 1,
                "description": "我家有一把乾坤弓，拿来咱们一起去打麻雀吧！"
            },
            "244": {
                "id": 244,
                "number": 49,
                "name": "擒龙·哪吒",
                "star": 4,
                "lv": 1,
                "atk": 192,
                "hp": 560,
                "skill_name": "龙骨枪",
                "skill_id": 1,
                "description": "公海里的海鲜是不是谁都可以捕捞？我想捉条龙。"
            },
            "245": {
                "id": 245,
                "number": 49,
                "name": "不死·哪吒",
                "star": 5,
                "lv": 1,
                "atk": 262,
                "hp": 720,
                "skill_name": "龙骨枪",
                "skill_id": 1,
                "description": "那年开始，我忘记了很多事情，师父说，那就好。"
            },
            "246": {
                "id": 246,
                "number": 50,
                "name": "灯芯·紫霞",
                "star": 1,
                "lv": 1,
                "atk": 55,
                "hp": 136,
                "description": "我本是日月神灯的灯芯，负责白天点亮，觉得有点浪费，就跑出来了。"
            },
            "247": {
                "id": 247,
                "number": 50,
                "name": "盘丝大仙·紫霞",
                "star": 2,
                "lv": 1,
                "atk": 91,
                "hp": 290,
                "description": "要不是一时性起，我才不会起这么个像蜘蛛精一样的名字呢。"
            },
            "248": {
                "id": 248,
                "number": 50,
                "name": "紫青宝剑·紫霞",
                "star": 3,
                "lv": 1,
                "atk": 141,
                "hp": 410,
                "skill_name": "月光宝盒",
                "skill_id": 10,
                "description": "拔出宝剑就能娶我，你还不明白我那颗恨嫁的心么？"
            },
            "249": {
                "id": 249,
                "number": 50,
                "name": "月光宝盒·紫霞",
                "star": 4,
                "lv": 1,
                "atk": 185,
                "hp": 556,
                "skill_name": "月光宝盒",
                "skill_id": 10,
                "description": "回到过去我可以当什么都没发生，虽然不能拥有，但我可以不去忘记。"
            },
            "250": {
                "id": 250,
                "number": 50,
                "name": "七色云彩·紫霞",
                "star": 5,
                "lv": 1,
                "atk": 255,
                "hp": 725,
                "skill_name": "月光宝盒",
                "skill_id": 10,
                "description": "意中人你驾着七色云彩慢慢飞，小心前面带刺的玫瑰。"
            },
            "10000": {
                "id": 10000,
                "number": 10000,
                "name": "恶·鬼谷子",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 1,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10001": {
                "id": 10001,
                "number": 10001,
                "name": "恶·黑无常",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 2,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10002": {
                "id": 10002,
                "number": 10002,
                "name": "恶·白无常",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 3,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10003": {
                "id": 10003,
                "number": 10003,
                "name": "恶·日游神",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 4,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10004": {
                "id": 10004,
                "number": 10004,
                "name": "恶·夜游神",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 5,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10005": {
                "id": 10005,
                "number": 10005,
                "name": "恶·宓妃",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 6,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10006": {
                "id": 10006,
                "number": 10006,
                "name": "恶·张道陵",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 1,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10007": {
                "id": 10007,
                "number": 10007,
                "name": "恶·修罗王",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 2,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10008": {
                "id": 10008,
                "number": 10008,
                "name": "恶·迦楼罗王",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 3,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10009": {
                "id": 10009,
                "number": 10009,
                "name": "恶·紧那罗王",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 4,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10010": {
                "id": 10010,
                "number": 10010,
                "name": "恶·紫霞",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 5,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10011": {
                "id": 10011,
                "number": 10011,
                "name": "恶·金蝉子",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 6,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10012": {
                "id": 10012,
                "number": 10012,
                "name": "恶·铁扇公主",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 1,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10013": {
                "id": 10013,
                "number": 10013,
                "name": "恶·沙僧",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 2,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10014": {
                "id": 10014,
                "number": 10014,
                "name": "恶·牛魔王",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 3,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10015": {
                "id": 10015,
                "number": 10015,
                "name": "恶·巨灵神",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 4,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10016": {
                "id": 10016,
                "number": 10016,
                "name": "恶·红孩儿",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 5,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10017": {
                "id": 10017,
                "number": 10017,
                "name": "恶·黄飞虎",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 6,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10018": {
                "id": 10018,
                "number": 10018,
                "name": "恶·孙悟空",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 1,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10019": {
                "id": 10019,
                "number": 10019,
                "name": "恶·猪八戒",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 2,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10020": {
                "id": 10020,
                "number": 10020,
                "name": "恶·杨戬",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 3,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10021": {
                "id": 10021,
                "number": 10021,
                "name": "恶·哪吒",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 4,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10022": {
                "id": 10022,
                "number": 10022,
                "name": "恶·赵公明",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 5,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10023": {
                "id": 10023,
                "number": 10023,
                "name": "恶·申公豹",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 6,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10024": {
                "id": 10024,
                "number": 10024,
                "name": "恶·土行孙",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 1,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10025": {
                "id": 10025,
                "number": 10025,
                "name": "恶·法海",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 2,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10026": {
                "id": 10026,
                "number": 10026,
                "name": "恶·雷震子",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 3,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10027": {
                "id": 10027,
                "number": 10027,
                "name": "恶·妲己",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 4,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10028": {
                "id": 10028,
                "number": 10028,
                "name": "恶·姜子牙",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 5,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10029": {
                "id": 10029,
                "number": 10029,
                "name": "恶·李靖",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 6,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10030": {
                "id": 10030,
                "number": 10030,
                "name": "恶·白素贞",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 1,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10031": {
                "id": 10031,
                "number": 10031,
                "name": "恶·小青",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 2,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10032": {
                "id": 10032,
                "number": 10032,
                "name": "恶·何仙姑",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 3,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10033": {
                "id": 10033,
                "number": 10033,
                "name": "恶·吕洞宾",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 4,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10034": {
                "id": 10034,
                "number": 10034,
                "name": "恶·铁拐李",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 5,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10035": {
                "id": 10035,
                "number": 10035,
                "name": "恶·汉钟离",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 6,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10036": {
                "id": 10036,
                "number": 10036,
                "name": "恶·张果老",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 1,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10037": {
                "id": 10037,
                "number": 10037,
                "name": "恶·蓝采和",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 2,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10038": {
                "id": 10038,
                "number": 10038,
                "name": "恶·韩湘子",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 3,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10039": {
                "id": 10039,
                "number": 10039,
                "name": "恶·牛郎",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 4,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10040": {
                "id": 10040,
                "number": 10040,
                "name": "恶·织女",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 5,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10041": {
                "id": 10041,
                "number": 10041,
                "name": "恶·吴刚",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 6,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10042": {
                "id": 10042,
                "number": 10042,
                "name": "恶·刑天",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 1,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10043": {
                "id": 10043,
                "number": 10043,
                "name": "恶·沉香",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 2,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10044": {
                "id": 10044,
                "number": 10044,
                "name": "恶·济公",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 3,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10045": {
                "id": 10045,
                "number": 10045,
                "name": "恶·瑶姬",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 4,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10046": {
                "id": 10046,
                "number": 10046,
                "name": "恶·精卫",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 5,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10047": {
                "id": 10047,
                "number": 10047,
                "name": "恶·后羿",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 6,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10048": {
                "id": 10048,
                "number": 10048,
                "name": "恶·嫦娥",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 1,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10049": {
                "id": 10049,
                "number": 10049,
                "name": "恶·夸父",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 2,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "10050": {
                "id": 10050,
                "number": 10050,
                "name": "恶·后羿",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 2,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20000": {
                "id": 20000,
                "number": 20000,
                "name": "战·牛魔王",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 5,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20001": {
                "id": 20001,
                "number": 20001,
                "name": "战·哪吒",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 6,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20002": {
                "id": 20002,
                "number": 20002,
                "name": "战·后羿",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 1,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20003": {
                "id": 20003,
                "number": 20003,
                "name": "战·孙悟空",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 2,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20004": {
                "id": 20004,
                "number": 20004,
                "name": "战·巨灵神",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 3,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20005": {
                "id": 20005,
                "number": 20005,
                "name": "战·铁扇公主",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 4,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20006": {
                "id": 20006,
                "number": 20006,
                "name": "战·红孩儿",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 5,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20007": {
                "id": 20007,
                "number": 20007,
                "name": "战·济公",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 6,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20008": {
                "id": 20008,
                "number": 20008,
                "name": "战·黄飞虎",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 1,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20009": {
                "id": 20009,
                "number": 20009,
                "name": "战·刑天",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 2,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20010": {
                "id": 20010,
                "number": 20010,
                "name": "战·妲己",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 3,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20011": {
                "id": 20011,
                "number": 20011,
                "name": "战·申公豹",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 4,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20012": {
                "id": 20012,
                "number": 20012,
                "name": "战·法海",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 5,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20013": {
                "id": 20013,
                "number": 20013,
                "name": "战·何仙姑",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 6,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20014": {
                "id": 20014,
                "number": 20014,
                "name": "战·土行孙",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 1,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20015": {
                "id": 20015,
                "number": 20015,
                "name": "战·白素贞",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 2,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20016": {
                "id": 20016,
                "number": 20016,
                "name": "战·修罗王",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 3,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20017": {
                "id": 20017,
                "number": 20017,
                "name": "战·吕洞宾",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 4,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20018": {
                "id": 20018,
                "number": 20018,
                "name": "战·鬼谷子",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 5,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20019": {
                "id": 20019,
                "number": 20019,
                "name": "战·日游神",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 6,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "20020": {
                "id": 20020,
                "number": 20020,
                "name": "战·夸父",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 6,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            },
            "30000": {
                "id": 30000,
                "number": 30000,
                "name": "经验元灵",
                "star": 1,
                "lv": 1,
                "atk": 5,
                "hp": 10,
                "url": 1,
                "description": "怪物卡牌，不可进阶。主要作为卡牌升级所用的经验素材卡。"
            }
        }
    },
    "pass_reward": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "exp": 1.5,
                "money": 20,
                "skill_point": 10
            },
            "2": {
                "id": 2,
                "exp": 1.575,
                "money": 30,
                "skill_point": 15
            },
            "3": {
                "id": 3,
                "exp": 1.7325,
                "money": 40,
                "skill_point": 20
            },
            "4": {
                "id": 4,
                "exp": 1.90575,
                "money": 50,
                "skill_point": 25
            },
            "5": {
                "id": 5,
                "exp": 2.096325,
                "money": 60,
                "skill_point": 30
            },
            "6": {
                "id": 6,
                "exp": 2.3059575,
                "money": 70,
                "skill_point": 35
            },
            "7": {
                "id": 7,
                "exp": 2.53655325,
                "money": 80,
                "skill_point": 40
            },
            "8": {
                "id": 8,
                "exp": 2.790208575,
                "money": 90,
                "skill_point": 45
            },
            "9": {
                "id": 9,
                "exp": 3.0692294325,
                "money": 100,
                "skill_point": 50
            },
            "10": {
                "id": 10,
                "exp": 3.37615237575,
                "money": 110,
                "skill_point": 55
            },
            "11": {
                "id": 11,
                "exp": 3.713767613325,
                "money": 120,
                "skill_point": 60
            },
            "12": {
                "id": 12,
                "exp": 4.0851443746575,
                "money": 130,
                "skill_point": 65
            },
            "13": {
                "id": 13,
                "exp": 4.49365881212325,
                "money": 140,
                "skill_point": 70
            },
            "14": {
                "id": 14,
                "exp": 4.94302469333558,
                "money": 150,
                "skill_point": 75
            },
            "15": {
                "id": 15,
                "exp": 5.43732716266914,
                "money": 160,
                "skill_point": 80
            },
            "16": {
                "id": 16,
                "exp": 5.98105987893605,
                "money": 170,
                "skill_point": 85
            },
            "17": {
                "id": 17,
                "exp": 6.57916586682966,
                "money": 180,
                "skill_point": 90
            },
            "18": {
                "id": 18,
                "exp": 7.23708245351263,
                "money": 190,
                "skill_point": 95
            },
            "19": {
                "id": 19,
                "exp": 7.96079069886389,
                "money": 200,
                "skill_point": 100
            },
            "20": {
                "id": 20,
                "exp": 8.75686976875028,
                "money": 210,
                "skill_point": 105
            },
            "21": {
                "id": 21,
                "exp": 9.63255674562531,
                "money": 220,
                "skill_point": 110
            },
            "22": {
                "id": 22,
                "exp": 10.5958124201878,
                "money": 230,
                "skill_point": 115
            },
            "23": {
                "id": 23,
                "exp": 11.6553936622066,
                "money": 240,
                "skill_point": 120
            },
            "24": {
                "id": 24,
                "exp": 12.8209330284273,
                "money": 250,
                "skill_point": 125
            },
            "25": {
                "id": 25,
                "exp": 14.10302633127,
                "money": 260,
                "skill_point": 130
            },
            "26": {
                "id": 26,
                "exp": 15.513328964397,
                "money": 270,
                "skill_point": 135
            },
            "27": {
                "id": 27,
                "exp": 17.0646618608367,
                "money": 280,
                "skill_point": 140
            },
            "28": {
                "id": 28,
                "exp": 18.7711280469204,
                "money": 290,
                "skill_point": 145
            },
            "29": {
                "id": 29,
                "exp": 20.6482408516124,
                "money": 300,
                "skill_point": 150
            },
            "30": {
                "id": 30,
                "exp": 22.7130649367737,
                "money": 310,
                "skill_point": 155
            },
            "31": {
                "id": 31,
                "exp": 24.984371430451,
                "money": 320,
                "skill_point": 160
            },
            "32": {
                "id": 32,
                "exp": 27.4828085734962,
                "money": 330,
                "skill_point": 165
            },
            "33": {
                "id": 33,
                "exp": 30.2310894308458,
                "money": 340,
                "skill_point": 170
            },
            "34": {
                "id": 34,
                "exp": 33.2541983739304,
                "money": 350,
                "skill_point": 175
            },
            "35": {
                "id": 35,
                "exp": 36.5796182113234,
                "money": 360,
                "skill_point": 180
            },
            "36": {
                "id": 36,
                "exp": 40.2375800324557,
                "money": 370,
                "skill_point": 185
            },
            "37": {
                "id": 37,
                "exp": 44.2613380357013,
                "money": 380,
                "skill_point": 190
            },
            "38": {
                "id": 38,
                "exp": 48.6874718392714,
                "money": 390,
                "skill_point": 195
            },
            "39": {
                "id": 39,
                "exp": 53.5562190231986,
                "money": 400,
                "skill_point": 200
            },
            "40": {
                "id": 40,
                "exp": 58.9118409255184,
                "money": 410,
                "skill_point": 205
            },
            "41": {
                "id": 41,
                "exp": 64.8030250180703,
                "money": 420,
                "skill_point": 210
            },
            "42": {
                "id": 42,
                "exp": 71.2833275198773,
                "money": 430,
                "skill_point": 215
            },
            "43": {
                "id": 43,
                "exp": 78.4116602718651,
                "money": 440,
                "skill_point": 220
            },
            "44": {
                "id": 44,
                "exp": 86.2528262990516,
                "money": 450,
                "skill_point": 225
            },
            "45": {
                "id": 45,
                "exp": 94.8781089289567,
                "money": 460,
                "skill_point": 230
            },
            "46": {
                "id": 46,
                "exp": 104.365919821852,
                "money": 470,
                "skill_point": 235
            },
            "47": {
                "id": 47,
                "exp": 114.802511804038,
                "money": 480,
                "skill_point": 240
            },
            "48": {
                "id": 48,
                "exp": 126.282762984441,
                "money": 490,
                "skill_point": 245
            },
            "49": {
                "id": 49,
                "exp": 138.911039282886,
                "money": 500,
                "skill_point": 250
            },
            "50": {
                "id": 50,
                "exp": 152.802143211174,
                "money": 510,
                "skill_point": 255
            },
            "51": {
                "id": 51,
                "exp": 168.082357532292,
                "money": 520,
                "skill_point": 260
            },
            "52": {
                "id": 52,
                "exp": 184.890593285521,
                "money": 530,
                "skill_point": 265
            },
            "53": {
                "id": 53,
                "exp": 203.379652614073,
                "money": 540,
                "skill_point": 270
            },
            "54": {
                "id": 54,
                "exp": 223.71761787548,
                "money": 550,
                "skill_point": 275
            },
            "55": {
                "id": 55,
                "exp": 246.089379663028,
                "money": 560,
                "skill_point": 280
            },
            "56": {
                "id": 56,
                "exp": 270.698317629331,
                "money": 570,
                "skill_point": 285
            },
            "57": {
                "id": 57,
                "exp": 297.768149392264,
                "money": 580,
                "skill_point": 290
            },
            "58": {
                "id": 58,
                "exp": 327.544964331491,
                "money": 590,
                "skill_point": 295
            },
            "59": {
                "id": 59,
                "exp": 360.29946076464,
                "money": 600,
                "skill_point": 300
            },
            "60": {
                "id": 60,
                "exp": 396.329406841104,
                "money": 610,
                "skill_point": 305
            },
            "61": {
                "id": 61,
                "exp": 435.962347525214,
                "money": 620,
                "skill_point": 310
            },
            "62": {
                "id": 62,
                "exp": 479.558582277736,
                "money": 630,
                "skill_point": 315
            },
            "63": {
                "id": 63,
                "exp": 527.514440505509,
                "money": 640,
                "skill_point": 320
            },
            "64": {
                "id": 64,
                "exp": 580.265884556061,
                "money": 650,
                "skill_point": 325
            },
            "65": {
                "id": 65,
                "exp": 638.292473011667,
                "money": 660,
                "skill_point": 330
            },
            "66": {
                "id": 66,
                "exp": 702.121720312833,
                "money": 670,
                "skill_point": 335
            },
            "67": {
                "id": 67,
                "exp": 772.333892344116,
                "money": 680,
                "skill_point": 340
            },
            "68": {
                "id": 68,
                "exp": 849.567281578528,
                "money": 690,
                "skill_point": 345
            },
            "69": {
                "id": 69,
                "exp": 934.524009736381,
                "money": 700,
                "skill_point": 350
            },
            "70": {
                "id": 70,
                "exp": 1027.97641071002,
                "money": 710,
                "skill_point": 355
            },
            "71": {
                "id": 71,
                "exp": 1130.77405178102,
                "money": 720,
                "skill_point": 360
            },
            "72": {
                "id": 72,
                "exp": 1243.85145695912,
                "money": 730,
                "skill_point": 365
            },
            "73": {
                "id": 73,
                "exp": 1368.23660265504,
                "money": 740,
                "skill_point": 370
            },
            "74": {
                "id": 74,
                "exp": 1505.06026292054,
                "money": 750,
                "skill_point": 375
            },
            "75": {
                "id": 75,
                "exp": 1655.56628921259,
                "money": 760,
                "skill_point": 380
            },
            "76": {
                "id": 76,
                "exp": 1821.12291813385,
                "money": 770,
                "skill_point": 385
            },
            "77": {
                "id": 77,
                "exp": 2003.23520994724,
                "money": 780,
                "skill_point": 390
            },
            "78": {
                "id": 78,
                "exp": 2203.55873094196,
                "money": 790,
                "skill_point": 395
            },
            "79": {
                "id": 79,
                "exp": 2423.91460403616,
                "money": 800,
                "skill_point": 400
            },
            "80": {
                "id": 80,
                "exp": 2666.30606443977,
                "money": 810,
                "skill_point": 405
            },
            "81": {
                "id": 81,
                "exp": 2932.93667088375,
                "money": 820,
                "skill_point": 410
            },
            "82": {
                "id": 82,
                "exp": 3226.23033797213,
                "money": 830,
                "skill_point": 415
            },
            "83": {
                "id": 83,
                "exp": 3548.85337176934,
                "money": 840,
                "skill_point": 420
            },
            "84": {
                "id": 84,
                "exp": 3903.73870894628,
                "money": 850,
                "skill_point": 425
            },
            "85": {
                "id": 85,
                "exp": 4294.1125798409,
                "money": 860,
                "skill_point": 430
            },
            "86": {
                "id": 86,
                "exp": 4723.52383782499,
                "money": 870,
                "skill_point": 435
            },
            "87": {
                "id": 87,
                "exp": 5195.8762216075,
                "money": 880,
                "skill_point": 440
            },
            "88": {
                "id": 88,
                "exp": 5715.46384376824,
                "money": 890,
                "skill_point": 445
            },
            "89": {
                "id": 89,
                "exp": 6287.01022814507,
                "money": 900,
                "skill_point": 450
            },
            "90": {
                "id": 90,
                "exp": 6915.71125095958,
                "money": 910,
                "skill_point": 455
            },
            "91": {
                "id": 91,
                "exp": 7607.28237605553,
                "money": 920,
                "skill_point": 460
            },
            "92": {
                "id": 92,
                "exp": 8368.01061366108,
                "money": 930,
                "skill_point": 465
            },
            "93": {
                "id": 93,
                "exp": 9204.81167502719,
                "money": 940,
                "skill_point": 470
            },
            "94": {
                "id": 94,
                "exp": 10125.2928425299,
                "money": 950,
                "skill_point": 475
            },
            "95": {
                "id": 95,
                "exp": 11137.8221267829,
                "money": 960,
                "skill_point": 480
            },
            "96": {
                "id": 96,
                "exp": 12251.6043394612,
                "money": 970,
                "skill_point": 485
            },
            "97": {
                "id": 97,
                "exp": 13476.7647734073,
                "money": 980,
                "skill_point": 490
            },
            "98": {
                "id": 98,
                "exp": 14824.4412507481,
                "money": 990,
                "skill_point": 495
            },
            "99": {
                "id": 99,
                "exp": 16306.8853758229,
                "money": 1000,
                "skill_point": 500
            },
            "100": {
                "id": 100,
                "exp": 17937.5739134051,
                "money": 1010,
                "skill_point": 505
            }
        }
    },
    "pass_config": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "layer": 1,
                "card_count": 3,
                "cards": "20000#20000#20000",
                "formation": "1:20000,2:20000,3:20000"
            },
            "2": {
                "id": 2,
                "layer": 2,
                "card_count": 3,
                "cards": "20000#20000#20000",
                "formation": "1:20000,2:20000,3:20000"
            },
            "3": {
                "id": 3,
                "layer": 3,
                "card_count": 3,
                "cards": "20000#20000#20000",
                "formation": "1:20000,2:20000,3:20000"
            },
            "4": {
                "id": 4,
                "layer": 4,
                "card_count": 3,
                "cards": "20000#20000#20000",
                "formation": "1:20000,2:20000,3:20000"
            },
            "5": {
                "id": 5,
                "layer": 5,
                "card_count": 3,
                "cards": "20000#20000#20001",
                "formation": "1:20000,2:20000,3:20001",
                "boss_id": 20001,
                "trigger_rate": 50,
                "boss_attr": 180,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "6": {
                "id": 6,
                "layer": 6,
                "card_count": 4,
                "cards": "20001#20001#20001#20001",
                "formation": "1:20001,2:20001,3:20001,4:20001"
            },
            "7": {
                "id": 7,
                "layer": 7,
                "card_count": 4,
                "cards": "20001#20001#20001#20001",
                "formation": "1:20001,2:20001,3:20001,4:20001"
            },
            "8": {
                "id": 8,
                "layer": 8,
                "card_count": 4,
                "cards": "20001#20001#20001#20001",
                "formation": "1:20001,2:20001,3:20001,4:20001"
            },
            "9": {
                "id": 9,
                "layer": 9,
                "card_count": 4,
                "cards": "20001#20001#20001#20001",
                "formation": "1:20001,2:20001,3:20001,4:20001"
            },
            "10": {
                "id": 10,
                "layer": 10,
                "card_count": 4,
                "cards": "20001#20001#20001#20002",
                "formation": "1:20001,2:20001,3:20001,4:20002",
                "boss_id": 20002,
                "trigger_rate": 50,
                "boss_attr": 70,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "11": {
                "id": 11,
                "layer": 11,
                "card_count": 5,
                "cards": "20002#20002#20002#20002#20002",
                "formation": "1:20002,2:20002,3:20002,4:20002,5:20002"
            },
            "12": {
                "id": 12,
                "layer": 12,
                "card_count": 5,
                "cards": "20002#20002#20002#20002#20002",
                "formation": "1:20002,2:20002,3:20002,4:20002,5:20002"
            },
            "13": {
                "id": 13,
                "layer": 13,
                "card_count": 5,
                "cards": "20002#20002#20002#20002#20002",
                "formation": "1:20002,2:20002,3:20002,4:20002,5:20002"
            },
            "14": {
                "id": 14,
                "layer": 14,
                "card_count": 5,
                "cards": "20002#20002#20002#20002#20002",
                "formation": "1:20002,2:20002,3:20002,4:20002,5:20002"
            },
            "15": {
                "id": 15,
                "layer": 15,
                "card_count": 5,
                "cards": "20002#20002#20002#20002#20003",
                "formation": "1:20002,2:20002,3:20002,4:20002,5:20003",
                "boss_id": 20003,
                "trigger_rate": 50,
                "boss_attr": 70,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "16": {
                "id": 16,
                "layer": 16,
                "card_count": 5,
                "cards": "20003#20003#20003#20003#20003",
                "formation": "1:20003,2:20003,3:20003,4:20003,5:20003"
            },
            "17": {
                "id": 17,
                "layer": 17,
                "card_count": 5,
                "cards": "20003#20003#20003#20003#20003",
                "formation": "1:20003,2:20003,3:20003,4:20003,5:20003"
            },
            "18": {
                "id": 18,
                "layer": 18,
                "card_count": 5,
                "cards": "20003#20003#20003#20003#20003",
                "formation": "1:20003,2:20003,3:20003,4:20003,5:20003"
            },
            "19": {
                "id": 19,
                "layer": 19,
                "card_count": 5,
                "cards": "20003#20003#20003#20003#20003",
                "formation": "1:20003,2:20003,3:20003,4:20003,5:20003"
            },
            "20": {
                "id": 20,
                "layer": 20,
                "card_count": 5,
                "cards": "20003#20003#20003#20003#20004",
                "formation": "1:20003,2:20003,3:20003,4:20003,5:20004",
                "boss_id": 20004,
                "trigger_rate": 50,
                "boss_attr": 80,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "21": {
                "id": 21,
                "layer": 21,
                "card_count": 5,
                "cards": "20004#20004#20004#20004#20004",
                "formation": "1:20004,2:20004,3:20004,4:20004,5:20004"
            },
            "22": {
                "id": 22,
                "layer": 22,
                "card_count": 5,
                "cards": "20004#20004#20004#20004#20004",
                "formation": "1:20004,2:20004,3:20004,4:20004,5:20004"
            },
            "23": {
                "id": 23,
                "layer": 23,
                "card_count": 5,
                "cards": "20004#20004#20004#20004#20004",
                "formation": "1:20004,2:20004,3:20004,4:20004,5:20004"
            },
            "24": {
                "id": 24,
                "layer": 24,
                "card_count": 5,
                "cards": "20004#20004#20004#20004#20004",
                "formation": "1:20004,2:20004,3:20004,4:20004,5:20004"
            },
            "25": {
                "id": 25,
                "layer": 25,
                "card_count": 5,
                "cards": "20004#20004#20004#20004#20005",
                "formation": "1:20004,2:20004,3:20004,4:20004,5:20005",
                "boss_id": 20005,
                "trigger_rate": 50,
                "boss_attr": 80,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "26": {
                "id": 26,
                "layer": 26,
                "card_count": 5,
                "cards": "20005#20005#20005#20005#20005",
                "formation": "1:20005,2:20005,3:20005,4:20005,5:20005"
            },
            "27": {
                "id": 27,
                "layer": 27,
                "card_count": 5,
                "cards": "20005#20005#20005#20005#20005",
                "formation": "1:20005,2:20005,3:20005,4:20005,5:20005"
            },
            "28": {
                "id": 28,
                "layer": 28,
                "card_count": 5,
                "cards": "20005#20005#20005#20005#20005",
                "formation": "1:20005,2:20005,3:20005,4:20005,5:20005"
            },
            "29": {
                "id": 29,
                "layer": 29,
                "card_count": 5,
                "cards": "20005#20005#20005#20005#20005",
                "formation": "1:20005,2:20005,3:20005,4:20005,5:20005"
            },
            "30": {
                "id": 30,
                "layer": 30,
                "card_count": 5,
                "cards": "20005#20005#20005#20005#20006",
                "formation": "1:20005,2:20005,3:20005,4:20005,5:20006",
                "boss_id": 20006,
                "trigger_rate": 50,
                "boss_attr": 70,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "31": {
                "id": 31,
                "layer": 31,
                "card_count": 5,
                "cards": "20006#20006#20006#20006#20006",
                "formation": "1:20006,2:20006,3:20006,4:20006,5:20006"
            },
            "32": {
                "id": 32,
                "layer": 32,
                "card_count": 5,
                "cards": "20006#20006#20006#20006#20006",
                "formation": "1:20006,2:20006,3:20006,4:20006,5:20006"
            },
            "33": {
                "id": 33,
                "layer": 33,
                "card_count": 5,
                "cards": "20006#20006#20006#20006#20006",
                "formation": "1:20006,2:20006,3:20006,4:20006,5:20006"
            },
            "34": {
                "id": 34,
                "layer": 34,
                "card_count": 5,
                "cards": "20006#20006#20006#20006#20006",
                "formation": "1:20006,2:20006,3:20006,4:20006,5:20006"
            },
            "35": {
                "id": 35,
                "layer": 35,
                "card_count": 5,
                "cards": "20006#20006#20006#20006#20007",
                "formation": "1:20006,2:20006,3:20006,4:20006,5:20007",
                "boss_id": 20007,
                "trigger_rate": 50,
                "boss_attr": 60,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "36": {
                "id": 36,
                "layer": 36,
                "card_count": 5,
                "cards": "20007#20007#20007#20007#20007",
                "formation": "1:20007,2:20007,3:20007,4:20007,5:20007"
            },
            "37": {
                "id": 37,
                "layer": 37,
                "card_count": 5,
                "cards": "20007#20007#20007#20007#20007",
                "formation": "1:20007,2:20007,3:20007,4:20007,5:20007"
            },
            "38": {
                "id": 38,
                "layer": 38,
                "card_count": 5,
                "cards": "20007#20007#20007#20007#20007",
                "formation": "1:20007,2:20007,3:20007,4:20007,5:20007"
            },
            "39": {
                "id": 39,
                "layer": 39,
                "card_count": 5,
                "cards": "20007#20007#20007#20007#20007",
                "formation": "1:20007,2:20007,3:20007,4:20007,5:20007"
            },
            "40": {
                "id": 40,
                "layer": 40,
                "card_count": 5,
                "cards": "20007#20007#20007#20007#20008",
                "formation": "1:20007,2:20007,3:20007,4:20007,5:20008",
                "boss_id": 20008,
                "trigger_rate": 50,
                "boss_attr": 45,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "41": {
                "id": 41,
                "layer": 41,
                "card_count": 5,
                "cards": "20008#20008#20008#20008#20008",
                "formation": "1:20008,2:20008,3:20008,4:20008,5:20008"
            },
            "42": {
                "id": 42,
                "layer": 42,
                "card_count": 5,
                "cards": "20008#20008#20008#20008#20008",
                "formation": "1:20008,2:20008,3:20008,4:20008,5:20008"
            },
            "43": {
                "id": 43,
                "layer": 43,
                "card_count": 5,
                "cards": "20008#20008#20008#20008#20008",
                "formation": "1:20008,2:20008,3:20008,4:20008,5:20008"
            },
            "44": {
                "id": 44,
                "layer": 44,
                "card_count": 5,
                "cards": "20008#20008#20008#20008#20008",
                "formation": "1:20008,2:20008,3:20008,4:20008,5:20008"
            },
            "45": {
                "id": 45,
                "layer": 45,
                "card_count": 5,
                "cards": "20008#20008#20008#20008#20009",
                "formation": "1:20008,2:20008,3:20008,4:20008,5:20009",
                "boss_id": 20009,
                "trigger_rate": 50,
                "boss_attr": 45,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "46": {
                "id": 46,
                "layer": 46,
                "card_count": 5,
                "cards": "20009#20009#20009#20009#20009",
                "formation": "1:20009,2:20009,3:20009,4:20009,5:20009"
            },
            "47": {
                "id": 47,
                "layer": 47,
                "card_count": 5,
                "cards": "20009#20009#20009#20009#20009",
                "formation": "1:20009,2:20009,3:20009,4:20009,5:20009"
            },
            "48": {
                "id": 48,
                "layer": 48,
                "card_count": 5,
                "cards": "20009#20009#20009#20009#20009",
                "formation": "1:20009,2:20009,3:20009,4:20009,5:20009"
            },
            "49": {
                "id": 49,
                "layer": 49,
                "card_count": 5,
                "cards": "20009#20009#20009#20009#20009",
                "formation": "1:20009,2:20009,3:20009,4:20009,5:20009"
            },
            "50": {
                "id": 50,
                "layer": 50,
                "card_count": 5,
                "cards": "20009#20009#20009#20009#20010",
                "formation": "1:20009,2:20009,3:20009,4:20009,5:20010",
                "boss_id": 20010,
                "trigger_rate": 70,
                "boss_attr": 40,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "51": {
                "id": 51,
                "layer": 51,
                "card_count": 5,
                "cards": "20010#20010#20010#20010#20010",
                "formation": "1:20010,2:20010,3:20010,4:20010,5:20010"
            },
            "52": {
                "id": 52,
                "layer": 52,
                "card_count": 5,
                "cards": "20010#20010#20010#20010#20010",
                "formation": "1:20010,2:20010,3:20010,4:20010,5:20010"
            },
            "53": {
                "id": 53,
                "layer": 53,
                "card_count": 5,
                "cards": "20010#20010#20010#20010#20010",
                "formation": "1:20010,2:20010,3:20010,4:20010,5:20010"
            },
            "54": {
                "id": 54,
                "layer": 54,
                "card_count": 5,
                "cards": "20010#20010#20010#20010#20010",
                "formation": "1:20010,2:20010,3:20010,4:20010,5:20010"
            },
            "55": {
                "id": 55,
                "layer": 55,
                "card_count": 5,
                "cards": "20010#20010#20010#20010#20011",
                "formation": "1:20010,2:20010,3:20010,4:20010,5:20011",
                "boss_id": 20011,
                "trigger_rate": 50,
                "boss_attr": 180,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "56": {
                "id": 56,
                "layer": 56,
                "card_count": 5,
                "cards": "20011#20011#20011#20011#20011",
                "formation": "1:20011,2:20011,3:20011,4:20011,5:20011"
            },
            "57": {
                "id": 57,
                "layer": 57,
                "card_count": 5,
                "cards": "20011#20011#20011#20011#20011",
                "formation": "1:20011,2:20011,3:20011,4:20011,5:20011"
            },
            "58": {
                "id": 58,
                "layer": 58,
                "card_count": 5,
                "cards": "20011#20011#20011#20011#20011",
                "formation": "1:20011,2:20011,3:20011,4:20011,5:20011"
            },
            "59": {
                "id": 59,
                "layer": 59,
                "card_count": 5,
                "cards": "20011#20011#20011#20011#20011",
                "formation": "1:20011,2:20011,3:20011,4:20011,5:20011"
            },
            "60": {
                "id": 60,
                "layer": 60,
                "card_count": 5,
                "cards": "20011#20011#20011#20011#20012",
                "formation": "1:20011,2:20011,3:20011,4:20011,5:20012",
                "boss_id": 20012,
                "trigger_rate": 50,
                "boss_attr": 70,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "61": {
                "id": 61,
                "layer": 61,
                "card_count": 5,
                "cards": "20012#20012#20012#20012#20012",
                "formation": "1:20012,2:20012,3:20012,4:20012,5:20012"
            },
            "62": {
                "id": 62,
                "layer": 62,
                "card_count": 5,
                "cards": "20012#20012#20012#20012#20012",
                "formation": "1:20012,2:20012,3:20012,4:20012,5:20012"
            },
            "63": {
                "id": 63,
                "layer": 63,
                "card_count": 5,
                "cards": "20012#20012#20012#20012#20012",
                "formation": "1:20012,2:20012,3:20012,4:20012,5:20012"
            },
            "64": {
                "id": 64,
                "layer": 64,
                "card_count": 5,
                "cards": "20012#20012#20012#20012#20012",
                "formation": "1:20012,2:20012,3:20012,4:20012,5:20012"
            },
            "65": {
                "id": 65,
                "layer": 65,
                "card_count": 5,
                "cards": "20012#20012#20012#20012#20013",
                "formation": "1:20012,2:20012,3:20012,4:20012,5:20013",
                "boss_id": 20013,
                "trigger_rate": 50,
                "boss_attr": 70,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "66": {
                "id": 66,
                "layer": 66,
                "card_count": 5,
                "cards": "20013#20013#20013#20013#20013",
                "formation": "1:20013,2:20013,3:20013,4:20013,5:20013"
            },
            "67": {
                "id": 67,
                "layer": 67,
                "card_count": 5,
                "cards": "20013#20013#20013#20013#20013",
                "formation": "1:20013,2:20013,3:20013,4:20013,5:20013"
            },
            "68": {
                "id": 68,
                "layer": 68,
                "card_count": 5,
                "cards": "20013#20013#20013#20013#20013",
                "formation": "1:20013,2:20013,3:20013,4:20013,5:20013"
            },
            "69": {
                "id": 69,
                "layer": 69,
                "card_count": 5,
                "cards": "20013#20013#20013#20013#20013",
                "formation": "1:20013,2:20013,3:20013,4:20013,5:20013"
            },
            "70": {
                "id": 70,
                "layer": 70,
                "card_count": 5,
                "cards": "20013#20013#20013#20013#20014",
                "formation": "1:20013,2:20013,3:20013,4:20013,5:20014",
                "boss_id": 20014,
                "trigger_rate": 50,
                "boss_attr": 80,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "71": {
                "id": 71,
                "layer": 71,
                "card_count": 5,
                "cards": "20014#20014#20014#20014#20014",
                "formation": "1:20014,2:20014,3:20014,4:20014,5:20014"
            },
            "72": {
                "id": 72,
                "layer": 72,
                "card_count": 5,
                "cards": "20014#20014#20014#20014#20014",
                "formation": "1:20014,2:20014,3:20014,4:20014,5:20014"
            },
            "73": {
                "id": 73,
                "layer": 73,
                "card_count": 5,
                "cards": "20014#20014#20014#20014#20014",
                "formation": "1:20014,2:20014,3:20014,4:20014,5:20014"
            },
            "74": {
                "id": 74,
                "layer": 74,
                "card_count": 5,
                "cards": "20014#20014#20014#20014#20014",
                "formation": "1:20014,2:20014,3:20014,4:20014,5:20014"
            },
            "75": {
                "id": 75,
                "layer": 75,
                "card_count": 5,
                "cards": "20014#20014#20014#20014#20015",
                "formation": "1:20014,2:20014,3:20014,4:20014,5:20015",
                "boss_id": 20015,
                "trigger_rate": 50,
                "boss_attr": 80,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "76": {
                "id": 76,
                "layer": 76,
                "card_count": 5,
                "cards": "20015#20015#20015#20015#20015",
                "formation": "1:20015,2:20015,3:20015,4:20015,5:20015"
            },
            "77": {
                "id": 77,
                "layer": 77,
                "card_count": 5,
                "cards": "20015#20015#20015#20015#20015",
                "formation": "1:20015,2:20015,3:20015,4:20015,5:20015"
            },
            "78": {
                "id": 78,
                "layer": 78,
                "card_count": 5,
                "cards": "20015#20015#20015#20015#20015",
                "formation": "1:20015,2:20015,3:20015,4:20015,5:20015"
            },
            "79": {
                "id": 79,
                "layer": 79,
                "card_count": 5,
                "cards": "20015#20015#20015#20015#20015",
                "formation": "1:20015,2:20015,3:20015,4:20015,5:20015"
            },
            "80": {
                "id": 80,
                "layer": 80,
                "card_count": 5,
                "cards": "20015#20015#20015#20015#20016",
                "formation": "1:20015,2:20015,3:20015,4:20015,5:20016",
                "boss_id": 20016,
                "trigger_rate": 50,
                "boss_attr": 70,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "81": {
                "id": 81,
                "layer": 81,
                "card_count": 5,
                "cards": "20016#20016#20016#20016#20016",
                "formation": "1:20016,2:20016,3:20016,4:20016,5:20016"
            },
            "82": {
                "id": 82,
                "layer": 82,
                "card_count": 5,
                "cards": "20016#20016#20016#20016#20016",
                "formation": "1:20016,2:20016,3:20016,4:20016,5:20016"
            },
            "83": {
                "id": 83,
                "layer": 83,
                "card_count": 5,
                "cards": "20016#20016#20016#20016#20016",
                "formation": "1:20016,2:20016,3:20016,4:20016,5:20016"
            },
            "84": {
                "id": 84,
                "layer": 84,
                "card_count": 5,
                "cards": "20016#20016#20016#20016#20016",
                "formation": "1:20016,2:20016,3:20016,4:20016,5:20016"
            },
            "85": {
                "id": 85,
                "layer": 85,
                "card_count": 5,
                "cards": "20016#20016#20016#20016#20017",
                "formation": "1:20016,2:20016,3:20016,4:20016,5:20017",
                "boss_id": 20017,
                "trigger_rate": 50,
                "boss_attr": 60,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "86": {
                "id": 86,
                "layer": 86,
                "card_count": 5,
                "cards": "20017#20017#20017#20017#20017",
                "formation": "1:20017,2:20017,3:20017,4:20017,5:20017"
            },
            "87": {
                "id": 87,
                "layer": 87,
                "card_count": 5,
                "cards": "20017#20017#20017#20017#20017",
                "formation": "1:20017,2:20017,3:20017,4:20017,5:20017"
            },
            "88": {
                "id": 88,
                "layer": 88,
                "card_count": 5,
                "cards": "20017#20017#20017#20017#20017",
                "formation": "1:20017,2:20017,3:20017,4:20017,5:20017"
            },
            "89": {
                "id": 89,
                "layer": 89,
                "card_count": 5,
                "cards": "20017#20017#20017#20017#20017",
                "formation": "1:20017,2:20017,3:20017,4:20017,5:20017"
            },
            "90": {
                "id": 90,
                "layer": 90,
                "card_count": 5,
                "cards": "20017#20017#20017#20017#20018",
                "formation": "1:20017,2:20017,3:20017,4:20017,5:20018",
                "boss_id": 20018,
                "trigger_rate": 50,
                "boss_attr": 45,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "91": {
                "id": 91,
                "layer": 91,
                "card_count": 5,
                "cards": "20018#20018#20018#20018#20018",
                "formation": "1:20018,2:20018,3:20018,4:20018,5:20018"
            },
            "92": {
                "id": 92,
                "layer": 92,
                "card_count": 5,
                "cards": "20018#20018#20018#20018#20018",
                "formation": "1:20018,2:20018,3:20018,4:20018,5:20018"
            },
            "93": {
                "id": 93,
                "layer": 93,
                "card_count": 5,
                "cards": "20018#20018#20018#20018#20018",
                "formation": "1:20018,2:20018,3:20018,4:20018,5:20018"
            },
            "94": {
                "id": 94,
                "layer": 94,
                "card_count": 5,
                "cards": "20018#20018#20018#20018#20018",
                "formation": "1:20018,2:20018,3:20018,4:20018,5:20018"
            },
            "95": {
                "id": 95,
                "layer": 95,
                "card_count": 5,
                "cards": "20018#20018#20018#20018#20019",
                "formation": "1:20018,2:20018,3:20018,4:20018,5:20019",
                "boss_id": 20019,
                "trigger_rate": 50,
                "boss_attr": 45,
                "atk_inc": 50,
                "hp_inc": 50
            },
            "96": {
                "id": 96,
                "layer": 96,
                "card_count": 5,
                "cards": "20019#20019#20019#20019#20019",
                "formation": "1:20019,2:20019,3:20019,4:20019,5:20019"
            },
            "97": {
                "id": 97,
                "layer": 97,
                "card_count": 5,
                "cards": "20019#20019#20019#20019#20019",
                "formation": "1:20019,2:20019,3:20019,4:20019,5:20019"
            },
            "98": {
                "id": 98,
                "layer": 98,
                "card_count": 5,
                "cards": "20019#20019#20019#20019#20019",
                "formation": "1:20019,2:20019,3:20019,4:20019,5:20019"
            },
            "99": {
                "id": 99,
                "layer": 99,
                "card_count": 5,
                "cards": "20019#20019#20019#20019#20019",
                "formation": "1:20019,2:20019,3:20019,4:20019,5:20019"
            },
            "100": {
                "id": 100,
                "layer": 100,
                "card_count": 5,
                "cards": "20019#20019#20019#20019#20020",
                "formation": "1:20019,2:20019,3:20019,4:20019,5:20020",
                "boss_id": 20020,
                "trigger_rate": 50,
                "boss_attr": 40,
                "atk_inc": 50,
                "hp_inc": 50
            }
        }
    },
    "task_card": {
        "colComment": {
            "card_id": {
                "table": "怪物卡牌配置表",
                "key_index": "name",
                "value_index": "id",
                "withPound": false
            }
        },
        "rows": {
            "10000": {
                "id": 10000,
                "card_id": "恶·鬼谷子",
                "atk": 50,
                "hp": 113,
                "dodge_rate": 15,
                "crit_rate": 20
            },
            "10001": {
                "id": 10001,
                "card_id": "恶·黑无常",
                "atk": 149,
                "hp": 372,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 1
            },
            "10002": {
                "id": 10002,
                "card_id": "恶·白无常",
                "atk": 163,
                "hp": 409,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 2
            },
            "10003": {
                "id": 10003,
                "card_id": "恶·日游神",
                "atk": 179,
                "hp": 448,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 3
            },
            "10004": {
                "id": 10004,
                "card_id": "恶·夜游神",
                "atk": 196,
                "hp": 491,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 4
            },
            "10005": {
                "id": 10005,
                "card_id": "恶·宓妃",
                "atk": 215,
                "hp": 538,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 5
            },
            "10006": {
                "id": 10006,
                "card_id": "恶·张道陵",
                "atk": 236,
                "hp": 590,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 6
            },
            "10007": {
                "id": 10007,
                "card_id": "恶·修罗王",
                "atk": 258,
                "hp": 645,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 7
            },
            "10008": {
                "id": 10008,
                "card_id": "恶·迦楼罗王",
                "atk": 283,
                "hp": 706,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 8
            },
            "10009": {
                "id": 10009,
                "card_id": "恶·紧那罗王",
                "atk": 309,
                "hp": 770,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 9
            },
            "10010": {
                "id": 10010,
                "card_id": "恶·紫霞",
                "atk": 337,
                "hp": 841,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 10
            },
            "10011": {
                "id": 10011,
                "card_id": "恶·金蝉子",
                "atk": 367,
                "hp": 916,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 1
            },
            "10012": {
                "id": 10012,
                "card_id": "恶·铁扇公主",
                "atk": 400,
                "hp": 998,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 2
            },
            "10013": {
                "id": 10013,
                "card_id": "恶·沙僧",
                "atk": 435,
                "hp": 1086,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 3
            },
            "10014": {
                "id": 10014,
                "card_id": "恶·牛魔王",
                "atk": 473,
                "hp": 1181,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 4
            },
            "10015": {
                "id": 10015,
                "card_id": "恶·巨灵神",
                "atk": 513,
                "hp": 1283,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 5
            },
            "10016": {
                "id": 10016,
                "card_id": "恶·红孩儿",
                "atk": 556,
                "hp": 1391,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 6
            },
            "10017": {
                "id": 10017,
                "card_id": "恶·黄飞虎",
                "atk": 603,
                "hp": 1508,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 7
            },
            "10018": {
                "id": 10018,
                "card_id": "恶·孙悟空",
                "atk": 653,
                "hp": 1634,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 8
            },
            "10019": {
                "id": 10019,
                "card_id": "恶·猪八戒",
                "atk": 707,
                "hp": 1768,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 9
            },
            "10020": {
                "id": 10020,
                "card_id": "恶·杨戬",
                "atk": 765,
                "hp": 1911,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 10
            },
            "10021": {
                "id": 10021,
                "card_id": "恶·哪吒",
                "atk": 826,
                "hp": 2064,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 1
            },
            "10022": {
                "id": 10022,
                "card_id": "恶·赵公明",
                "atk": 892,
                "hp": 2227,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 2
            },
            "10023": {
                "id": 10023,
                "card_id": "恶·申公豹",
                "atk": 961,
                "hp": 2400,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 3
            },
            "10024": {
                "id": 10024,
                "card_id": "恶·土行孙",
                "atk": 1035,
                "hp": 2585,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 4
            },
            "10025": {
                "id": 10025,
                "card_id": "恶·法海",
                "atk": 1113,
                "hp": 2781,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 5
            },
            "10026": {
                "id": 10026,
                "card_id": "恶·雷震子",
                "atk": 1197,
                "hp": 2990,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 6
            },
            "10027": {
                "id": 10027,
                "card_id": "恶·妲己",
                "atk": 1285,
                "hp": 3211,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 7
            },
            "10028": {
                "id": 10028,
                "card_id": "恶·姜子牙",
                "atk": 1379,
                "hp": 3445,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 8
            },
            "10029": {
                "id": 10029,
                "card_id": "恶·李靖",
                "atk": 1478,
                "hp": 3694,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 9
            },
            "10030": {
                "id": 10030,
                "card_id": "恶·白素贞",
                "atk": 1583,
                "hp": 3956,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 10
            },
            "10031": {
                "id": 10031,
                "card_id": "恶·小青",
                "atk": 1694,
                "hp": 4233,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 1
            },
            "10032": {
                "id": 10032,
                "card_id": "恶·何仙姑",
                "atk": 1811,
                "hp": 4525,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 2
            },
            "10033": {
                "id": 10033,
                "card_id": "恶·吕洞宾",
                "atk": 1934,
                "hp": 4833,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 3
            },
            "10034": {
                "id": 10034,
                "card_id": "恶·铁拐李",
                "atk": 2064,
                "hp": 5157,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 4
            },
            "10035": {
                "id": 10035,
                "card_id": "恶·汉钟离",
                "atk": 2200,
                "hp": 5497,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 5
            },
            "10036": {
                "id": 10036,
                "card_id": "恶·张果老",
                "atk": 2343,
                "hp": 5855,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 6
            },
            "10037": {
                "id": 10037,
                "card_id": "恶·蓝采和",
                "atk": 2493,
                "hp": 6229,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 7
            },
            "10038": {
                "id": 10038,
                "card_id": "恶·韩湘子",
                "atk": 2651,
                "hp": 6621,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 8
            },
            "10039": {
                "id": 10039,
                "card_id": "恶·牛郎",
                "atk": 2815,
                "hp": 7032,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 9
            },
            "10040": {
                "id": 10040,
                "card_id": "恶·织女",
                "atk": 2987,
                "hp": 7461,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 10
            },
            "10041": {
                "id": 10041,
                "card_id": "恶·吴刚",
                "atk": 3166,
                "hp": 7908,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 1
            },
            "10042": {
                "id": 10042,
                "card_id": "恶·刑天",
                "atk": 3353,
                "hp": 8375,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 2
            },
            "10043": {
                "id": 10043,
                "card_id": "恶·沉香",
                "atk": 3548,
                "hp": 8861,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 3
            },
            "10044": {
                "id": 10044,
                "card_id": "恶·济公",
                "atk": 3750,
                "hp": 9365,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 4
            },
            "10045": {
                "id": 10045,
                "card_id": "恶·瑶姬",
                "atk": 3960,
                "hp": 9890,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 5
            },
            "10046": {
                "id": 10046,
                "card_id": "恶·精卫",
                "atk": 4178,
                "hp": 10434,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 6
            },
            "10047": {
                "id": 10047,
                "card_id": "恶·后羿",
                "atk": 4404,
                "hp": 10997,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 7
            },
            "10048": {
                "id": 10048,
                "card_id": "恶·嫦娥",
                "atk": 4637,
                "hp": 11580,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 8
            },
            "10049": {
                "id": 10049,
                "card_id": "恶·夸父",
                "atk": 4878,
                "hp": 12182,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 9
            },
            "10050": {
                "id": 10050,
                "card_id": "恶·后羿",
                "atk": 5200,
                "hp": 14500,
                "dodge_rate": 15,
                "crit_rate": 20,
                "skill_id": 10
            },
            "20000": {
                "id": 20000,
                "card_id": "战·牛魔王",
                "atk": 309,
                "hp": 770,
                "dodge_rate": 20,
                "crit_rate": 25
            },
            "20001": {
                "id": 20001,
                "card_id": "战·哪吒",
                "atk": 483,
                "hp": 1207,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 1
            },
            "20002": {
                "id": 20002,
                "card_id": "战·后羿",
                "atk": 739,
                "hp": 1846,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 2
            },
            "20003": {
                "id": 20003,
                "card_id": "战·孙悟空",
                "atk": 1104,
                "hp": 2757,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 3
            },
            "20004": {
                "id": 20004,
                "card_id": "战·巨灵神",
                "atk": 1609,
                "hp": 4022,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 4
            },
            "20005": {
                "id": 20005,
                "card_id": "战·铁扇公主",
                "atk": 2444,
                "hp": 6108,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 5
            },
            "20006": {
                "id": 20006,
                "card_id": "战·红孩儿",
                "atk": 3385,
                "hp": 8456,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 6
            },
            "20007": {
                "id": 20007,
                "card_id": "战·济公",
                "atk": 4576,
                "hp": 11429,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 7
            },
            "20008": {
                "id": 20008,
                "card_id": "战·黄飞虎",
                "atk": 5745,
                "hp": 14348,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 8
            },
            "20009": {
                "id": 20009,
                "card_id": "战·刑天",
                "atk": 5686,
                "hp": 14769,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 9
            },
            "20010": {
                "id": 20010,
                "card_id": "战·妲己",
                "atk": 7189,
                "hp": 18669,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 10
            },
            "20011": {
                "id": 20011,
                "card_id": "战·申公豹",
                "atk": 8947,
                "hp": 23238,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 1
            },
            "20012": {
                "id": 20012,
                "card_id": "战·法海",
                "atk": 10963,
                "hp": 28478,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 2
            },
            "20013": {
                "id": 20013,
                "card_id": "战·何仙姑",
                "atk": 13227,
                "hp": 34359,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 3
            },
            "20014": {
                "id": 20014,
                "card_id": "战·土行孙",
                "atk": 15136,
                "hp": 39315,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 4
            },
            "20015": {
                "id": 20015,
                "card_id": "战·白素贞",
                "atk": 14141,
                "hp": 35453,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 5
            },
            "20016": {
                "id": 20016,
                "card_id": "战·修罗王",
                "atk": 16454,
                "hp": 41251,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 6
            },
            "20017": {
                "id": 20017,
                "card_id": "战·吕洞宾",
                "atk": 18209,
                "hp": 45654,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 7
            },
            "20018": {
                "id": 20018,
                "card_id": "战·鬼谷子",
                "atk": 20873,
                "hp": 52333,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 8
            },
            "20019": {
                "id": 20019,
                "card_id": "战·日游神",
                "atk": 23715,
                "hp": 59457,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 9
            },
            "20020": {
                "id": 20020,
                "card_id": "战·夸父",
                "atk": 25695,
                "hp": 65346,
                "dodge_rate": 20,
                "crit_rate": 25,
                "skill_id": 10
            }
        }
    },
    "task_config": {
        "colComment": {
            "chapter_id": {
                "table": "大章表",
                "key_index": "chapter",
                "value_index": "id",
                "withPound": false
            }
        },
        "rows": {
            "1": {
                "id": 1,
                "chapter_id": "鬼门关",
                "card_count": 2,
                "cards": "10000#10001",
                "boss_id": 10001,
                "trigger_rate": 30,
                "boss_attr": 180,
                "formation": "1:10000,2:10001",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "2": {
                "id": 2,
                "chapter_id": "炼狱谷",
                "card_count": 3,
                "cards": "10001#10001#10002",
                "boss_id": 10002,
                "trigger_rate": 30,
                "boss_attr": 70,
                "formation": "1:10001,2:10001,3:10002",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "3": {
                "id": 3,
                "chapter_id": "噬心峰",
                "card_count": 3,
                "cards": "10002#10002#10003",
                "boss_id": 10003,
                "trigger_rate": 30,
                "boss_attr": 70,
                "formation": "1:10002,2:10002,3:10003",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "4": {
                "id": 4,
                "chapter_id": "绝情池",
                "card_count": 4,
                "cards": "10003#10003#10003#10004",
                "boss_id": 10004,
                "trigger_rate": 30,
                "boss_attr": 80,
                "formation": "1:10003,2:10003,3:10003,4:10004",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "5": {
                "id": 5,
                "chapter_id": "哭丧岩",
                "card_count": 4,
                "cards": "10004#10004#10004#10005",
                "boss_id": 10005,
                "trigger_rate": 30,
                "boss_attr": 80,
                "formation": "1:10004,2:10004,3:10004,4:10005",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "6": {
                "id": 6,
                "chapter_id": "杏花村",
                "card_count": 5,
                "cards": "10005#10005#10005#10005#10006",
                "boss_id": 10006,
                "trigger_rate": 30,
                "boss_attr": 70,
                "formation": "1:10005,2:10005,3:10005,4:10005,5:10006",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "7": {
                "id": 7,
                "chapter_id": "窦娥冢",
                "card_count": 5,
                "cards": "10006#10006#10006#10006#10007",
                "boss_id": 10007,
                "trigger_rate": 30,
                "boss_attr": 60,
                "formation": "1:10006,2:10006,3:10006,4:10006,5:10007",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "8": {
                "id": 8,
                "chapter_id": "柳风堂",
                "card_count": 5,
                "cards": "10007#10007#10007#10007#10008",
                "boss_id": 10008,
                "trigger_rate": 30,
                "boss_attr": 45,
                "formation": "1:10007,2:10007,3:10007,4:10007,5:10008",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "9": {
                "id": 9,
                "chapter_id": "陶然居",
                "card_count": 5,
                "cards": "10008#10008#10008#10008#10009",
                "boss_id": 10009,
                "trigger_rate": 30,
                "boss_attr": 45,
                "formation": "1:10008,2:10008,3:10008,4:10008,5:10009",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "10": {
                "id": 10,
                "chapter_id": "忘情河",
                "card_count": 5,
                "cards": "10009#10009#10009#10009#10010",
                "boss_id": 10010,
                "trigger_rate": 30,
                "boss_attr": 40,
                "formation": "1:10009,2:10009,3:10009,4:10009,5:10010",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "11": {
                "id": 11,
                "chapter_id": "南天门",
                "card_count": 5,
                "cards": "10010#10010#10010#10010#10011",
                "boss_id": 10011,
                "trigger_rate": 30,
                "boss_attr": 180,
                "formation": "1:10010,2:10010,3:10010,4:10010,5:10011",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "12": {
                "id": 12,
                "chapter_id": "凌霄殿",
                "card_count": 5,
                "cards": "10011#10011#10011#10011#10012",
                "boss_id": 10012,
                "trigger_rate": 30,
                "boss_attr": 70,
                "formation": "1:10011,2:10011,3:10011,4:10011,5:10012",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "13": {
                "id": 13,
                "chapter_id": "冷月宫",
                "card_count": 5,
                "cards": "10012#10012#10012#10012#10013",
                "boss_id": 10013,
                "trigger_rate": 30,
                "boss_attr": 70,
                "formation": "1:10012,2:10012,3:10012,4:10012,5:10013",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "14": {
                "id": 14,
                "chapter_id": "蟠桃园",
                "card_count": 5,
                "cards": "10013#10013#10013#10013#10014",
                "boss_id": 10014,
                "trigger_rate": 30,
                "boss_attr": 80,
                "formation": "1:10013,2:10013,3:10013,4:10013,5:10014",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "15": {
                "id": 15,
                "chapter_id": "王母峰",
                "card_count": 5,
                "cards": "10014#10014#10014#10014#10015",
                "boss_id": 10015,
                "trigger_rate": 30,
                "boss_attr": 80,
                "formation": "1:10014,2:10014,3:10014,4:10014,5:10015",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "16": {
                "id": 16,
                "chapter_id": "流沙河",
                "card_count": 5,
                "cards": "10015#10015#10015#10015#10016",
                "boss_id": 10016,
                "trigger_rate": 30,
                "boss_attr": 70,
                "formation": "1:10015,2:10015,3:10015,4:10015,5:10016",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "17": {
                "id": 17,
                "chapter_id": "五指山",
                "card_count": 5,
                "cards": "10016#10016#10016#10016#10017",
                "boss_id": 10017,
                "trigger_rate": 30,
                "boss_attr": 60,
                "formation": "1:10016,2:10016,3:10016,4:10016,5:10017",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "18": {
                "id": 18,
                "chapter_id": "女儿国",
                "card_count": 5,
                "cards": "10017#10017#10017#10017#10018",
                "boss_id": 10018,
                "trigger_rate": 30,
                "boss_attr": 45,
                "formation": "1:10017,2:10017,3:10017,4:10017,5:10018",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "19": {
                "id": 19,
                "chapter_id": "曲女城",
                "card_count": 5,
                "cards": "10018#10018#10018#10018#10019",
                "boss_id": 10019,
                "trigger_rate": 30,
                "boss_attr": 45,
                "formation": "1:10018,2:10018,3:10018,4:10018,5:10019",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "20": {
                "id": 20,
                "chapter_id": "天竺寺",
                "card_count": 5,
                "cards": "10019#10019#10019#10019#10020",
                "boss_id": 10020,
                "trigger_rate": 30,
                "boss_attr": 40,
                "formation": "1:10019,2:10019,3:10019,4:10019,5:10020",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "21": {
                "id": 21,
                "chapter_id": "圣女峰",
                "card_count": 5,
                "cards": "10020#10020#10020#10020#10021",
                "boss_id": 10021,
                "trigger_rate": 30,
                "boss_attr": 180,
                "formation": "1:10020,2:10020,3:10020,4:10020,5:10021",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "22": {
                "id": 22,
                "chapter_id": "空灵泉",
                "card_count": 5,
                "cards": "10021#10021#10021#10021#10022",
                "boss_id": 10022,
                "trigger_rate": 30,
                "boss_attr": 70,
                "formation": "1:10022,2:10022,3:10022,4:10022,5:10022",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "23": {
                "id": 23,
                "chapter_id": "莲花池",
                "card_count": 5,
                "cards": "10022#10022#10022#10022#10023",
                "boss_id": 10023,
                "trigger_rate": 30,
                "boss_attr": 70,
                "formation": "1:10022,2:10022,3:10022,4:10022,5:10023",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "24": {
                "id": 24,
                "chapter_id": "极乐界",
                "card_count": 5,
                "cards": "10023#10023#10023#10023#10024",
                "boss_id": 10024,
                "trigger_rate": 30,
                "boss_attr": 80,
                "formation": "1:10023,2:10023,3:10023,4:10023,5:10024",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "25": {
                "id": 25,
                "chapter_id": "苦难谷",
                "card_count": 5,
                "cards": "10024#10024#10024#10024#10025",
                "boss_id": 10025,
                "trigger_rate": 30,
                "boss_attr": 80,
                "formation": "1:10024,2:10024,3:10024,4:10024,5:10025",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "26": {
                "id": 26,
                "chapter_id": "盘丝洞",
                "card_count": 5,
                "cards": "10025#10025#10025#10025#10026",
                "boss_id": 10026,
                "trigger_rate": 30,
                "boss_attr": 70,
                "formation": "1:10025,2:10025,3:10025,4:10025,5:10026",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "27": {
                "id": 27,
                "chapter_id": "斗战堂",
                "card_count": 5,
                "cards": "10026#10026#10026#10026#10027",
                "boss_id": 10027,
                "trigger_rate": 30,
                "boss_attr": 60,
                "formation": "1:10026,2:10026,3:10026,4:10026,5:10027",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "28": {
                "id": 28,
                "chapter_id": "圣佛村",
                "card_count": 5,
                "cards": "10027#10027#10027#10027#10028",
                "boss_id": 10028,
                "trigger_rate": 30,
                "boss_attr": 45,
                "formation": "1:10027,2:10027,3:10027,4:10027,5:10028",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "29": {
                "id": 29,
                "chapter_id": "紫霞谷",
                "card_count": 5,
                "cards": "10028#10028#10028#10028#10029",
                "boss_id": 10029,
                "trigger_rate": 30,
                "boss_attr": 45,
                "formation": "1:10028,2:10028,3:10028,4:10028,5:10029",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "30": {
                "id": 30,
                "chapter_id": "思念池",
                "card_count": 5,
                "cards": "10029#10029#10029#10029#10030",
                "boss_id": 10030,
                "trigger_rate": 30,
                "boss_attr": 40,
                "formation": "1:10029,2:10029,3:10029,4:10029,5:10030",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "31": {
                "id": 31,
                "chapter_id": "五华山",
                "card_count": 5,
                "cards": "10030#10030#10030#10030#10031",
                "boss_id": 10031,
                "trigger_rate": 30,
                "boss_attr": 180,
                "formation": "1:10030,2:10030,3:10030,4:10030,5:10031",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "32": {
                "id": 32,
                "chapter_id": "尘缘地",
                "card_count": 5,
                "cards": "10031#10031#10031#10031#10032",
                "boss_id": 10032,
                "trigger_rate": 30,
                "boss_attr": 70,
                "formation": "1:10031,2:10031,3:10031,4:10031,5:10032",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "33": {
                "id": 33,
                "chapter_id": "了然原",
                "card_count": 5,
                "cards": "10032#10032#10032#10032#10033",
                "boss_id": 10033,
                "trigger_rate": 30,
                "boss_attr": 70,
                "formation": "1:10032,2:10032,3:10032,4:10032,5:10033",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "34": {
                "id": 34,
                "chapter_id": "那烂陀",
                "card_count": 5,
                "cards": "10033#10033#10033#10033#10034",
                "boss_id": 10034,
                "trigger_rate": 30,
                "boss_attr": 80,
                "formation": "1:10033,2:10033,3:10033,4:10033,5:10034",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "35": {
                "id": 35,
                "chapter_id": "生死场",
                "card_count": 5,
                "cards": "10034#10034#10034#10034#10035",
                "boss_id": 10035,
                "trigger_rate": 30,
                "boss_attr": 80,
                "formation": "1:10034,2:10034,3:10034,4:10034,5:10035",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "36": {
                "id": 36,
                "chapter_id": "龙须地",
                "card_count": 5,
                "cards": "10035#10035#10035#10035#10036",
                "boss_id": 10036,
                "trigger_rate": 30,
                "boss_attr": 70,
                "formation": "1:10035,2:10035,3:10035,4:10035,5:10036",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "37": {
                "id": 37,
                "chapter_id": "南华峰",
                "card_count": 5,
                "cards": "10036#10036#10036#10036#10037",
                "boss_id": 10037,
                "trigger_rate": 30,
                "boss_attr": 60,
                "formation": "1:10036,2:10036,3:10036,4:10036,5:10037",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "38": {
                "id": 38,
                "chapter_id": "黑虎山",
                "card_count": 5,
                "cards": "10037#10037#10037#10037#10038",
                "boss_id": 10038,
                "trigger_rate": 30,
                "boss_attr": 45,
                "formation": "1:10037,2:10037,3:10037,4:10037,5:10038",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "39": {
                "id": 39,
                "chapter_id": "妖风洞",
                "card_count": 5,
                "cards": "10038#10038#10038#10038#10039",
                "boss_id": 10039,
                "trigger_rate": 30,
                "boss_attr": 45,
                "formation": "1:10039,2:10039,3:10039,4:10039,5:10039",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "40": {
                "id": 40,
                "chapter_id": "大乘愚",
                "card_count": 5,
                "cards": "10039#10039#10039#10039#10040",
                "boss_id": 10040,
                "trigger_rate": 30,
                "boss_attr": 40,
                "formation": "1:10039,2:10039,3:10039,4:10039,5:10040",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "41": {
                "id": 41,
                "chapter_id": "普陀寺",
                "card_count": 5,
                "cards": "10040#10040#10040#10040#10041",
                "boss_id": 10041,
                "trigger_rate": 30,
                "boss_attr": 180,
                "formation": "1:10040,2:10040,3:10040,4:10040,5:10041",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "42": {
                "id": 42,
                "chapter_id": "三界门",
                "card_count": 5,
                "cards": "10041#10041#10041#10041#10042",
                "boss_id": 10042,
                "trigger_rate": 30,
                "boss_attr": 70,
                "formation": "1:10041,2:10041,3:10041,4:10041,5:10042",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "43": {
                "id": 43,
                "chapter_id": "七尘斋",
                "card_count": 5,
                "cards": "10042#10042#10042#10042#10043",
                "boss_id": 10043,
                "trigger_rate": 30,
                "boss_attr": 70,
                "formation": "1:10042,2:10042,3:10042,4:10042,5:10043",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "44": {
                "id": 44,
                "chapter_id": "众生琅",
                "card_count": 5,
                "cards": "10043#10043#10043#10043#10044",
                "boss_id": 10044,
                "trigger_rate": 30,
                "boss_attr": 80,
                "formation": "1:10043,2:10043,3:10043,4:10043,5:10044",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "45": {
                "id": 45,
                "chapter_id": "万年羲",
                "card_count": 5,
                "cards": "10044#10044#10044#10044#10045",
                "boss_id": 10045,
                "trigger_rate": 30,
                "boss_attr": 80,
                "formation": "1:10044,2:10044,3:10044,4:10044,5:10045",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "46": {
                "id": 46,
                "chapter_id": "玲珑痷",
                "card_count": 5,
                "cards": "10045#10045#10045#10045#10046",
                "boss_id": 10046,
                "trigger_rate": 30,
                "boss_attr": 70,
                "formation": "1:10045,2:10045,3:10045,4:10045,5:10046",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "47": {
                "id": 47,
                "chapter_id": "相生殿",
                "card_count": 5,
                "cards": "10046#10046#10046#10046#10047",
                "boss_id": 10047,
                "trigger_rate": 30,
                "boss_attr": 60,
                "formation": "1:10046,2:10046,3:10046,4:10046,5:10047",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "48": {
                "id": 48,
                "chapter_id": "罗汉堂",
                "card_count": 5,
                "cards": "10047#10047#10047#10047#10048",
                "boss_id": 10048,
                "trigger_rate": 30,
                "boss_attr": 45,
                "formation": "1:10047,2:10047,3:10047,4:10047,5:10048",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "49": {
                "id": 49,
                "chapter_id": "七仙居",
                "card_count": 5,
                "cards": "10048#10048#10048#10048#10049",
                "boss_id": 10049,
                "trigger_rate": 30,
                "boss_attr": 45,
                "formation": "1:10048,2:10048,3:10048,4:10048,5:10049",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            },
            "50": {
                "id": 50,
                "chapter_id": "封神山",
                "card_count": 5,
                "cards": "10049#10049#10049#10049#10050",
                "boss_id": 10050,
                "trigger_rate": 30,
                "boss_attr": 40,
                "formation": "1:10049,2:10049,3:10049,4:10049,5:10050",
                "atk_inc": 5,
                "hp_inc": 5,
                "max_drop_card_number": 1
            }
        }
    },
    "wipe_out": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "money_obtain": 550,
                "exp_obtain": 100
            },
            "2": {
                "id": 2,
                "money_obtain": 660,
                "exp_obtain": 120
            },
            "3": {
                "id": 3,
                "money_obtain": 770,
                "exp_obtain": 140
            },
            "4": {
                "id": 4,
                "money_obtain": 880,
                "exp_obtain": 160
            },
            "5": {
                "id": 5,
                "money_obtain": 990,
                "exp_obtain": 180
            },
            "6": {
                "id": 6,
                "money_obtain": 1100,
                "exp_obtain": 200
            },
            "7": {
                "id": 7,
                "money_obtain": 1210,
                "exp_obtain": 220
            },
            "8": {
                "id": 8,
                "money_obtain": 1320,
                "exp_obtain": 240
            },
            "9": {
                "id": 9,
                "money_obtain": 1430,
                "exp_obtain": 260
            },
            "10": {
                "id": 10,
                "money_obtain": 1540,
                "exp_obtain": 280
            },
            "11": {
                "id": 11,
                "money_obtain": 1650,
                "exp_obtain": 300
            },
            "12": {
                "id": 12,
                "money_obtain": 1760,
                "exp_obtain": 320
            },
            "13": {
                "id": 13,
                "money_obtain": 1870,
                "exp_obtain": 340
            },
            "14": {
                "id": 14,
                "money_obtain": 1980,
                "exp_obtain": 360
            },
            "15": {
                "id": 15,
                "money_obtain": 2090,
                "exp_obtain": 380
            },
            "16": {
                "id": 16,
                "money_obtain": 2200,
                "exp_obtain": 400
            },
            "17": {
                "id": 17,
                "money_obtain": 2310,
                "exp_obtain": 420
            },
            "18": {
                "id": 18,
                "money_obtain": 2420,
                "exp_obtain": 440
            },
            "19": {
                "id": 19,
                "money_obtain": 2530,
                "exp_obtain": 460
            },
            "20": {
                "id": 20,
                "money_obtain": 2640,
                "exp_obtain": 480
            },
            "21": {
                "id": 21,
                "money_obtain": 2750,
                "exp_obtain": 500
            },
            "22": {
                "id": 22,
                "money_obtain": 2860,
                "exp_obtain": 520
            },
            "23": {
                "id": 23,
                "money_obtain": 2970,
                "exp_obtain": 540
            },
            "24": {
                "id": 24,
                "money_obtain": 3080,
                "exp_obtain": 560
            },
            "25": {
                "id": 25,
                "money_obtain": 3190,
                "exp_obtain": 580
            },
            "26": {
                "id": 26,
                "money_obtain": 3300,
                "exp_obtain": 600
            },
            "27": {
                "id": 27,
                "money_obtain": 3410,
                "exp_obtain": 620
            },
            "28": {
                "id": 28,
                "money_obtain": 3520,
                "exp_obtain": 640
            },
            "29": {
                "id": 29,
                "money_obtain": 3630,
                "exp_obtain": 660
            },
            "30": {
                "id": 30,
                "money_obtain": 3740,
                "exp_obtain": 680
            },
            "31": {
                "id": 31,
                "money_obtain": 3850,
                "exp_obtain": 700
            },
            "32": {
                "id": 32,
                "money_obtain": 3960,
                "exp_obtain": 720
            },
            "33": {
                "id": 33,
                "money_obtain": 4070,
                "exp_obtain": 740
            },
            "34": {
                "id": 34,
                "money_obtain": 4180,
                "exp_obtain": 760
            },
            "35": {
                "id": 35,
                "money_obtain": 4290,
                "exp_obtain": 780
            },
            "36": {
                "id": 36,
                "money_obtain": 4400,
                "exp_obtain": 800
            },
            "37": {
                "id": 37,
                "money_obtain": 4510,
                "exp_obtain": 820
            },
            "38": {
                "id": 38,
                "money_obtain": 4620,
                "exp_obtain": 840
            },
            "39": {
                "id": 39,
                "money_obtain": 4730,
                "exp_obtain": 860
            },
            "40": {
                "id": 40,
                "money_obtain": 4840,
                "exp_obtain": 880
            },
            "41": {
                "id": 41,
                "money_obtain": 4950,
                "exp_obtain": 900
            },
            "42": {
                "id": 42,
                "money_obtain": 5060,
                "exp_obtain": 920
            },
            "43": {
                "id": 43,
                "money_obtain": 5170,
                "exp_obtain": 940
            },
            "44": {
                "id": 44,
                "money_obtain": 5280,
                "exp_obtain": 960
            },
            "45": {
                "id": 45,
                "money_obtain": 5390,
                "exp_obtain": 980
            },
            "46": {
                "id": 46,
                "money_obtain": 5500,
                "exp_obtain": 1000
            },
            "47": {
                "id": 47,
                "money_obtain": 5610,
                "exp_obtain": 1020
            },
            "48": {
                "id": 48,
                "money_obtain": 5720,
                "exp_obtain": 1040
            },
            "49": {
                "id": 49,
                "money_obtain": 5830,
                "exp_obtain": 1060
            },
            "50": {
                "id": 50,
                "money_obtain": 5940,
                "exp_obtain": 1080
            }
        }
    },
    "chapter": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "chapter": "鬼门关"
            },
            "2": {
                "id": 2,
                "chapter": "炼狱谷"
            },
            "3": {
                "id": 3,
                "chapter": "噬心峰"
            },
            "4": {
                "id": 4,
                "chapter": "绝情池"
            },
            "5": {
                "id": 5,
                "chapter": "哭丧岩"
            },
            "6": {
                "id": 6,
                "chapter": "杏花村"
            },
            "7": {
                "id": 7,
                "chapter": "窦娥冢"
            },
            "8": {
                "id": 8,
                "chapter": "柳风堂"
            },
            "9": {
                "id": 9,
                "chapter": "陶然居"
            },
            "10": {
                "id": 10,
                "chapter": "忘情河"
            },
            "11": {
                "id": 11,
                "chapter": "南天门"
            },
            "12": {
                "id": 12,
                "chapter": "凌霄殿"
            },
            "13": {
                "id": 13,
                "chapter": "冷月宫"
            },
            "14": {
                "id": 14,
                "chapter": "蟠桃园"
            },
            "15": {
                "id": 15,
                "chapter": "王母峰"
            },
            "16": {
                "id": 16,
                "chapter": "流沙河"
            },
            "17": {
                "id": 17,
                "chapter": "五指山"
            },
            "18": {
                "id": 18,
                "chapter": "女儿国"
            },
            "19": {
                "id": 19,
                "chapter": "曲女城"
            },
            "20": {
                "id": 20,
                "chapter": "天竺寺"
            },
            "21": {
                "id": 21,
                "chapter": "圣女峰"
            },
            "22": {
                "id": 22,
                "chapter": "空灵泉"
            },
            "23": {
                "id": 23,
                "chapter": "莲花池"
            },
            "24": {
                "id": 24,
                "chapter": "极乐界"
            },
            "25": {
                "id": 25,
                "chapter": "苦难谷"
            },
            "26": {
                "id": 26,
                "chapter": "盘丝洞"
            },
            "27": {
                "id": 27,
                "chapter": "斗战堂"
            },
            "28": {
                "id": 28,
                "chapter": "圣佛村"
            },
            "29": {
                "id": 29,
                "chapter": "紫霞谷"
            },
            "30": {
                "id": 30,
                "chapter": "思念池"
            },
            "31": {
                "id": 31,
                "chapter": "五华山"
            },
            "32": {
                "id": 32,
                "chapter": "尘缘地"
            },
            "33": {
                "id": 33,
                "chapter": "了然原"
            },
            "34": {
                "id": 34,
                "chapter": "那烂陀"
            },
            "35": {
                "id": 35,
                "chapter": "生死场"
            },
            "36": {
                "id": 36,
                "chapter": "龙须地"
            },
            "37": {
                "id": 37,
                "chapter": "南华峰"
            },
            "38": {
                "id": 38,
                "chapter": "黑虎山"
            },
            "39": {
                "id": 39,
                "chapter": "妖风洞"
            },
            "40": {
                "id": 40,
                "chapter": "大乘愚"
            },
            "41": {
                "id": 41,
                "chapter": "普陀寺"
            },
            "42": {
                "id": 42,
                "chapter": "三界门"
            },
            "43": {
                "id": 43,
                "chapter": "七尘斋"
            },
            "44": {
                "id": 44,
                "chapter": "众生琅"
            },
            "45": {
                "id": 45,
                "chapter": "万年羲"
            },
            "46": {
                "id": 46,
                "chapter": "玲珑痷"
            },
            "47": {
                "id": 47,
                "chapter": "相生殿"
            },
            "48": {
                "id": 48,
                "chapter": "罗汉堂"
            },
            "49": {
                "id": 49,
                "chapter": "七仙居"
            },
            "50": {
                "id": 50,
                "chapter": "封神山"
            }
        }
    },
    "chapter_title": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "name": "苦寒地狱"
            },
            "2": {
                "id": 2,
                "name": "凄凉人间"
            },
            "3": {
                "id": 3,
                "name": "南天之门"
            },
            "4": {
                "id": 4,
                "name": "西天取经"
            },
            "5": {
                "id": 5,
                "name": "莲花加持"
            },
            "6": {
                "id": 6,
                "name": "千年之修"
            },
            "7": {
                "id": 7,
                "name": "斩妖除魔"
            },
            "8": {
                "id": 8,
                "name": "降龙伏虎"
            },
            "9": {
                "id": 9,
                "name": "普度众生"
            },
            "10": {
                "id": 10,
                "name": "尊者之身"
            }
        }
    },
    "task": {
        "colComment": {
            "chapter_id": {
                "table": "大章表",
                "key_index": "chapter",
                "value_index": "id",
                "withPound": false
            }
        },
        "rows": {
            "1": {
                "id": 1,
                "chapter_id": "鬼门关",
                "section_id": 1,
                "section_name": "鬼门关",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "一声长叹，后裔的心中充满了愤懑。自从嫦娥撇下他独自奔月之后，他一直都买不起套像样的房，现在依旧住茅屋，而且还是小产权。"
            },
            "2": {
                "id": 2,
                "chapter_id": "鬼门关",
                "section_id": 2,
                "section_name": "鬼门关",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "嚓，嚓，嚓……吴刚劈砍桂树的声音有节奏的穿过宫墙，敲打着嫦娥寂寞的心房。她忍不住的问自己：这样的坚持是否还有意义？"
            },
            "3": {
                "id": 3,
                "chapter_id": "鬼门关",
                "section_id": 3,
                "section_name": "鬼门关",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "作为后裔的兄弟，我不能做那种事情，绝对不能！吴刚望着面前的篝火，平静的从烤架上撕下了一条兔腿。"
            },
            "4": {
                "id": 4,
                "chapter_id": "鬼门关",
                "section_id": 4,
                "section_name": "鬼门关",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "八戒问沙僧，二师兄，大师兄为什么对女人一点兴趣都没有呢？二师兄你告诉我嘛。沙僧瞪了八戒一眼说，早压断了。"
            },
            "5": {
                "id": 5,
                "chapter_id": "鬼门关",
                "section_id": 5,
                "section_name": "鬼门关",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "没有人知道，当年女娲娘娘补天所用的最后一块石头，其实并不是石头，而是她自己的心。"
            },
            "6": {
                "id": 6,
                "chapter_id": "鬼门关",
                "section_id": 6,
                "section_name": "鬼门关",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "每次当何仙姑和吕洞宾在一起遨游的时候，没有人知道铁拐李与张果老的痛。"
            },
            "7": {
                "id": 7,
                "chapter_id": "鬼门关",
                "section_id": 7,
                "section_name": "鬼门关",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "其实天上的神仙和人间百姓一样，都需要买房，买不起的那就租，租不起的那就睡南天门去。"
            },
            "8": {
                "id": 8,
                "chapter_id": "鬼门关",
                "section_id": 8,
                "section_name": "鬼门关",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "自从月老发现人间开始流行一对多或多对一或多对多这种男女关系之后，他不知道自己该如何搭线了，最近他在考虑退休的事。"
            },
            "9": {
                "id": 9,
                "chapter_id": "鬼门关",
                "section_id": 9,
                "section_name": "鬼门关",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "跟随牛郎多年的那头牛，是头公牛，不过可以产奶。"
            },
            "10": {
                "id": 10,
                "chapter_id": "鬼门关",
                "section_id": 10,
                "section_name": "鬼门关",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "织女其实并不恨王母，她总觉得两人在一起呢，容易事儿多，时间长了会影响夫妻感情，所以还是保持一定距离比较好。"
            },
            "11": {
                "id": 11,
                "chapter_id": "炼狱谷",
                "section_id": 11,
                "section_name": "炼狱谷",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "最近水质污染比较严重，几个龙王总觉得这样下去龙体迟早会烂掉。所以他们打算申请集体搬到天上的银河去。"
            },
            "12": {
                "id": 12,
                "chapter_id": "炼狱谷",
                "section_id": 12,
                "section_name": "炼狱谷",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "很多神仙都劝二郎神说现在世道变了，神仙也流行找小三了，你也找一个吧。二郎神淡淡一笑说不必了，我有哮天犬了。"
            },
            "13": {
                "id": 13,
                "chapter_id": "炼狱谷",
                "section_id": 13,
                "section_name": "炼狱谷",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "很多人都痛恨妲己。其实，她不过是找了一个有权有势的高官，仅此而已。怎么，难道你们竟然会觉得这种情况不正常么。"
            },
            "14": {
                "id": 14,
                "chapter_id": "炼狱谷",
                "section_id": 14,
                "section_name": "炼狱谷",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "在哮天犬的眼里，每个神仙都是一条母狗，除了二郎神。"
            },
            "15": {
                "id": 15,
                "chapter_id": "炼狱谷",
                "section_id": 15,
                "section_name": "炼狱谷",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "悟空当前取经功德圆满之后，他就返回了花果山，和沙僧一起合伙开了一家绿色天然饮品店，生意一直很好。"
            },
            "16": {
                "id": 16,
                "chapter_id": "炼狱谷",
                "section_id": 16,
                "section_name": "炼狱谷",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "玉帝其实是一个非常豪迈的帝，每当晚上睡不着的时候，他总会约上如来和菩萨，来到嫦娥住的地方，几个人花前月下，引吭高歌。"
            },
            "17": {
                "id": 17,
                "chapter_id": "炼狱谷",
                "section_id": 17,
                "section_name": "炼狱谷",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "仙界每年都会举行一次峰会，讨论关于修仙之道相关事宜。会议由西天如来发起，耶稣如果有空的话，他也会来参加的。"
            },
            "18": {
                "id": 18,
                "chapter_id": "炼狱谷",
                "section_id": 18,
                "section_name": "炼狱谷",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "雷震子的翅膀其实是可以拔下来的。"
            },
            "19": {
                "id": 19,
                "chapter_id": "炼狱谷",
                "section_id": 19,
                "section_name": "炼狱谷",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "土行孙的土遁术后来被玉帝一道禁令收回去了，因为他总喜欢半夜到处乱遁。"
            },
            "20": {
                "id": 20,
                "chapter_id": "炼狱谷",
                "section_id": 20,
                "section_name": "炼狱谷",
                "points": 5,
                "power_consume": 5,
                "exp_obtain": 5,
                "coins_obtain": 50,
                "description": "黑白无常其实是阎王的私生子，他们是一对双胞胎。"
            },
            "21": {
                "id": 21,
                "chapter_id": "噬心峰",
                "section_id": 21,
                "section_name": "噬心峰",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "真正的地狱其实不是十八层，而是上下两层，复式的。"
            },
            "22": {
                "id": 22,
                "chapter_id": "噬心峰",
                "section_id": 22,
                "section_name": "噬心峰",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "花果山常年供奉着一颗晶龙珠，那是紫霞仙子的一滴眼泪。"
            },
            "23": {
                "id": 23,
                "chapter_id": "噬心峰",
                "section_id": 23,
                "section_name": "噬心峰",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "猪八戒的真神不是猪，是驴。"
            },
            "24": {
                "id": 24,
                "chapter_id": "噬心峰",
                "section_id": 24,
                "section_name": "噬心峰",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "西天取经，每一次遇到妖怪，悟空都忍不住的想要呐喊，如来，我就XXX了，你能不要这样一次一只怪一次一只怪的折磨我么。"
            },
            "25": {
                "id": 25,
                "chapter_id": "噬心峰",
                "section_id": 25,
                "section_name": "噬心峰",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "流沙河盛产金沙，质地优良，晶莹剔透。据说这是由昔日唐僧师徒四人取经途中留下来的大便风干而成。"
            },
            "26": {
                "id": 26,
                "chapter_id": "噬心峰",
                "section_id": 26,
                "section_name": "噬心峰",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "七夕没有鹊，更没有桥，连个船都没有，牛郎都是游过去的。因为很远，所以基本上到那边打个招呼基本上就得往回游了。"
            },
            "27": {
                "id": 27,
                "chapter_id": "噬心峰",
                "section_id": 27,
                "section_name": "噬心峰",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "作为仙界唯一的无头勇士，唯一与黄帝单挑过的纯爷们真汉子，一个永不止息的真正的战神，他是凡人心中真正的守护神。"
            },
            "28": {
                "id": 28,
                "chapter_id": "噬心峰",
                "section_id": 28,
                "section_name": "噬心峰",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "红孩儿其实不是个小孩，按年龄来看，他比牛魔王大个三岁左右。他之所以长成那样是因为他就是那个样子。"
            },
            "29": {
                "id": 29,
                "chapter_id": "噬心峰",
                "section_id": 29,
                "section_name": "噬心峰",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "铁扇公主的那把扇子其实并没有藏到嘴里，而是藏到女人最深的那个地方，这是牛魔王亲口说的。"
            },
            "30": {
                "id": 30,
                "chapter_id": "噬心峰",
                "section_id": 30,
                "section_name": "噬心峰",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "十八罗汉中，有一名女罗汉。"
            },
            "31": {
                "id": 31,
                "chapter_id": "绝情池",
                "section_id": 31,
                "section_name": "绝情池",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "土地公是仙界最富裕的神仙，他掌管着整个仙界的土地审批大权。在地价疯长的这年头，有了地，你就有了幸福。"
            },
            "32": {
                "id": 32,
                "chapter_id": "绝情池",
                "section_id": 32,
                "section_name": "绝情池",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "哮天犬原本是有生育能力的，后来跟着二郎神参与沉香劈山救母这件事的时候，被沉香一斧头劈掉了狗蛋，从此变为一只阉狗。"
            },
            "33": {
                "id": 33,
                "chapter_id": "绝情池",
                "section_id": 33,
                "section_name": "绝情池",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "昔日取经路过女儿国，三藏和女儿国的女王其实种下了幸福的果子。瓜熟落地之后，发现是个男孩，女王为之取名唐伯虎。"
            },
            "34": {
                "id": 34,
                "chapter_id": "绝情池",
                "section_id": 34,
                "section_name": "绝情池",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "凌霄大殿主体建筑主要是大理石，它的地板则以花岗岩为主。卧室则铺以通体的瓷砖，主要是玉帝喜欢亮亮的那种感觉。"
            },
            "35": {
                "id": 35,
                "chapter_id": "绝情池",
                "section_id": 35,
                "section_name": "绝情池",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "常年守在南天门附近的两个天兵，一个叫阳骏，一个叫刘胜，他们的感情极深。"
            },
            "36": {
                "id": 36,
                "chapter_id": "绝情池",
                "section_id": 36,
                "section_name": "绝情池",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "其实天上的神仙大多都羡慕人间生活。因为在天上就算有权也没有太多可发挥的空间，而在人间，那就完全不一样了。"
            },
            "37": {
                "id": 37,
                "chapter_id": "绝情池",
                "section_id": 37,
                "section_name": "绝情池",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "很多神仙都想把哮天犬煮了吃，甚至包括玉帝，不过每次看到二郎神与哮天犬在一起的那种感觉，他们又没有胃口了，不敢吃。"
            },
            "38": {
                "id": 38,
                "chapter_id": "绝情池",
                "section_id": 38,
                "section_name": "绝情池",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "铁拐李其实并不是拐子，他这么搞，主要是为了追求一个造型。说白了，主要就是给何仙姑看的。"
            },
            "39": {
                "id": 39,
                "chapter_id": "绝情池",
                "section_id": 39,
                "section_name": "绝情池",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "张果老之所以总是倒骑着驴，是因为那驴的眼睛长在屁股上。"
            },
            "40": {
                "id": 40,
                "chapter_id": "绝情池",
                "section_id": 40,
                "section_name": "绝情池",
                "points": 6,
                "power_consume": 5,
                "exp_obtain": 12,
                "coins_obtain": 60,
                "description": "其实许多神仙都对嫦娥有想法，但极少有人敢去尝试，据说是因为嫦娥的玉兔特别狠，只要看到棍状物，啊呜一口就咬掉了。"
            },
            "41": {
                "id": 41,
                "chapter_id": "哭丧岩",
                "section_id": 41,
                "section_name": "哭丧岩",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "巨灵神以体型巨大儿闻名仙界，大家送了他一个友善的绰号，奥特曼。"
            },
            "42": {
                "id": 42,
                "chapter_id": "哭丧岩",
                "section_id": 42,
                "section_name": "哭丧岩",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "盘古当年开天辟地的时候，他用了三年六个月十五天八小时二十五分三十六秒。我们可以想象，盘古爷劈的有多么辛苦。"
            },
            "43": {
                "id": 43,
                "chapter_id": "哭丧岩",
                "section_id": 43,
                "section_name": "哭丧岩",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "白素贞变形为白蛇的时候，许多人都说大概有十多米长。但真正长度其实是八百六十七米，法海整整量了两天两夜。"
            },
            "44": {
                "id": 44,
                "chapter_id": "哭丧岩",
                "section_id": 44,
                "section_name": "哭丧岩",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "相对于白蛇的这个长度，小青就短了很多，她只有不到一米。不过这个法海倒是没有量过。"
            },
            "45": {
                "id": 45,
                "chapter_id": "哭丧岩",
                "section_id": 45,
                "section_name": "哭丧岩",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "其实白素贞被压在雷锋塔下的日子并没有那么糟糕，每周法海都会找个时间叫上许仙和小青，四个人在塔顶热闹那么一回。"
            },
            "46": {
                "id": 46,
                "chapter_id": "哭丧岩",
                "section_id": 46,
                "section_name": "哭丧岩",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "混沌之初，女娲娘娘造人的时候，她其实捏了两个男泥人，一个女泥人。这也是当今许多男子娶不到媳妇的根本原因。"
            },
            "47": {
                "id": 47,
                "chapter_id": "哭丧岩",
                "section_id": 47,
                "section_name": "哭丧岩",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "当下众多的求子峰，其实是当年盘古爷掉落在凡间的斧柄碎片。男人们都希望能够祈得盘古爷那怕一丝丝的雄风，让老婆满意以及满足。"
            },
            "48": {
                "id": 48,
                "chapter_id": "哭丧岩",
                "section_id": 48,
                "section_name": "哭丧岩",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "金箍棒最早是大禹手中的武器，是昔日大禹治水横扫妖魔鬼怪的利器。只是后来不知怎么的居然到了大圣的手中。"
            },
            "49": {
                "id": 49,
                "chapter_id": "哭丧岩",
                "section_id": 49,
                "section_name": "哭丧岩",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "嫦娥思念后裔，但更多的是忍不住的经常想起天蓬元帅来，想着想着就忍不住会浑身发烫。她不知道是为什么。"
            },
            "50": {
                "id": 50,
                "chapter_id": "哭丧岩",
                "section_id": 50,
                "section_name": "哭丧岩",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "当八戒结束取经回到高老庄的时候，他悲哀的发现高老庄在未经他同意的情况下，已经被强行拆除。"
            },
            "51": {
                "id": 51,
                "chapter_id": "杏花村",
                "section_id": 51,
                "section_name": "杏花村",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "沙僧结束取经之后，他惊讶的发现，他秃了了数百年的脑袋，又重新长出了乌黑粗硬卷曲的毛发来。"
            },
            "52": {
                "id": 52,
                "chapter_id": "杏花村",
                "section_id": 52,
                "section_name": "杏花村",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "玉帝和王母其实在结婚后第二天就离婚了，这是仙界一个公开的秘密。"
            },
            "53": {
                "id": 53,
                "chapter_id": "杏花村",
                "section_id": 53,
                "section_name": "杏花村",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "大部分时间里，其实太上老君不是在炼丹，而是在烤地瓜。对于人间这一美味，老君非常喜欢。"
            },
            "54": {
                "id": 54,
                "chapter_id": "杏花村",
                "section_id": 54,
                "section_name": "杏花村",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "八仙从来就没有过海的行为，事实上他们几乎都没有到过海边。因为他们把个人中，有七个人先天性怕水，看到水波就头晕恶心。"
            },
            "55": {
                "id": 55,
                "chapter_id": "杏花村",
                "section_id": 55,
                "section_name": "杏花村",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "神仙从来不吃早餐，也不吃午餐，也不吃晚餐，不过他们吃宵夜。"
            },
            "56": {
                "id": 56,
                "chapter_id": "杏花村",
                "section_id": 56,
                "section_name": "杏花村",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "观音菩萨的那个圣水瓶，产地源于人间，具体地址是景德镇。"
            },
            "57": {
                "id": 57,
                "chapter_id": "杏花村",
                "section_id": 57,
                "section_name": "杏花村",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "仙界中第二号人物，其实是太白金星，这个专门传布玉帝命令的老头。这老头是个正派人。"
            },
            "58": {
                "id": 58,
                "chapter_id": "杏花村",
                "section_id": 58,
                "section_name": "杏花村",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "菩提老祖的元神并不是葡萄。那只是星爷电影中的一个桥段。"
            },
            "59": {
                "id": 59,
                "chapter_id": "杏花村",
                "section_id": 59,
                "section_name": "杏花村",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "夸父当年为何一定要去追日，累死累活的最后还是没有追上。玉帝曾召集众仙讨论过这个问题，最后结果是不知道。"
            },
            "60": {
                "id": 60,
                "chapter_id": "杏花村",
                "section_id": 60,
                "section_name": "杏花村",
                "points": 7,
                "power_consume": 5,
                "exp_obtain": 21,
                "coins_obtain": 70,
                "description": "终年跟随着南极仙翁的那只仙鹤，最开始是母的，后来变成了公的，再后来又变成了母的，据说这是跟着仙翁的阶段性喜好来变的。"
            },
            "61": {
                "id": 61,
                "chapter_id": "窦娥冢",
                "section_id": 61,
                "section_name": "窦娥冢",
                "points": 8,
                "power_consume": 5,
                "exp_obtain": 32,
                "coins_obtain": 80,
                "description": "天庭也需要供电的，也需要照明的，但因为电母的电压最近一直不稳，所以老跳闸。这让玉帝一直很不爽。"
            },
            "62": {
                "id": 62,
                "chapter_id": "窦娥冢",
                "section_id": 62,
                "section_name": "窦娥冢",
                "points": 8,
                "power_consume": 5,
                "exp_obtain": 32,
                "coins_obtain": 80,
                "description": "雷公是个好男人，电母脾气很暴，动不动就用电锥子扎他，但任凭电母怎么扎，扎的多用力，雷公哼都不哼一声。"
            },
            "63": {
                "id": 63,
                "chapter_id": "窦娥冢",
                "section_id": 63,
                "section_name": "窦娥冢",
                "points": 8,
                "power_consume": 5,
                "exp_obtain": 32,
                "coins_obtain": 80,
                "description": "人参果其实并不是果实，严格来说它也是神仙。但毫无疑问，它可以算作天庭最惨的仙了，因为它生来就是被吃的。"
            },
            "64": {
                "id": 64,
                "chapter_id": "窦娥冢",
                "section_id": 64,
                "section_name": "窦娥冢",
                "points": 8,
                "power_consume": 5,
                "exp_obtain": 32,
                "coins_obtain": 80,
                "description": "七仙女作为天庭最为耀眼的璀璨舞者，她们很寂寞，她们一直渴望能够有自己的另一半。但是，唉……说什么好呢？"
            },
            "65": {
                "id": 65,
                "chapter_id": "窦娥冢",
                "section_id": 65,
                "section_name": "窦娥冢",
                "points": 8,
                "power_consume": 5,
                "exp_obtain": 32,
                "coins_obtain": 80,
                "description": "据野史记载，刘彦昌在三圣母被压到华山下之后，到处找女人睡觉。所以，我认为，三圣母在感情这件事上，严重看走了眼。"
            },
            "66": {
                "id": 66,
                "chapter_id": "窦娥冢",
                "section_id": 66,
                "section_name": "窦娥冢",
                "points": 8,
                "power_consume": 5,
                "exp_obtain": 32,
                "coins_obtain": 80,
                "description": "宝莲灯之所以有无穷的威力，是因为灯芯是如来门下弟子青霞仙子的化身。说到这里，我又不禁的想起了紫霞，想起了至尊宝，唉……"
            },
            "67": {
                "id": 67,
                "chapter_id": "窦娥冢",
                "section_id": 67,
                "section_name": "窦娥冢",
                "points": 8,
                "power_consume": 5,
                "exp_obtain": 32,
                "coins_obtain": 80,
                "description": "仙史记载，狐狸精其实是托塔李天王的情人。从实际情况来看，这应该是真的。"
            },
            "68": {
                "id": 68,
                "chapter_id": "窦娥冢",
                "section_id": 68,
                "section_name": "窦娥冢",
                "points": 8,
                "power_consume": 5,
                "exp_obtain": 32,
                "coins_obtain": 80,
                "description": "仙史记载，悟空上任弼马温这一段时间内，天庭总共失去了九万八千六百七十二匹天马，最后仅剩下了两匹马驹子。骇人听闻。"
            },
            "69": {
                "id": 69,
                "chapter_id": "窦娥冢",
                "section_id": 69,
                "section_name": "窦娥冢",
                "points": 8,
                "power_consume": 5,
                "exp_obtain": 32,
                "coins_obtain": 80,
                "description": "阎罗王最大的癖好，就是吃刚刚来到阴间的灵魂，尤其是青壮年男女的灵魂，一大半都被他吃掉了。天上地下，这家伙大概是最狠的了。"
            },
            "70": {
                "id": 70,
                "chapter_id": "窦娥冢",
                "section_id": 70,
                "section_name": "窦娥冢",
                "points": 8,
                "power_consume": 5,
                "exp_obtain": 32,
                "coins_obtain": 80,
                "description": "作为阎王身边的得力鬼将，牛头继承了阎王喜吃的特性，他喜欢吃和牛相关的任何东西，牛筋，牛皮，牛毛，牛鞭，牛粪，等等。"
            },
            "71": {
                "id": 71,
                "chapter_id": "柳风堂",
                "section_id": 71,
                "section_name": "柳风堂",
                "points": 10,
                "power_consume": 5,
                "exp_obtain": 50,
                "coins_obtain": 100,
                "description": "作为阎王身边的得力鬼将，马面并没有继承阎王喜吃的特性，但却创立了另外一种个性，他喜欢被人骑。"
            },
            "72": {
                "id": 72,
                "chapter_id": "柳风堂",
                "section_id": 72,
                "section_name": "柳风堂",
                "points": 10,
                "power_consume": 5,
                "exp_obtain": 50,
                "coins_obtain": 100,
                "description": "从鬼门关距离阎罗殿，大概是十公里的距离。打车的话也就是个起步价。"
            },
            "73": {
                "id": 73,
                "chapter_id": "柳风堂",
                "section_id": 73,
                "section_name": "柳风堂",
                "points": 10,
                "power_consume": 5,
                "exp_obtain": 50,
                "coins_obtain": 100,
                "description": "很多人都以为南天门下去就是人间，其实不然。南天门和鬼门关是直通的。"
            },
            "74": {
                "id": 74,
                "chapter_id": "柳风堂",
                "section_id": 74,
                "section_name": "柳风堂",
                "points": 10,
                "power_consume": 5,
                "exp_obtain": 50,
                "coins_obtain": 100,
                "description": "关于人间百姓生活房价过高的这个问题，玉帝和众仙有过专门的讨论，大家最后一致认为，它会稳定的越来越高。"
            },
            "75": {
                "id": 75,
                "chapter_id": "柳风堂",
                "section_id": 75,
                "section_name": "柳风堂",
                "points": 10,
                "power_consume": 5,
                "exp_obtain": 50,
                "coins_obtain": 100,
                "description": "姜子牙现在基本不怎么垂钓了，他现在改用渔网了。"
            },
            "76": {
                "id": 76,
                "chapter_id": "柳风堂",
                "section_id": 76,
                "section_name": "柳风堂",
                "points": 10,
                "power_consume": 5,
                "exp_obtain": 50,
                "coins_obtain": 100,
                "description": "很多人可能不知道，吕洞宾有一个很著名的徒孙，叫王重阳，他获得过首届华山论剑的冠军。"
            },
            "77": {
                "id": 77,
                "chapter_id": "柳风堂",
                "section_id": 77,
                "section_name": "柳风堂",
                "points": 10,
                "power_consume": 5,
                "exp_obtain": 50,
                "coins_obtain": 100,
                "description": "作为游走于天上和地下的降龙尊者，济公羡煞了众神仙。主要是因为他到地面吃喝嫖赌啥都可以干，而且玉帝还不怪他，爽爆了。"
            },
            "78": {
                "id": 78,
                "chapter_id": "柳风堂",
                "section_id": 78,
                "section_name": "柳风堂",
                "points": 10,
                "power_consume": 5,
                "exp_obtain": 50,
                "coins_obtain": 100,
                "description": "冷面判官作为地狱的行刑官，他无论在鬼界还是仙界都是一个风云人物，主要是因为他长的非常俊秀，有点像那个谁，对，陈冠希。"
            },
            "79": {
                "id": 79,
                "chapter_id": "柳风堂",
                "section_id": 79,
                "section_name": "柳风堂",
                "points": 10,
                "power_consume": 5,
                "exp_obtain": 50,
                "coins_obtain": 100,
                "description": "三藏西天取经遇到了很多妖怪，但唯一一个并不是真正想吃他的只有狐狸精，因为狐狸姐姐相信真爱，渴望真爱，拥抱真爱。"
            },
            "80": {
                "id": 80,
                "chapter_id": "柳风堂",
                "section_id": 80,
                "section_name": "柳风堂",
                "points": 10,
                "power_consume": 5,
                "exp_obtain": 50,
                "coins_obtain": 100,
                "description": "十八罗汉中，最猛的是沉思罗汉，因为他永远都在闭目沉思，从没睁开过眼睛。甚至连如来都在怀疑他究竟是在修行还是睡觉。"
            },
            "81": {
                "id": 81,
                "chapter_id": "陶然居",
                "section_id": 81,
                "section_name": "陶然居",
                "points": 12,
                "power_consume": 5,
                "exp_obtain": 60,
                "coins_obtain": 120,
                "description": "千里眼作为神仙中看的最远的大仙，他一直都觉得很累，也一直觉得有些尴尬，他觉得他看到的有些太多了。"
            },
            "82": {
                "id": 82,
                "chapter_id": "陶然居",
                "section_id": 82,
                "section_name": "陶然居",
                "points": 12,
                "power_consume": 5,
                "exp_obtain": 60,
                "coins_obtain": 120,
                "description": "最近嫦娥发现广寒宫的玉兔日益减少，与此同时，她发现吴刚的嘴巴上总是沾着一些兔毛……"
            },
            "83": {
                "id": 83,
                "chapter_id": "陶然居",
                "section_id": 83,
                "section_name": "陶然居",
                "points": 12,
                "power_consume": 5,
                "exp_obtain": 60,
                "coins_obtain": 120,
                "description": "每个进入鬼门关的灵魂，都要喝下孟婆的孟婆汤，这样他才能彻底忘记人间的一切，彻底了断人间的恩爱情仇，心平气和的到地狱去死。"
            },
            "84": {
                "id": 84,
                "chapter_id": "陶然居",
                "section_id": 84,
                "section_name": "陶然居",
                "points": 12,
                "power_consume": 5,
                "exp_obtain": 60,
                "coins_obtain": 120,
                "description": "太阳神与火神这两哥们经常会闹矛盾，主要的争执焦点就在于，谁的火更热更猛更牛逼。当然，这种愚蠢的争论是不会没有结果的。"
            },
            "85": {
                "id": 85,
                "chapter_id": "陶然居",
                "section_id": 85,
                "section_name": "陶然居",
                "points": 12,
                "power_consume": 5,
                "exp_obtain": 60,
                "coins_obtain": 120,
                "description": "没有人知道，土行孙既是惧留孙大仙的徒弟，同时也是他的私生子。当然，这个没人知道是正常的，大家都知道了，那不就出事了么。"
            },
            "86": {
                "id": 86,
                "chapter_id": "陶然居",
                "section_id": 86,
                "section_name": "陶然居",
                "points": 12,
                "power_consume": 5,
                "exp_obtain": 60,
                "coins_obtain": 120,
                "description": "神仙虽然长生不老，但也是有年龄大小的，根据玉帝统计，仙界岁数最大的不是老寿星南极仙翁，而是守蟠桃园的那个神仙婆婆。"
            },
            "87": {
                "id": 87,
                "chapter_id": "陶然居",
                "section_id": 87,
                "section_name": "陶然居",
                "points": 12,
                "power_consume": 5,
                "exp_obtain": 60,
                "coins_obtain": 120,
                "description": "众仙一致认为每次宴席吃的最多的就是二郎神了，因为他带着哮天犬。这只狗的饭量毫无疑问是逆天的。"
            },
            "88": {
                "id": 88,
                "chapter_id": "陶然居",
                "section_id": 88,
                "section_name": "陶然居",
                "points": 12,
                "power_consume": 5,
                "exp_obtain": 60,
                "coins_obtain": 120,
                "description": "哮天犬不像普通狗一样，到处撒尿留记号。因为它的下体已经被沉香一斧劈坏了，所以它彻底丧失了这个功能。"
            },
            "89": {
                "id": 89,
                "chapter_id": "陶然居",
                "section_id": 89,
                "section_name": "陶然居",
                "points": 12,
                "power_consume": 5,
                "exp_obtain": 60,
                "coins_obtain": 120,
                "description": "悟空有七十二般变化，如来比他多十倍。但如来却很羡慕悟空，因为悟空可以随便变，而他却不能。"
            },
            "90": {
                "id": 90,
                "chapter_id": "陶然居",
                "section_id": 90,
                "section_name": "陶然居",
                "points": 12,
                "power_consume": 5,
                "exp_obtain": 60,
                "coins_obtain": 120,
                "description": "观音菩萨圣水瓶里的水其实很新鲜，菩萨每天早晨起床后都会换上新鲜的自来水，所以是可以喝的。"
            },
            "91": {
                "id": 91,
                "chapter_id": "忘情河",
                "section_id": 91,
                "section_name": "忘情河",
                "points": 14,
                "power_consume": 5,
                "exp_obtain": 70,
                "coins_obtain": 140,
                "description": "最近十八罗汉中的长腿罗汉被辞退了。他在本届神仙田径大赛中用力过猛，造成小腿粉碎性骨折，所以不可能再随意变长了。"
            },
            "92": {
                "id": 92,
                "chapter_id": "忘情河",
                "section_id": 92,
                "section_name": "忘情河",
                "points": 14,
                "power_consume": 5,
                "exp_obtain": 70,
                "coins_obtain": 140,
                "description": "如来最近招了一名新罗汉，叫高音罗汉。他的特点是声音高，可直通九霄云外天地三界。如来觉得他很牛逼。"
            },
            "93": {
                "id": 93,
                "chapter_id": "忘情河",
                "section_id": 93,
                "section_name": "忘情河",
                "points": 14,
                "power_consume": 5,
                "exp_obtain": 70,
                "coins_obtain": 140,
                "description": "玉帝最近打算对七仙女进行扩招。他感觉人有点太少了，跳舞的时候氛围不够浓烈。他跟王母商量后，决定再找四十二个。"
            },
            "94": {
                "id": 94,
                "chapter_id": "忘情河",
                "section_id": 94,
                "section_name": "忘情河",
                "points": 14,
                "power_consume": 5,
                "exp_obtain": 70,
                "coins_obtain": 140,
                "description": "蟠桃园最近发生了一件奇怪的事情，所有的桃子都有两个核，双核的。王母一直在怀疑，这桃子难道也有什么奸情么。"
            },
            "95": {
                "id": 95,
                "chapter_id": "忘情河",
                "section_id": 95,
                "section_name": "忘情河",
                "points": 14,
                "power_consume": 5,
                "exp_obtain": 70,
                "coins_obtain": 140,
                "description": "关于至尊宝和紫霞仙子的故事，其实是有另外一个结局：他们成功的走进了婚姻的殿堂，并生有一子，取名为至尊宝宝。"
            },
            "96": {
                "id": 96,
                "chapter_id": "忘情河",
                "section_id": 96,
                "section_name": "忘情河",
                "points": 14,
                "power_consume": 5,
                "exp_obtain": 70,
                "coins_obtain": 140,
                "description": "牛魔王一直怀疑铁扇公主与至尊宝有奸情，其实那不叫奸情，那是光明正大的真爱。"
            },
            "97": {
                "id": 97,
                "chapter_id": "忘情河",
                "section_id": 97,
                "section_name": "忘情河",
                "points": 14,
                "power_consume": 5,
                "exp_obtain": 70,
                "coins_obtain": 140,
                "description": "红孩儿和东海三太子是结义兄弟，感情一直很深。当年哪吒抽三太子的龙筋时，红孩儿在旁边亲眼看着他被一根筋一根筋的抽死。"
            },
            "98": {
                "id": 98,
                "chapter_id": "忘情河",
                "section_id": 98,
                "section_name": "忘情河",
                "points": 14,
                "power_consume": 5,
                "exp_obtain": 70,
                "coins_obtain": 140,
                "description": "许多神仙对嫦娥的祖籍身世一直很感兴趣，平日私下里也聊这个话题。按照玉帝的说法，嫦娥祖籍应该是黑龙江哈尔滨。"
            },
            "99": {
                "id": 99,
                "chapter_id": "忘情河",
                "section_id": 99,
                "section_name": "忘情河",
                "points": 14,
                "power_consume": 5,
                "exp_obtain": 70,
                "coins_obtain": 140,
                "description": "赤脚大仙的脚气比较重。自从上次在凌霄殿当场将二郎神熏晕之后，玉帝就很少让他上朝了。"
            },
            "100": {
                "id": 100,
                "chapter_id": "忘情河",
                "section_id": 100,
                "section_name": "忘情河",
                "points": 14,
                "power_consume": 5,
                "exp_obtain": 70,
                "coins_obtain": 140,
                "description": "陪着三藏走西天的那匹白龙马，其实是母马，这个三藏是知道的。三藏还给她起了另外一个名字，叫阿梅。"
            },
            "101": {
                "id": 101,
                "chapter_id": "南天门",
                "section_id": 101,
                "section_name": "南天门",
                "points": 15,
                "power_consume": 5,
                "exp_obtain": 75,
                "coins_obtain": 150,
                "description": "原本牛郎织女相会，王母是给安排了鹊桥的。但是后来发现牛郎有恐高症，所以就只能把鹊桥给撤了。"
            },
            "102": {
                "id": 102,
                "chapter_id": "南天门",
                "section_id": 102,
                "section_name": "南天门",
                "points": 15,
                "power_consume": 5,
                "exp_obtain": 75,
                "coins_obtain": 150,
                "description": "神仙其实对人间文化都挺有兴趣的，比如玉帝喜欢唐诗，王母喜欢宋词，七仙女喜欢元曲，二郎神喜欢金瓶梅。"
            },
            "103": {
                "id": 103,
                "chapter_id": "南天门",
                "section_id": 103,
                "section_name": "南天门",
                "points": 15,
                "power_consume": 5,
                "exp_obtain": 75,
                "coins_obtain": 150,
                "description": "天上也会闹干旱的，没有水气，就算雷公电母再努力，那也没得下。最近银河的水位明显低了很多。"
            },
            "104": {
                "id": 104,
                "chapter_id": "南天门",
                "section_id": 104,
                "section_name": "南天门",
                "points": 15,
                "power_consume": 5,
                "exp_obtain": 75,
                "coins_obtain": 150,
                "description": "天庭其实是有集市的，和人间许多村镇一样，都是每个月的初一和十五这两天。"
            },
            "105": {
                "id": 105,
                "chapter_id": "南天门",
                "section_id": 105,
                "section_name": "南天门",
                "points": 15,
                "power_consume": 5,
                "exp_obtain": 75,
                "coins_obtain": 150,
                "description": "天庭集市卖的最好的是织女的织锦绸缎，而织锦中最受欢迎的首推纯棉底裤。因为神仙都是不穿那玩意的，再说也没见过，看着新鲜。"
            },
            "106": {
                "id": 106,
                "chapter_id": "南天门",
                "section_id": 106,
                "section_name": "南天门",
                "points": 15,
                "power_consume": 5,
                "exp_obtain": 75,
                "coins_obtain": 150,
                "description": "虾兵蟹将其实不是一个统称，而是两个小神仙的名称。他们自称是双胞胎，虽然无论从哪个角度看，虾和蟹都不可能成为兄弟。"
            },
            "107": {
                "id": 107,
                "chapter_id": "南天门",
                "section_id": 107,
                "section_name": "南天门",
                "points": 15,
                "power_consume": 5,
                "exp_obtain": 75,
                "coins_obtain": 150,
                "description": "花果山的水果是不喷农药的，所以口感非常好，味道堪比王母后院的蟠桃。"
            },
            "108": {
                "id": 108,
                "chapter_id": "南天门",
                "section_id": 108,
                "section_name": "南天门",
                "points": 15,
                "power_consume": 5,
                "exp_obtain": 75,
                "coins_obtain": 150,
                "description": "高老庄被强拆之后，八戒在另外一个地方新建了一所宅院，门匾上写着“强拆死全家”。"
            },
            "109": {
                "id": 109,
                "chapter_id": "南天门",
                "section_id": 109,
                "section_name": "南天门",
                "points": 15,
                "power_consume": 5,
                "exp_obtain": 75,
                "coins_obtain": 150,
                "description": "沙僧住的地方和八戒的新宅院离的很近。经常晚上没事的时候他们两个会凑一起喝个小酒，慨叹当年西天取经的不容易。"
            },
            "110": {
                "id": 110,
                "chapter_id": "南天门",
                "section_id": 110,
                "section_name": "南天门",
                "points": 15,
                "power_consume": 5,
                "exp_obtain": 75,
                "coins_obtain": 150,
                "description": "如果让悟空重新选择，就算在五指山下再压上五百年，他也不会跟唐僧去取经。他说，太XX的折腾人了。"
            },
            "111": {
                "id": 111,
                "chapter_id": "凌霄殿",
                "section_id": 111,
                "section_name": "凌霄殿",
                "points": 16,
                "power_consume": 5,
                "exp_obtain": 80,
                "coins_obtain": 160,
                "description": "由于终年累月的坐在蒲团上进行修行，很多神仙都坐骨增生。"
            },
            "112": {
                "id": 112,
                "chapter_id": "凌霄殿",
                "section_id": 112,
                "section_name": "凌霄殿",
                "points": 16,
                "power_consume": 5,
                "exp_obtain": 80,
                "coins_obtain": 160,
                "description": "每年仙界都会举行一次仙法大会，旨在检验各路神仙这一年来的修仙成果。上一年的冠军是，哮天犬。"
            },
            "113": {
                "id": 113,
                "chapter_id": "凌霄殿",
                "section_id": 113,
                "section_name": "凌霄殿",
                "points": 16,
                "power_consume": 5,
                "exp_obtain": 80,
                "coins_obtain": 160,
                "description": "神仙不同与凡人，都是耳聪目明之仙，有个什么动静能很快感觉到。所以后来玉帝定了一条新的天规：晚上尽量不要声音太大。"
            },
            "114": {
                "id": 114,
                "chapter_id": "凌霄殿",
                "section_id": 114,
                "section_name": "凌霄殿",
                "points": 16,
                "power_consume": 5,
                "exp_obtain": 80,
                "coins_obtain": 160,
                "description": "黑白无常最近迷上了一个很有意思的游戏，叫捉迷藏。每天晚饭后，他们都会拉上阎王他们玩上一把。"
            },
            "115": {
                "id": 115,
                "chapter_id": "凌霄殿",
                "section_id": 115,
                "section_name": "凌霄殿",
                "points": 16,
                "power_consume": 5,
                "exp_obtain": 80,
                "coins_obtain": 160,
                "description": "很多人都认为阎罗王是包拯的化身。其实阎王自己很清楚，他和包拯连毛的关系都没有，他甚至都没有听说过这个人。"
            },
            "116": {
                "id": 116,
                "chapter_id": "凌霄殿",
                "section_id": 116,
                "section_name": "凌霄殿",
                "points": 16,
                "power_consume": 5,
                "exp_obtain": 80,
                "coins_obtain": 160,
                "description": "三界神仙中，最黑的是阎罗王，最白的是牡丹仙子，最黄的，大家一致认为是二郎神。"
            },
            "117": {
                "id": 117,
                "chapter_id": "凌霄殿",
                "section_id": 117,
                "section_name": "凌霄殿",
                "points": 16,
                "power_consume": 5,
                "exp_obtain": 80,
                "coins_obtain": 160,
                "description": "许多人可能不知道，其实阎王是有家室的人，他的妻子叫黑玫瑰。是一个比阎罗王更黑的温柔女子，黑的发亮。"
            },
            "118": {
                "id": 118,
                "chapter_id": "凌霄殿",
                "section_id": 118,
                "section_name": "凌霄殿",
                "points": 16,
                "power_consume": 5,
                "exp_obtain": 80,
                "coins_obtain": 160,
                "description": "玉帝很喜欢音乐，其本人也是一个很有音乐天赋的。最近他迷上了民族风，口头禅经常是：哟，哟，切克闹。"
            },
            "119": {
                "id": 119,
                "chapter_id": "凌霄殿",
                "section_id": 119,
                "section_name": "凌霄殿",
                "points": 16,
                "power_consume": 5,
                "exp_obtain": 80,
                "coins_obtain": 160,
                "description": "和日游神相比，夜游神总是比较烦躁。因为在夜里巡游的时候，他经常遇到许多打野战的散仙，弄的他很尴尬。"
            },
            "120": {
                "id": 120,
                "chapter_id": "凌霄殿",
                "section_id": 120,
                "section_name": "凌霄殿",
                "points": 16,
                "power_consume": 5,
                "exp_obtain": 80,
                "coins_obtain": 160,
                "description": "为了整顿仙风，玉帝今日发布了禁肖令。所有神仙夜里无事一律不能出来，有事也不能随便出来，那些打野战的，是时候消停了。"
            },
            "121": {
                "id": 121,
                "chapter_id": "冷月宫",
                "section_id": 121,
                "section_name": "冷月宫",
                "points": 17,
                "power_consume": 5,
                "exp_obtain": 85,
                "coins_obtain": 170,
                "description": "每年春秋两个季节，玉帝都会组织众仙进行集体旅游，他认为这有助于更好的修行。今年他初步打算去一个叫东莞的地方。"
            },
            "122": {
                "id": 122,
                "chapter_id": "冷月宫",
                "section_id": 122,
                "section_name": "冷月宫",
                "points": 17,
                "power_consume": 5,
                "exp_obtain": 85,
                "coins_obtain": 170,
                "description": "其实，贪污受贿不仅仅是人间的一个正常情况，在仙界也是如此。作为玉帝身边的红人，太白金星家中堆满了各路神仙送来的Q币。"
            },
            "123": {
                "id": 123,
                "chapter_id": "冷月宫",
                "section_id": 123,
                "section_name": "冷月宫",
                "points": 17,
                "power_consume": 5,
                "exp_obtain": 85,
                "coins_obtain": 170,
                "description": "托塔天王李靖最近离婚了，这在仙界引起了不小的震撼。按李天王自己的说法，是不行了腻了没感觉了必须换一个了。"
            },
            "124": {
                "id": 124,
                "chapter_id": "冷月宫",
                "section_id": 124,
                "section_name": "冷月宫",
                "points": 17,
                "power_consume": 5,
                "exp_obtain": 85,
                "coins_obtain": 170,
                "description": "最近仙界的违章建筑特别多，为了彻底消除这一现象，玉帝任命巨灵神为拆迁队队长，只要发现违章建筑，往死里拆。"
            },
            "125": {
                "id": 125,
                "chapter_id": "冷月宫",
                "section_id": 125,
                "section_name": "冷月宫",
                "points": 17,
                "power_consume": 5,
                "exp_obtain": 85,
                "coins_obtain": 170,
                "description": "二郎神一直很屌，许多散仙一直在不停的上访，希望告倒这个仙界恶霸，但总是到不了玉帝跟前就被压了下去。唉……"
            },
            "126": {
                "id": 126,
                "chapter_id": "冷月宫",
                "section_id": 126,
                "section_name": "冷月宫",
                "points": 17,
                "power_consume": 5,
                "exp_obtain": 85,
                "coins_obtain": 170,
                "description": "作为玉帝最宠爱的仙界勇士，二郎神飞扬跋扈到了极致。他的口头禅是：告啊，接着告啊，老子上面有人你知道不？"
            },
            "127": {
                "id": 127,
                "chapter_id": "冷月宫",
                "section_id": 127,
                "section_name": "冷月宫",
                "points": 17,
                "power_consume": 5,
                "exp_obtain": 85,
                "coins_obtain": 170,
                "description": "地狱万千恶鬼中，最厉害的大概就属黑罗刹了。他就相当于监狱中的黑老大。就连阎罗王，都得让着他三分。"
            },
            "128": {
                "id": 128,
                "chapter_id": "冷月宫",
                "section_id": 128,
                "section_name": "冷月宫",
                "points": 17,
                "power_consume": 5,
                "exp_obtain": 85,
                "coins_obtain": 170,
                "description": "黄泉路是进入鬼门关之后的一条路，很远，很荒凉。当你走到这条路上的时候，你只有一种感觉，那就是，绝望。"
            },
            "129": {
                "id": 129,
                "chapter_id": "冷月宫",
                "section_id": 129,
                "section_name": "冷月宫",
                "points": 17,
                "power_consume": 5,
                "exp_obtain": 85,
                "coins_obtain": 170,
                "description": "许多人都会好奇那碗让人忘掉来世今生的孟婆汤到底是什么味道，按照阎王的说法，跟河南烩面馆的胡辣汤味道差不多。"
            },
            "130": {
                "id": 130,
                "chapter_id": "冷月宫",
                "section_id": 130,
                "section_name": "冷月宫",
                "points": 17,
                "power_consume": 5,
                "exp_obtain": 85,
                "coins_obtain": 170,
                "description": "相传孟婆就是那位哭倒万里长城的孟姜女。此传闻不知是真是假，但有一点是真的，孟婆不是老婆婆，而是一位绝色美人。"
            },
            "131": {
                "id": 131,
                "chapter_id": "蟠桃园",
                "section_id": 131,
                "section_name": "蟠桃园",
                "points": 18,
                "power_consume": 5,
                "exp_obtain": 90,
                "coins_obtain": 180,
                "description": "玉帝最近晚上老是失眠，就算好不容易睡着了也是梦多，盗汗。作为仙界最高领袖，其实他的压力也是蛮大的。"
            },
            "132": {
                "id": 132,
                "chapter_id": "蟠桃园",
                "section_id": 132,
                "section_name": "蟠桃园",
                "points": 18,
                "power_consume": 5,
                "exp_obtain": 90,
                "coins_obtain": 180,
                "description": "前几天南天门突然莫名其妙的倒塌了，这直接切断了仙界与地狱之间的通道，目前还在抢修，倒塌原因不明。"
            },
            "133": {
                "id": 133,
                "chapter_id": "蟠桃园",
                "section_id": 133,
                "section_name": "蟠桃园",
                "points": 18,
                "power_consume": 5,
                "exp_obtain": 90,
                "coins_obtain": 180,
                "description": "其实不光二郎神养宠物，其他许多神仙也会养，比如太上老君最近就养了一条藏獒。"
            },
            "134": {
                "id": 134,
                "chapter_id": "蟠桃园",
                "section_id": 134,
                "section_name": "蟠桃园",
                "points": 18,
                "power_consume": 5,
                "exp_obtain": 90,
                "coins_obtain": 180,
                "description": "凌霄宝殿没有我们想象中的那么开阔，甚至可以说面积挺小的，满打满算大概也就九十平。之所以搞这么小据说是玉帝的意思。"
            },
            "135": {
                "id": 135,
                "chapter_id": "蟠桃园",
                "section_id": 135,
                "section_name": "蟠桃园",
                "points": 18,
                "power_consume": 5,
                "exp_obtain": 90,
                "coins_obtain": 180,
                "description": "因为最近的水质污染过于严重，河神直接染病，不治而亡。"
            },
            "136": {
                "id": 136,
                "chapter_id": "蟠桃园",
                "section_id": 136,
                "section_name": "蟠桃园",
                "points": 18,
                "power_consume": 5,
                "exp_obtain": 90,
                "coins_obtain": 180,
                "description": "绝大多数神仙下凡之后，最喜欢做的一件事是足疗。只有赤脚大仙除外，因为他的脚气神仙都受不了，更何况凡人。"
            },
            "137": {
                "id": 137,
                "chapter_id": "蟠桃园",
                "section_id": 137,
                "section_name": "蟠桃园",
                "points": 18,
                "power_consume": 5,
                "exp_obtain": 90,
                "coins_obtain": 180,
                "description": "哮天犬最近怀上了。二郎神一直很紧张，他自己也不确定这是不是和他有关。"
            },
            "138": {
                "id": 138,
                "chapter_id": "蟠桃园",
                "section_id": 138,
                "section_name": "蟠桃园",
                "points": 18,
                "power_consume": 5,
                "exp_obtain": 90,
                "coins_obtain": 180,
                "description": "太上老君的炼丹炉近日突然发生了爆炸，老君被严重烧伤当场疼的嗷嗷直叫。后经过调查，是炼丹炉质量有问题。"
            },
            "139": {
                "id": 139,
                "chapter_id": "蟠桃园",
                "section_id": 139,
                "section_name": "蟠桃园",
                "points": 18,
                "power_consume": 5,
                "exp_obtain": 90,
                "coins_obtain": 180,
                "description": "对于近来人间流行的各种拼爹事件，神仙们也经常在一起讨论。他们一致认为，这种爹，应及早让阎王收了他。"
            },
            "140": {
                "id": 140,
                "chapter_id": "蟠桃园",
                "section_id": 140,
                "section_name": "蟠桃园",
                "points": 18,
                "power_consume": 5,
                "exp_obtain": 90,
                "coins_obtain": 180,
                "description": "玉帝一直不太相信人间的地沟油有那么大的危害，他特地让文曲星下凡体验了一回，结果文曲星差点拉肚子拉死在人间。"
            },
            "141": {
                "id": 141,
                "chapter_id": "王母峰",
                "section_id": 141,
                "section_name": "王母峰",
                "points": 19,
                "power_consume": 5,
                "exp_obtain": 95,
                "coins_obtain": 190,
                "description": "关于人间房价一直过高的这个事儿，玉帝隔三差五的就着急众仙进行讨论，但每次结果都很一致，那就是，绝逼不会降下来的。"
            },
            "142": {
                "id": 142,
                "chapter_id": "王母峰",
                "section_id": 142,
                "section_name": "王母峰",
                "points": 19,
                "power_consume": 5,
                "exp_obtain": 95,
                "coins_obtain": 190,
                "description": "牛郎闲来无事就在银河边上开辟了一块地，专门种各种蔬菜，豆角，西红柿，黄瓜，辣椒，等等。他把这个叫做：菜篮子工程。"
            },
            "143": {
                "id": 143,
                "chapter_id": "王母峰",
                "section_id": 143,
                "section_name": "王母峰",
                "points": 19,
                "power_consume": 5,
                "exp_obtain": 95,
                "coins_obtain": 190,
                "description": "太乙真人常年居住在火焰山脚下，他希望能够早日炼成火云掌，在来年的仙界法术大赛中一展身手。"
            },
            "144": {
                "id": 144,
                "chapter_id": "王母峰",
                "section_id": 144,
                "section_name": "王母峰",
                "points": 19,
                "power_consume": 5,
                "exp_obtain": 95,
                "coins_obtain": 190,
                "description": "红孩儿的三味真火是他的成名绝技。不过虽然练就了这法术，不过他的脑子也被烧坏了，所以他脑子有问题。"
            },
            "145": {
                "id": 145,
                "chapter_id": "王母峰",
                "section_id": 145,
                "section_name": "王母峰",
                "points": 19,
                "power_consume": 5,
                "exp_obtain": 95,
                "coins_obtain": 190,
                "description": "白骨精并非我们想象中的那么阴森恐怖，恰恰相反，无论身材还是相貌，她们甚至堪比嫦娥。"
            },
            "146": {
                "id": 146,
                "chapter_id": "王母峰",
                "section_id": 146,
                "section_name": "王母峰",
                "points": 19,
                "power_consume": 5,
                "exp_obtain": 95,
                "coins_obtain": 190,
                "description": "一千个人的眼中有一千个汉姆雷特。一千个神仙的眼中有一千个嫦娥。"
            },
            "147": {
                "id": 147,
                "chapter_id": "王母峰",
                "section_id": 147,
                "section_name": "王母峰",
                "points": 19,
                "power_consume": 5,
                "exp_obtain": 95,
                "coins_obtain": 190,
                "description": "按照商纣王的说法，妲己人美，活儿更好。只是不知道纣王说的这个活儿更好是啥意思，不明白。"
            },
            "148": {
                "id": 148,
                "chapter_id": "王母峰",
                "section_id": 148,
                "section_name": "王母峰",
                "points": 19,
                "power_consume": 5,
                "exp_obtain": 95,
                "coins_obtain": 190,
                "description": "土地公是所有神仙中最矮的，据说身高不到一尺。一千个土地公叠起来，刚好到巨灵神的裤裆。"
            },
            "149": {
                "id": 149,
                "chapter_id": "王母峰",
                "section_id": 149,
                "section_name": "王母峰",
                "points": 19,
                "power_consume": 5,
                "exp_obtain": 95,
                "coins_obtain": 190,
                "description": "如来一直希望能够到凡间走一走，实际体验一下凡人的生活。但这很难实现，因为他官太大了。"
            },
            "150": {
                "id": 150,
                "chapter_id": "王母峰",
                "section_id": 150,
                "section_name": "王母峰",
                "points": 19,
                "power_consume": 5,
                "exp_obtain": 95,
                "coins_obtain": 190,
                "description": "八戒刚刚新建起来的宅子又被强行拆掉了。八戒对这个世道有些绝望了，老子跟随唐三藏西天取经那么辛苦，自己造个宅子也不行么。"
            },
            "151": {
                "id": 151,
                "chapter_id": "流沙河",
                "section_id": 151,
                "section_name": "流沙河",
                "points": 20,
                "power_consume": 5,
                "exp_obtain": 100,
                "coins_obtain": 200,
                "description": "土行孙近日将举行大婚，迎娶七仙女中最小的那位，也是最漂亮的那位。仙子说了，她就喜欢这种畸形的，看着就觉得特刺激。"
            },
            "152": {
                "id": 152,
                "chapter_id": "流沙河",
                "section_id": 152,
                "section_name": "流沙河",
                "points": 20,
                "power_consume": 5,
                "exp_obtain": 100,
                "coins_obtain": 200,
                "description": "黑山老妖其实没有我们想象中的那么坏，也不是个什么阴阳人。他其实是一个道行高深的真正的大神，其突出特点是下体很硬。"
            },
            "153": {
                "id": 153,
                "chapter_id": "流沙河",
                "section_id": 153,
                "section_name": "流沙河",
                "points": 20,
                "power_consume": 5,
                "exp_obtain": 100,
                "coins_obtain": 200,
                "description": "并非所有的神仙出行都是脚踏七色云彩，云彩作为仙界最高档次的出行工具，那都是经过佛祖加持的。"
            },
            "154": {
                "id": 154,
                "chapter_id": "流沙河",
                "section_id": 154,
                "section_name": "流沙河",
                "points": 20,
                "power_consume": 5,
                "exp_obtain": 100,
                "coins_obtain": 200,
                "description": "降龙和伏虎其实不是两个神仙，而是一个神仙，一个同时长着龙头和虎头的怪仙。"
            },
            "155": {
                "id": 155,
                "chapter_id": "流沙河",
                "section_id": 155,
                "section_name": "流沙河",
                "points": 20,
                "power_consume": 5,
                "exp_obtain": 100,
                "coins_obtain": 200,
                "description": "许多人都认为阎罗王是地狱的老大，但实际上，泰山神东岳大帝才是冥界的真正主宰，最高之神。"
            },
            "156": {
                "id": 156,
                "chapter_id": "流沙河",
                "section_id": 156,
                "section_name": "流沙河",
                "points": 20,
                "power_consume": 5,
                "exp_obtain": 100,
                "coins_obtain": 200,
                "description": "阎罗殿设有五宫十殿三十六王，每个人各司其职，共同协助阎王掌管整个鬼界。"
            },
            "157": {
                "id": 157,
                "chapter_id": "流沙河",
                "section_id": 157,
                "section_name": "流沙河",
                "points": 20,
                "power_consume": 5,
                "exp_obtain": 100,
                "coins_obtain": 200,
                "description": "人生在世，最好不要随意杀生，否则等你到了地狱的时候，所有被你杀过的牲畜都会轮番折磨你，让你苦不堪言。"
            },
            "158": {
                "id": 158,
                "chapter_id": "流沙河",
                "section_id": 158,
                "section_name": "流沙河",
                "points": 20,
                "power_consume": 5,
                "exp_obtain": 100,
                "coins_obtain": 200,
                "description": "轮回转世的时间其实很长，按照人间时间来算，一个人从生到死再到生，这样一个轮回大概需要上亿年。"
            },
            "159": {
                "id": 159,
                "chapter_id": "流沙河",
                "section_id": 159,
                "section_name": "流沙河",
                "points": 20,
                "power_consume": 5,
                "exp_obtain": 100,
                "coins_obtain": 200,
                "description": "许多人都以为天上的十八罗汉就是少林寺的十八罗汉，这完全就是两个概念。"
            },
            "160": {
                "id": 160,
                "chapter_id": "流沙河",
                "section_id": 160,
                "section_name": "流沙河",
                "points": 20,
                "power_consume": 5,
                "exp_obtain": 100,
                "coins_obtain": 200,
                "description": "仙界五大战神之中，大地战神法术最高，而北极战神则最为睿智。"
            },
            "161": {
                "id": 161,
                "chapter_id": "五指山",
                "section_id": 161,
                "section_name": "五指山",
                "points": 21,
                "power_consume": 5,
                "exp_obtain": 105,
                "coins_obtain": 210,
                "description": "北斗星君其实不是一个人，而是七个神仙，北斗七星中，每一颗星都是一位大仙。"
            },
            "162": {
                "id": 162,
                "chapter_id": "五指山",
                "section_id": 162,
                "section_name": "五指山",
                "points": 21,
                "power_consume": 5,
                "exp_obtain": 105,
                "coins_obtain": 210,
                "description": "关于八仙中曹国舅的名字来历，玉帝是这么说的，他是一个叫曹国的人的舅舅。"
            },
            "163": {
                "id": 163,
                "chapter_id": "五指山",
                "section_id": 163,
                "section_name": "五指山",
                "points": 21,
                "power_consume": 5,
                "exp_obtain": 105,
                "coins_obtain": 210,
                "description": "其实盘古爷当年开天辟地的时候，并非一蹴而就。而是劈了很久很久才将混沌天地劈开，很辛苦。"
            },
            "164": {
                "id": 164,
                "chapter_id": "五指山",
                "section_id": 164,
                "section_name": "五指山",
                "points": 21,
                "power_consume": 5,
                "exp_obtain": 105,
                "coins_obtain": 210,
                "description": "天聋地哑附在万物，生育万物，是天父和地母，可以说是万物赖以生存繁衍之根本。在仙界地位极高。"
            },
            "165": {
                "id": 165,
                "chapter_id": "五指山",
                "section_id": 165,
                "section_name": "五指山",
                "points": 21,
                "power_consume": 5,
                "exp_obtain": 105,
                "coins_obtain": 210,
                "description": "九头鸟原本是一只神鸟，后来因为听说魂气可以让自己羽毛更丰满漂亮，便逐渐由神格沦落为收人魂气的妖鸟。都是美丽惹的祸。"
            },
            "166": {
                "id": 166,
                "chapter_id": "五指山",
                "section_id": 166,
                "section_name": "五指山",
                "points": 21,
                "power_consume": 5,
                "exp_obtain": 105,
                "coins_obtain": 210,
                "description": "通天教主可以算是仙界中最为特殊的一位大仙，他辈分极高，法术极强，且又亦正亦邪。玉帝拿他很头疼，不知道该怎么办。"
            },
            "167": {
                "id": 167,
                "chapter_id": "五指山",
                "section_id": 167,
                "section_name": "五指山",
                "points": 21,
                "power_consume": 5,
                "exp_obtain": 105,
                "coins_obtain": 210,
                "description": "月老老了，他真的老了，最近经常在搭线的时候手一哆嗦就搞错了。这导致人间许多男子在洞房完了之后才发现女的不是自己媳妇。"
            },
            "168": {
                "id": 168,
                "chapter_id": "五指山",
                "section_id": 168,
                "section_name": "五指山",
                "points": 21,
                "power_consume": 5,
                "exp_obtain": 105,
                "coins_obtain": 210,
                "description": "神仙崇尚清心寡欲，无欲而修。所以在仙界是禁止吃肉的。唯独巨灵神除外，他说，不让我吃肉，我宁愿现在就下地狱。"
            },
            "169": {
                "id": 169,
                "chapter_id": "五指山",
                "section_id": 169,
                "section_name": "五指山",
                "points": 21,
                "power_consume": 5,
                "exp_obtain": 105,
                "coins_obtain": 210,
                "description": "因为气候干旱，蟠桃园里的桃子发育不良。迫不得已，王母将每年一次的蟠桃盛会改为每一万年一次。"
            },
            "170": {
                "id": 170,
                "chapter_id": "五指山",
                "section_id": 170,
                "section_name": "五指山",
                "points": 21,
                "power_consume": 5,
                "exp_obtain": 105,
                "coins_obtain": 210,
                "description": "传闻二郎神的哮天犬与南极仙翁的那只仙鹤有染，双方一见钟情，惺惺相惜，情不自禁。祝它们能够白头偕老。"
            },
            "171": {
                "id": 171,
                "chapter_id": "女儿国",
                "section_id": 171,
                "section_name": "女儿国",
                "points": 22,
                "power_consume": 5,
                "exp_obtain": 110,
                "coins_obtain": 220,
                "description": "在饮食方面，神仙各自喜好不同。南华大仙喜食蔬菜，战神刑天喜使水果，二郎神喜食臊子面，玉帝喜食四川火锅。"
            },
            "172": {
                "id": 172,
                "chapter_id": "女儿国",
                "section_id": 172,
                "section_name": "女儿国",
                "points": 22,
                "power_consume": 5,
                "exp_obtain": 110,
                "coins_obtain": 220,
                "description": "在修行方面，每个神仙的方式不同。最具特色的是赤脚大仙，他的修行方式是抠脚丫子，一边扣一边闻。"
            },
            "173": {
                "id": 173,
                "chapter_id": "女儿国",
                "section_id": 173,
                "section_name": "女儿国",
                "points": 22,
                "power_consume": 5,
                "exp_obtain": 110,
                "coins_obtain": 220,
                "description": "白虎神君作为四大守护神兽之一，最近显得有些烦躁。因为他脑袋上的那个王字也不知道什么时候被谁给扣掉了。"
            },
            "174": {
                "id": 174,
                "chapter_id": "女儿国",
                "section_id": 174,
                "section_name": "女儿国",
                "points": 22,
                "power_consume": 5,
                "exp_obtain": 110,
                "coins_obtain": 220,
                "description": "鹿角大仙化身为一只梅花鹿下凡体察民生的时候，不小心被一群猎手逮住，割掉了双角。这让他痛不欲生。"
            },
            "175": {
                "id": 175,
                "chapter_id": "女儿国",
                "section_id": 175,
                "section_name": "女儿国",
                "points": 22,
                "power_consume": 5,
                "exp_obtain": 110,
                "coins_obtain": 220,
                "description": "因为凡间百姓有钱人越来越多，对貂绒需求量越来越大，为了防止仙貂绝种，玉帝今日下令，所有仙貂，绝对永远也不能出现在凡间了。"
            },
            "176": {
                "id": 176,
                "chapter_id": "女儿国",
                "section_id": 176,
                "section_name": "女儿国",
                "points": 22,
                "power_consume": 5,
                "exp_obtain": 110,
                "coins_obtain": 220,
                "description": "玉帝总共有三处行宫，一处是凌霄殿，一处是琼华宫，还有一处是用来度假的，在蓬莱。"
            },
            "177": {
                "id": 177,
                "chapter_id": "女儿国",
                "section_id": 177,
                "section_name": "女儿国",
                "points": 22,
                "power_consume": 5,
                "exp_obtain": 110,
                "coins_obtain": 220,
                "description": "其实蓬莱原本属于蓬莱仙子的，但是后来这地方被玉帝看上了，所以仙子只好搬了出去。领导的话必须要听的，不管你是人还是神。"
            },
            "178": {
                "id": 178,
                "chapter_id": "女儿国",
                "section_id": 178,
                "section_name": "女儿国",
                "points": 22,
                "power_consume": 5,
                "exp_obtain": 110,
                "coins_obtain": 220,
                "description": "修行之余，神仙们一般也会组织一些娱乐活动，比如足球，篮球，乒乓球，手球，橄榄球，网球，台球，高尔夫，等等。"
            },
            "179": {
                "id": 179,
                "chapter_id": "女儿国",
                "section_id": 179,
                "section_name": "女儿国",
                "points": 22,
                "power_consume": 5,
                "exp_obtain": 110,
                "coins_obtain": 220,
                "description": "托塔天王最喜欢的课外活动是，做仰卧起坐。李天王对自己的体型非常看重。尤其是腹肌这一块，他总是希望能够再雕刻雕刻。"
            },
            "180": {
                "id": 180,
                "chapter_id": "女儿国",
                "section_id": 180,
                "section_name": "女儿国",
                "points": 22,
                "power_consume": 5,
                "exp_obtain": 110,
                "coins_obtain": 220,
                "description": "三圣母最近打算再婚了。这一次，二郎神不打算再把亲妹子压在华山下了，他也想通了，这玩意也就那么个事，不需要太较真。"
            },
            "181": {
                "id": 181,
                "chapter_id": "曲女城",
                "section_id": 181,
                "section_name": "曲女城",
                "points": 23,
                "power_consume": 5,
                "exp_obtain": 115,
                "coins_obtain": 230,
                "description": "地狱判官钟馗最近向阎王提出，他不想晚上一个人睡，理由是他怕鬼。阎王愣了半天，不知道该如何回答他。"
            },
            "182": {
                "id": 182,
                "chapter_id": "曲女城",
                "section_id": 182,
                "section_name": "曲女城",
                "points": 23,
                "power_consume": 5,
                "exp_obtain": 115,
                "coins_obtain": 230,
                "description": "铁拐李很喜欢画画，尤喜画裸女图，只不过每次那女的看起来都很像何仙姑。这让吕洞宾很不爽，你这是把老子完全忽略了么。"
            },
            "183": {
                "id": 183,
                "chapter_id": "曲女城",
                "section_id": 183,
                "section_name": "曲女城",
                "points": 23,
                "power_consume": 5,
                "exp_obtain": 115,
                "coins_obtain": 230,
                "description": "关于人间主要的娱乐活动，玉帝召集众仙经过慎重讨论，得出如下结论：第一是足球，第二是篮球，第三是嫖娼。"
            },
            "184": {
                "id": 184,
                "chapter_id": "曲女城",
                "section_id": 184,
                "section_name": "曲女城",
                "points": 23,
                "power_consume": 5,
                "exp_obtain": 115,
                "coins_obtain": 230,
                "description": "无花大仙是仙界最为特殊的一位大仙，因为他只有下半身，而且平日里都是保持全裸状态。玉帝一直怀疑他是露阴癖。"
            },
            "185": {
                "id": 185,
                "chapter_id": "曲女城",
                "section_id": 185,
                "section_name": "曲女城",
                "points": 23,
                "power_consume": 5,
                "exp_obtain": 115,
                "coins_obtain": 230,
                "description": "玉帝一直人为八仙中的吕洞宾和韩湘子感觉总有点怪怪的，最近，吕与韩高调宣布出柜的消息验证了他的这种感觉。"
            },
            "186": {
                "id": 186,
                "chapter_id": "曲女城",
                "section_id": 186,
                "section_name": "曲女城",
                "points": 23,
                "power_consume": 5,
                "exp_obtain": 115,
                "coins_obtain": 230,
                "description": "几乎仙界所有的仙女都对吴刚常年劈砍桂树所练出来的雄健体魄充满了兴趣，她们都希望能够亲手摸一摸，甚至包括王母在内。"
            },
            "187": {
                "id": 187,
                "chapter_id": "曲女城",
                "section_id": 187,
                "section_name": "曲女城",
                "points": 23,
                "power_consume": 5,
                "exp_obtain": 115,
                "coins_obtain": 230,
                "description": "邓婵玉当初下嫁给土行孙，这完全就是姜子牙的主意，如此一个大美人跟着这么一个孙子，白瞎了。"
            },
            "188": {
                "id": 188,
                "chapter_id": "曲女城",
                "section_id": 188,
                "section_name": "曲女城",
                "points": 23,
                "power_consume": 5,
                "exp_obtain": 115,
                "coins_obtain": 230,
                "description": "西王母和王母既不是一个神仙，也不是姐妹，他们之间完全没有联系，而且西王母是的男的。"
            },
            "189": {
                "id": 189,
                "chapter_id": "曲女城",
                "section_id": 189,
                "section_name": "曲女城",
                "points": 23,
                "power_consume": 5,
                "exp_obtain": 115,
                "coins_obtain": 230,
                "description": "玉兔看着吴刚面前冒着青烟的烧烤架，它忍不住的留下了眼泪，再这么吃下去，广寒宫的兔子就完蛋了。"
            },
            "190": {
                "id": 190,
                "chapter_id": "曲女城",
                "section_id": 190,
                "section_name": "曲女城",
                "points": 23,
                "power_consume": 5,
                "exp_obtain": 115,
                "coins_obtain": 230,
                "description": "作为神仙中出了名的医仙，牡丹仙子有一颗普度众生的心，每天她都会下凡人间，广施恩泽，救苦救难。她是百姓心中真正的菩萨。"
            },
            "191": {
                "id": 191,
                "chapter_id": "天竺寺",
                "section_id": 191,
                "section_name": "天竺寺",
                "points": 24,
                "power_consume": 5,
                "exp_obtain": 120,
                "coins_obtain": 240,
                "description": "百花仙子之所以被称为百花仙子，是因为她穿的衣服是由一百朵玫瑰花织成的，织的天衣无缝。二郎神盯了八百多年，还是没有发现漏点。"
            },
            "192": {
                "id": 192,
                "chapter_id": "天竺寺",
                "section_id": 192,
                "section_name": "天竺寺",
                "points": 24,
                "power_consume": 5,
                "exp_obtain": 120,
                "coins_obtain": 240,
                "description": "百花仙子和花神是两个神仙，花神几乎和百花仙子一样的年轻貌美，但事实上花神是百花仙子她妈。"
            },
            "193": {
                "id": 193,
                "chapter_id": "天竺寺",
                "section_id": 193,
                "section_name": "天竺寺",
                "points": 24,
                "power_consume": 5,
                "exp_obtain": 120,
                "coins_obtain": 240,
                "description": "很多人不知道，其实神仙中是有床神的，而且地位很高。所以，如果床上生活有问题的，大家可以拜一拜。"
            },
            "194": {
                "id": 194,
                "chapter_id": "天竺寺",
                "section_id": 194,
                "section_name": "天竺寺",
                "points": 24,
                "power_consume": 5,
                "exp_obtain": 120,
                "coins_obtain": 240,
                "description": "洛神宓妃是仙女当中另外一位绝色佳人，其美貌程度绝不亚于嫦娥。据说后裔当年经常在梦中与宓妃爱爱。我们由此想象宓妃之美。"
            },
            "195": {
                "id": 195,
                "chapter_id": "天竺寺",
                "section_id": 195,
                "section_name": "天竺寺",
                "points": 24,
                "power_consume": 5,
                "exp_obtain": 120,
                "coins_obtain": 240,
                "description": "精卫平均一天可以往大海里填三十颗石子，龙王算过，照这个速度，它要想填平大海，大概需要八亿亿亿亿亿亿亿亿年零九个月。"
            },
            "196": {
                "id": 196,
                "chapter_id": "天竺寺",
                "section_id": 196,
                "section_name": "天竺寺",
                "points": 24,
                "power_consume": 5,
                "exp_obtain": 120,
                "coins_obtain": 240,
                "description": "大禹治水，功德无量，流芳百世。但很多人可能不知道，其实大禹不会游泳，而且很怕水，简直怕的要命。"
            },
            "197": {
                "id": 197,
                "chapter_id": "天竺寺",
                "section_id": 197,
                "section_name": "天竺寺",
                "points": 24,
                "power_consume": 5,
                "exp_obtain": 120,
                "coins_obtain": 240,
                "description": "最近天庭扩招，来了很多新人。附近餐馆都是人满为患，很多神仙甚至不得不下凡去用餐。所以玉帝决定盖一个食堂。"
            },
            "198": {
                "id": 198,
                "chapter_id": "天竺寺",
                "section_id": 198,
                "section_name": "天竺寺",
                "points": 24,
                "power_consume": 5,
                "exp_obtain": 120,
                "coins_obtain": 240,
                "description": "最近龟神有些烦躁，因为饭量日益增加，再加上头部吸收营养能力过强，导致他的龟头越来越大。现在晚上睡觉都缩不回龟壳里去了。"
            },
            "199": {
                "id": 199,
                "chapter_id": "天竺寺",
                "section_id": 199,
                "section_name": "天竺寺",
                "points": 24,
                "power_consume": 5,
                "exp_obtain": 120,
                "coins_obtain": 240,
                "description": "神仙中对于男欢女爱之事最上瘾的大概莫过于巫山神女了，基本上只要有机会她就会巫山云雨一把。不过搞过的都说她活儿很不错。"
            },
            "200": {
                "id": 200,
                "chapter_id": "天竺寺",
                "section_id": 200,
                "section_name": "天竺寺",
                "points": 24,
                "power_consume": 5,
                "exp_obtain": 120,
                "coins_obtain": 240,
                "description": "孟姜女当年的一哭，不仅哭倒了万里长城，也哭碎了玉帝的心。这是他唯一一次动过凡心，不过这个事王母是不知道的。"
            },
            "201": {
                "id": 201,
                "chapter_id": "圣女峰",
                "section_id": 201,
                "section_name": "圣女峰",
                "points": 25,
                "power_consume": 5,
                "exp_obtain": 125,
                "coins_obtain": 250,
                "description": "玉帝最近打算恢复八戒天蓬元帅的职位。少了这么一个喜欢调戏妇女的元帅，玉帝总觉得生活变得枯燥了很多。"
            },
            "202": {
                "id": 202,
                "chapter_id": "圣女峰",
                "section_id": 202,
                "section_name": "圣女峰",
                "points": 25,
                "power_consume": 5,
                "exp_obtain": 125,
                "coins_obtain": 250,
                "description": "人间空气污染指数的上升，直接影响了仙界的空气质量，南天门最近空气的PM指数已经达到了800多，污染程度与人间紫禁城相近。"
            },
            "203": {
                "id": 203,
                "chapter_id": "圣女峰",
                "section_id": 203,
                "section_name": "圣女峰",
                "points": 25,
                "power_consume": 5,
                "exp_obtain": 125,
                "coins_obtain": 250,
                "description": "从上个月开始，新造的各大仙宫陆续出现了漏水现象，玉帝已下令彻查此事，严格控制房屋质量，确保神仙的基本生活品质。"
            },
            "204": {
                "id": 204,
                "chapter_id": "圣女峰",
                "section_id": 204,
                "section_name": "圣女峰",
                "points": 25,
                "power_consume": 5,
                "exp_obtain": 125,
                "coins_obtain": 250,
                "description": "许多神仙都非常喜欢人间的足球这项运动。最近这一届世界杯他们打算化身成球迷前往巴西到现场去看一看。"
            },
            "205": {
                "id": 205,
                "chapter_id": "圣女峰",
                "section_id": 205,
                "section_name": "圣女峰",
                "points": 25,
                "power_consume": 5,
                "exp_obtain": 125,
                "coins_obtain": 250,
                "description": "对于人间流行的上帝这个称呼，玉帝很不喜欢，他也曾和西方的耶稣交涉过多次，明确表示上天应该只有他这么一个帝。"
            },
            "206": {
                "id": 206,
                "chapter_id": "圣女峰",
                "section_id": 206,
                "section_name": "圣女峰",
                "points": 25,
                "power_consume": 5,
                "exp_obtain": 125,
                "coins_obtain": 250,
                "description": "前些日子二郎神发现哮天犬长了个痔疮，这让他有些惴惴不安，他不知道这是不是和他有关系。"
            },
            "207": {
                "id": 207,
                "chapter_id": "圣女峰",
                "section_id": 207,
                "section_name": "圣女峰",
                "points": 25,
                "power_consume": 5,
                "exp_obtain": 125,
                "coins_obtain": 250,
                "description": "天庭今日发布了堪称有史以来最为严厉的一道新规：为了保证纯洁性，任何神仙不得潜规则仙女，谁潜，就干谁。"
            },
            "208": {
                "id": 208,
                "chapter_id": "圣女峰",
                "section_id": 208,
                "section_name": "圣女峰",
                "points": 25,
                "power_consume": 5,
                "exp_obtain": 125,
                "coins_obtain": 250,
                "description": "王母娘娘心系三界，她经常督促各路神仙，多到人间去走一走看一看，体验下百姓疾苦，真相往往都是在基层。"
            },
            "209": {
                "id": 209,
                "chapter_id": "圣女峰",
                "section_id": 209,
                "section_name": "圣女峰",
                "points": 25,
                "power_consume": 5,
                "exp_obtain": 125,
                "coins_obtain": 250,
                "description": "身为一代鬼王，修罗王一直想争阎罗王这个位子，众鬼纷纷提醒阎王爷要留神。阎王淡淡一笑说没事老子早就干腻了。"
            },
            "210": {
                "id": 210,
                "chapter_id": "圣女峰",
                "section_id": 210,
                "section_name": "圣女峰",
                "points": 25,
                "power_consume": 5,
                "exp_obtain": 125,
                "coins_obtain": 250,
                "description": "地狱里是可以看到阳光的，每天中午，阎王都会带着众鬼将在森罗大殿晒晒太阳，聊聊天，整体氛围是很温馨的。"
            },
            "211": {
                "id": 211,
                "chapter_id": "空灵泉",
                "section_id": 211,
                "section_name": "空灵泉",
                "points": 26,
                "power_consume": 5,
                "exp_obtain": 130,
                "coins_obtain": 260,
                "description": "第二界廉政大会在天庭如期召开。会上玉帝作出了重要指示，他希望各神仙能够认真学习，研究部署，贯彻落实，并拥有大局观。"
            },
            "212": {
                "id": 212,
                "chapter_id": "空灵泉",
                "section_id": 212,
                "section_name": "空灵泉",
                "points": 26,
                "power_consume": 5,
                "exp_obtain": 130,
                "coins_obtain": 260,
                "description": "近日召开的全体神仙扩大性精神会议上，观音菩萨首次提出，建立神仙党员制度，凡表现优秀的神仙，均有机会成为党员。"
            },
            "213": {
                "id": 213,
                "chapter_id": "空灵泉",
                "section_id": 213,
                "section_name": "空灵泉",
                "points": 26,
                "power_consume": 5,
                "exp_obtain": 130,
                "coins_obtain": 260,
                "description": "前几天土行孙与猪八戒，赤脚大仙，蓬莱大仙，太上老君，他们五个因感情深厚决定义结金兰，并号称五虎上将。"
            },
            "214": {
                "id": 214,
                "chapter_id": "空灵泉",
                "section_id": 214,
                "section_name": "空灵泉",
                "points": 26,
                "power_consume": 5,
                "exp_obtain": 130,
                "coins_obtain": 260,
                "description": "作为仙界首位医术高超的仙女，牡丹仙子首创中医针灸概念，以针运气，以针养气，成功的解除了众多神仙的风湿之痛。"
            },
            "215": {
                "id": 215,
                "chapter_id": "空灵泉",
                "section_id": 215,
                "section_name": "空灵泉",
                "points": 26,
                "power_consume": 5,
                "exp_obtain": 130,
                "coins_obtain": 260,
                "description": "越来越多的神仙沦为了房奴，高额的房贷让他们喘不过起来，他们甚至觉得他们和地上的凡人没什么区别。"
            },
            "216": {
                "id": 216,
                "chapter_id": "空灵泉",
                "section_id": 216,
                "section_name": "空灵泉",
                "points": 26,
                "power_consume": 5,
                "exp_obtain": 130,
                "coins_obtain": 260,
                "description": "最近仙界房地产市场泡沫越来越大，玉帝指示各部门，没事的时候大家研究一下，保障众神仙的基本生活品质还是有一点意义的。"
            },
            "217": {
                "id": 217,
                "chapter_id": "空灵泉",
                "section_id": 217,
                "section_name": "空灵泉",
                "points": 26,
                "power_consume": 5,
                "exp_obtain": 130,
                "coins_obtain": 260,
                "description": "南天童子昨晚凌晨五点自尽身亡，魂飞魄散。他成为了第一个因还不起房贷而自杀的神仙。据说他那套两居室已经还了九千多年了。"
            },
            "218": {
                "id": 218,
                "chapter_id": "空灵泉",
                "section_id": 218,
                "section_name": "空灵泉",
                "points": 26,
                "power_consume": 5,
                "exp_obtain": 130,
                "coins_obtain": 260,
                "description": "九天杀童最近喜欢上了人间的烧烤，尤其最喜欢吃一种叫鸡肾的东西，没事的时候他就偷偷的溜下凡间，烤个几千串吃一吃。"
            },
            "219": {
                "id": 219,
                "chapter_id": "空灵泉",
                "section_id": 219,
                "section_name": "空灵泉",
                "points": 26,
                "power_consume": 5,
                "exp_obtain": 130,
                "coins_obtain": 260,
                "description": "最近玉帝新换了一名御厨，叫欧阳卵。他非常擅长做又麻又辣的菜。玉帝最近口味比较重，所以他很喜欢这个欧阳卵。"
            },
            "220": {
                "id": 220,
                "chapter_id": "空灵泉",
                "section_id": 220,
                "section_name": "空灵泉",
                "points": 26,
                "power_consume": 5,
                "exp_obtain": 130,
                "coins_obtain": 260,
                "description": "吴刚打算这几天向玉帝申请下凡一趟，看看他的兄弟后裔。老这么让他守着，孤男寡女的，也不是那么个事。"
            },
            "221": {
                "id": 221,
                "chapter_id": "莲花池",
                "section_id": 221,
                "section_name": "莲花池",
                "points": 27,
                "power_consume": 5,
                "exp_obtain": 135,
                "coins_obtain": 270,
                "description": "后裔打算结婚了，他感觉就这么和嫦娥耗下去也不是个事，再说一个在天上，一个在地下，想要复合估计是没戏了。"
            },
            "222": {
                "id": 222,
                "chapter_id": "莲花池",
                "section_id": 222,
                "section_name": "莲花池",
                "points": 27,
                "power_consume": 5,
                "exp_obtain": 135,
                "coins_obtain": 270,
                "description": "听到后裔在凡间打算结婚的消息，嫦娥哭了整整三天三夜，无论如何，她对后裔是真心的。"
            },
            "223": {
                "id": 223,
                "chapter_id": "莲花池",
                "section_id": 223,
                "section_name": "莲花池",
                "points": 27,
                "power_consume": 5,
                "exp_obtain": 135,
                "coins_obtain": 270,
                "description": "听到后裔在凡间打算结婚的消息后，吴刚一直在想，这是不是意味着他可以做点什么了。"
            },
            "224": {
                "id": 224,
                "chapter_id": "莲花池",
                "section_id": 224,
                "section_name": "莲花池",
                "points": 27,
                "power_consume": 5,
                "exp_obtain": 135,
                "coins_obtain": 270,
                "description": "仙界前些日子好多神仙都患上了禽流感，大家纷纷把目光对准了二郎神的哮天犬，大家都觉得是时候该对这畜生做点什么了。"
            },
            "225": {
                "id": 225,
                "chapter_id": "莲花池",
                "section_id": 225,
                "section_name": "莲花池",
                "points": 27,
                "power_consume": 5,
                "exp_obtain": 135,
                "coins_obtain": 270,
                "description": "其实大多数神仙过的都比较清贫，神仙也分好多种，有强有弱，有好有坏，有富有穷。这和人间基本上是差不多的。"
            },
            "226": {
                "id": 226,
                "chapter_id": "莲花池",
                "section_id": 226,
                "section_name": "莲花池",
                "points": 27,
                "power_consume": 5,
                "exp_obtain": 135,
                "coins_obtain": 270,
                "description": "第七届神仙田径大赛圆满结束，第三名是土行孙，第二名是九华仙子，第一名是哮天犬。"
            },
            "227": {
                "id": 227,
                "chapter_id": "莲花池",
                "section_id": 227,
                "section_name": "莲花池",
                "points": 27,
                "power_consume": 5,
                "exp_obtain": 135,
                "coins_obtain": 270,
                "description": "神仙当中不乏众多球迷，其中北斗七星君是皇马球迷，牛魔王和铁扇公主最喜欢梅西，而玉帝则是奥尼尔最忠实的粉丝。"
            },
            "228": {
                "id": 228,
                "chapter_id": "莲花池",
                "section_id": 228,
                "section_name": "莲花池",
                "points": 27,
                "power_consume": 5,
                "exp_obtain": 135,
                "coins_obtain": 270,
                "description": "七仙女分别是：红衣仙女、素衣仙女、青衣仙女、皂衣仙女、紫衣仙女、黄衣仙女、绿衣仙女。传闻她们其实并不是玉帝的女儿。"
            },
            "229": {
                "id": 229,
                "chapter_id": "莲花池",
                "section_id": 229,
                "section_name": "莲花池",
                "points": 27,
                "power_consume": 5,
                "exp_obtain": 135,
                "coins_obtain": 270,
                "description": "太华山的赤精子最近和九宫山的普贤真人干上了，这两个八竿子打不着边的神仙也能干起来，只能说明神仙的日子过的越来越浮躁了。"
            },
            "230": {
                "id": 230,
                "chapter_id": "莲花池",
                "section_id": 230,
                "section_name": "莲花池",
                "points": 27,
                "power_consume": 5,
                "exp_obtain": 135,
                "coins_obtain": 270,
                "description": "第十七届青歌大赛成功落幕，巨灵神以一首充满深情的《让我们一次爱个够》勇夺桂冠。玉帝点评说唱出陕北民歌味儿了。"
            },
            "231": {
                "id": 231,
                "chapter_id": "极乐界",
                "section_id": 231,
                "section_name": "极乐界",
                "points": 28,
                "power_consume": 5,
                "exp_obtain": 140,
                "coins_obtain": 280,
                "description": "因为仙流量过大，天庭最近打算在南天门对面新建一道北天门，以此来缓解交通压力。"
            },
            "232": {
                "id": 232,
                "chapter_id": "极乐界",
                "section_id": 232,
                "section_name": "极乐界",
                "points": 28,
                "power_consume": 5,
                "exp_obtain": 140,
                "coins_obtain": 280,
                "description": "人间到天庭的距离其实不算太远，悟空踩着云彩，大概要飞半个小时，这样比照下来，差不多相当于凡人连续做半个月飞机的时间。"
            },
            "233": {
                "id": 233,
                "chapter_id": "极乐界",
                "section_id": 233,
                "section_name": "极乐界",
                "points": 28,
                "power_consume": 5,
                "exp_obtain": 140,
                "coins_obtain": 280,
                "description": "不要羡慕神仙，做个凡人没什么不好的，仙有仙的苦楚，而人有人的幸福。各自都有各自的活法。"
            },
            "234": {
                "id": 234,
                "chapter_id": "极乐界",
                "section_id": 234,
                "section_name": "极乐界",
                "points": 28,
                "power_consume": 5,
                "exp_obtain": 140,
                "coins_obtain": 280,
                "description": "正在外地旅游的悟空听到了一个不幸的消息，他花果山的饮品店和猪八戒的高老庄一样，也被强行拆掉了。"
            },
            "235": {
                "id": 235,
                "chapter_id": "极乐界",
                "section_id": 235,
                "section_name": "极乐界",
                "points": 28,
                "power_consume": 5,
                "exp_obtain": 140,
                "coins_obtain": 280,
                "description": "羊角大仙近日喜得贵子，大仙为其取名为，羊羊羊。"
            },
            "236": {
                "id": 236,
                "chapter_id": "极乐界",
                "section_id": 236,
                "section_name": "极乐界",
                "points": 28,
                "power_consume": 5,
                "exp_obtain": 140,
                "coins_obtain": 280,
                "description": "玉帝最近打算废除禁止神仙恋爱的这条规定。他看不到这一条规定有任何意义，人可以相爱，神为什么就不可以。"
            },
            "237": {
                "id": 237,
                "chapter_id": "极乐界",
                "section_id": 237,
                "section_name": "极乐界",
                "points": 28,
                "power_consume": 5,
                "exp_obtain": 140,
                "coins_obtain": 280,
                "description": "作为仙界的乐官，五音大仙最近创作了一首叫做《干！干！干！》的歌曲。此歌节奏明快，旋律优美，深得众仙的喜爱。"
            },
            "238": {
                "id": 238,
                "chapter_id": "极乐界",
                "section_id": 238,
                "section_name": "极乐界",
                "points": 28,
                "power_consume": 5,
                "exp_obtain": 140,
                "coins_obtain": 280,
                "description": "作为仙界最具艺术才华的仙子，文曲星最近创作了一首叫做《你们都去死吧！》的诗词，该诗以感情强烈而迅速风靡仙界。"
            },
            "239": {
                "id": 239,
                "chapter_id": "极乐界",
                "section_id": 239,
                "section_name": "极乐界",
                "points": 28,
                "power_consume": 5,
                "exp_obtain": 140,
                "coins_obtain": 280,
                "description": "因为舞姿过于出色，七仙女中的青衣仙子近日被王母娘娘授以樱桃小丸子的一级大仙封号。"
            },
            "240": {
                "id": 240,
                "chapter_id": "极乐界",
                "section_id": 240,
                "section_name": "极乐界",
                "points": 28,
                "power_consume": 5,
                "exp_obtain": 140,
                "coins_obtain": 280,
                "description": "牛郎家的那头牛最近早产，生下了两头小牛犊，牛郎为其命名为，牛丽丽和牛青青。"
            },
            "241": {
                "id": 241,
                "chapter_id": "苦难谷",
                "section_id": 241,
                "section_name": "苦难谷",
                "points": 29,
                "power_consume": 5,
                "exp_obtain": 145,
                "coins_obtain": 290,
                "description": "在近日召开的艺术指导会议上，文曲星指出，艺术不能脱离生活，要以贴近众仙日常情感为线索，坚定不移的走群众路线。"
            },
            "242": {
                "id": 242,
                "chapter_id": "苦难谷",
                "section_id": 242,
                "section_name": "苦难谷",
                "points": 29,
                "power_consume": 5,
                "exp_obtain": 145,
                "coins_obtain": 290,
                "description": "最近经常有神仙偷偷下凡去炒股，玉帝觉得很恼火，下令一旦发现这种神仙就地处决。他觉得股市这个东西摆明就是黑钱的。"
            },
            "243": {
                "id": 243,
                "chapter_id": "苦难谷",
                "section_id": 243,
                "section_name": "苦难谷",
                "points": 29,
                "power_consume": 5,
                "exp_obtain": 145,
                "coins_obtain": 290,
                "description": "下一届奥运会，王母打算亲临现场看一看，她很喜欢看游泳，尤其喜欢那个美国飞鱼菲尔普斯。"
            },
            "244": {
                "id": 244,
                "chapter_id": "苦难谷",
                "section_id": 244,
                "section_name": "苦难谷",
                "points": 29,
                "power_consume": 5,
                "exp_obtain": 145,
                "coins_obtain": 290,
                "description": "雷公最近想换个工作，天天打雷，天天打雷，快烦死了。"
            },
            "245": {
                "id": 245,
                "chapter_id": "苦难谷",
                "section_id": 245,
                "section_name": "苦难谷",
                "points": 29,
                "power_consume": 5,
                "exp_obtain": 145,
                "coins_obtain": 290,
                "description": "电母是仙界长的最丑的仙女，但也是最会保养的仙女。最近她打算再去呵护一下头发，做一个离子烫，拉个直板。"
            },
            "246": {
                "id": 246,
                "chapter_id": "苦难谷",
                "section_id": 246,
                "section_name": "苦难谷",
                "points": 29,
                "power_consume": 5,
                "exp_obtain": 145,
                "coins_obtain": 290,
                "description": "没有人知道法海的痛苦，也没有人能理解他对许仙的感情。当他看到白素贞和许仙在一起的那一刻，他的心，碎了。"
            },
            "247": {
                "id": 247,
                "chapter_id": "苦难谷",
                "section_id": 247,
                "section_name": "苦难谷",
                "points": 29,
                "power_consume": 5,
                "exp_obtain": 145,
                "coins_obtain": 290,
                "description": "唐僧师徒四人取经归来之后，最幸运的当属白龙马。因为只有他家的宅院没有被巨灵神强拆过。"
            },
            "248": {
                "id": 248,
                "chapter_id": "苦难谷",
                "section_id": 248,
                "section_name": "苦难谷",
                "points": 29,
                "power_consume": 5,
                "exp_obtain": 145,
                "coins_obtain": 290,
                "description": "因为经常性的熬夜，二郎神三只眼睛的近视度数高达三千多度，额头上的那只天眼基本上已经废掉了。"
            },
            "249": {
                "id": 249,
                "chapter_id": "苦难谷",
                "section_id": 249,
                "section_name": "苦难谷",
                "points": 29,
                "power_consume": 5,
                "exp_obtain": 145,
                "coins_obtain": 290,
                "description": "曾有神仙向玉帝提出在人间弄一个常驻办事处，玉帝听了忍不住哈哈大笑，笑完之后他说好这个提议不错，完了我们研究下。"
            },
            "250": {
                "id": 250,
                "chapter_id": "苦难谷",
                "section_id": 250,
                "section_name": "苦难谷",
                "points": 29,
                "power_consume": 5,
                "exp_obtain": 145,
                "coins_obtain": 290,
                "description": "因为刑罚过于残暴，地狱最近经常发生群鬼暴乱事件。对此，阎王对众刑官表示，再严厉一点，谁不服当场就废了他。"
            },
            "251": {
                "id": 251,
                "chapter_id": "盘丝洞",
                "section_id": 251,
                "section_name": "盘丝洞",
                "points": 30,
                "power_consume": 5,
                "exp_obtain": 150,
                "coins_obtain": 300,
                "description": "整个地狱，皮肤保养的最好的当属钟馗，这得益于他每天吸食灵魂。据统计他大概一天吸食九百多万个魂魄。"
            },
            "252": {
                "id": 252,
                "chapter_id": "盘丝洞",
                "section_id": 252,
                "section_name": "盘丝洞",
                "points": 30,
                "power_consume": 5,
                "exp_obtain": 150,
                "coins_obtain": 300,
                "description": "黄飞虎最近迷上了人体雕塑，他希望能够在不就的未来举办一次个人雕塑展，名字都想好了，叫：我的灵魂我的肉。"
            },
            "253": {
                "id": 253,
                "chapter_id": "盘丝洞",
                "section_id": 253,
                "section_name": "盘丝洞",
                "points": 30,
                "power_consume": 5,
                "exp_obtain": 150,
                "coins_obtain": 300,
                "description": "王母娘娘其实是一个京剧迷，她曾降入凡间化身普通戏子，师从京剧大师梅兰芳。不过这事只有玉帝知道。"
            },
            "254": {
                "id": 254,
                "chapter_id": "盘丝洞",
                "section_id": 254,
                "section_name": "盘丝洞",
                "points": 30,
                "power_consume": 5,
                "exp_obtain": 150,
                "coins_obtain": 300,
                "description": "由于进来环境污染严重，气候严重异常，东海经常是动不动的就刮台风。老龙王躺在龙宫里晃来晃去，一会就晕吐了。"
            },
            "255": {
                "id": 255,
                "chapter_id": "盘丝洞",
                "section_id": 255,
                "section_name": "盘丝洞",
                "points": 30,
                "power_consume": 5,
                "exp_obtain": 150,
                "coins_obtain": 300,
                "description": "花果山饮品店被拆除后，悟空潜心修行三十年，终于悟出了第七十三种仙术变化。他打算最近再搞一次大闹天宫。"
            },
            "256": {
                "id": 256,
                "chapter_id": "盘丝洞",
                "section_id": 256,
                "section_name": "盘丝洞",
                "points": 30,
                "power_consume": 5,
                "exp_obtain": 150,
                "coins_obtain": 300,
                "description": "因生活清贫，修行苦闷，许多神仙选择到凡间经商。玉帝知道后立刻发布一道天规：一旦发现官员经商，无须上报，直接弄死。"
            },
            "257": {
                "id": 257,
                "chapter_id": "盘丝洞",
                "section_id": 257,
                "section_name": "盘丝洞",
                "points": 30,
                "power_consume": 5,
                "exp_obtain": 150,
                "coins_obtain": 300,
                "description": "闻名三界的孟婆汤秘方近日曝光，众仙这才发现原来配方如此简单：大蒜，香菜，土豆，萝卜，外加一碗清水，仅此而已。"
            },
            "258": {
                "id": 258,
                "chapter_id": "盘丝洞",
                "section_id": 258,
                "section_name": "盘丝洞",
                "points": 30,
                "power_consume": 5,
                "exp_obtain": 150,
                "coins_obtain": 300,
                "description": "为了防止走光，众仙女在腾云驾雾的时候很少穿那种刻意飘的起来的迷你裙，一律改穿紧身包臀牛仔短裤了。"
            },
            "259": {
                "id": 259,
                "chapter_id": "盘丝洞",
                "section_id": 259,
                "section_name": "盘丝洞",
                "points": 30,
                "power_consume": 5,
                "exp_obtain": 150,
                "coins_obtain": 300,
                "description": "最近一届“女人我最美”大赛，南华仙子勇夺桂冠。评委主席李靖对她的评价是：肉质好皮肤白，整体能够给人以相当强烈的蹂躏欲望。"
            },
            "260": {
                "id": 260,
                "chapter_id": "盘丝洞",
                "section_id": 260,
                "section_name": "盘丝洞",
                "points": 30,
                "power_consume": 5,
                "exp_obtain": 150,
                "coins_obtain": 300,
                "description": "最近一届“雄起，男人”大赛，吴刚不负众望，勇夺桂冠。评委主席嫦娥对他的评价是：整个下体一如既往的出色。"
            },
            "261": {
                "id": 261,
                "chapter_id": "斗战堂",
                "section_id": 261,
                "section_name": "斗战堂",
                "points": 31,
                "power_consume": 5,
                "exp_obtain": 155,
                "coins_obtain": 310,
                "description": "事实上，天庭所有仙女中玉帝最满意的是北极仙子。据玉帝的目测，她的三围是十八十八十八。玉帝说，我就喜欢这样的，越瘦越好。"
            },
            "262": {
                "id": 262,
                "chapter_id": "斗战堂",
                "section_id": 262,
                "section_name": "斗战堂",
                "points": 31,
                "power_consume": 5,
                "exp_obtain": 155,
                "coins_obtain": 310,
                "description": "最近传闻有一个内裤外穿的男子从人间竟然直接飞到了天庭。这件事让玉帝产生了深深的危机感，这让神仙以后还怎么混？"
            },
            "263": {
                "id": 263,
                "chapter_id": "斗战堂",
                "section_id": 263,
                "section_name": "斗战堂",
                "points": 31,
                "power_consume": 5,
                "exp_obtain": 155,
                "coins_obtain": 310,
                "description": "第二届经济扩大会议上，众仙一致通过了关于成立天庭自由贸易区的决议。会议特别强调，要按照人类经济特区的模式来搞。"
            },
            "264": {
                "id": 264,
                "chapter_id": "斗战堂",
                "section_id": 264,
                "section_name": "斗战堂",
                "points": 31,
                "power_consume": 5,
                "exp_obtain": 155,
                "coins_obtain": 310,
                "description": "针对老是有神仙不上早朝的这种现象，玉帝经过慎重考虑后，宣布：以后大伙都不用来上朝了。"
            },
            "265": {
                "id": 265,
                "chapter_id": "斗战堂",
                "section_id": 265,
                "section_name": "斗战堂",
                "points": 31,
                "power_consume": 5,
                "exp_obtain": 155,
                "coins_obtain": 310,
                "description": "仙女们没事的时候喜欢聚在一起八卦，比如吴刚的胸大肌好性感哦，巨灵神的臀大肌好性感哦，南天大仙的腿大肌好性感哦，等等。"
            },
            "266": {
                "id": 266,
                "chapter_id": "斗战堂",
                "section_id": 266,
                "section_name": "斗战堂",
                "points": 31,
                "power_consume": 5,
                "exp_obtain": 155,
                "coins_obtain": 310,
                "description": "在西天取经结束后，悟空已经把金箍棒还给了东海龙王，毕竟那玩意老塞在耳朵里，怪痒痒。"
            },
            "267": {
                "id": 267,
                "chapter_id": "斗战堂",
                "section_id": 267,
                "section_name": "斗战堂",
                "points": 31,
                "power_consume": 5,
                "exp_obtain": 155,
                "coins_obtain": 310,
                "description": "鬼界，人界，神界，其实除了这三界之外，还存在一界，虚空界，只有修行极深的大仙方可进入虚空界。普通小仙估计连听都没听过。"
            },
            "268": {
                "id": 268,
                "chapter_id": "斗战堂",
                "section_id": 268,
                "section_name": "斗战堂",
                "points": 31,
                "power_consume": 5,
                "exp_obtain": 155,
                "coins_obtain": 310,
                "description": "通灵仙女其实并不想当神仙，她觉得做神仙很枯燥，也很无趣。她最大的愿望是，下凡当一名服装设计师。"
            },
            "269": {
                "id": 269,
                "chapter_id": "斗战堂",
                "section_id": 269,
                "section_name": "斗战堂",
                "points": 31,
                "power_consume": 5,
                "exp_obtain": 155,
                "coins_obtain": 310,
                "description": "仙界最高的山，是五指山；最深的洞，是霄云洞；最高的树，是蟠桃树；最美的云，是王母脚下的七彩祥云。"
            },
            "270": {
                "id": 270,
                "chapter_id": "斗战堂",
                "section_id": 270,
                "section_name": "斗战堂",
                "points": 31,
                "power_consume": 5,
                "exp_obtain": 155,
                "coins_obtain": 310,
                "description": "近日太上老君成功炼制出了一种可以随意改变性别的丹药。不过为了防止引起三界大混乱，玉帝禁止他进行批量生产。"
            },
            "271": {
                "id": 271,
                "chapter_id": "圣佛村",
                "section_id": 271,
                "section_name": "圣佛村",
                "points": 32,
                "power_consume": 5,
                "exp_obtain": 160,
                "coins_obtain": 320,
                "description": "长安城最近发大水，死伤无数。玉皇大帝得知后亲临凡间，面对痛不欲生的人民，玉帝意味深长的说了一句：“这就叫报应！”"
            },
            "272": {
                "id": 272,
                "chapter_id": "圣佛村",
                "section_id": 272,
                "section_name": "圣佛村",
                "points": 32,
                "power_consume": 5,
                "exp_obtain": 160,
                "coins_obtain": 320,
                "description": "八戒和婵娥大婚的第二天早上，婵娥特地为八戒准备了早餐。但是八戒告诉他：“我不可以空腹吃早餐的！”"
            },
            "273": {
                "id": 273,
                "chapter_id": "圣佛村",
                "section_id": 273,
                "section_name": "圣佛村",
                "points": 32,
                "power_consume": 5,
                "exp_obtain": 160,
                "coins_obtain": 320,
                "description": "孙悟空当初之所以学火眼金睛，其实是为了看七仙女洗澡。"
            },
            "274": {
                "id": 274,
                "chapter_id": "圣佛村",
                "section_id": 274,
                "section_name": "圣佛村",
                "points": 32,
                "power_consume": 5,
                "exp_obtain": 160,
                "coins_obtain": 320,
                "description": "孙悟空自从取完西经之后以为自己不用再降妖除魔了，直到有一天他在电视上看到中国好嗓音的吴莫愁。"
            },
            "275": {
                "id": 275,
                "chapter_id": "圣佛村",
                "section_id": 275,
                "section_name": "圣佛村",
                "points": 32,
                "power_consume": 5,
                "exp_obtain": 160,
                "coins_obtain": 320,
                "description": "织女有奖问答环节：“水快冷猜一个英语\",答案揭晓：“西瓜”。"
            },
            "276": {
                "id": 276,
                "chapter_id": "圣佛村",
                "section_id": 276,
                "section_name": "圣佛村",
                "points": 32,
                "power_consume": 5,
                "exp_obtain": 160,
                "coins_obtain": 320,
                "description": "每个神仙都羡慕孙悟空有一根可长可短可粗可细的棒子。"
            },
            "277": {
                "id": 277,
                "chapter_id": "圣佛村",
                "section_id": 277,
                "section_name": "圣佛村",
                "points": 32,
                "power_consume": 5,
                "exp_obtain": 160,
                "coins_obtain": 320,
                "description": "那吒不仅会喷火，其实他也很爱喝水。"
            },
            "278": {
                "id": 278,
                "chapter_id": "圣佛村",
                "section_id": 278,
                "section_name": "圣佛村",
                "points": 32,
                "power_consume": 5,
                "exp_obtain": 160,
                "coins_obtain": 320,
                "description": "人们总误以为白蛇和青蛇是好姐妹，其实他们是好基友来的。"
            },
            "279": {
                "id": 279,
                "chapter_id": "圣佛村",
                "section_id": 279,
                "section_name": "圣佛村",
                "points": 32,
                "power_consume": 5,
                "exp_obtain": 160,
                "coins_obtain": 320,
                "description": "人们时常不解为什么雷震子鼻子比别人长。直到后来皮诺曹告诉我们：“说谎鼻子会变长哟”。"
            },
            "280": {
                "id": 280,
                "chapter_id": "圣佛村",
                "section_id": 280,
                "section_name": "圣佛村",
                "points": 32,
                "power_consume": 5,
                "exp_obtain": 160,
                "coins_obtain": 320,
                "description": "唐僧从来不吃肉，他最喜欢吃黑木耳。"
            },
            "281": {
                "id": 281,
                "chapter_id": "紫霞谷",
                "section_id": 281,
                "section_name": "紫霞谷",
                "points": 33,
                "power_consume": 5,
                "exp_obtain": 165,
                "coins_obtain": 330,
                "description": "白龙马自从在网上认识了韩国棒子团后，就把自己变成了中国金枪鱼。"
            },
            "282": {
                "id": 282,
                "chapter_id": "紫霞谷",
                "section_id": 282,
                "section_name": "紫霞谷",
                "points": 33,
                "power_consume": 5,
                "exp_obtain": 165,
                "coins_obtain": 330,
                "description": "天庭的蟠桃不仅有长命百岁的作用，还有清凉降火的功效，夏日必备好产品哟。"
            },
            "283": {
                "id": 283,
                "chapter_id": "紫霞谷",
                "section_id": 283,
                "section_name": "紫霞谷",
                "points": 33,
                "power_consume": 5,
                "exp_obtain": 165,
                "coins_obtain": 330,
                "description": "珠海乐之科技有限公司是当年托塔天王和天蓬元帅为了泡妹子而成立的俱乐部。"
            },
            "284": {
                "id": 284,
                "chapter_id": "紫霞谷",
                "section_id": 284,
                "section_name": "紫霞谷",
                "points": 33,
                "power_consume": 5,
                "exp_obtain": 165,
                "coins_obtain": 330,
                "description": "为什么神仙们喜欢留胡子，因为他们都拜关二哥。"
            },
            "285": {
                "id": 285,
                "chapter_id": "紫霞谷",
                "section_id": 285,
                "section_name": "紫霞谷",
                "points": 33,
                "power_consume": 5,
                "exp_obtain": 165,
                "coins_obtain": 330,
                "description": "话说在天庭找不到工作的人，都喜欢混入凡间当城管。"
            },
            "286": {
                "id": 286,
                "chapter_id": "紫霞谷",
                "section_id": 286,
                "section_name": "紫霞谷",
                "points": 33,
                "power_consume": 5,
                "exp_obtain": 165,
                "coins_obtain": 330,
                "description": "神仙买苹果从来不买一颗两颗，他们告诉凡人，买苹果要买4代五代。"
            },
            "287": {
                "id": 287,
                "chapter_id": "紫霞谷",
                "section_id": 287,
                "section_name": "紫霞谷",
                "points": 33,
                "power_consume": 5,
                "exp_obtain": 165,
                "coins_obtain": 330,
                "description": "王母娘娘发现现在的人类人人携带苹果，为了断绝这种现象，她创建了一个新的族群，叫魅族。"
            },
            "288": {
                "id": 288,
                "chapter_id": "紫霞谷",
                "section_id": 288,
                "section_name": "紫霞谷",
                "points": 33,
                "power_consume": 5,
                "exp_obtain": 165,
                "coins_obtain": 330,
                "description": "“我掌控你们的现在，你们嘲笑我的未来”我是玉皇大帝，我为自己带盐。"
            },
            "289": {
                "id": 289,
                "chapter_id": "紫霞谷",
                "section_id": 289,
                "section_name": "紫霞谷",
                "points": 33,
                "power_consume": 5,
                "exp_obtain": 165,
                "coins_obtain": 330,
                "description": "牛郎和织女在分开了千千万万年之后，牛郎终于铁杵磨成绣花针。"
            },
            "290": {
                "id": 290,
                "chapter_id": "紫霞谷",
                "section_id": 290,
                "section_name": "紫霞谷",
                "points": 33,
                "power_consume": 5,
                "exp_obtain": 165,
                "coins_obtain": 330,
                "description": "白骨精从小爱吃泡菜，因此悟空特别喜欢她，有一天白骨精问他：“为什么你那么喜欢我？”悟空告诉她：“因为你是棒子”。"
            },
            "291": {
                "id": 291,
                "chapter_id": "思念池",
                "section_id": 291,
                "section_name": "思念池",
                "points": 34,
                "power_consume": 5,
                "exp_obtain": 170,
                "coins_obtain": 340,
                "description": "玉帝的御厨决定下凡到人间学一学新的厨艺，最近玉帝喜欢上了川菜火锅。厨哥决定下凡到四川成都一行。"
            },
            "292": {
                "id": 292,
                "chapter_id": "思念池",
                "section_id": 292,
                "section_name": "思念池",
                "points": 34,
                "power_consume": 5,
                "exp_obtain": 170,
                "coins_obtain": 340,
                "description": "御厨到成都后，他发现这才是真正的人间天堂啊。不仅菜好吃，而且漂亮妹子多，而且一个个水格灵灵，嫩白嫩白，看着相当有感觉。"
            },
            "293": {
                "id": 293,
                "chapter_id": "思念池",
                "section_id": 293,
                "section_name": "思念池",
                "points": 34,
                "power_consume": 5,
                "exp_obtain": 170,
                "coins_obtain": 340,
                "description": "很少有神仙能够触觉到音乐对灵魂产生的那种撞击。赤脚大仙除外，每次他一边抠脚一边听着凤凰传奇的歌时，都忍不住热泪盈眶。"
            },
            "294": {
                "id": 294,
                "chapter_id": "思念池",
                "section_id": 294,
                "section_name": "思念池",
                "points": 34,
                "power_consume": 5,
                "exp_obtain": 170,
                "coins_obtain": 340,
                "description": "人间奥特曼打小怪兽科幻电影的盛行，让玉帝意识到，神仙修行的步伐必须加快了，否则有朝一日很可能直接干到天庭来。"
            },
            "295": {
                "id": 295,
                "chapter_id": "思念池",
                "section_id": 295,
                "section_name": "思念池",
                "points": 34,
                "power_consume": 5,
                "exp_obtain": 170,
                "coins_obtain": 340,
                "description": "对于人间最近流行的小米手机，玉帝和王母其实都知道这个事情，也私底下试用过，用过之后他们的结论是，这玩意也能火？"
            },
            "296": {
                "id": 296,
                "chapter_id": "思念池",
                "section_id": 296,
                "section_name": "思念池",
                "points": 34,
                "power_consume": 5,
                "exp_obtain": 170,
                "coins_obtain": 340,
                "description": "观看《泰坦尼克号》，是牛郎和织女每年七夕的固定节目。只是每次快要看到杰克沉入大海时，两人都终于撑不住双双睡了过去。"
            },
            "297": {
                "id": 297,
                "chapter_id": "思念池",
                "section_id": 297,
                "section_name": "思念池",
                "points": 34,
                "power_consume": 5,
                "exp_obtain": 170,
                "coins_obtain": 340,
                "description": "为了看看自己在凡间究竟有多大的人气，玉帝来到凡间参加非诚勿扰。当他说出我是玉帝时，孟非扭头看了他一眼说，你丫傻逼吧。"
            },
            "298": {
                "id": 298,
                "chapter_id": "思念池",
                "section_id": 298,
                "section_name": "思念池",
                "points": 34,
                "power_consume": 5,
                "exp_obtain": 170,
                "coins_obtain": 340,
                "description": "对于人间流行的女神这个称号，王母觉得有些不可思议，波大一点，皮肤白一点，腿细一点，穿的少一点，紧一点，就可以叫女神了？"
            },
            "299": {
                "id": 299,
                "chapter_id": "思念池",
                "section_id": 299,
                "section_name": "思念池",
                "points": 34,
                "power_consume": 5,
                "exp_obtain": 170,
                "coins_obtain": 340,
                "description": "土地公近日对笑面罗汉提出了抗议，每次人间供奉的东西还没等人家走出寺庙，罗汉拿过来两口就吃掉，这神仙还要不要做了。"
            },
            "300": {
                "id": 300,
                "chapter_id": "思念池",
                "section_id": 300,
                "section_name": "思念池",
                "points": 34,
                "power_consume": 5,
                "exp_obtain": 170,
                "coins_obtain": 340,
                "description": "作为仙界真正的爱爱女神，洛神宓妃每年据说要下凡与男性爱爱上万次，平均每天三百多次。这就是她修仙的方式，羡煞旁人也。"
            },
            "301": {
                "id": 301,
                "chapter_id": "五华山",
                "section_id": 301,
                "section_name": "五华山",
                "points": 35,
                "power_consume": 5,
                "exp_obtain": 175,
                "coins_obtain": 350,
                "description": "最近因下凡人间而染上烟瘾的神仙越来越多，这让玉帝很郁闷，什么时候神仙也沦落到凡人的地步了，神仙难道也就这么容易堕落么？"
            },
            "302": {
                "id": 302,
                "chapter_id": "五华山",
                "section_id": 302,
                "section_name": "五华山",
                "points": 35,
                "power_consume": 5,
                "exp_obtain": 175,
                "coins_obtain": 350,
                "description": "关于最近人间流行的各种车震门事件，众仙经过几次激烈的争论，最后大家一致认为，如果把车窗摇下来，体验上可能会更好一些。"
            },
            "303": {
                "id": 303,
                "chapter_id": "五华山",
                "section_id": 303,
                "section_name": "五华山",
                "points": 35,
                "power_consume": 5,
                "exp_obtain": 175,
                "coins_obtain": 350,
                "description": "针对人间有关慈善方面的情况，玉帝提议，封郭美美为至尊女神。理由是：她的出现，彻底颠覆了人们在特定领域的特定价值观。"
            },
            "304": {
                "id": 304,
                "chapter_id": "五华山",
                "section_id": 304,
                "section_name": "五华山",
                "points": 35,
                "power_consume": 5,
                "exp_obtain": 175,
                "coins_obtain": 350,
                "description": "人间有真爱，仙界也有；人间有房姐，仙界同样也有。最近爆出了东华仙人名下有三百多套房，玉帝知道这个消息后，直接晕了过去。"
            },
            "305": {
                "id": 305,
                "chapter_id": "五华山",
                "section_id": 305,
                "section_name": "五华山",
                "points": 35,
                "power_consume": 5,
                "exp_obtain": 175,
                "coins_obtain": 350,
                "description": "人间霸王李刚近日上天受封，鉴于他儿子独特的开创性的表现，玉帝决定封他为：少年之爹。"
            },
            "306": {
                "id": 306,
                "chapter_id": "五华山",
                "section_id": 306,
                "section_name": "五华山",
                "points": 35,
                "power_consume": 5,
                "exp_obtain": 175,
                "coins_obtain": 350,
                "description": "风流少年陈冠希近日上天受封，鉴于他在男女关系方面所作出的有益探索，玉帝决定封他为：妇女之友。"
            },
            "307": {
                "id": 307,
                "chapter_id": "五华山",
                "section_id": 307,
                "section_name": "五华山",
                "points": 35,
                "power_consume": 5,
                "exp_obtain": 175,
                "coins_obtain": 350,
                "description": "东海老龙王的长孙深海蛟龙，近日在游泳的时候因为没有穿救生衣，不慎被淹死。"
            },
            "308": {
                "id": 308,
                "chapter_id": "五华山",
                "section_id": 308,
                "section_name": "五华山",
                "points": 35,
                "power_consume": 5,
                "exp_obtain": 175,
                "coins_obtain": 350,
                "description": "在七仙女的倡导下，众仙最近也开始练瑜伽，以深化修行之道。但因为用力过猛，经常发生一些断胳膊断腿的事儿。"
            },
            "309": {
                "id": 309,
                "chapter_id": "五华山",
                "section_id": 309,
                "section_name": "五华山",
                "points": 35,
                "power_consume": 5,
                "exp_obtain": 175,
                "coins_obtain": 350,
                "description": "针对仙界最近不稳定的经济形势，财神组织召开了经济扩大会议，会议一致通过，今年务必要把仙界的GDP增幅控制在7%以下。"
            },
            "310": {
                "id": 310,
                "chapter_id": "五华山",
                "section_id": 310,
                "section_name": "五华山",
                "points": 35,
                "power_consume": 5,
                "exp_obtain": 175,
                "coins_obtain": 350,
                "description": "为了进一步刺激仙界经济的发展，财神决定再次增发三万亿Q币，以此来平衡市场相对紧张的供需关系。"
            },
            "311": {
                "id": 311,
                "chapter_id": "尘缘地",
                "section_id": 311,
                "section_name": "尘缘地",
                "points": 36,
                "power_consume": 5,
                "exp_obtain": 180,
                "coins_obtain": 360,
                "description": "人间大佬马化腾近日入狱受罚，鉴于他在IT界一贯的坚定的卓有成效的垄断行为，阎王决定，放了他，让他返回人间，继续垄断下去。"
            },
            "312": {
                "id": 312,
                "chapter_id": "尘缘地",
                "section_id": 312,
                "section_name": "尘缘地",
                "points": 36,
                "power_consume": 5,
                "exp_obtain": 180,
                "coins_obtain": 360,
                "description": "许多神仙最近也都有了自己的微博账号。有些还加了V。二郎神叫我与狗，巨灵神叫下体很硬，蓬莱仙女叫深不可测。"
            },
            "313": {
                "id": 313,
                "chapter_id": "尘缘地",
                "section_id": 313,
                "section_name": "尘缘地",
                "points": 36,
                "power_consume": 5,
                "exp_obtain": 180,
                "coins_obtain": 360,
                "description": "又到了一年一度的旅游季节，这一次，大家一致同意，到阿尔卑斯山去滑雪，体验雪花的柔美，享受尖叫的快感。"
            },
            "314": {
                "id": 314,
                "chapter_id": "尘缘地",
                "section_id": 314,
                "section_name": "尘缘地",
                "points": 36,
                "power_consume": 5,
                "exp_obtain": 180,
                "coins_obtain": 360,
                "description": "太乙真人下凡，要办签证。真人说我是神仙，签证官冷笑一声说那也得办。真人怒说我要送你下地狱。于是真人就被送进了警察局。"
            },
            "315": {
                "id": 315,
                "chapter_id": "尘缘地",
                "section_id": 315,
                "section_name": "尘缘地",
                "points": 36,
                "power_consume": 5,
                "exp_obtain": 180,
                "coins_obtain": 360,
                "description": "羊角大仙近日又喜得了一贵子。思索良久，大仙为其取名为：羊驼。"
            },
            "316": {
                "id": 316,
                "chapter_id": "尘缘地",
                "section_id": 316,
                "section_name": "尘缘地",
                "points": 36,
                "power_consume": 5,
                "exp_obtain": 180,
                "coins_obtain": 360,
                "description": "最近仙界红白喜事不少，南天童子也因此苦不堪言，最近他给出的份子钱是他每个月薪水的16倍。"
            },
            "317": {
                "id": 317,
                "chapter_id": "尘缘地",
                "section_id": 317,
                "section_name": "尘缘地",
                "points": 36,
                "power_consume": 5,
                "exp_obtain": 180,
                "coins_obtain": 360,
                "description": "当织女听到牛郎出轨，而且还是跟巨灵神的消息后，她忍不住流下了震惊的泪水。"
            },
            "318": {
                "id": 318,
                "chapter_id": "尘缘地",
                "section_id": 318,
                "section_name": "尘缘地",
                "points": 36,
                "power_consume": 5,
                "exp_obtain": 180,
                "coins_obtain": 360,
                "description": "针对近日人间发生的海天盛筵事件，二郎神表示，将会仔细研究录像，进入深入的调查取证，必要时自会下凡进行处理。"
            },
            "319": {
                "id": 319,
                "chapter_id": "尘缘地",
                "section_id": 319,
                "section_name": "尘缘地",
                "points": 36,
                "power_consume": 5,
                "exp_obtain": 180,
                "coins_obtain": 360,
                "description": "如来和玉帝见面，口头禅就是，你被猴打过。老说老说，玉帝终于有一天忍不住爆发了，我就XXX了，我被猴打过又怎么了。"
            },
            "320": {
                "id": 320,
                "chapter_id": "尘缘地",
                "section_id": 320,
                "section_name": "尘缘地",
                "points": 36,
                "power_consume": 5,
                "exp_obtain": 180,
                "coins_obtain": 360,
                "description": "对于人间流行的民工讨薪难事件，众神仙一致决定，将诅咒系法术注入民工体内，使其可对欠薪者全家造成灭门伤害。"
            },
            "321": {
                "id": 321,
                "chapter_id": "了然原",
                "section_id": 321,
                "section_name": "了然原",
                "points": 37,
                "power_consume": 5,
                "exp_obtain": 185,
                "coins_obtain": 370,
                "description": "如果单纯只是为了修仙而修仙，那很容易走火入魔。灵宝真人闭关修仙二十年，最后己修成了一傻子，整天只会喊好饿啊我好饿啊。"
            },
            "322": {
                "id": 322,
                "chapter_id": "了然原",
                "section_id": 322,
                "section_name": "了然原",
                "points": 37,
                "power_consume": 5,
                "exp_obtain": 185,
                "coins_obtain": 370,
                "description": "关于人间垄断企业相关的争议，神仙们表达了一个基本的观点，那就是：垄断死全家。"
            },
            "323": {
                "id": 323,
                "chapter_id": "了然原",
                "section_id": 323,
                "section_name": "了然原",
                "points": 37,
                "power_consume": 5,
                "exp_obtain": 185,
                "coins_obtain": 370,
                "description": "最近不仅人间家庭暴力事件屡屡上演，就连仙界也是如此。牛魔王那么大一块头，被铁扇公主打的现在和七仙女差不多体型了。"
            },
            "324": {
                "id": 324,
                "chapter_id": "了然原",
                "section_id": 324,
                "section_name": "了然原",
                "points": 37,
                "power_consume": 5,
                "exp_obtain": 185,
                "coins_obtain": 370,
                "description": "对于人间潜规则这个行规，通灵大仙的观点是：潜的力度还不够，应该进一步加强，争取做到全民参潜的效应。"
            },
            "325": {
                "id": 325,
                "chapter_id": "了然原",
                "section_id": 325,
                "section_name": "了然原",
                "points": 37,
                "power_consume": 5,
                "exp_obtain": 185,
                "coins_obtain": 370,
                "description": "因为生活拮据，后裔不得不在晚上出来摆摊卖烧烤。不过很不幸，他的烧烤基本上都被城管给吃掉了。当然，白吃。"
            },
            "326": {
                "id": 326,
                "chapter_id": "了然原",
                "section_id": 326,
                "section_name": "了然原",
                "points": 37,
                "power_consume": 5,
                "exp_obtain": 185,
                "coins_obtain": 370,
                "description": "因为生活的太压抑，最近牛犊子仙人发布言论声称要炸南天门，炸凌霄殿，炸玉帝，炸王母。很快，他就被弄死了。"
            },
            "327": {
                "id": 327,
                "chapter_id": "了然原",
                "section_id": 327,
                "section_name": "了然原",
                "points": 37,
                "power_consume": 5,
                "exp_obtain": 185,
                "coins_obtain": 370,
                "description": "人间流行毒奶粉，仙界最近也开始流行。玉帝很迷惘，什么时候神仙也开始喝奶粉了。"
            },
            "328": {
                "id": 328,
                "chapter_id": "了然原",
                "section_id": 328,
                "section_name": "了然原",
                "points": 37,
                "power_consume": 5,
                "exp_obtain": 185,
                "coins_obtain": 370,
                "description": "道德真君是仙界中最没有道德素养的一个道德大仙。"
            },
            "329": {
                "id": 329,
                "chapter_id": "了然原",
                "section_id": 329,
                "section_name": "了然原",
                "points": 37,
                "power_consume": 5,
                "exp_obtain": 185,
                "coins_obtain": 370,
                "description": "仙界同样富豪众多，而且懂得享受。最近财神爷就下凡购置了一艘超级豪华游轮，没事的时候就从给天上下来玩一会。"
            },
            "330": {
                "id": 330,
                "chapter_id": "了然原",
                "section_id": 330,
                "section_name": "了然原",
                "points": 37,
                "power_consume": 5,
                "exp_obtain": 185,
                "coins_obtain": 370,
                "description": "后裔是仙界中公认的屌丝，二郎神是仙界公认的高富帅，而嫦娥，则是仙界中公认的白富美，可以进行深度开发的一个原始美人。"
            },
            "331": {
                "id": 331,
                "chapter_id": "那烂陀",
                "section_id": 331,
                "section_name": "那烂陀",
                "points": 38,
                "power_consume": 5,
                "exp_obtain": 190,
                "coins_obtain": 380,
                "description": "人类越来越牛逼，造出来的飞机飞的越来越高，也越来越快。这一定程度干扰了天庭的正常交通。玉帝寻思着他是不是该做点什么了。"
            },
            "332": {
                "id": 332,
                "chapter_id": "那烂陀",
                "section_id": 332,
                "section_name": "那烂陀",
                "points": 38,
                "power_consume": 5,
                "exp_obtain": 190,
                "coins_obtain": 380,
                "description": "突然间，神仙开始流行纹身，雷公胸部纹了条龙，电母手臂纹了条凤，二郎神臀部纹了条狗，巨灵神腹部纹了条蚯蚓。"
            },
            "333": {
                "id": 333,
                "chapter_id": "那烂陀",
                "section_id": 333,
                "section_name": "那烂陀",
                "points": 38,
                "power_consume": 5,
                "exp_obtain": 190,
                "coins_obtain": 380,
                "description": "最近仙界掀起一股移民狂潮，许多神仙打算移民到西方耶稣那边，据说那里各方面条件都要好。当然，这些神仙很快就被玉帝弄死了。"
            },
            "334": {
                "id": 334,
                "chapter_id": "那烂陀",
                "section_id": 334,
                "section_name": "那烂陀",
                "points": 38,
                "power_consume": 5,
                "exp_obtain": 190,
                "coins_obtain": 380,
                "description": "第七届中国好声音冠军鲁一发，演唱曲目《我不是黄蓉》，他撕心裂肺般的嗓音震的几位导师当场几乎休克。他其实是巨灵神的化身。"
            },
            "335": {
                "id": 335,
                "chapter_id": "那烂陀",
                "section_id": 335,
                "section_name": "那烂陀",
                "points": 38,
                "power_consume": 5,
                "exp_obtain": 190,
                "coins_obtain": 380,
                "description": "喜马拉雅之神最近打算搬家了，因为喜马拉山每年都在变暖，每年都在变矮，他无法忍受这一状况，但却又无可奈何。"
            },
            "336": {
                "id": 336,
                "chapter_id": "那烂陀",
                "section_id": 336,
                "section_name": "那烂陀",
                "points": 38,
                "power_consume": 5,
                "exp_obtain": 190,
                "coins_obtain": 380,
                "description": "玉帝最近打算改变一下星系的基本规则，让地球绕着月亮转一段时间，老是绕着太阳转，他看着头晕。"
            },
            "337": {
                "id": 337,
                "chapter_id": "那烂陀",
                "section_id": 337,
                "section_name": "那烂陀",
                "points": 38,
                "power_consume": 5,
                "exp_obtain": 190,
                "coins_obtain": 380,
                "description": "天界就神仙该不该吃肉这一议题请教如来，如来说，荤即是素，素即是荤，何必分清。众仙大喜说，那就是可以吃了？如来说，不可以。"
            },
            "338": {
                "id": 338,
                "chapter_id": "那烂陀",
                "section_id": 338,
                "section_name": "那烂陀",
                "points": 38,
                "power_consume": 5,
                "exp_obtain": 190,
                "coins_obtain": 380,
                "description": "针对近日人间发生的众多领土争议，玉帝表示，其他的我可以不管，但是，钓鱼岛一定是中国的，希望鬼子不要逼他触发天庭之怒。"
            },
            "339": {
                "id": 339,
                "chapter_id": "那烂陀",
                "section_id": 339,
                "section_name": "那烂陀",
                "points": 38,
                "power_consume": 5,
                "exp_obtain": 190,
                "coins_obtain": 380,
                "description": "在足球方面，玉帝对于亚洲近来风头正劲的恒大球队赞赏有加，他说，搞足球就得这么干，猛砸钱，狂砸钱，往死里砸钱。"
            },
            "340": {
                "id": 340,
                "chapter_id": "那烂陀",
                "section_id": 340,
                "section_name": "那烂陀",
                "points": 38,
                "power_consume": 5,
                "exp_obtain": 190,
                "coins_obtain": 380,
                "description": "财神手下火焰大仙近日携带近5亿的Q币潜逃至西方极乐世界。这一事件在仙界引起了极大的震动。玉帝批示，务必要彻查此事。"
            },
            "341": {
                "id": 341,
                "chapter_id": "生死场",
                "section_id": 341,
                "section_name": "生死场",
                "points": 39,
                "power_consume": 5,
                "exp_obtain": 195,
                "coins_obtain": 390,
                "description": "地狱高层最近发生了人事变动，大刑官钟馗被开除。原因是他调戏女鬼。这让阎罗王很恼火，女鬼你也有兴趣，你这TMD是有多饥渴。"
            },
            "342": {
                "id": 342,
                "chapter_id": "生死场",
                "section_id": 342,
                "section_name": "生死场",
                "points": 39,
                "power_consume": 5,
                "exp_obtain": 195,
                "coins_obtain": 390,
                "description": "仙界工资最高的是玉帝身边的红人太白金星，传闻他一年的工资达到8000多万Q币。"
            },
            "343": {
                "id": 343,
                "chapter_id": "生死场",
                "section_id": 343,
                "section_name": "生死场",
                "points": 39,
                "power_consume": 5,
                "exp_obtain": 195,
                "coins_obtain": 390,
                "description": "在神仙面前，马克思主义变成了浮云。事实上，当马克思上天之后，他也意识到了确实还存在这么一个纯粹的意识世界。"
            },
            "344": {
                "id": 344,
                "chapter_id": "生死场",
                "section_id": 344,
                "section_name": "生死场",
                "points": 39,
                "power_consume": 5,
                "exp_obtain": 195,
                "coins_obtain": 390,
                "description": "外星人确实存在，他们经常组团光临天庭，与众神仙讨论修仙之道。"
            },
            "345": {
                "id": 345,
                "chapter_id": "生死场",
                "section_id": 345,
                "section_name": "生死场",
                "points": 39,
                "power_consume": 5,
                "exp_obtain": 195,
                "coins_obtain": 390,
                "description": "关于宇宙本身是否有寿命这个话题，玉帝的观点是，就算有，宇宙也一定是比我先死。"
            },
            "346": {
                "id": 346,
                "chapter_id": "生死场",
                "section_id": 346,
                "section_name": "生死场",
                "points": 39,
                "power_consume": 5,
                "exp_obtain": 195,
                "coins_obtain": 390,
                "description": "人间最有手机游戏很火，但大部分都是三国武侠题材。对此玉帝觉得有些恼火，难道神仙的地位人间这些货色都比不上么。"
            },
            "347": {
                "id": 347,
                "chapter_id": "生死场",
                "section_id": 347,
                "section_name": "生死场",
                "points": 39,
                "power_consume": 5,
                "exp_obtain": 195,
                "coins_obtain": 390,
                "description": "灵异事件其实没那么玄乎，不过是一些还没有被黑白无常收走的孤魂野鬼而已，他们都是善良的鬼，没什么好怕的。"
            },
            "348": {
                "id": 348,
                "chapter_id": "生死场",
                "section_id": 348,
                "section_name": "生死场",
                "points": 39,
                "power_consume": 5,
                "exp_obtain": 195,
                "coins_obtain": 390,
                "description": "创新对于神仙来说同样重要。比如姜子牙将垂钓的修行方式改为拳击，而二郎神则采用了一种比较休闲的修仙方式，遛狗。"
            },
            "349": {
                "id": 349,
                "chapter_id": "生死场",
                "section_id": 349,
                "section_name": "生死场",
                "points": 39,
                "power_consume": 5,
                "exp_obtain": 195,
                "coins_obtain": 390,
                "description": "所有神仙中，普通话最差的当属南海仙人，因为他祖籍是海南黎族。他说的话，大家基本都是在猜，都听清楚那是不可能的了。"
            },
            "350": {
                "id": 350,
                "chapter_id": "生死场",
                "section_id": 350,
                "section_name": "生死场",
                "points": 39,
                "power_consume": 5,
                "exp_obtain": 195,
                "coins_obtain": 390,
                "description": "太白金星向玉帝建议，以后搞一个签到制度，凡是迟到或者不来上朝的，一律扣Q币。玉帝打了个呵欠说，算了吧，我自己都懒得上朝。"
            },
            "351": {
                "id": 351,
                "chapter_id": "龙须地",
                "section_id": 351,
                "section_name": "龙须地",
                "points": 40,
                "power_consume": 5,
                "exp_obtain": 200,
                "coins_obtain": 400,
                "description": "在今年仙界的“下基层，察民情”活动中，北天仙人荣获第一。因为他自从下到凡间之后，就再也没有回来，消失了。"
            },
            "352": {
                "id": 352,
                "chapter_id": "龙须地",
                "section_id": 352,
                "section_name": "龙须地",
                "points": 40,
                "power_consume": 5,
                "exp_obtain": 200,
                "coins_obtain": 400,
                "description": "每年七夕，法海都会坐在雷锋塔顶，点上一支香烟，45度角仰望星空，他不禁陷入痛苦的沉思中，为什么许仙喜欢的是白素贞，而不是他。"
            },
            "353": {
                "id": 353,
                "chapter_id": "龙须地",
                "section_id": 353,
                "section_name": "龙须地",
                "points": 40,
                "power_consume": 5,
                "exp_obtain": 200,
                "coins_obtain": 400,
                "description": "作为仙界首富，财神赵公明的总资产已经达到了7800亿Q币，这相当于整个人间500年的总产值。"
            },
            "354": {
                "id": 354,
                "chapter_id": "龙须地",
                "section_id": 354,
                "section_name": "龙须地",
                "points": 40,
                "power_consume": 5,
                "exp_obtain": 200,
                "coins_obtain": 400,
                "description": "对于人间这些国家领导人，玉帝最欣赏的就是朝鲜金三胖，因为他觉得三胖最特别的地方就在于，他是如此的令人无语。"
            },
            "355": {
                "id": 355,
                "chapter_id": "龙须地",
                "section_id": 355,
                "section_name": "龙须地",
                "points": 40,
                "power_consume": 5,
                "exp_obtain": 200,
                "coins_obtain": 400,
                "description": "娱乐圈最近很混乱，二郎神一直蠢蠢欲动，他在想，都这样没有底线没有节操了，干脆让老子下去一次性全给潜了得了。"
            },
            "356": {
                "id": 356,
                "chapter_id": "龙须地",
                "section_id": 356,
                "section_name": "龙须地",
                "points": 40,
                "power_consume": 5,
                "exp_obtain": 200,
                "coins_obtain": 400,
                "description": "在观看完今年人间一年一度的世界模特大赛之后，玉帝主要的感受是，都穿那么紧的比基尼，勒的不疼么。"
            },
            "357": {
                "id": 357,
                "chapter_id": "龙须地",
                "section_id": 357,
                "section_name": "龙须地",
                "points": 40,
                "power_consume": 5,
                "exp_obtain": 200,
                "coins_obtain": 400,
                "description": "仙界最近很流行整容塑体这一套，毫无疑问，紫衣仙女是最为耀眼的一个。她的三围在整容后成功的变为1-250-1。"
            },
            "358": {
                "id": 358,
                "chapter_id": "龙须地",
                "section_id": 358,
                "section_name": "龙须地",
                "points": 40,
                "power_consume": 5,
                "exp_obtain": 200,
                "coins_obtain": 400,
                "description": "日游神最近从人间收集到了许多明星的不雅照。最近他打算在仙界办这样一个展览，名字都想好了，叫：丑陋的人性。"
            },
            "359": {
                "id": 359,
                "chapter_id": "龙须地",
                "section_id": 359,
                "section_name": "龙须地",
                "points": 40,
                "power_consume": 5,
                "exp_obtain": 200,
                "coins_obtain": 400,
                "description": "韩剧很热，韩流来袭，众仙女一整个夏天都在思密达中度过。她们尤其喜欢棒子们演戏时的那个噢？噢？噢？的嘟嘴表情。唉……"
            },
            "360": {
                "id": 360,
                "chapter_id": "龙须地",
                "section_id": 360,
                "section_name": "龙须地",
                "points": 40,
                "power_consume": 5,
                "exp_obtain": 200,
                "coins_obtain": 400,
                "description": "最近凡间的后裔又传来了消息，由于城管的介入，烧烤摊成功关闭。他思虑良久后，加入了城管组织。"
            },
            "361": {
                "id": 361,
                "chapter_id": "南华峰",
                "section_id": 361,
                "section_name": "南华峰",
                "points": 41,
                "power_consume": 5,
                "exp_obtain": 205,
                "coins_obtain": 410,
                "description": "紫霞仙子因为不忍看着人间农村众多留守儿童和老人受苦，她将自己的全部法术倾注于人间，护佑这些孩子和老人的健康与快乐。"
            },
            "362": {
                "id": 362,
                "chapter_id": "南华峰",
                "section_id": 362,
                "section_name": "南华峰",
                "points": 41,
                "power_consume": 5,
                "exp_obtain": 205,
                "coins_obtain": 410,
                "description": "二郎神最近出版了一本写真画册，名为《我与哮天犬》。该画册受到了众仙的热捧，因为大家都想知道他们是怎么搞的。"
            },
            "363": {
                "id": 363,
                "chapter_id": "南华峰",
                "section_id": 363,
                "section_name": "南华峰",
                "points": 41,
                "power_consume": 5,
                "exp_obtain": 205,
                "coins_obtain": 410,
                "description": "其实神仙也是有男女之分的，只是这个性别区分度可能没有人间那么高，那么夸张。"
            },
            "364": {
                "id": 364,
                "chapter_id": "南华峰",
                "section_id": 364,
                "section_name": "南华峰",
                "points": 41,
                "power_consume": 5,
                "exp_obtain": 205,
                "coins_obtain": 410,
                "description": "老龙王真的老了，不仅晕船，而且恐高，最近上天那一次，好几次差点从云彩上掉下来。他觉得他应该退休了。"
            },
            "365": {
                "id": 365,
                "chapter_id": "南华峰",
                "section_id": 365,
                "section_name": "南华峰",
                "points": 41,
                "power_consume": 5,
                "exp_obtain": 205,
                "coins_obtain": 410,
                "description": "托塔李天王的那座塔，其实是用东海三太子的皮和筋做成的。"
            },
            "366": {
                "id": 366,
                "chapter_id": "南华峰",
                "section_id": 366,
                "section_name": "南华峰",
                "points": 41,
                "power_consume": 5,
                "exp_obtain": 205,
                "coins_obtain": 410,
                "description": "白素贞并没有被压到雷锋塔下，而是一直住在雷峰塔的顶层，东南朝向，落地窗，全海景，堪称奢侈。"
            },
            "367": {
                "id": 367,
                "chapter_id": "南华峰",
                "section_id": 367,
                "section_name": "南华峰",
                "points": 41,
                "power_consume": 5,
                "exp_obtain": 205,
                "coins_obtain": 410,
                "description": "周星驰很久不拍片了，这让众神仙非常遗憾，昔日的济癫，何时才能够回来呢？"
            },
            "368": {
                "id": 368,
                "chapter_id": "南华峰",
                "section_id": 368,
                "section_name": "南华峰",
                "points": 41,
                "power_consume": 5,
                "exp_obtain": 205,
                "coins_obtain": 410,
                "description": "近日众仙列出了一份最喜欢吃的人间美食。排名前三的分别是山西臊子面，河北驴肉火烧，凉拌黄瓜。"
            },
            "369": {
                "id": 369,
                "chapter_id": "南华峰",
                "section_id": 369,
                "section_name": "南华峰",
                "points": 41,
                "power_consume": 5,
                "exp_obtain": 205,
                "coins_obtain": 410,
                "description": "每年的中秋节，玉帝都会召集众仙前往月宫，大家一起坐在桂树下，吃着烤兔肉，喝着瑶池水，观看嫦娥的精彩演出。"
            },
            "370": {
                "id": 370,
                "chapter_id": "南华峰",
                "section_id": 370,
                "section_name": "南华峰",
                "points": 41,
                "power_consume": 5,
                "exp_obtain": 205,
                "coins_obtain": 410,
                "description": "最近仙界莫名其妙的多了许多妖魔鬼魂，玉帝怀疑阎罗王是不是有叛逆之心，想夺他的位子。"
            },
            "371": {
                "id": 371,
                "chapter_id": "黑虎山",
                "section_id": 371,
                "section_name": "黑虎山",
                "points": 42,
                "power_consume": 5,
                "exp_obtain": 210,
                "coins_obtain": 420,
                "description": "牛魔王最近喜得贵子，思虑良久，他最终为这个牛犊子起名为牛牪犇。"
            },
            "372": {
                "id": 372,
                "chapter_id": "黑虎山",
                "section_id": 372,
                "section_name": "黑虎山",
                "points": 42,
                "power_consume": 5,
                "exp_obtain": 210,
                "coins_obtain": 420,
                "description": "人间的后裔近日再传喜讯，他已经成功的结婚了。妻子叫丽丽。"
            },
            "373": {
                "id": 373,
                "chapter_id": "黑虎山",
                "section_id": 373,
                "section_name": "黑虎山",
                "points": 42,
                "power_consume": 5,
                "exp_obtain": 210,
                "coins_obtain": 420,
                "description": "后裔其实并不是他自己的真是名字，那只是一个代号。他真正的名字叫刘德龙。"
            },
            "374": {
                "id": 374,
                "chapter_id": "黑虎山",
                "section_id": 374,
                "section_name": "黑虎山",
                "points": 42,
                "power_consume": 5,
                "exp_obtain": 210,
                "coins_obtain": 420,
                "description": "在忍受了数百年的寂寞苦修后，法海的情愫终于爆发，近日，他高调宣布出柜。"
            },
            "375": {
                "id": 375,
                "chapter_id": "黑虎山",
                "section_id": 375,
                "section_name": "黑虎山",
                "points": 42,
                "power_consume": 5,
                "exp_obtain": 210,
                "coins_obtain": 420,
                "description": "张果老的驴最近产下一驹子，张老喜不胜喜，他为其取名为果果。大家都说果果长的很像张果老。"
            },
            "376": {
                "id": 376,
                "chapter_id": "黑虎山",
                "section_id": 376,
                "section_name": "黑虎山",
                "points": 42,
                "power_consume": 5,
                "exp_obtain": 210,
                "coins_obtain": 420,
                "description": "财神最近受到了玉帝的点名批评。因为他私自下凡在紫荆城中购置了76套四合院，直接使得紫荆城乱了套。"
            },
            "377": {
                "id": 377,
                "chapter_id": "黑虎山",
                "section_id": 377,
                "section_name": "黑虎山",
                "points": 42,
                "power_consume": 5,
                "exp_obtain": 210,
                "coins_obtain": 420,
                "description": "近日传闻雷公有了外遇，电母听到这个消息后，发了疯一样用电锥子戳雷公。若不是众仙阻拦及时，雷公一定被活活戳死。"
            },
            "378": {
                "id": 378,
                "chapter_id": "黑虎山",
                "section_id": 378,
                "section_name": "黑虎山",
                "points": 42,
                "power_consume": 5,
                "exp_obtain": 210,
                "coins_obtain": 420,
                "description": "玉帝最近很喜欢看《舌尖上的中国》这个栏目，他寻思着是不是找个时间组织众仙下凡一趟，按照节目上说的挨个尝一遍。"
            },
            "379": {
                "id": 379,
                "chapter_id": "黑虎山",
                "section_id": 379,
                "section_name": "黑虎山",
                "points": 42,
                "power_consume": 5,
                "exp_obtain": 210,
                "coins_obtain": 420,
                "description": "盘古爷自从开天辟地之后，他便一直在西天苍山沉睡。据说每过一亿年，盘古爷才会睁眼一次。"
            },
            "380": {
                "id": 380,
                "chapter_id": "黑虎山",
                "section_id": 380,
                "section_name": "黑虎山",
                "points": 42,
                "power_consume": 5,
                "exp_obtain": 210,
                "coins_obtain": 420,
                "description": "悟空被压在五指山下的时候，唐僧每天都在给他送饭。送了整整五百年的饭，而且每次都是蛋炒饭。悟空已经要吃吐了。"
            },
            "381": {
                "id": 381,
                "chapter_id": "妖风洞",
                "section_id": 381,
                "section_name": "妖风洞",
                "points": 43,
                "power_consume": 5,
                "exp_obtain": 215,
                "coins_obtain": 430,
                "description": "玉帝希望能够推选出一个仙界吉祥物，以此来代表仙界的正义与仁爱。最终大家选出的是王母蟠桃园中的小蝴蝶。"
            },
            "382": {
                "id": 382,
                "chapter_id": "妖风洞",
                "section_id": 382,
                "section_name": "妖风洞",
                "points": 43,
                "power_consume": 5,
                "exp_obtain": 215,
                "coins_obtain": 430,
                "description": "玉帝最近喜欢上了人间的一款叫《英雄联盟》游戏，没事的时候他总会拉上太白金星太上老君一起组队撸两把。"
            },
            "383": {
                "id": 383,
                "chapter_id": "妖风洞",
                "section_id": 383,
                "section_name": "妖风洞",
                "points": 43,
                "power_consume": 5,
                "exp_obtain": 215,
                "coins_obtain": 430,
                "description": "流沙河因为气候干旱，最近已经完全枯干。"
            },
            "384": {
                "id": 384,
                "chapter_id": "妖风洞",
                "section_id": 384,
                "section_name": "妖风洞",
                "points": 43,
                "power_consume": 5,
                "exp_obtain": 215,
                "coins_obtain": 430,
                "description": "南天门守卫最近发现了了一架F117隐形飞机经常在附近晃荡，经过一番激战，南天门守卫重伤。"
            },
            "385": {
                "id": 385,
                "chapter_id": "妖风洞",
                "section_id": 385,
                "section_name": "妖风洞",
                "points": 43,
                "power_consume": 5,
                "exp_obtain": 215,
                "coins_obtain": 430,
                "description": "南海龙宫的蟹黄大将最近在潜水时不幸发生意外，窒息身亡。"
            },
            "386": {
                "id": 386,
                "chapter_id": "妖风洞",
                "section_id": 386,
                "section_name": "妖风洞",
                "points": 43,
                "power_consume": 5,
                "exp_obtain": 215,
                "coins_obtain": 430,
                "description": "关于人间最近发生的法官集体嫖娼事件，众仙的意见是：嫖了就嫖了吧，没什么大惊小怪的，这只是他们的一次正常娱乐活动罢了。"
            },
            "387": {
                "id": 387,
                "chapter_id": "妖风洞",
                "section_id": 387,
                "section_name": "妖风洞",
                "points": 43,
                "power_consume": 5,
                "exp_obtain": 215,
                "coins_obtain": 430,
                "description": "南天仙女最近以你为减肥过度而昏厥数天，醒来以后变成了植物人。"
            },
            "388": {
                "id": 388,
                "chapter_id": "妖风洞",
                "section_id": 388,
                "section_name": "妖风洞",
                "points": 43,
                "power_consume": 5,
                "exp_obtain": 215,
                "coins_obtain": 430,
                "description": "为了更好的化身人间进行民情体察，土行孙打算去蓝翔技校学习一门在人间能真正用得上的技术。"
            },
            "389": {
                "id": 389,
                "chapter_id": "妖风洞",
                "section_id": 389,
                "section_name": "妖风洞",
                "points": 43,
                "power_consume": 5,
                "exp_obtain": 215,
                "coins_obtain": 430,
                "description": "洛神宓妃作为仙界爱爱女神，她从来没有觉得这有什么不妥，因为这原本就是她的修行方式。"
            },
            "390": {
                "id": 390,
                "chapter_id": "妖风洞",
                "section_id": 390,
                "section_name": "妖风洞",
                "points": 43,
                "power_consume": 5,
                "exp_obtain": 215,
                "coins_obtain": 430,
                "description": "西楚霸王归天之后，他被玉帝封为仁义武大帝。刘邦归天之后，阎罗王每天都会打上他半个小时。"
            },
            "391": {
                "id": 391,
                "chapter_id": "大乘愚",
                "section_id": 391,
                "section_name": "大乘愚",
                "points": 44,
                "power_consume": 5,
                "exp_obtain": 220,
                "coins_obtain": 440,
                "description": "因为吴刚吃的玉兔太多，嫦娥上诉到了玉帝那里。玉帝叹了口气说，你知道么，他吃的其实不是兔肉，是寂寞，是孤苦。"
            },
            "392": {
                "id": 392,
                "chapter_id": "大乘愚",
                "section_id": 392,
                "section_name": "大乘愚",
                "points": 44,
                "power_consume": 5,
                "exp_obtain": 220,
                "coins_obtain": 440,
                "description": "孙大圣身上的猴毛总共是三千七百六十五根，其实没有我们想象的那么多。他的毛是比较粗硬的那种类型。"
            },
            "393": {
                "id": 393,
                "chapter_id": "大乘愚",
                "section_id": 393,
                "section_name": "大乘愚",
                "points": 44,
                "power_consume": 5,
                "exp_obtain": 220,
                "coins_obtain": 440,
                "description": "筹备多年的北天门工程近日在仙界启动。仙界多年来堵塞的交通将获得有效缓解。"
            },
            "394": {
                "id": 394,
                "chapter_id": "大乘愚",
                "section_id": 394,
                "section_name": "大乘愚",
                "points": 44,
                "power_consume": 5,
                "exp_obtain": 220,
                "coins_obtain": 440,
                "description": "九头鸟因为最近屡犯天规，被处以砍头刑罚，最近被砍的只剩下一颗脑袋了。"
            },
            "395": {
                "id": 395,
                "chapter_id": "大乘愚",
                "section_id": 395,
                "section_name": "大乘愚",
                "points": 44,
                "power_consume": 5,
                "exp_obtain": 220,
                "coins_obtain": 440,
                "description": "夏之妺喜、商之妲己、周之褒姒以及春秋之骊姬，被称为古代四大妖姬。事实上，她们是四姐妹。"
            },
            "396": {
                "id": 396,
                "chapter_id": "大乘愚",
                "section_id": 396,
                "section_name": "大乘愚",
                "points": 44,
                "power_consume": 5,
                "exp_obtain": 220,
                "coins_obtain": 440,
                "description": "张果老的毛驴越来越老，渐渐的已经骑不动了，而小毛驴果果又没有完全长大，这让他很发愁，以后出行骑什么呢？"
            },
            "397": {
                "id": 397,
                "chapter_id": "大乘愚",
                "section_id": 397,
                "section_name": "大乘愚",
                "points": 44,
                "power_consume": 5,
                "exp_obtain": 220,
                "coins_obtain": 440,
                "description": "北海龙王很清楚，美人鱼其实不是上半身人下半身鱼，而是上半身鱼下半身人。"
            },
            "398": {
                "id": 398,
                "chapter_id": "大乘愚",
                "section_id": 398,
                "section_name": "大乘愚",
                "points": 44,
                "power_consume": 5,
                "exp_obtain": 220,
                "coins_obtain": 440,
                "description": "铁扇公主在牛魔王生日那天，下凡去找孙悟空玩去了。不过这是现在牛魔王还不知道。"
            },
            "399": {
                "id": 399,
                "chapter_id": "大乘愚",
                "section_id": 399,
                "section_name": "大乘愚",
                "points": 44,
                "power_consume": 5,
                "exp_obtain": 220,
                "coins_obtain": 440,
                "description": "哪吒的风火轮因为使用频率过高，所以已经被彻底烧坏了，现在基本上也就是当个旱冰鞋来穿。"
            },
            "400": {
                "id": 400,
                "chapter_id": "大乘愚",
                "section_id": 400,
                "section_name": "大乘愚",
                "points": 44,
                "power_consume": 5,
                "exp_obtain": 220,
                "coins_obtain": 440,
                "description": "由于人间台风频繁，造成损失过于严重。风神近日被玉帝免职，并打到地狱。"
            },
            "401": {
                "id": 401,
                "chapter_id": "普陀寺",
                "section_id": 401,
                "section_name": "普陀寺",
                "points": 45,
                "power_consume": 5,
                "exp_obtain": 225,
                "coins_obtain": 450,
                "description": "北斗七星君最近打算和七仙女结对子，不过这遭到了王母的反对，她意思是，这事儿啊，动静太大了啊，影响不太好啊。"
            },
            "402": {
                "id": 402,
                "chapter_id": "普陀寺",
                "section_id": 402,
                "section_name": "普陀寺",
                "points": 45,
                "power_consume": 5,
                "exp_obtain": 225,
                "coins_obtain": 450,
                "description": "人间百姓生活苦不堪言，摆不起摊，开不起店，买不起房，很多人甚至吃不饱饭。玉帝用力吸了一口烟，忍不住陷入深深的沉思之中。"
            },
            "403": {
                "id": 403,
                "chapter_id": "普陀寺",
                "section_id": 403,
                "section_name": "普陀寺",
                "points": 45,
                "power_consume": 5,
                "exp_obtain": 225,
                "coins_obtain": 450,
                "description": "对于凡间里专家盛行的这个事，玉帝的观点是，应该把这事儿告诉阎王，让他在地狱里尽快一次性解决。"
            },
            "404": {
                "id": 404,
                "chapter_id": "普陀寺",
                "section_id": 404,
                "section_name": "普陀寺",
                "points": 45,
                "power_consume": 5,
                "exp_obtain": 225,
                "coins_obtain": 450,
                "description": "沙僧每次在喊大师兄、二师兄，师父被抓走了，心里都想着我的师弟呀，你在哪里。"
            },
            "405": {
                "id": 405,
                "chapter_id": "普陀寺",
                "section_id": 405,
                "section_name": "普陀寺",
                "points": 45,
                "power_consume": 5,
                "exp_obtain": 225,
                "coins_obtain": 450,
                "description": "当年女娲造人只是为了日后天漏了有人可以帮忙补上，而把人分为男女只是为了干活不累。"
            },
            "406": {
                "id": 406,
                "chapter_id": "普陀寺",
                "section_id": 406,
                "section_name": "普陀寺",
                "points": 45,
                "power_consume": 5,
                "exp_obtain": 225,
                "coins_obtain": 450,
                "description": "当年唐僧取经路上有那么多神仙或家属下界为妖，是因为天宫收入太低，他们想下海赚外快。"
            },
            "407": {
                "id": 407,
                "chapter_id": "普陀寺",
                "section_id": 407,
                "section_name": "普陀寺",
                "points": 45,
                "power_consume": 5,
                "exp_obtain": 225,
                "coins_obtain": 450,
                "description": "据说后羿射日的时候，其中一个偷偷给他塞了一大笔钱，所以最后的那个日被留了下来。"
            },
            "408": {
                "id": 408,
                "chapter_id": "普陀寺",
                "section_id": 408,
                "section_name": "普陀寺",
                "points": 45,
                "power_consume": 5,
                "exp_obtain": 225,
                "coins_obtain": 450,
                "description": "王母娘娘好客，每逢佳节，常常宴请各路神仙聚会吃蟠桃、喝茅台，随便收些礼物。"
            },
            "409": {
                "id": 409,
                "chapter_id": "普陀寺",
                "section_id": 409,
                "section_name": "普陀寺",
                "points": 45,
                "power_consume": 5,
                "exp_obtain": 225,
                "coins_obtain": 450,
                "description": "百花仙子对每种花都再熟悉不过了，不管是桃花荷花，还是牡丹兰花，抑或是菊花。"
            },
            "410": {
                "id": 410,
                "chapter_id": "普陀寺",
                "section_id": 410,
                "section_name": "普陀寺",
                "points": 45,
                "power_consume": 5,
                "exp_obtain": 225,
                "coins_obtain": 450,
                "description": "由于唐僧有恐高症，所以观音要求龙王三太子不能变成龙，只能变成马。"
            },
            "411": {
                "id": 411,
                "chapter_id": "三界门",
                "section_id": 411,
                "section_name": "三界门",
                "points": 46,
                "power_consume": 5,
                "exp_obtain": 230,
                "coins_obtain": 460,
                "description": "97号草的价格一升再升，唐僧压力特别大，所以他到处游说，想方设法想把他的宝贵坐骑白龙马给出售了。"
            },
            "412": {
                "id": 412,
                "chapter_id": "三界门",
                "section_id": 412,
                "section_name": "三界门",
                "points": 46,
                "power_consume": 5,
                "exp_obtain": 230,
                "coins_obtain": 460,
                "description": "唐僧他们去西天是为了上访，想让玉帝下台，所以一路上玉帝派了各路神仙装成妖魔鬼怪进行阻挠。"
            },
            "413": {
                "id": 413,
                "chapter_id": "三界门",
                "section_id": 413,
                "section_name": "三界门",
                "points": 46,
                "power_consume": 5,
                "exp_obtain": 230,
                "coins_obtain": 460,
                "description": "有小道消息称，愚公把花果山移走了，不过不知道移到了什么地方，这个可能是天庭机密吧，不宜对外公开。"
            },
            "414": {
                "id": 414,
                "chapter_id": "三界门",
                "section_id": 414,
                "section_name": "三界门",
                "points": 46,
                "power_consume": 5,
                "exp_obtain": 230,
                "coins_obtain": 460,
                "description": "猪八戒和高俅是一对好基友，猪八戒随唐僧去西天取经后，高俅趁机将高老庄强行占为己有，并改名为高老庄。当然这只是传闻。"
            },
            "415": {
                "id": 415,
                "chapter_id": "三界门",
                "section_id": 415,
                "section_name": "三界门",
                "points": 46,
                "power_consume": 5,
                "exp_obtain": 230,
                "coins_obtain": 460,
                "description": "玉帝觉得天庭的市容市貌越来越差，所以他决定再组建一支城管部队，这次由二郎神担任队长，哮天犬担任副队长。"
            },
            "416": {
                "id": 416,
                "chapter_id": "三界门",
                "section_id": 416,
                "section_name": "三界门",
                "points": 46,
                "power_consume": 5,
                "exp_obtain": 230,
                "coins_obtain": 460,
                "description": "雷公是A型血，电母是B型血，所以每天晚上电母都睡的很香，而雷公则被蚊子叮的完全睡不着，这就是血型的魅力。"
            },
            "417": {
                "id": 417,
                "chapter_id": "三界门",
                "section_id": 417,
                "section_name": "三界门",
                "points": 46,
                "power_consume": 5,
                "exp_obtain": 230,
                "coins_obtain": 460,
                "description": "因为长年久坐龙椅，玉帝经常大腿发麻，医仙说他这是腰间盘突出，脊椎压住神经了，需要做手术动刀子才行。"
            },
            "418": {
                "id": 418,
                "chapter_id": "三界门",
                "section_id": 418,
                "section_name": "三界门",
                "points": 46,
                "power_consume": 5,
                "exp_obtain": 230,
                "coins_obtain": 460,
                "description": "肺主气，肾主骨，由于憋了数百年了，能量过大。所以人间的后裔近日腰疼的厉害，医生说悠着点兄弟，别太猛了，肾快被你搞烂了。"
            },
            "419": {
                "id": 419,
                "chapter_id": "三界门",
                "section_id": 419,
                "section_name": "三界门",
                "points": 46,
                "power_consume": 5,
                "exp_obtain": 230,
                "coins_obtain": 460,
                "description": "一个月的时间，土行孙的身高由之前的0.5米暴增到1.7米，这让他不禁喜极而泣。憋了数千年了，终于TMD开始正常发育了。"
            },
            "420": {
                "id": 420,
                "chapter_id": "三界门",
                "section_id": 420,
                "section_name": "三界门",
                "points": 46,
                "power_consume": 5,
                "exp_obtain": 230,
                "coins_obtain": 460,
                "description": "因为长的太高，巨灵神的膝盖终于不堪重负，他近日患上了严重的关节炎，医仙说他很有可能整个下体坏死。"
            },
            "421": {
                "id": 421,
                "chapter_id": "七尘斋",
                "section_id": 421,
                "section_name": "七尘斋",
                "points": 47,
                "power_consume": 5,
                "exp_obtain": 235,
                "coins_obtain": 470,
                "description": "由于气候反常，牡丹仙子的牡丹园里，所有的牡丹花一眼之间全部变成了向日葵。仙子坐在园子里，忍不住流下了伤心的泪水。"
            },
            "422": {
                "id": 422,
                "chapter_id": "七尘斋",
                "section_id": 422,
                "section_name": "七尘斋",
                "points": 47,
                "power_consume": 5,
                "exp_obtain": 235,
                "coins_obtain": 470,
                "description": "菩提老祖被视为仙界里最没有节操的一个神仙，原因不详。"
            },
            "423": {
                "id": 423,
                "chapter_id": "七尘斋",
                "section_id": 423,
                "section_name": "七尘斋",
                "points": 47,
                "power_consume": 5,
                "exp_obtain": 235,
                "coins_obtain": 470,
                "description": "由于品性端庄，尔雅大方。嫦娥仙子最近被玉帝任命为天庭德育大队辅导员，专门负责神仙们的心理健康。"
            },
            "424": {
                "id": 424,
                "chapter_id": "七尘斋",
                "section_id": 424,
                "section_name": "七尘斋",
                "points": 47,
                "power_consume": 5,
                "exp_obtain": 235,
                "coins_obtain": 470,
                "description": "近日人间传出干露露和她娘以及她妹干毛毛三人共吃香蕉的照片，这让众仙大开眼界，连如来佛祖都忍不住说了一句，真猛。"
            },
            "425": {
                "id": 425,
                "chapter_id": "七尘斋",
                "section_id": 425,
                "section_name": "七尘斋",
                "points": 47,
                "power_consume": 5,
                "exp_obtain": 235,
                "coins_obtain": 470,
                "description": "在近日的仙术结业考试中，托塔天王作弊被发现，玉帝雷霆震怒，剥脱他天王的称号，并没收了他的天塔神器。"
            },
            "426": {
                "id": 426,
                "chapter_id": "七尘斋",
                "section_id": 426,
                "section_name": "七尘斋",
                "points": 47,
                "power_consume": 5,
                "exp_obtain": 235,
                "coins_obtain": 470,
                "description": "云中子是仙界最擅炼器之人，番天印、捆仙绳、风火轮等大名鼎鼎的道具都曾被仿制过，他算得上是盗版的始祖。"
            },
            "427": {
                "id": 427,
                "chapter_id": "七尘斋",
                "section_id": 427,
                "section_name": "七尘斋",
                "points": 47,
                "power_consume": 5,
                "exp_obtain": 235,
                "coins_obtain": 470,
                "description": "生活的压力越来越大，仙界中的单身越来越多了，房子，车子，妻子都已经成为了他们生命中无法承受之重。"
            },
            "428": {
                "id": 428,
                "chapter_id": "七尘斋",
                "section_id": 428,
                "section_name": "七尘斋",
                "points": 47,
                "power_consume": 5,
                "exp_obtain": 235,
                "coins_obtain": 470,
                "description": "最近人间重走西天路的这个旅游路线很火。悟空看的又想哭又想笑，人的想法，他真的猜不透耶。"
            },
            "429": {
                "id": 429,
                "chapter_id": "七尘斋",
                "section_id": 429,
                "section_name": "七尘斋",
                "points": 47,
                "power_consume": 5,
                "exp_obtain": 235,
                "coins_obtain": 470,
                "description": "守望在奈何桥边的孟婆近日提出离职，看过了人间太多的生死悲欢与离合，她的内心已无法承受这份沉重。"
            },
            "430": {
                "id": 430,
                "chapter_id": "七尘斋",
                "section_id": 430,
                "section_name": "七尘斋",
                "points": 47,
                "power_consume": 5,
                "exp_obtain": 235,
                "coins_obtain": 470,
                "description": "泰森近日受邀上天参加第二届神仙拳击大赛，在被问到夺冠后的感触时，泰森微微一笑说，shit，so easy。"
            },
            "431": {
                "id": 431,
                "chapter_id": "众生琅",
                "section_id": 431,
                "section_name": "众生琅",
                "points": 48,
                "power_consume": 5,
                "exp_obtain": 240,
                "coins_obtain": 480,
                "description": "人类福音苍井空近日受邀上天做客，并在宴席上进行了现场演示。演示完毕后，众仙做了简单点评并对苍姐提出了更高的要求。"
            },
            "432": {
                "id": 432,
                "chapter_id": "众生琅",
                "section_id": 432,
                "section_name": "众生琅",
                "points": 48,
                "power_consume": 5,
                "exp_obtain": 240,
                "coins_obtain": 480,
                "description": "南极仙翁的那只仙鹤最近掉毛掉的很厉害，太上老君看过之后说，这是精气过盛所导致，它需要发泄。"
            },
            "433": {
                "id": 433,
                "chapter_id": "众生琅",
                "section_id": 433,
                "section_name": "众生琅",
                "points": 48,
                "power_consume": 5,
                "exp_obtain": 240,
                "coins_obtain": 480,
                "description": "哮天犬近日成功产下一小狗崽，而且还是公的。二郎神狂喜之余，为其取名为杨哮天。"
            },
            "434": {
                "id": 434,
                "chapter_id": "众生琅",
                "section_id": 434,
                "section_name": "众生琅",
                "points": 48,
                "power_consume": 5,
                "exp_obtain": 240,
                "coins_obtain": 480,
                "description": "济公其实并非什么降龙尊者，事实上连罗汉都不是，他其实是天界掌管雨的大神，俗称雨师。"
            },
            "435": {
                "id": 435,
                "chapter_id": "众生琅",
                "section_id": 435,
                "section_name": "众生琅",
                "points": 48,
                "power_consume": 5,
                "exp_obtain": 240,
                "coins_obtain": 480,
                "description": "仙界英文说的最好的是太乙真人，据说他已经过了专8了，托福雅思都是满分。"
            },
            "436": {
                "id": 436,
                "chapter_id": "众生琅",
                "section_id": 436,
                "section_name": "众生琅",
                "points": 48,
                "power_consume": 5,
                "exp_obtain": 240,
                "coins_obtain": 480,
                "description": "虽然太乙真人是仙界英文说的最好的神仙，但最具语言天赋的却是嫦娥仙子。所有的人语，鸟语，神语，她都懂。这都是寂寞的苦劳。"
            },
            "437": {
                "id": 437,
                "chapter_id": "众生琅",
                "section_id": 437,
                "section_name": "众生琅",
                "points": 48,
                "power_consume": 5,
                "exp_obtain": 240,
                "coins_obtain": 480,
                "description": "由于长年累月的战斗不息，刑天战神近日终于病倒了。太上老君说了，没别的，就是累的。"
            },
            "438": {
                "id": 438,
                "chapter_id": "众生琅",
                "section_id": 438,
                "section_name": "众生琅",
                "points": 48,
                "power_consume": 5,
                "exp_obtain": 240,
                "coins_obtain": 480,
                "description": "沉香当年劈山救母的时候，悟空其实是有帮助的，否则以沉香的力量，尚不足以劈开华山的。"
            },
            "439": {
                "id": 439,
                "chapter_id": "众生琅",
                "section_id": 439,
                "section_name": "众生琅",
                "points": 48,
                "power_consume": 5,
                "exp_obtain": 240,
                "coins_obtain": 480,
                "description": "有人说沉香当年劈山救母的斧头，就是盘古爷当年开天辟地的那把。这是真的。"
            },
            "440": {
                "id": 440,
                "chapter_id": "众生琅",
                "section_id": 440,
                "section_name": "众生琅",
                "points": 48,
                "power_consume": 5,
                "exp_obtain": 240,
                "coins_obtain": 480,
                "description": "人间传说中的四不像神兽，它的原型其实是天上的风神箕伯。虽然长相奇特，人面鸟身，但作为蚩尤大帝的师弟，他的地位极其尊贵。"
            },
            "441": {
                "id": 441,
                "chapter_id": "万年羲",
                "section_id": 441,
                "section_name": "万年羲",
                "points": 49,
                "power_consume": 5,
                "exp_obtain": 245,
                "coins_obtain": 490,
                "description": "因为过度嗜酒，铁拐李得了肝硬化，并最终导致下半身彻底瘫痪。于是他告别了随他多年的铁拐，坐上了轮椅。"
            },
            "442": {
                "id": 442,
                "chapter_id": "万年羲",
                "section_id": 442,
                "section_name": "万年羲",
                "points": 49,
                "power_consume": 5,
                "exp_obtain": 245,
                "coins_obtain": 490,
                "description": "由于常年不和，八仙近日发布天庭通告：我们散伙了。"
            },
            "443": {
                "id": 443,
                "chapter_id": "万年羲",
                "section_id": 443,
                "section_name": "万年羲",
                "points": 49,
                "power_consume": 5,
                "exp_obtain": 245,
                "coins_obtain": 490,
                "description": "作为天蓬元帅，八戒当年是主管银河的，而且他性侵嫦娥也不是一次两次了。只不过凌霄殿那次不幸被玉帝看到了而已。"
            },
            "444": {
                "id": 444,
                "chapter_id": "万年羲",
                "section_id": 444,
                "section_name": "万年羲",
                "points": 49,
                "power_consume": 5,
                "exp_obtain": 245,
                "coins_obtain": 490,
                "description": "在砍了八万年的桂树之后，吴刚近日终于向玉帝提出，要下凡去疯狂的发泄。他说，我无法忍受这份煎熬了，我已经到极限了。"
            },
            "445": {
                "id": 445,
                "chapter_id": "万年羲",
                "section_id": 445,
                "section_name": "万年羲",
                "points": 49,
                "power_consume": 5,
                "exp_obtain": 245,
                "coins_obtain": 490,
                "description": "近日被批准下凡的吴刚传来了消息，一夜之间，他踏遍了人间的夜总会KTV按摩店，他让所有的姐妹们彻底虚脱。"
            },
            "446": {
                "id": 446,
                "chapter_id": "万年羲",
                "section_id": 446,
                "section_name": "万年羲",
                "points": 49,
                "power_consume": 5,
                "exp_obtain": 245,
                "coins_obtain": 490,
                "description": "对于吴刚近日在人间所取得的成绩，爱爱女神洛神宓妃大感震惊。她表示，等刚哥上来了一定要与他战个三天三夜。"
            },
            "447": {
                "id": 447,
                "chapter_id": "万年羲",
                "section_id": 447,
                "section_name": "万年羲",
                "points": 49,
                "power_consume": 5,
                "exp_obtain": 245,
                "coins_obtain": 490,
                "description": "由于仙界最近天气炎热，大家都提议一起到银河系来一个集体裸游，让嫦娥仙子为大家当场示范28个裸游动作。玉帝当场拍板表示赞成。"
            },
            "448": {
                "id": 448,
                "chapter_id": "万年羲",
                "section_id": 448,
                "section_name": "万年羲",
                "points": 49,
                "power_consume": 5,
                "exp_obtain": 245,
                "coins_obtain": 490,
                "description": "在近日举行的第27届天庭马拉松大赛中，北天仙童一头栽倒在终点线上，成为了仙界第一位牺牲在长跑线上的神仙。"
            },
            "449": {
                "id": 449,
                "chapter_id": "万年羲",
                "section_id": 449,
                "section_name": "万年羲",
                "points": 49,
                "power_consume": 5,
                "exp_obtain": 245,
                "coins_obtain": 490,
                "description": "神仙中QQ号码最多的是黑煞神，他最大的爱好就是注册QQ，每天没事就在那疯狂的注册号码。这一度导致腾讯的服务器崩溃。"
            },
            "450": {
                "id": 450,
                "chapter_id": "万年羲",
                "section_id": 450,
                "section_name": "万年羲",
                "points": 49,
                "power_consume": 5,
                "exp_obtain": 245,
                "coins_obtain": 490,
                "description": "神仙中QQ号码最牛的是二郎神，他的QQ号是：888，可以说是QQ号中的元老号，而且让如来佛开过光。不过最近被人盗了。"
            },
            "451": {
                "id": 451,
                "chapter_id": "玲珑痷",
                "section_id": 451,
                "section_name": "玲珑痷",
                "points": 50,
                "power_consume": 5,
                "exp_obtain": 250,
                "coins_obtain": 500,
                "description": "作为仙界块头最大也最丑的大神，巨灵神近日终于也有了自己的女神：地狱八婆，作为定情礼，巨灵神送了八婆一枚八百克拉的大钻戒。"
            },
            "452": {
                "id": 452,
                "chapter_id": "玲珑痷",
                "section_id": 452,
                "section_name": "玲珑痷",
                "points": 50,
                "power_consume": 5,
                "exp_obtain": 250,
                "coins_obtain": 500,
                "description": "作为第一位拥有iphone手机的神仙，九天杀童一直没有告诉大家，其实这是乔布斯亲自送给他的见面礼物。"
            },
            "453": {
                "id": 453,
                "chapter_id": "玲珑痷",
                "section_id": 453,
                "section_name": "玲珑痷",
                "points": 50,
                "power_consume": 5,
                "exp_obtain": 250,
                "coins_obtain": 500,
                "description": "观音菩萨近日主持召开了一次天庭祈福大会，为苦难的人间百姓送去平安，送去健康，送去福分。人们啊，过的真的是太不容易了。"
            },
            "454": {
                "id": 454,
                "chapter_id": "玲珑痷",
                "section_id": 454,
                "section_name": "玲珑痷",
                "points": 50,
                "power_consume": 5,
                "exp_obtain": 250,
                "coins_obtain": 500,
                "description": "黄飞虎近日下凡后悲哀的发现，作为万兽之王，他的徒子徒孙已经濒临灭绝。于是他不禁的悲声大哭了整整一天一夜。"
            },
            "455": {
                "id": 455,
                "chapter_id": "玲珑痷",
                "section_id": 455,
                "section_name": "玲珑痷",
                "points": 50,
                "power_consume": 5,
                "exp_obtain": 250,
                "coins_obtain": 500,
                "description": "托塔天王最新打造的天塔十分的霸气威武，而且更重要的是，这塔是佛祖开过光的。"
            },
            "456": {
                "id": 456,
                "chapter_id": "玲珑痷",
                "section_id": 456,
                "section_name": "玲珑痷",
                "points": 50,
                "power_consume": 5,
                "exp_obtain": 250,
                "coins_obtain": 500,
                "description": "“没有人想操你的内在美，和一个男人讲内涵，不如直接告诉他你允许内射更有吸引力。”这是爱爱女神洛神宓妃的口头禅。"
            },
            "457": {
                "id": 457,
                "chapter_id": "玲珑痷",
                "section_id": 457,
                "section_name": "玲珑痷",
                "points": 50,
                "power_consume": 5,
                "exp_obtain": 250,
                "coins_obtain": 500,
                "description": "作为昔日佛祖修行过的地方，五华山成为凡间百姓心中的朝拜圣地，他们在山脚下三步一跪拜，祈求佛祖能够为他带来内心的安宁。"
            },
            "458": {
                "id": 458,
                "chapter_id": "玲珑痷",
                "section_id": 458,
                "section_name": "玲珑痷",
                "points": 50,
                "power_consume": 5,
                "exp_obtain": 250,
                "coins_obtain": 500,
                "description": "由于地球板块运动过于剧烈，火焰山早在上个世纪就变成了汪洋大海。"
            },
            "459": {
                "id": 459,
                "chapter_id": "玲珑痷",
                "section_id": 459,
                "section_name": "玲珑痷",
                "points": 50,
                "power_consume": 5,
                "exp_obtain": 250,
                "coins_obtain": 500,
                "description": "许多人或者神都在议论着悟空铁扇公主以及牛魔王之间的关系，但这一切其实都是那么的荒唐无聊。铁扇公主爱的从来都是那头老牛。"
            },
            "460": {
                "id": 460,
                "chapter_id": "玲珑痷",
                "section_id": 460,
                "section_name": "玲珑痷",
                "points": 50,
                "power_consume": 5,
                "exp_obtain": 250,
                "coins_obtain": 500,
                "description": "每每想到人间众多受苦受难的孤儿，王母总会忍不住黯然伤神。她纵然可以降福与这些可怜的孩子，也无法改变人性的那份冷漠。"
            },
            "461": {
                "id": 461,
                "chapter_id": "相生殿",
                "section_id": 461,
                "section_name": "相生殿",
                "points": 51,
                "power_consume": 5,
                "exp_obtain": 255,
                "coins_obtain": 510,
                "description": "八戒抚摸着床边的九齿钉钯，心中充满了感伤。五年前他就已经很难挥得动这柄神器了。其实无论是人还是神，终究都会有老去的那一天。"
            },
            "462": {
                "id": 462,
                "chapter_id": "相生殿",
                "section_id": 462,
                "section_name": "相生殿",
                "points": 51,
                "power_consume": 5,
                "exp_obtain": 255,
                "coins_obtain": 510,
                "description": "自从取经归来之后，唐僧师徒四人就各奔东西。只有在每年的八月十五，他们才会聚在花果山，把酒笑言，畅谈昔日西天取经之事。"
            },
            "463": {
                "id": 463,
                "chapter_id": "相生殿",
                "section_id": 463,
                "section_name": "相生殿",
                "points": 51,
                "power_consume": 5,
                "exp_obtain": 255,
                "coins_obtain": 510,
                "description": "天聋地哑两位大仙作为人间众生的天父和地母，其实他们既不聋也不哑，而且在仙界位极尊贵。"
            },
            "464": {
                "id": 464,
                "chapter_id": "相生殿",
                "section_id": 464,
                "section_name": "相生殿",
                "points": 51,
                "power_consume": 5,
                "exp_obtain": 255,
                "coins_obtain": 510,
                "description": "极光大仙的武器是一把激光刀。这刀是大仙最近一次下凡中从人民医院里拿走的，经过开光，这刀已然成为了仙界最为锋利的神器。"
            },
            "465": {
                "id": 465,
                "chapter_id": "相生殿",
                "section_id": 465,
                "section_name": "相生殿",
                "points": 51,
                "power_consume": 5,
                "exp_obtain": 255,
                "coins_obtain": 510,
                "description": "人间总喜欢把寺庙里供奉的十八罗汉雕刻的面目狰狞，其实众罗汉皆是眉清目秀之人，尤其是笑面罗汉，长的很像布拉德皮特。"
            },
            "466": {
                "id": 466,
                "chapter_id": "相生殿",
                "section_id": 466,
                "section_name": "相生殿",
                "points": 51,
                "power_consume": 5,
                "exp_obtain": 255,
                "coins_obtain": 510,
                "description": "雷震子最近染上了毒瘾，每天都要吸个几百公斤大麻。每次吸完之后，他都会仰天长啸，老天，这真是太爽了，果然是飘飘欲仙啊。"
            },
            "467": {
                "id": 467,
                "chapter_id": "相生殿",
                "section_id": 467,
                "section_name": "相生殿",
                "points": 51,
                "power_consume": 5,
                "exp_obtain": 255,
                "coins_obtain": 510,
                "description": "没有人能够理解五音仙子对音乐的狂热。在她看来，好的音乐不仅仅是一种声音，更是发自灵魂深处的一种低语，一种回音。"
            },
            "468": {
                "id": 468,
                "chapter_id": "相生殿",
                "section_id": 468,
                "section_name": "相生殿",
                "points": 51,
                "power_consume": 5,
                "exp_obtain": 255,
                "coins_obtain": 510,
                "description": "当上海的法官们想拼命甩掉＂嫖客＂身份的时候，李双江梦鸽夫妇在竭力为孩子争取一个＂嫖客＂的名份! 所以：人活着要知足。"
            },
            "469": {
                "id": 469,
                "chapter_id": "相生殿",
                "section_id": 469,
                "section_name": "相生殿",
                "points": 51,
                "power_consume": 5,
                "exp_obtain": 255,
                "coins_obtain": 510,
                "description": "哮天犬的狗崽，羊角大仙的羊羊羊，牛魔王的牛牪犇，因为关系一直很好，所以前些日子它们结为了盟兄弟。"
            },
            "470": {
                "id": 470,
                "chapter_id": "相生殿",
                "section_id": 470,
                "section_name": "相生殿",
                "points": 51,
                "power_consume": 5,
                "exp_obtain": 255,
                "coins_obtain": 510,
                "description": "因为同样的酷爱音乐，九天杀童与土行孙最近组成了一个乐队，叫“暴力火车”，主打民族风。"
            },
            "471": {
                "id": 471,
                "chapter_id": "罗汉堂",
                "section_id": 471,
                "section_name": "罗汉堂",
                "points": 52,
                "power_consume": 5,
                "exp_obtain": 260,
                "coins_obtain": 520,
                "description": "UFO近日途径南天门时与南天门神发生了纠纷，双方展开了一番激战，最后以南天门神一脚将UFO踩个稀巴烂而告终。"
            },
            "472": {
                "id": 472,
                "chapter_id": "罗汉堂",
                "section_id": 472,
                "section_name": "罗汉堂",
                "points": 52,
                "power_consume": 5,
                "exp_obtain": 260,
                "coins_obtain": 520,
                "description": "包二奶，找情人就是道德问题，卖淫嫖娼就是违法行为。难道结账方式就真的这么重要么。道行天尊对人间的这些事越来越看不懂了。"
            },
            "473": {
                "id": 473,
                "chapter_id": "罗汉堂",
                "section_id": 473,
                "section_name": "罗汉堂",
                "points": 52,
                "power_consume": 5,
                "exp_obtain": 260,
                "coins_obtain": 520,
                "description": "为了更好的研究女性心理，吴刚与牛郎以及托塔李天王成立了一家专门的研究机构，名为“妇女之夜”。"
            },
            "474": {
                "id": 474,
                "chapter_id": "罗汉堂",
                "section_id": 474,
                "section_name": "罗汉堂",
                "points": 52,
                "power_consume": 5,
                "exp_obtain": 260,
                "coins_obtain": 520,
                "description": "洞庭仙人永远都无法忘记昔日在凡间与那帮难兄难弟走过的日子，每每忆及往事，他的眼角总会忍不住的湿润。苦难，能够让人铭记。"
            },
            "475": {
                "id": 475,
                "chapter_id": "罗汉堂",
                "section_id": 475,
                "section_name": "罗汉堂",
                "points": 52,
                "power_consume": 5,
                "exp_obtain": 260,
                "coins_obtain": 520,
                "description": "凡人问，为何我烦恼这么多。佛祖说，你没有放下。凡人问怎样才能放下，佛祖说，修仙。凡人说可是我修不成啊，佛祖说，那算了。"
            },
            "476": {
                "id": 476,
                "chapter_id": "罗汉堂",
                "section_id": 476,
                "section_name": "罗汉堂",
                "points": 52,
                "power_consume": 5,
                "exp_obtain": 260,
                "coins_obtain": 520,
                "description": "对于人间的艺术品，二郎神最欣赏的只有两个，一个是达芬奇的《蒙娜丽莎》。另外一个是动画片《黑猫警长》。"
            },
            "477": {
                "id": 477,
                "chapter_id": "罗汉堂",
                "section_id": 477,
                "section_name": "罗汉堂",
                "points": 52,
                "power_consume": 5,
                "exp_obtain": 260,
                "coins_obtain": 520,
                "description": "为什么神仙都能飘着走呢？一些部落的人认为，神仙的鞋里有机关！所以他们管修仙也叫修鞋，联盟的人对此种说法表示很费解。"
            },
            "478": {
                "id": 478,
                "chapter_id": "罗汉堂",
                "section_id": 478,
                "section_name": "罗汉堂",
                "points": 52,
                "power_consume": 5,
                "exp_obtain": 260,
                "coins_obtain": 520,
                "description": "从前有座山，山里有座庙，庙里有台电脑，电脑前面做了一位程序猿，叫阿日隆~"
            },
            "479": {
                "id": 479,
                "chapter_id": "罗汉堂",
                "section_id": 479,
                "section_name": "罗汉堂",
                "points": 52,
                "power_consume": 5,
                "exp_obtain": 260,
                "coins_obtain": 520,
                "description": "孙悟空：“听说下界最近出现了一个新的战斗种族，叫程序猿？不知是不是从我大花果山跑出去的，战斗力跟俺比起来怎样？”"
            },
            "480": {
                "id": 480,
                "chapter_id": "罗汉堂",
                "section_id": 480,
                "section_name": "罗汉堂",
                "points": 52,
                "power_consume": 5,
                "exp_obtain": 260,
                "coins_obtain": 520,
                "description": "猪八戒：“最近怎么老有那么多人喊，要成为火影的男人，要成为海贼王的男人？脑残么，俺只要成为白富美的男人，捏哈哈哈~”"
            },
            "481": {
                "id": 481,
                "chapter_id": "七仙居",
                "section_id": 481,
                "section_name": "七仙居",
                "points": 53,
                "power_consume": 5,
                "exp_obtain": 265,
                "coins_obtain": 530,
                "description": "知道道教三观是哪三观么？人生观，世界观，价值观！"
            },
            "482": {
                "id": 482,
                "chapter_id": "七仙居",
                "section_id": 482,
                "section_name": "七仙居",
                "points": 53,
                "power_consume": 5,
                "exp_obtain": 265,
                "coins_obtain": 530,
                "description": "铁扇公主：“告诉你们多少次了，不要叫我牛夫人，叫我公主大人！”"
            },
            "483": {
                "id": 483,
                "chapter_id": "七仙居",
                "section_id": 483,
                "section_name": "七仙居",
                "points": 53,
                "power_consume": 5,
                "exp_obtain": 265,
                "coins_obtain": 530,
                "description": "近日人间对微博上的大V开始了严格的整顿。为了避免节外生枝，玉帝带领众仙集体封博，返回天庭。"
            },
            "484": {
                "id": 484,
                "chapter_id": "七仙居",
                "section_id": 484,
                "section_name": "七仙居",
                "points": 53,
                "power_consume": 5,
                "exp_obtain": 265,
                "coins_obtain": 530,
                "description": "华山老仙在近日登山的时候不慎从山顶一直滚到山脚，造成了全身粉碎性骨折。玉帝看了后叹了口气说，让阎王收了吧。"
            },
            "485": {
                "id": 485,
                "chapter_id": "七仙居",
                "section_id": 485,
                "section_name": "七仙居",
                "points": 53,
                "power_consume": 5,
                "exp_obtain": 265,
                "coins_obtain": 530,
                "description": "作为昔日在人间一起嫖过的炮友，吴刚与后裔之间有着一种我们常人难以理解的情感，他们是真兄弟。"
            },
            "486": {
                "id": 486,
                "chapter_id": "七仙居",
                "section_id": 486,
                "section_name": "七仙居",
                "points": 53,
                "power_consume": 5,
                "exp_obtain": 265,
                "coins_obtain": 530,
                "description": "没有人可以理解嫦娥独守广寒宫的那种寂寞与煎熬，甚至包括嫦娥自己，她也一直在问自己，这样的坚持还有意义吗？"
            },
            "487": {
                "id": 487,
                "chapter_id": "七仙居",
                "section_id": 487,
                "section_name": "七仙居",
                "points": 53,
                "power_consume": 5,
                "exp_obtain": 265,
                "coins_obtain": 530,
                "description": "最近二郎神跟巨灵神在讨论要不要灭了人间大学，重铸教育制度。理由是，上大学简直就是在浪费生命。"
            },
            "488": {
                "id": 488,
                "chapter_id": "七仙居",
                "section_id": 488,
                "section_name": "七仙居",
                "points": 53,
                "power_consume": 5,
                "exp_obtain": 265,
                "coins_obtain": 530,
                "description": "为了节约开支，财神最近制定了一条新规：神仙到人间出差，差旅费一律不能超过300Q币，否则不给报。"
            },
            "489": {
                "id": 489,
                "chapter_id": "七仙居",
                "section_id": 489,
                "section_name": "七仙居",
                "points": 53,
                "power_consume": 5,
                "exp_obtain": 265,
                "coins_obtain": 530,
                "description": "在连续通宵加班两周之后，木瓜道长终于猝死在了工作岗位上，这引起玉帝的高度重视，他随即颁布了一道新规：不准把人加班加死。"
            },
            "490": {
                "id": 490,
                "chapter_id": "七仙居",
                "section_id": 490,
                "section_name": "七仙居",
                "points": 53,
                "power_consume": 5,
                "exp_obtain": 265,
                "coins_obtain": 530,
                "description": "作为战斗力最高的大神，九天杀童的绝招是：天崩地裂，玉石俱焚。所以玉帝经常跟众仙说别惹他，他的绝杀我们是惹不起的。"
            },
            "491": {
                "id": 491,
                "chapter_id": "封神山",
                "section_id": 491,
                "section_name": "封神山",
                "points": 54,
                "power_consume": 5,
                "exp_obtain": 270,
                "coins_obtain": 540,
                "description": "作为南天门的守护天神，哼哈二将数千年如一日，始终在忠心耿耿的看守着仙界大门。他们无愧于仙界劳模这个光荣称号。"
            },
            "492": {
                "id": 492,
                "chapter_id": "封神山",
                "section_id": 492,
                "section_name": "封神山",
                "points": 54,
                "power_consume": 5,
                "exp_obtain": 270,
                "coins_obtain": 540,
                "description": "近日西天耶稣来到天庭做客，玉帝以全羊宴进行款待。羊角大仙吃的泪流满面。"
            },
            "493": {
                "id": 493,
                "chapter_id": "封神山",
                "section_id": 493,
                "section_name": "封神山",
                "points": 54,
                "power_consume": 5,
                "exp_obtain": 270,
                "coins_obtain": 540,
                "description": "牛魔王最爱吃的东西，就是牛肉，尤其是爆炒牛肝。"
            },
            "494": {
                "id": 494,
                "chapter_id": "封神山",
                "section_id": 494,
                "section_name": "封神山",
                "points": 54,
                "power_consume": 5,
                "exp_obtain": 270,
                "coins_obtain": 540,
                "description": "在出嫁女儿猪小小的那一天，八戒哭成了泪人。他到现在才真正懂得了什么才是心痛的感觉。"
            },
            "495": {
                "id": 495,
                "chapter_id": "封神山",
                "section_id": 495,
                "section_name": "封神山",
                "points": 54,
                "power_consume": 5,
                "exp_obtain": 270,
                "coins_obtain": 540,
                "description": "有时候坐在花果山顶，看着身边众多的小猴儿嬉戏玩耍，不知道为什么，悟空总有一种寂寞萧索的感觉。也许他真的已经老了。"
            },
            "496": {
                "id": 496,
                "chapter_id": "封神山",
                "section_id": 496,
                "section_name": "封神山",
                "points": 54,
                "power_consume": 5,
                "exp_obtain": 270,
                "coins_obtain": 540,
                "description": "针对牛郎最近的出轨事件，众神仙一致的意见是，极度正常。对岸放着那么好的一个媳妇，一年才能见一次面，换谁都抓狂。"
            },
            "497": {
                "id": 497,
                "chapter_id": "封神山",
                "section_id": 497,
                "section_name": "封神山",
                "points": 54,
                "power_consume": 5,
                "exp_obtain": 270,
                "coins_obtain": 540,
                "description": "在人间的年轻作家中，二郎神最欣赏的是郭敬明和韩寒，他也一直幻想着这两个小青年有朝一日能够出柜。"
            },
            "498": {
                "id": 498,
                "chapter_id": "封神山",
                "section_id": 498,
                "section_name": "封神山",
                "points": 54,
                "power_consume": 5,
                "exp_obtain": 270,
                "coins_obtain": 540,
                "description": "作为最失败的房奴，海灵子近日跳海自尽。他那一套五十多平的单身公寓，迄今为止还了三万年的贷款，接下来还要还五万年。"
            },
            "499": {
                "id": 499,
                "chapter_id": "封神山",
                "section_id": 499,
                "section_name": "封神山",
                "points": 54,
                "power_consume": 5,
                "exp_obtain": 270,
                "coins_obtain": 540,
                "description": "看着窗外桂树下吴刚孤独的背影，嫦娥突然间产生了一丝的迷惘。两人这么多年来的苦苦坚持，到底有何意义呢？"
            },
            "500": {
                "id": 500,
                "chapter_id": "封神山",
                "section_id": 500,
                "section_name": "封神山",
                "points": 54,
                "power_consume": 5,
                "exp_obtain": 270,
                "coins_obtain": 540,
                "description": "神仙和我们人类一样，有生有死，有爱有恨，有苦有甜，有高贵也有卑微，有欢笑也有泪水。他们和我们唯一的区别是，他们生活在天上。"
            }
        }
    },
    "player_upgrade": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "exp": 32
            },
            "2": {
                "id": 2,
                "exp": 34
            },
            "3": {
                "id": 3,
                "exp": 37
            },
            "4": {
                "id": 4,
                "exp": 41
            },
            "5": {
                "id": 5,
                "exp": 45
            },
            "6": {
                "id": 6,
                "exp": 49
            },
            "7": {
                "id": 7,
                "exp": 54
            },
            "8": {
                "id": 8,
                "exp": 60
            },
            "9": {
                "id": 9,
                "exp": 65
            },
            "10": {
                "id": 10,
                "exp": 72
            },
            "11": {
                "id": 11,
                "exp": 79
            },
            "12": {
                "id": 12,
                "exp": 87
            },
            "13": {
                "id": 13,
                "exp": 96
            },
            "14": {
                "id": 14,
                "exp": 105
            },
            "15": {
                "id": 15,
                "exp": 116
            },
            "16": {
                "id": 16,
                "exp": 128
            },
            "17": {
                "id": 17,
                "exp": 140
            },
            "18": {
                "id": 18,
                "exp": 154
            },
            "19": {
                "id": 19,
                "exp": 170
            },
            "20": {
                "id": 20,
                "exp": 187
            },
            "21": {
                "id": 21,
                "exp": 205
            },
            "22": {
                "id": 22,
                "exp": 226
            },
            "23": {
                "id": 23,
                "exp": 249
            },
            "24": {
                "id": 24,
                "exp": 274
            },
            "25": {
                "id": 25,
                "exp": 301
            },
            "26": {
                "id": 26,
                "exp": 331
            },
            "27": {
                "id": 27,
                "exp": 364
            },
            "28": {
                "id": 28,
                "exp": 400
            },
            "29": {
                "id": 29,
                "exp": 440
            },
            "30": {
                "id": 30,
                "exp": 485
            },
            "31": {
                "id": 31,
                "exp": 533
            },
            "32": {
                "id": 32,
                "exp": 586
            },
            "33": {
                "id": 33,
                "exp": 645
            },
            "34": {
                "id": 34,
                "exp": 709
            },
            "35": {
                "id": 35,
                "exp": 780
            },
            "36": {
                "id": 36,
                "exp": 858
            },
            "37": {
                "id": 37,
                "exp": 944
            },
            "38": {
                "id": 38,
                "exp": 1039
            },
            "39": {
                "id": 39,
                "exp": 1143
            },
            "40": {
                "id": 40,
                "exp": 1257
            },
            "41": {
                "id": 41,
                "exp": 1382
            },
            "42": {
                "id": 42,
                "exp": 1521
            },
            "43": {
                "id": 43,
                "exp": 1673
            },
            "44": {
                "id": 44,
                "exp": 1840
            },
            "45": {
                "id": 45,
                "exp": 2024
            },
            "46": {
                "id": 46,
                "exp": 2226
            },
            "47": {
                "id": 47,
                "exp": 2449
            },
            "48": {
                "id": 48,
                "exp": 2694
            },
            "49": {
                "id": 49,
                "exp": 2963
            },
            "50": {
                "id": 50,
                "exp": 3260
            },
            "51": {
                "id": 51,
                "exp": 3586
            },
            "52": {
                "id": 52,
                "exp": 3944
            },
            "53": {
                "id": 53,
                "exp": 4339
            },
            "54": {
                "id": 54,
                "exp": 4773
            },
            "55": {
                "id": 55,
                "exp": 5250
            },
            "56": {
                "id": 56,
                "exp": 5775
            },
            "57": {
                "id": 57,
                "exp": 6352
            },
            "58": {
                "id": 58,
                "exp": 6988
            },
            "59": {
                "id": 59,
                "exp": 7686
            },
            "60": {
                "id": 60,
                "exp": 8455
            },
            "61": {
                "id": 61,
                "exp": 9301
            },
            "62": {
                "id": 62,
                "exp": 10231
            },
            "63": {
                "id": 63,
                "exp": 11254
            },
            "64": {
                "id": 64,
                "exp": 12379
            },
            "65": {
                "id": 65,
                "exp": 13617
            },
            "66": {
                "id": 66,
                "exp": 14979
            },
            "67": {
                "id": 67,
                "exp": 16476
            },
            "68": {
                "id": 68,
                "exp": 18124
            },
            "69": {
                "id": 69,
                "exp": 19937
            },
            "70": {
                "id": 70,
                "exp": 21930
            },
            "71": {
                "id": 71,
                "exp": 24123
            },
            "72": {
                "id": 72,
                "exp": 26535
            },
            "73": {
                "id": 73,
                "exp": 29189
            },
            "74": {
                "id": 74,
                "exp": 32108
            },
            "75": {
                "id": 75,
                "exp": 35319
            },
            "76": {
                "id": 76,
                "exp": 38851
            },
            "77": {
                "id": 77,
                "exp": 42736
            },
            "78": {
                "id": 78,
                "exp": 47009
            },
            "79": {
                "id": 79,
                "exp": 51710
            },
            "80": {
                "id": 80,
                "exp": 56881
            },
            "81": {
                "id": 81,
                "exp": 62569
            },
            "82": {
                "id": 82,
                "exp": 68826
            },
            "83": {
                "id": 83,
                "exp": 75709
            },
            "84": {
                "id": 84,
                "exp": 83280
            },
            "85": {
                "id": 85,
                "exp": 91608
            },
            "86": {
                "id": 86,
                "exp": 100769
            },
            "87": {
                "id": 87,
                "exp": 110845
            },
            "88": {
                "id": 88,
                "exp": 121930
            },
            "89": {
                "id": 89,
                "exp": 134123
            },
            "90": {
                "id": 90,
                "exp": 147535
            },
            "91": {
                "id": 91,
                "exp": 162289
            },
            "92": {
                "id": 92,
                "exp": 178518
            },
            "93": {
                "id": 93,
                "exp": 196369
            },
            "94": {
                "id": 94,
                "exp": 216006
            },
            "95": {
                "id": 95,
                "exp": 237607
            },
            "96": {
                "id": 96,
                "exp": 261368
            },
            "97": {
                "id": 97,
                "exp": 287504
            },
            "98": {
                "id": 98,
                "exp": 316255
            },
            "99": {
                "id": 99,
                "exp": 347880
            },
            "100": {
                "id": 100,
                "exp": 382668
            }
        }
    },
    "title": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "title": "初级天兵",
                "inc_value": 5,
                "honorPoint_need": 3000
            },
            "2": {
                "id": 2,
                "title": "中级天兵",
                "inc_value": 10,
                "honorPoint_need": 5000
            },
            "3": {
                "id": 3,
                "title": "高级天兵",
                "inc_value": 15,
                "honorPoint_need": 10000
            },
            "4": {
                "id": 4,
                "title": "初级天将",
                "inc_value": 20,
                "honorPoint_need": 20000
            },
            "5": {
                "id": 5,
                "title": "中级天将",
                "inc_value": 25,
                "honorPoint_need": 40000
            },
            "6": {
                "id": 6,
                "title": "高级天将",
                "inc_value": 30,
                "honorPoint_need": 70000
            },
            "7": {
                "id": 7,
                "title": "伏虎尊者",
                "inc_value": 35,
                "honorPoint_need": 10000
            },
            "8": {
                "id": 8,
                "title": "降龙尊者",
                "inc_value": 40,
                "honorPoint_need": 150000
            },
            "9": {
                "id": 9,
                "title": "三界战神",
                "inc_value": 45,
                "honorPoint_need": 200000
            },
            "10": {
                "id": 10,
                "title": "斗战胜佛",
                "inc_value": 50,
                "honorPoint_need": 300000
            }
        }
    },
    "rank": {
        "colComment": {},
        "rows": {
            "20": {
                "id": 20,
                "lv": 20,
                "win_exp": 1,
                "win_money": 50,
                "win_elixir": 5,
                "lose_exp": 1,
                "lose_money": 25,
                "lose_elixir": 3
            },
            "21": {
                "id": 21,
                "lv": 21,
                "win_exp": 1,
                "win_money": 60,
                "win_elixir": 7,
                "lose_exp": 1,
                "lose_money": 30,
                "lose_elixir": 4
            },
            "22": {
                "id": 22,
                "lv": 22,
                "win_exp": 1,
                "win_money": 70,
                "win_elixir": 9,
                "lose_exp": 1,
                "lose_money": 35,
                "lose_elixir": 5
            },
            "23": {
                "id": 23,
                "lv": 23,
                "win_exp": 1,
                "win_money": 80,
                "win_elixir": 11,
                "lose_exp": 1,
                "lose_money": 40,
                "lose_elixir": 6
            },
            "24": {
                "id": 24,
                "lv": 24,
                "win_exp": 1,
                "win_money": 90,
                "win_elixir": 13,
                "lose_exp": 1,
                "lose_money": 45,
                "lose_elixir": 7
            },
            "25": {
                "id": 25,
                "lv": 25,
                "win_exp": 2,
                "win_money": 100,
                "win_elixir": 15,
                "lose_exp": 1,
                "lose_money": 50,
                "lose_elixir": 8
            },
            "26": {
                "id": 26,
                "lv": 26,
                "win_exp": 2,
                "win_money": 110,
                "win_elixir": 17,
                "lose_exp": 1,
                "lose_money": 55,
                "lose_elixir": 9
            },
            "27": {
                "id": 27,
                "lv": 27,
                "win_exp": 2,
                "win_money": 120,
                "win_elixir": 19,
                "lose_exp": 1,
                "lose_money": 60,
                "lose_elixir": 10
            },
            "28": {
                "id": 28,
                "lv": 28,
                "win_exp": 2,
                "win_money": 130,
                "win_elixir": 21,
                "lose_exp": 1,
                "lose_money": 65,
                "lose_elixir": 11
            },
            "29": {
                "id": 29,
                "lv": 29,
                "win_exp": 2,
                "win_money": 140,
                "win_elixir": 23,
                "lose_exp": 1,
                "lose_money": 70,
                "lose_elixir": 12
            },
            "30": {
                "id": 30,
                "lv": 30,
                "win_exp": 2,
                "win_money": 150,
                "win_elixir": 25,
                "lose_exp": 1,
                "lose_money": 75,
                "lose_elixir": 13
            },
            "31": {
                "id": 31,
                "lv": 31,
                "win_exp": 3,
                "win_money": 160,
                "win_elixir": 27,
                "lose_exp": 1,
                "lose_money": 80,
                "lose_elixir": 14
            },
            "32": {
                "id": 32,
                "lv": 32,
                "win_exp": 3,
                "win_money": 170,
                "win_elixir": 29,
                "lose_exp": 1,
                "lose_money": 85,
                "lose_elixir": 15
            },
            "33": {
                "id": 33,
                "lv": 33,
                "win_exp": 3,
                "win_money": 180,
                "win_elixir": 31,
                "lose_exp": 2,
                "lose_money": 90,
                "lose_elixir": 16
            },
            "34": {
                "id": 34,
                "lv": 34,
                "win_exp": 4,
                "win_money": 190,
                "win_elixir": 33,
                "lose_exp": 2,
                "lose_money": 95,
                "lose_elixir": 17
            },
            "35": {
                "id": 35,
                "lv": 35,
                "win_exp": 4,
                "win_money": 200,
                "win_elixir": 35,
                "lose_exp": 2,
                "lose_money": 100,
                "lose_elixir": 18
            },
            "36": {
                "id": 36,
                "lv": 36,
                "win_exp": 4,
                "win_money": 210,
                "win_elixir": 37,
                "lose_exp": 2,
                "lose_money": 105,
                "lose_elixir": 19
            },
            "37": {
                "id": 37,
                "lv": 37,
                "win_exp": 5,
                "win_money": 220,
                "win_elixir": 39,
                "lose_exp": 2,
                "lose_money": 110,
                "lose_elixir": 20
            },
            "38": {
                "id": 38,
                "lv": 38,
                "win_exp": 5,
                "win_money": 230,
                "win_elixir": 41,
                "lose_exp": 3,
                "lose_money": 115,
                "lose_elixir": 21
            },
            "39": {
                "id": 39,
                "lv": 39,
                "win_exp": 6,
                "win_money": 240,
                "win_elixir": 43,
                "lose_exp": 3,
                "lose_money": 120,
                "lose_elixir": 22
            },
            "40": {
                "id": 40,
                "lv": 40,
                "win_exp": 6,
                "win_money": 250,
                "win_elixir": 45,
                "lose_exp": 3,
                "lose_money": 125,
                "lose_elixir": 23
            },
            "41": {
                "id": 41,
                "lv": 41,
                "win_exp": 7,
                "win_money": 260,
                "win_elixir": 47,
                "lose_exp": 3,
                "lose_money": 130,
                "lose_elixir": 24
            },
            "42": {
                "id": 42,
                "lv": 42,
                "win_exp": 8,
                "win_money": 270,
                "win_elixir": 49,
                "lose_exp": 4,
                "lose_money": 135,
                "lose_elixir": 25
            },
            "43": {
                "id": 43,
                "lv": 43,
                "win_exp": 8,
                "win_money": 280,
                "win_elixir": 51,
                "lose_exp": 4,
                "lose_money": 140,
                "lose_elixir": 26
            },
            "44": {
                "id": 44,
                "lv": 44,
                "win_exp": 9,
                "win_money": 290,
                "win_elixir": 53,
                "lose_exp": 5,
                "lose_money": 145,
                "lose_elixir": 27
            },
            "45": {
                "id": 45,
                "lv": 45,
                "win_exp": 10,
                "win_money": 300,
                "win_elixir": 55,
                "lose_exp": 5,
                "lose_money": 150,
                "lose_elixir": 28
            },
            "46": {
                "id": 46,
                "lv": 46,
                "win_exp": 11,
                "win_money": 310,
                "win_elixir": 57,
                "lose_exp": 6,
                "lose_money": 155,
                "lose_elixir": 29
            },
            "47": {
                "id": 47,
                "lv": 47,
                "win_exp": 12,
                "win_money": 320,
                "win_elixir": 59,
                "lose_exp": 6,
                "lose_money": 160,
                "lose_elixir": 30
            },
            "48": {
                "id": 48,
                "lv": 48,
                "win_exp": 13,
                "win_money": 330,
                "win_elixir": 61,
                "lose_exp": 7,
                "lose_money": 165,
                "lose_elixir": 31
            },
            "49": {
                "id": 49,
                "lv": 49,
                "win_exp": 15,
                "win_money": 340,
                "win_elixir": 63,
                "lose_exp": 7,
                "lose_money": 170,
                "lose_elixir": 32
            },
            "50": {
                "id": 50,
                "lv": 50,
                "win_exp": 16,
                "win_money": 350,
                "win_elixir": 65,
                "lose_exp": 8,
                "lose_money": 175,
                "lose_elixir": 33
            },
            "51": {
                "id": 51,
                "lv": 51,
                "win_exp": 18,
                "win_money": 360,
                "win_elixir": 67,
                "lose_exp": 9,
                "lose_money": 180,
                "lose_elixir": 34
            },
            "52": {
                "id": 52,
                "lv": 52,
                "win_exp": 20,
                "win_money": 370,
                "win_elixir": 69,
                "lose_exp": 10,
                "lose_money": 185,
                "lose_elixir": 35
            },
            "53": {
                "id": 53,
                "lv": 53,
                "win_exp": 22,
                "win_money": 380,
                "win_elixir": 71,
                "lose_exp": 11,
                "lose_money": 190,
                "lose_elixir": 36
            },
            "54": {
                "id": 54,
                "lv": 54,
                "win_exp": 24,
                "win_money": 390,
                "win_elixir": 73,
                "lose_exp": 12,
                "lose_money": 195,
                "lose_elixir": 37
            },
            "55": {
                "id": 55,
                "lv": 55,
                "win_exp": 26,
                "win_money": 400,
                "win_elixir": 75,
                "lose_exp": 13,
                "lose_money": 200,
                "lose_elixir": 38
            },
            "56": {
                "id": 56,
                "lv": 56,
                "win_exp": 29,
                "win_money": 410,
                "win_elixir": 77,
                "lose_exp": 14,
                "lose_money": 205,
                "lose_elixir": 39
            },
            "57": {
                "id": 57,
                "lv": 57,
                "win_exp": 32,
                "win_money": 420,
                "win_elixir": 79,
                "lose_exp": 16,
                "lose_money": 210,
                "lose_elixir": 40
            },
            "58": {
                "id": 58,
                "lv": 58,
                "win_exp": 35,
                "win_money": 430,
                "win_elixir": 81,
                "lose_exp": 17,
                "lose_money": 215,
                "lose_elixir": 41
            },
            "59": {
                "id": 59,
                "lv": 59,
                "win_exp": 38,
                "win_money": 440,
                "win_elixir": 83,
                "lose_exp": 19,
                "lose_money": 220,
                "lose_elixir": 42
            },
            "60": {
                "id": 60,
                "lv": 60,
                "win_exp": 42,
                "win_money": 450,
                "win_elixir": 85,
                "lose_exp": 21,
                "lose_money": 225,
                "lose_elixir": 43
            },
            "61": {
                "id": 61,
                "lv": 61,
                "win_exp": 47,
                "win_money": 460,
                "win_elixir": 87,
                "lose_exp": 23,
                "lose_money": 230,
                "lose_elixir": 44
            },
            "62": {
                "id": 62,
                "lv": 62,
                "win_exp": 51,
                "win_money": 470,
                "win_elixir": 89,
                "lose_exp": 26,
                "lose_money": 235,
                "lose_elixir": 45
            },
            "63": {
                "id": 63,
                "lv": 63,
                "win_exp": 56,
                "win_money": 480,
                "win_elixir": 91,
                "lose_exp": 28,
                "lose_money": 240,
                "lose_elixir": 46
            },
            "64": {
                "id": 64,
                "lv": 64,
                "win_exp": 62,
                "win_money": 490,
                "win_elixir": 93,
                "lose_exp": 31,
                "lose_money": 245,
                "lose_elixir": 47
            },
            "65": {
                "id": 65,
                "lv": 65,
                "win_exp": 68,
                "win_money": 500,
                "win_elixir": 95,
                "lose_exp": 34,
                "lose_money": 250,
                "lose_elixir": 48
            },
            "66": {
                "id": 66,
                "lv": 66,
                "win_exp": 75,
                "win_money": 510,
                "win_elixir": 97,
                "lose_exp": 37,
                "lose_money": 255,
                "lose_elixir": 49
            },
            "67": {
                "id": 67,
                "lv": 67,
                "win_exp": 82,
                "win_money": 520,
                "win_elixir": 99,
                "lose_exp": 41,
                "lose_money": 260,
                "lose_elixir": 50
            },
            "68": {
                "id": 68,
                "lv": 68,
                "win_exp": 91,
                "win_money": 530,
                "win_elixir": 101,
                "lose_exp": 45,
                "lose_money": 265,
                "lose_elixir": 51
            },
            "69": {
                "id": 69,
                "lv": 69,
                "win_exp": 100,
                "win_money": 540,
                "win_elixir": 103,
                "lose_exp": 50,
                "lose_money": 270,
                "lose_elixir": 52
            },
            "70": {
                "id": 70,
                "lv": 70,
                "win_exp": 110,
                "win_money": 550,
                "win_elixir": 105,
                "lose_exp": 55,
                "lose_money": 275,
                "lose_elixir": 53
            },
            "71": {
                "id": 71,
                "lv": 71,
                "win_exp": 121,
                "win_money": 560,
                "win_elixir": 107,
                "lose_exp": 60,
                "lose_money": 280,
                "lose_elixir": 54
            },
            "72": {
                "id": 72,
                "lv": 72,
                "win_exp": 133,
                "win_money": 570,
                "win_elixir": 109,
                "lose_exp": 66,
                "lose_money": 285,
                "lose_elixir": 55
            },
            "73": {
                "id": 73,
                "lv": 73,
                "win_exp": 146,
                "win_money": 580,
                "win_elixir": 111,
                "lose_exp": 73,
                "lose_money": 290,
                "lose_elixir": 56
            },
            "74": {
                "id": 74,
                "lv": 74,
                "win_exp": 161,
                "win_money": 590,
                "win_elixir": 113,
                "lose_exp": 80,
                "lose_money": 295,
                "lose_elixir": 57
            },
            "75": {
                "id": 75,
                "lv": 75,
                "win_exp": 177,
                "win_money": 600,
                "win_elixir": 115,
                "lose_exp": 88,
                "lose_money": 300,
                "lose_elixir": 58
            },
            "76": {
                "id": 76,
                "lv": 76,
                "win_exp": 194,
                "win_money": 610,
                "win_elixir": 117,
                "lose_exp": 97,
                "lose_money": 305,
                "lose_elixir": 59
            },
            "77": {
                "id": 77,
                "lv": 77,
                "win_exp": 214,
                "win_money": 620,
                "win_elixir": 119,
                "lose_exp": 107,
                "lose_money": 310,
                "lose_elixir": 60
            },
            "78": {
                "id": 78,
                "lv": 78,
                "win_exp": 235,
                "win_money": 630,
                "win_elixir": 121,
                "lose_exp": 118,
                "lose_money": 315,
                "lose_elixir": 61
            },
            "79": {
                "id": 79,
                "lv": 79,
                "win_exp": 259,
                "win_money": 640,
                "win_elixir": 123,
                "lose_exp": 129,
                "lose_money": 320,
                "lose_elixir": 62
            },
            "80": {
                "id": 80,
                "lv": 80,
                "win_exp": 284,
                "win_money": 650,
                "win_elixir": 125,
                "lose_exp": 142,
                "lose_money": 325,
                "lose_elixir": 63
            },
            "81": {
                "id": 81,
                "lv": 81,
                "win_exp": 313,
                "win_money": 660,
                "win_elixir": 127,
                "lose_exp": 156,
                "lose_money": 330,
                "lose_elixir": 64
            },
            "82": {
                "id": 82,
                "lv": 82,
                "win_exp": 344,
                "win_money": 670,
                "win_elixir": 129,
                "lose_exp": 172,
                "lose_money": 335,
                "lose_elixir": 65
            },
            "83": {
                "id": 83,
                "lv": 83,
                "win_exp": 379,
                "win_money": 680,
                "win_elixir": 131,
                "lose_exp": 189,
                "lose_money": 340,
                "lose_elixir": 66
            },
            "84": {
                "id": 84,
                "lv": 84,
                "win_exp": 416,
                "win_money": 690,
                "win_elixir": 133,
                "lose_exp": 208,
                "lose_money": 345,
                "lose_elixir": 67
            },
            "85": {
                "id": 85,
                "lv": 85,
                "win_exp": 458,
                "win_money": 700,
                "win_elixir": 135,
                "lose_exp": 229,
                "lose_money": 350,
                "lose_elixir": 68
            },
            "86": {
                "id": 86,
                "lv": 86,
                "win_exp": 504,
                "win_money": 710,
                "win_elixir": 137,
                "lose_exp": 252,
                "lose_money": 355,
                "lose_elixir": 69
            },
            "87": {
                "id": 87,
                "lv": 87,
                "win_exp": 554,
                "win_money": 720,
                "win_elixir": 139,
                "lose_exp": 277,
                "lose_money": 360,
                "lose_elixir": 70
            },
            "88": {
                "id": 88,
                "lv": 88,
                "win_exp": 610,
                "win_money": 730,
                "win_elixir": 141,
                "lose_exp": 305,
                "lose_money": 365,
                "lose_elixir": 71
            },
            "89": {
                "id": 89,
                "lv": 89,
                "win_exp": 671,
                "win_money": 740,
                "win_elixir": 143,
                "lose_exp": 335,
                "lose_money": 370,
                "lose_elixir": 72
            },
            "90": {
                "id": 90,
                "lv": 90,
                "win_exp": 738,
                "win_money": 750,
                "win_elixir": 145,
                "lose_exp": 369,
                "lose_money": 375,
                "lose_elixir": 73
            },
            "91": {
                "id": 91,
                "lv": 91,
                "win_exp": 811,
                "win_money": 760,
                "win_elixir": 147,
                "lose_exp": 406,
                "lose_money": 380,
                "lose_elixir": 74
            },
            "92": {
                "id": 92,
                "lv": 92,
                "win_exp": 893,
                "win_money": 770,
                "win_elixir": 149,
                "lose_exp": 446,
                "lose_money": 385,
                "lose_elixir": 75
            },
            "93": {
                "id": 93,
                "lv": 93,
                "win_exp": 982,
                "win_money": 780,
                "win_elixir": 151,
                "lose_exp": 491,
                "lose_money": 390,
                "lose_elixir": 76
            },
            "94": {
                "id": 94,
                "lv": 94,
                "win_exp": 1080,
                "win_money": 790,
                "win_elixir": 153,
                "lose_exp": 540,
                "lose_money": 395,
                "lose_elixir": 77
            },
            "95": {
                "id": 95,
                "lv": 95,
                "win_exp": 1188,
                "win_money": 800,
                "win_elixir": 155,
                "lose_exp": 594,
                "lose_money": 400,
                "lose_elixir": 78
            },
            "96": {
                "id": 96,
                "lv": 96,
                "win_exp": 1307,
                "win_money": 810,
                "win_elixir": 157,
                "lose_exp": 653,
                "lose_money": 405,
                "lose_elixir": 79
            },
            "97": {
                "id": 97,
                "lv": 97,
                "win_exp": 1438,
                "win_money": 820,
                "win_elixir": 159,
                "lose_exp": 719,
                "lose_money": 410,
                "lose_elixir": 80
            },
            "98": {
                "id": 98,
                "lv": 98,
                "win_exp": 1581,
                "win_money": 830,
                "win_elixir": 161,
                "lose_exp": 791,
                "lose_money": 415,
                "lose_elixir": 81
            },
            "99": {
                "id": 99,
                "lv": 99,
                "win_exp": 1739,
                "win_money": 840,
                "win_elixir": 163,
                "lose_exp": 870,
                "lose_money": 420,
                "lose_elixir": 82
            },
            "100": {
                "id": 100,
                "lv": 100,
                "win_exp": 0,
                "win_money": 850,
                "win_elixir": 165,
                "lose_exp": 0,
                "lose_money": 425,
                "lose_elixir": 83
            }
        }
    },
    "treasure_hunt": {
        "colComment": {},
        "rows": {
            "0": {
                "id": 0,
                "type": "power",
                "value": 10,
                "name": "体力",
                "type_rate": 30,
                "value_rate": 60,
                "rate": 18
            },
            "1": {
                "id": 1,
                "type": "power",
                "value": 50,
                "name": "体力",
                "type_rate": 30,
                "value_rate": 30,
                "rate": 9
            },
            "2": {
                "id": 2,
                "type": "power",
                "value": 100,
                "name": "体力",
                "type_rate": 30,
                "value_rate": 10,
                "rate": 3
            },
            "3": {
                "id": 3,
                "type": "elixir",
                "value": 10,
                "name": "仙丹",
                "type_rate": 15,
                "value_rate": 60,
                "rate": 9
            },
            "4": {
                "id": 4,
                "type": "elixir",
                "value": 100,
                "name": "仙丹",
                "type_rate": 15,
                "value_rate": 39,
                "rate": 5.85
            },
            "5": {
                "id": 5,
                "type": "elixir",
                "value": 5000,
                "name": "仙丹",
                "type_rate": 15,
                "value_rate": 1,
                "rate": 0.15
            },
            "6": {
                "id": 6,
                "type": "spirit",
                "value": 50,
                "name": "灵气",
                "type_rate": 10,
                "value_rate": 60,
                "rate": 6
            },
            "7": {
                "id": 7,
                "type": "spirit",
                "value": 100,
                "name": "灵气",
                "type_rate": 10,
                "value_rate": 39,
                "rate": 3.9
            },
            "8": {
                "id": 8,
                "type": "spirit",
                "value": 1000,
                "name": "灵气",
                "type_rate": 10,
                "value_rate": 1,
                "rate": 0.1
            },
            "9": {
                "id": 9,
                "type": "skillPoint",
                "value": 100,
                "name": "技能点",
                "type_rate": 10,
                "value_rate": 60,
                "rate": 6
            },
            "10": {
                "id": 10,
                "type": "skillPoint",
                "value": 500,
                "name": "技能点",
                "type_rate": 10,
                "value_rate": 39,
                "rate": 3.9
            },
            "11": {
                "id": 11,
                "type": "skillPoint",
                "value": 10000,
                "name": "技能点",
                "type_rate": 10,
                "value_rate": 1,
                "rate": 0.1
            },
            "12": {
                "id": 12,
                "type": "energy",
                "value": 50,
                "name": "活力",
                "type_rate": 10,
                "value_rate": 60,
                "rate": 6
            },
            "13": {
                "id": 13,
                "type": "energy",
                "value": 100,
                "name": "活力",
                "type_rate": 10,
                "value_rate": 39,
                "rate": 3.9
            },
            "14": {
                "id": 14,
                "type": "energy",
                "value": 5000,
                "name": "活力",
                "type_rate": 10,
                "value_rate": 1,
                "rate": 0.1
            },
            "15": {
                "id": 15,
                "type": "money",
                "value": 1000,
                "name": "铜板",
                "type_rate": 15,
                "value_rate": 60,
                "rate": 9
            },
            "16": {
                "id": 16,
                "type": "money",
                "value": 10000,
                "name": "铜板",
                "type_rate": 15,
                "value_rate": 39,
                "rate": 5.85
            },
            "17": {
                "id": 17,
                "type": "money",
                "value": 200000,
                "name": "铜板",
                "type_rate": 15,
                "value_rate": 1,
                "rate": 0.15
            },
            "18": {
                "id": 18,
                "type": "gold",
                "value": 10,
                "name": "元宝",
                "type_rate": 10,
                "value_rate": 99,
                "rate": 9.9
            },
            "19": {
                "id": 19,
                "type": "gold",
                "value": 500,
                "name": "元宝",
                "type_rate": 10,
                "value_rate": 1,
                "rate": 0.1
            }
        }
    },
    "spirit_pool": {
        "colComment": {},
        "rows": {
            "0": {
                "id": 0,
                "lv": 0,
                "exp_need": 50,
                "spirit_obtain": 8
            },
            "1": {
                "id": 1,
                "lv": 1,
                "exp_need": 225,
                "spirit_obtain": 10
            },
            "2": {
                "id": 2,
                "lv": 2,
                "exp_need": 450,
                "spirit_obtain": 12
            },
            "3": {
                "id": 3,
                "lv": 3,
                "exp_need": 825,
                "spirit_obtain": 14
            },
            "4": {
                "id": 4,
                "lv": 4,
                "exp_need": 1200,
                "spirit_obtain": 16
            },
            "5": {
                "id": 5,
                "lv": 5,
                "exp_need": 1575,
                "spirit_obtain": 18
            },
            "6": {
                "id": 6,
                "lv": 6,
                "exp_need": 1950,
                "spirit_obtain": 20
            },
            "7": {
                "id": 7,
                "lv": 7,
                "exp_need": 2325,
                "spirit_obtain": 22
            },
            "8": {
                "id": 8,
                "lv": 8,
                "exp_need": 2700,
                "spirit_obtain": 24
            },
            "9": {
                "id": 9,
                "lv": 9,
                "exp_need": 3075,
                "spirit_obtain": 26
            },
            "10": {
                "id": 10,
                "lv": 10,
                "exp_need": 0,
                "spirit_obtain": 28
            }
        }
    },
    "spirit": {
        "colComment": {},
        "rows": {
            "0": {
                "id": 0,
                "lv": 0,
                "spirit_need": 50,
                "hp_inc": 0,
                "atk_inc": 0,
                "spirit_atk_pct": 0,
                "rate": 0
            },
            "1": {
                "id": 1,
                "lv": 1,
                "spirit_need": 900,
                "hp_inc": 5,
                "atk_inc": 5,
                "spirit_atk_pct": 55,
                "rate": 100
            },
            "2": {
                "id": 2,
                "lv": 2,
                "spirit_need": 2040,
                "hp_inc": 10,
                "atk_inc": 10,
                "spirit_atk_pct": 60,
                "rate": 30
            },
            "3": {
                "id": 3,
                "lv": 3,
                "spirit_need": 4180,
                "hp_inc": 15,
                "atk_inc": 15,
                "spirit_atk_pct": 65,
                "rate": 30
            },
            "4": {
                "id": 4,
                "lv": 4,
                "spirit_need": 6720,
                "hp_inc": 20,
                "atk_inc": 20,
                "spirit_atk_pct": 70,
                "rate": 30
            },
            "5": {
                "id": 5,
                "lv": 5,
                "spirit_need": 9660,
                "hp_inc": 25,
                "atk_inc": 25,
                "spirit_atk_pct": 75,
                "rate": 30
            },
            "6": {
                "id": 6,
                "lv": 6,
                "spirit_need": 13000,
                "hp_inc": 30,
                "atk_inc": 30,
                "spirit_atk_pct": 80,
                "rate": 30
            },
            "7": {
                "id": 7,
                "lv": 7,
                "spirit_need": 16740,
                "hp_inc": 35,
                "atk_inc": 35,
                "spirit_atk_pct": 85,
                "rate": 30
            },
            "8": {
                "id": 8,
                "lv": 8,
                "spirit_need": 20880,
                "hp_inc": 40,
                "atk_inc": 40,
                "spirit_atk_pct": 90,
                "rate": 30
            },
            "9": {
                "id": 9,
                "lv": 9,
                "spirit_need": 25420,
                "hp_inc": 45,
                "atk_inc": 45,
                "spirit_atk_pct": 95,
                "rate": 30
            },
            "10": {
                "id": 10,
                "lv": 10,
                "spirit_need": 0,
                "hp_inc": 50,
                "atk_inc": 50,
                "spirit_atk_pct": 100,
                "rate": 30
            }
        }
    },
    "signIn_rewards": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "count": 5,
                "money": 10000,
                "energy": 200,
                "skillPoint": 0,
                "elixir": 0,
                "lottery_free_count": 0
            },
            "2": {
                "id": 2,
                "count": 10,
                "money": 20000,
                "energy": 300,
                "skillPoint": 0,
                "elixir": 0,
                "lottery_free_count": 0
            },
            "3": {
                "id": 3,
                "count": 15,
                "money": 30000,
                "energy": 500,
                "skillPoint": 1000,
                "elixir": 0,
                "lottery_free_count": 5
            },
            "4": {
                "id": 4,
                "count": 20,
                "money": 50000,
                "energy": 800,
                "skillPoint": 2000,
                "elixir": 1000,
                "lottery_free_count": 10
            },
            "5": {
                "id": 5,
                "count": 25,
                "money": 100000,
                "energy": 1000,
                "skillPoint": 3000,
                "elixir": 2000,
                "lottery_free_count": 15
            }
        }
    },
    "recharge": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "cash": 10,
                "gold": 10
            },
            "2": {
                "id": 2,
                "cash": 30,
                "gold": 30
            },
            "3": {
                "id": 3,
                "cash": 50,
                "gold": 50
            },
            "4": {
                "id": 4,
                "cash": 100,
                "gold": 120
            },
            "5": {
                "id": 5,
                "cash": 200,
                "gold": 250
            },
            "6": {
                "id": 6,
                "cash": 500,
                "gold": 700
            },
            "7": {
                "id": 7,
                "cash": 600,
                "gold": 800
            }
        }
    },
    "vip_privilege": {
        "colComment": {},
        "rows": {
            "0": {
                "id": 0,
                "lottery_free_count": 0,
                "friend_count": 0,
                "buy_power_count": 0,
                "give_bless_count": 0,
                "receive_bless_count": 0,
                "challenge_count": 0,
                "spirit_collect_count": 0
            },
            "1": {
                "id": 1,
                "lottery_free_count": 1,
                "friend_count": 0,
                "buy_power_count": 0,
                "give_bless_count": 0,
                "receive_bless_count": 0,
                "challenge_count": 0,
                "spirit_collect_count": 0
            },
            "2": {
                "id": 2,
                "lottery_free_count": 2,
                "friend_count": 5,
                "buy_power_count": 0,
                "give_bless_count": 0,
                "receive_bless_count": 0,
                "challenge_count": 0,
                "spirit_collect_count": 0
            },
            "3": {
                "id": 3,
                "lottery_free_count": 3,
                "friend_count": 10,
                "buy_power_count": 0,
                "give_bless_count": 0,
                "receive_bless_count": 0,
                "challenge_count": 0,
                "spirit_collect_count": 0
            },
            "4": {
                "id": 4,
                "lottery_free_count": 4,
                "friend_count": 15,
                "buy_power_count": 1,
                "give_bless_count": 0,
                "receive_bless_count": 0,
                "challenge_count": 0,
                "spirit_collect_count": 0
            },
            "5": {
                "id": 5,
                "lottery_free_count": 5,
                "friend_count": 20,
                "buy_power_count": 2,
                "give_bless_count": 5,
                "receive_bless_count": 0,
                "challenge_count": 0,
                "spirit_collect_count": 0
            },
            "6": {
                "id": 6,
                "lottery_free_count": 6,
                "friend_count": 25,
                "buy_power_count": 3,
                "give_bless_count": 6,
                "receive_bless_count": 6,
                "challenge_count": 0,
                "spirit_collect_count": 0
            },
            "7": {
                "id": 7,
                "lottery_free_count": 7,
                "friend_count": 30,
                "buy_power_count": 4,
                "give_bless_count": 7,
                "receive_bless_count": 7,
                "challenge_count": 0,
                "spirit_collect_count": 0
            },
            "8": {
                "id": 8,
                "lottery_free_count": 8,
                "friend_count": 35,
                "buy_power_count": 5,
                "give_bless_count": 8,
                "receive_bless_count": 8,
                "challenge_count": 3,
                "spirit_collect_count": 0
            },
            "9": {
                "id": 9,
                "lottery_free_count": 9,
                "friend_count": 40,
                "buy_power_count": 6,
                "give_bless_count": 9,
                "receive_bless_count": 9,
                "challenge_count": 4,
                "spirit_collect_count": 0
            },
            "10": {
                "id": 10,
                "lottery_free_count": 10,
                "friend_count": 45,
                "buy_power_count": 7,
                "give_bless_count": 10,
                "receive_bless_count": 10,
                "challenge_count": 5,
                "spirit_collect_count": 5
            },
            "11": {
                "id": 11,
                "lottery_free_count": 11,
                "friend_count": 50,
                "buy_power_count": 8,
                "give_bless_count": 11,
                "receive_bless_count": 11,
                "challenge_count": 6,
                "spirit_collect_count": 6
            },
            "12": {
                "id": 12,
                "lottery_free_count": 12,
                "friend_count": 50,
                "buy_power_count": 9,
                "give_bless_count": 12,
                "receive_bless_count": 12,
                "challenge_count": 7,
                "spirit_collect_count": 7
            }
        }
    },
    "vip_box": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "power": 100,
                "energy": 500,
                "money": 100000,
                "skillPoint": 0,
                "elixir": 0,
                "fragments": 0,
                "exp_card": 0,
                "price": 10
            },
            "2": {
                "id": 2,
                "power": 120,
                "energy": 600,
                "money": 120000,
                "skillPoint": 1000,
                "elixir": 0,
                "fragments": 0,
                "exp_card": 0,
                "price": 50
            },
            "3": {
                "id": 3,
                "power": 140,
                "energy": 700,
                "money": 150000,
                "skillPoint": 1100,
                "elixir": 1000,
                "fragments": 0,
                "exp_card": 0,
                "price": 100
            },
            "4": {
                "id": 4,
                "power": 160,
                "energy": 800,
                "money": 200000,
                "skillPoint": 1200,
                "elixir": 1500,
                "fragments": 3,
                "exp_card": 0,
                "price": 200
            },
            "5": {
                "id": 5,
                "power": 180,
                "energy": 900,
                "money": 250000,
                "skillPoint": 2000,
                "elixir": 2000,
                "fragments": 3,
                "exp_card": 0,
                "price": 300
            },
            "6": {
                "id": 6,
                "power": 200,
                "energy": 1000,
                "money": 300000,
                "skillPoint": 2100,
                "elixir": 2500,
                "fragments": 3,
                "exp_card": 10,
                "price": 400
            },
            "7": {
                "id": 7,
                "power": 200,
                "energy": 1100,
                "money": 350000,
                "skillPoint": 2200,
                "elixir": 3000,
                "fragments": 3,
                "exp_card": 15,
                "price": 500
            },
            "8": {
                "id": 8,
                "power": 200,
                "energy": 1200,
                "money": 400000,
                "skillPoint": 5000,
                "elixir": 5000,
                "fragments": 5,
                "exp_card": 20,
                "price": 600
            },
            "9": {
                "id": 9,
                "power": 200,
                "energy": 1300,
                "money": 450000,
                "skillPoint": 5100,
                "elixir": 5500,
                "fragments": 5,
                "exp_card": 15,
                "price": 700
            },
            "10": {
                "id": 10,
                "power": 200,
                "energy": 1400,
                "money": 500000,
                "skillPoint": 10000,
                "elixir": 6000,
                "fragments": 10,
                "exp_card": 20,
                "price": 800
            },
            "11": {
                "id": 11,
                "power": 200,
                "energy": 1500,
                "money": 550000,
                "skillPoint": 11000,
                "elixir": 7000,
                "fragments": 10,
                "exp_card": 20,
                "price": 900
            },
            "12": {
                "id": 12,
                "power": 200,
                "energy": 1600,
                "money": 600000,
                "skillPoint": 15000,
                "elixir": 10000,
                "fragments": 10,
                "exp_card": 20,
                "price": 1000
            }
        }
    },
    "vip": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "lv": 1,
                "name": "Vip1",
                "cash": 10,
                "total_cash": 10
            },
            "2": {
                "id": 2,
                "lv": 2,
                "name": "Vip2",
                "cash": 50,
                "total_cash": 60
            },
            "3": {
                "id": 3,
                "lv": 3,
                "name": "Vip3",
                "cash": 100,
                "total_cash": 160
            },
            "4": {
                "id": 4,
                "lv": 4,
                "name": "Vip4",
                "cash": 200,
                "total_cash": 360
            },
            "5": {
                "id": 5,
                "lv": 5,
                "name": "Vip5",
                "cash": 500,
                "total_cash": 860
            },
            "6": {
                "id": 6,
                "lv": 6,
                "name": "Vip6",
                "cash": 1000,
                "total_cash": 1860
            },
            "7": {
                "id": 7,
                "lv": 7,
                "name": "Vip7",
                "cash": 2000,
                "total_cash": 3860
            },
            "8": {
                "id": 8,
                "lv": 8,
                "name": "Vip8",
                "cash": 5000,
                "total_cash": 8860
            },
            "9": {
                "id": 9,
                "lv": 9,
                "name": "Vip9",
                "cash": 8000,
                "total_cash": 16860
            },
            "10": {
                "id": 10,
                "lv": 10,
                "name": "Vip10",
                "cash": 10000,
                "total_cash": 26860
            },
            "11": {
                "id": 11,
                "lv": 11,
                "name": "Vip11",
                "cash": 20000,
                "total_cash": 46860
            },
            "12": {
                "id": 12,
                "lv": 12,
                "name": "Vip12",
                "cash": 50000,
                "total_cash": 96860
            }
        }
    },
    "achievement": {
        "colComment": {},
        "rows": {
            "1": {
                "id": 1,
                "method": "levelTo",
                "need": 50,
                "name": "升级达人",
                "desc": "角色等级达到50级",
                "gold": 10,
                "energy": 100
            },
            "2": {
                "id": 2,
                "method": "levelTo",
                "need": 90,
                "name": "疯狂升级",
                "desc": "角色等级达到90级",
                "gold": 100,
                "energy": 1000
            },
            "3": {
                "id": 3,
                "method": "passTo",
                "need": 50,
                "name": "一半！",
                "desc": "天道闯过50层",
                "gold": 10,
                "energy": 100
            },
            "4": {
                "id": 4,
                "method": "passTo",
                "need": 100,
                "name": "通关！",
                "desc": "天道闯过100层",
                "gold": 100,
                "energy": 1000
            },
            "5": {
                "id": 5,
                "method": "winCount",
                "need": 50,
                "name": "小试牛刀",
                "desc": "竞技获胜次数达到50场",
                "gold": 10,
                "energy": 100
            },
            "6": {
                "id": 6,
                "method": "winCount",
                "need": 5000,
                "name": "已经超神了",
                "desc": "竞技获胜次数达到5000场",
                "gold": 100,
                "energy": 1000
            },
            "7": {
                "id": 7,
                "method": "winningStreak",
                "need": 50,
                "name": "所向披靡",
                "desc": "竞技最高连胜达到50次",
                "gold": 100,
                "energy": 1000
            },
            "8": {
                "id": 8,
                "method": "rankingTo",
                "need": 1,
                "name": "寂寞",
                "desc": "竞技排名达到第一",
                "gold": 100,
                "energy": 1000
            },
            "9": {
                "id": 9,
                "need": 1,
                "name": "霸气外射！",
                "desc": "以1敌5，战胜对方",
                "gold": 10,
                "energy": 100
            },
            "10": {
                "id": 10,
                "method": "friends",
                "need": 20,
                "name": "我们约会吧",
                "desc": "拥有20个好友",
                "gold": 10,
                "energy": 100
            },
            "11": {
                "id": 11,
                "method": "gaveBless",
                "need": 500,
                "name": "无私奉献",
                "desc": "为好友送出祝福达到500次",
                "gold": 10,
                "energy": 100
            },
            "12": {
                "id": 12,
                "method": "receivedBless",
                "need": 100,
                "name": "爱是相互的",
                "desc": "收到好友祝福次数达到100次",
                "gold": 300,
                "energy": 2000
            },
            "13": {
                "id": 13,
                "method": "star5card",
                "need": 1,
                "name": "质的飞跃",
                "desc": "获得1张5星卡",
                "gold": 10,
                "energy": 100
            },
            "14": {
                "id": 14,
                "method": "star5cardLevelTo",
                "need": 60,
                "name": "这就是实力",
                "desc": "将1张5星卡强化到满级",
                "gold": 50,
                "energy": 500
            },
            "15": {
                "id": 15,
                "method": "star5card",
                "need": 5,
                "name": "你就是神！",
                "desc": "获得5张5星卡",
                "gold": 100,
                "energy": 1000
            },
            "16": {
                "id": 16,
                "method": "psTo",
                "need": 10,
                "name": "但求最好",
                "desc": "拥有1个10%的被动属性",
                "gold": 10,
                "energy": 100
            },
            "17": {
                "id": 17,
                "method": "elixirTo",
                "need": 100000,
                "name": "一大波仙丹",
                "desc": "累计获得100000仙丹",
                "gold": 50,
                "energy": 500
            },
            "18": {
                "id": 18,
                "method": "energyTo",
                "need": 100000,
                "name": "活力无限",
                "desc": "累计获得100000活力值",
                "gold": 100,
                "energy": 1000
            },
            "19": {
                "id": 19,
                "method": "luckyCardCount",
                "need": 9999,
                "name": "抽卡狂魔",
                "desc": "抽卡总次数达到9999",
                "gold": 100,
                "energy": 500
            },
            "20": {
                "id": 20,
                "method": "highLuckyCardCount",
                "need": 8888,
                "name": "钱就是个屁",
                "desc": "高级抽卡总次数达到8888",
                "gold": 100,
                "energy": 1000
            },
            "21": {
                "id": 21,
                "need": 1,
                "name": "买彩票去吧",
                "desc": "只消耗一张素材卡进阶成功",
                "gold": 50,
                "energy": 100
            },
            "22": {
                "id": 22,
                "method": "powerConsume",
                "need": 10000,
                "name": "孜孜不倦",
                "desc": "累计消耗体力10000点",
                "gold": 10,
                "energy": 100
            },
            "23": {
                "id": 23,
                "method": "vip",
                "need": 1,
                "name": "我是VIP！",
                "desc": "成为VIP用户",
                "gold": 50,
                "energy": 500
            },
            "24": {
                "id": 24,
                "method": "moneyConsume",
                "need": 10000000,
                "name": "不差钱",
                "desc": "累计消耗仙币1000万",
                "gold": 10,
                "energy": 100
            },
            "25": {
                "id": 25,
                "method": "goldConsume",
                "need": 100000,
                "name": "挥金如土",
                "desc": "累计消耗元宝100000",
                "gold": 50,
                "energy": 500
            }
        }
    }
};