/*
 * 抽卡参数配置
 */
module.exports = {
  "STAR": {       // 抽卡时得到卡牌的星级的概率
    "LOWER": {    // 低级抽卡
      "1": 50,
      "2": 45,
      "3": 4.5,
      "4": 0.48,
      "5": 0.02
    },
    "MEDIUM": {   // 中级抽卡
      "2": 70,
      "3": 26,
      "4": 3.58,
      "5": 0.15
    },
    "HIGHT": {    // 高级抽卡
      "3": 95,
      "4": 4.8,
      "5": 0.2
    }
  },
  "HIGHT_LEVEL_INIT": 1,    // 抽到高级卡牌（3、4、5星卡牌）的等级的初始值
  "LOWER_LEVEL_INIT": {     // 抽到低级卡牌（1、2星卡牌）的等级的初始值，以及对应的概率
    "1": 60,                // key, value 分别表示 星级 和 对应得到的概率
    "2": 10,
    "3": 10,
    "4": 10,
    "5": 10
  },
  "FRAGMENT": {             // 每次抽卡获得卡牌碎片的概率
    "1": 1,                 // key, value 表示 抽卡等级 和 概率
    "2": 5,                 // (key = 1,2,3 分别表示 低级、中级、高级抽卡)。 
    "3": 10                 // "1": 1 就表示每次低级抽卡可获的一张卡牌碎片的概率为百分之一
  },
  "LOTTERY_CONSUME": {
    "1": {
      "1": 10,
      "2": 70,
      "3": 100
    },
    "0": {
      "1": 100,
      "2": 300,
      "3": 500
    }
  },
  "PASSIVESKILL": {
    TYPE: [
      'crit',
      'dodge',
      'dmg_reduce',
      'atk_improve',
      'hp_improve'
     ],
    VALUE_SCOPE: '1-4'
  }
}