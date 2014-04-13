/*
 * 星级进阶配置信息
 */
module.exports = {
  STAR_1: {
    money: 5000,
    rate_per_card: 7,
    max_num: 15
  },
  STAR_2: {
    money: 10000,
    rate_per_card: 6,
    max_num: 17
  },
  STAR_3: {             // 三星进阶
    money: 20000,
    rate_per_card: 5,   // 每张卡牌提供的进阶概率
    max_num: 20         // 最多提供的卡牌数量
  },
  STAR_4: {
    money: 50000,
    rate_per_card: 4,   // 每张卡牌提供的进阶概率
    max_num: 25         // 最多提供的卡牌数量
  }
  
}