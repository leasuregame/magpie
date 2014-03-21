module.exports = {
  INIT_MAX: 4.9, // 出生卡牌被动技能最大值
  MAX: 10, // 所有被动技能的最大值
  TYPE: {
    MONEY: 1,
    GOLD: 2
  },
  BORN_RATES: { // 卡牌出生时，随机到每个被动技能的概率
    "atk_improve": 12.5,  // 攻击
    "hp_improve": 12.5,   // 生命
    
    "crit": 12.5,         // 暴击
    "toughness": 12.5,    // 韧性
    
    "dodge": 12.5,        // 闪避
    "hit": 12.5,          // 命中

    "dmg_reduce": 12.5,   // 减伤
    "disrupting": 12.5    // 破防

  },
  AFRESH: { // 洗炼被动技能得到的百分比的概率
    TYPE: {
      1: { // 仙币洗练
        STAR: {
          5: {
            "1~4.9": 76,
            "5~7.9": 23.8,
            "8~10": 0.2
          },
          6: {
            "1~4.9": 76,
            "5~8.9": 23.8,
            "9~11": 0.2
          },
          7: {
            "1~4.9": 76,
            "5~9.9": 23.8,
            "10~12": 0.2
          }
        }
      },
      2: { // 魔石洗练
        STAR: {
          5: {
            "1~4.9": 76,
            "5~7.9": 22,
            "8~10": 2
          },
          6: {
            "1~4.9": 76,
            "5~8.9": 22,
            "9~11": 2
          },
          7: {
            "1~4.9": 76,
            "5~9.9": 22,
            "10~12": 2
          }
        }
      }
    }
  },
  CONSUME: { // 每次洗炼的消耗, 铜板 2000, 元宝 10
    1: 5000,
    2: 20
  }
}