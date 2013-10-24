module.exports = {
  "DEFAULT_VALUE": {
    "money": 1000,
    "lv": 1,
    "power": 50
  },
  "POWER_RESUME": {
    "interval": 60000 * 10,
    "point": 5
  },
  "POWER_GIVE": {
    "hours": [12, 18], 
    "point": 50,
    "interval": 60000
  },
  "MAX_SPIRITOR_LV":10,
  "MAX_SPIRITPOOL_LV":10,
  "MAX_PLAYER_LV":100,

  "BUY_MONEY": { //购买仙币类型
    "1": {
      "gold": 10,
      "money": 1000 + 200
    },
    "2": {
      "gold": 50,
      "money": 5000 + 1000
    },
    "3": {
      "gold": 100,
      "money": 10000 + 3000
    }
  },

  "BUY_POWER": { //购买体力
    "gold": 20,
    "power": 50
  },

  "BUY_CHALLENGECOUNT": {  // 购买有奖竞技次数
    "gold": 20
  },

  "FRIENDCOUNT_LIMIT": {
    1: 20,
    31: 30,
    51: 40,
    71: 50
  }
}