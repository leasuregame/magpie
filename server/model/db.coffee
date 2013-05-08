OWN = 1
ENEMY = -1

CARDSPOSITION = 
  self: 1
  crossways_front: 2
  crossways_back: 3
  lengthways: 4
  all: 5
  hp_max: 6
  hp_min: 7
  atk_max: 8
  atk_min: 9
  random: 10
  default: 11


class Database
  @find: (model, id) ->
    return item for item in @_model(model) when item.id is id
    null

  @findAll: (model) ->
    return @_model(model)

  @_model: (m) ->
    res = {
      player: [
        {id: 1, lv: 3, hero_ids: [1]}
        {id: 2, lv: 3, hero_ids: [2]}
        {id: 3, lv: 2, hero_ids: [3, 4, 5]}
        {id: 4, lv: 1, hero_ids: [6, 7, 8]}
        {id: 5, lv: 4, hero_ids: [9, 10, 11]}
        {id: 6, lv: 5, hero_ids: [12]}
        {id: 7, lv: 5, hero_ids: [13]}
      ],
      hero: [
        {id: 1, hp: 501, atk: 41, skill: '普通攻击', effects: '刀光剑影'}
        {id: 2, hp: 500, atk: 40, skill: '普通攻击', effects: '刀光剑影'}
        {id: 3, hp: 500, atk: 40, skill: '普通攻击', effects: '刀光剑影'}
        {id: 4, hp: 500, atk: 40, skill: '普通攻击', effects: '刀光剑影'}
        {id: 5, hp: 500, atk: 40, skill: '普通攻击', effects: '刀光剑影'}
        {id: 6, hp: 500, atk: 40, skill: '普通攻击', effects: '刀光剑影'}
        {id: 7, hp: 500, atk: 40, skill: '普通攻击', effects: '刀光剑影'}
        {id: 8, hp: 500, atk: 40, skill: '普通攻击', effects: '刀光剑影'}
        {id: 9, hp: 500, atk: 40, skill: '普通攻击', effects: '刀光剑影'}
        {id: 10, hp: 500, atk: 40, skill: '普通攻击', effects: '刀光剑影'}
        {id: 11, hp: 500, atk: 40, skill: '普通攻击', effects: '刀光剑影'}
        {id: 12, hp: 10000, atk: 3000, skill: '暴击攻击', effects: '-3000'}
        {id: 13, hp: 11000, atk: 2700, skill: '暴击攻击', effects: '-2700'}
      ],
      skill: [
        {
          id: 1,
          name: '提升攻击',
          condition: 'passive',
          magic: 'atk_improve',
          when: 'now',
          target: OWN,
          scope: CARDSPOSITION.self,
          star3: '10:5',
          start4: '15:5',
          star5: '20:5'
        }, {
          id: 2,
          name: '免疫暴击',
          condition: 'passive',
          magic: 'crit_ignore',
          when: 'now',
          target: OWN,
          scope: CARDSPOSITION.self
        }, {
          id: 3,
          name: '提升攻击和生命',
          condition: 'passive',
          magic: 'atk_improve',
          when: 'now',
          target: OWN,
          scope: CARDSPOSITION.self,
          star3: '5:5',
          start4: '10:5',
          star5: '15:5'
        }, {
          id: 4,
          name: '增加己方任意2张卡牌下次攻击的攻击力',
          condition: 'passive_rate',
          rate: 30,
          magic: 'atk_improve',
          when: 'next_round',
          target: OWN,
          scope: CARDSPOSITION.random,
          random_cards: 2,
          star3: '10:5',
          start4: '15:5',
          star5: '20:5'
        }, {
          id: 5,
          name: '纵向攻击 伤害平摊',
          condition: 'passive_rate',
          rate: 30,
          magic: 'atk_lengthways',
          when: 'now',
          target: ENEMY,
          scope: CARDSPOSITION.crossways_front,
          star3: '10:5',
          start4: '15:5',
          star5: '20:5'
        }, {
          id: 5,
          name: '单体攻击敌方卡牌，附加魅惑效果，使其下一回合随机攻击己方某一张卡牌',
          condition: 'passive_rate',
          rate: 30,
          magic: 'atk_self_card',
          when: 'next_round',
          target: ENEMY,
          scope: CARDSPOSITION.random,
          random_cards: 1,
          star3: '10:5',
          start4: '15:5',
          star5: '20:5'
        }, {
          id: 5,
          name: '每次攻击，都有一定概率（30%）封印对方攻击力最低的卡牌，使其下一回合无法发动攻击',
          condition: 'passive_rate',
          rate: 30,
          magic: 'atk_forbid',
          when: 'next_round',
          target: ENEMY,
          scope: CARDSPOSITION.hp_min,
          star3: '10:5',
          start4: '15:5',
          star5: '20:5'
        }, {
          id: 5,
          name: '每次攻击，都有一定概率（30%）对敌方造成连击效果，发起第二次攻击。---第二次攻击伤害的变化',
          condition: 'passive_rate',
          rate: 30,
          magic: 'atk_multiple',
          when: 'now',
          target: ENEMY,
          scope: CARDSPOSITION["default"],
          star3: '10:5',
          start4: '15:5',
          star5: '20:5'
        }, {
          id: 5,
          name: '伤害造成暴击后，下次发动攻击，其攻击力提升20%。',
          condition: 'on_crit',
          magic: 'atk_improve',
          when: 'next_round',
          target: ENEMY,
          scope: CARDSPOSITION["default"],
          star3: '20:5',
          start4: '25:5',
          star5: '30:5'
        }, {
          id: 5,
          name: '卡牌阵亡后，将对敌方生命值最高的卡牌发起额外的最后一击，造成自身攻击力20%的伤害量。',
          condition: 'on_self_death',
          magic: 'atk_one_more',
          when: 'now',
          target: ENEMY,
          scope: CARDSPOSITION.hp_max,
          star3: '20:5',
          start4: '25:5',
          star5: '30:5'
        }, {
          id: 5,
          name: '护佑己方生命值最高的卡牌，分摊其每次所受伤害量的10%。',
          condition: 'passive',
          magic: 'atk_reduce',
          when: 'now',
          target: OWN,
          scope: CARDSPOSITION.hp_max,
          star3: '20:5',
          start4: '25:5',
          star5: '30:5'
        }, {
          id: 5,
          name: '生命值降低到70%以下，攻击力提升20%。',
          condition: 'on_hp_reduce_to',
          hp_reduce_to: 70,
          magic: 'atk_improve',
          when: 'now',
          target: OWN,
          scope: CARDSPOSITION.self,
          star3: '20:5',
          start4: '25:5',
          star5: '30:5'
        }
      ]
    }
    res[m]

module.exports = Database