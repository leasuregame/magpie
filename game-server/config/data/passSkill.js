module.exports = {
  INIT_MAX: 4,  // 出生卡牌被动技能最大值
  MAX: 10,      // 所有被动技能的最大值
  TYPE_RATES: { // 卡牌出生时，随机到每个被动技能的概率
    "atk_improve": 20,
    "hp_improve": 20,
    "crit": 20,
    "dodge": 20,
    "atk_reduce": 20
  },
  AFRESH: {         // 洗炼被动技能得到的百分比的概率
    money: {
      "1~4": 60,
      "5~7": 39.7,
      "8~10": 0.3
    },
    gold: {
      "1~4": 60,
      "5~7": 37,
      "8~10": 3
    }
  },
  CONSUME: {      // 每次洗炼的消耗, 铜板 20000, 元宝 10
    money: 20000,
    gold: 10
  }
}