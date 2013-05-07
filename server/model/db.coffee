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
      ]
    }
    res[m]

module.exports = Database