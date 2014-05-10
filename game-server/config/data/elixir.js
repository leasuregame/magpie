/*
 * 卡牌熔炼配置信息
 */
module.exports = {
  /*
  熔炼卡牌时，每种星级的卡牌获得的仙丹数和概率
  key, 为星级；value, 为概率和值
  如："1": {rate: 30, value: 5}
      表示熔炼1星级卡牌，百分之30的概率获得5点的仙丹
   */
  smelt: {
    "1": {rate: 30, value: 5},
    "2": {rate: 30, value: 5},
    "3": {rate: 100, value: 50},
    "4": {rate: 100, value: 150},
    "5": {rate: 100, value: 250}
  },
  /*
  仙丹加成效果
  5点仙丹可以加成1点攻击力
  5点仙丹可以加成3点生命力
   */
  exchange: {
    atk: 5,
    hp: 10
  },

  useElixirCritRate: 20,
  growRate: {
    50: 30,
    30: 50,
    20: 100
  }
}