module.exports = {
  STATUS: {
    SLEEP: 1,
    AWAKE: 2,
    RUNAWAY: 3,
    TIMEOUT: 4,
    DEATH: 5,
    DISAPPEAR: 6
  }, 
  INSPIRE_PER_CARD: 20, // 每次鼓舞的加成比例 %
  INSPIRE_MAX: 100,     // 最高加成比例 %
  INSPIRE_GOLD: 20,     // 每次鼓舞消耗的魔石数量
  
  KNEEL_REWARD: {
    ENERGY: 75,
    POWER: 15
  },
  HONOR_TO_SUPER: 6000,     // 兑换一个精元需要的荣誉点
  REWARD_COUNT: {           // 计算奖励配置信息
    MIN: 2000,
    FACTOR: 0.003,
    DURACTION: 20,
    BASE_VALUE: 8000
  },

  DAMAGE_TO_MONEY: {
    DAMAGE: 1000,
    MONEY: 31
  },
  DAMAGE_TO_HONOR: {
    DAMAGE: 2000,
    HONOR: 1
  },

  FRIEND_REWARD_PERCENT: 0.3  // 协助好友攻击boss，好友得到奖励所占比例
}