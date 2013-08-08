/*
 * 星级进阶配置信息
 */
module.exports = {
  STAR_MIN: 1,          // 卡牌星级必须大于此值才能进阶
  STAR_1: {
    money: 3000,
    rate_per_card: 7,
    max_num: 15
  },
  STAR_2: {
    money: 5000,
    rate_per_card: 6,
    max_num: 17
  },
  STAR_3: {             // 三星进阶
    money: 10000,
    rate_per_card: 5,   // 每张卡牌提供的进阶概率
    max_num: 20,        // 最多提供的卡牌数量
  },
  STAR_4: {
    money: 20000,
    rate_per_card: 3,   // 每张卡牌提供的进阶概率
    max_num: 34,        // 最多提供的卡牌数量
  },
  DEFAULT_INHERIT: {    // 进阶后属性的传承配置信息
    exp: 50,            // 卡牌经验传承百分之五十
    skillPoint: 50,     // 技能点传承百分之五十
    elixir: 50          // 仙丹传承百分之五十
  },
  ALL_INHERIT_GOLD: 500 // 100%传承所需要花费的元宝数量
}