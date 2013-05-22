http = require 'http'
util = require 'util'

###
我方卡牌信息
{
  id: 4
  card_id: 4
  name: '猪八戒'
  lv: 34
  hp: 8000
  atk: 3700
  star: 4
  skill_lv: 1
},
{
  id: 5
  card_id: 5
  name: '沙僧'
  lv: 34
  hp: 8000
  atk: 2400
  star: 4
  skill_lv: 1
},
{
  id: 6
  card_id: 6
  name: '孙悟空'
  lv: 34
  hp: 10000
  atk: 4500
  star: 4
  skill_lv: 1
}

布阵字符串：如 1:4 表示1号位置放置id为4的卡牌
line_up: '1:4,2:5,3:6'
###

battle_log = 
  winner: 'own'
  enemy: 
    id: 2
    name: '皆空'
    lv: 30
    line_up: '1:1,2:2,3:3'
    cards: [
      {
        id: 1
        card_id: 1
        name: '哪吒'
        lv: 34
        hp: 10000
        atk: 4000
        star: 4
        skill_lv: 1
      },
      {
        id: 2
        card_id: 1
        name: '金吒'
        lv: 34
        hp: 8000
        atk: 3000
        star: 4
        skill_lv: 1
      },
      {
        id: 3
        card_id: 1
        name: '木吒'
        lv: 34
        hp: 7500
        atk: 3200
        star: 4
        skill_lv: 1
      }
    ]
  result: 
    exp: 650
    money: 3000
    card: [1,2,3]
  steps: [
    {a: 0, d: 6, t: 0, v: -3700} #6(6300)
    {a: 6, d: 0, t: 0, v: -4000} #0(6000)
    {a: 1, d: 7, t: 0, v: -2400} #7(5600)
    {a: 7, d: 1, t: 0, v: -3000} #1(5000)
    {a: 2, d: 8, t: 0, v: -3200} #8(6800)
    {a: 8, d: 2, t: 0, v: -4500} #2(3000)

    {a: 0, d: [6,7], t: 1, v: [-1800, -2400]} #6(4500) 7(3200)
    {a: 6, d: 0, t: 0, v: -4000} #0(2000)
    {a: 1, d: 7, t: 0, v: -2400} #7(800)
    {a: 7, d: 1, t: 0, v: -3000} #1(2000)
    {a: 2, d: [6,7,8], t: 1, v: [-2000, -2000, -2000]} #6(2500) 7(-1200) 8(4800)
    {a: 8, d: 6, t: 0, v: 1000} #6(3500)

    {a: 0, d: 6, t: 0, v: -3700} #6(-200)
    {a: 8, d: 2, t: 0, v: -4500} #2(-1500)
    {a: 1, d: 8, t: 0, v: -2400} #8(2400)
    {a: 8, d: 1, t: 0, v: 4500} #1(-2500)
    {a: 1, d: 8, t: 0, v: -2400} #8(0)
  ]
    


app = http.createServer (req, res) ->
  res.writeHead '200', {'Content-Type': 'text/plain', 'charset': 'UTF-8'}
  res.write(JSON.stringify(battle_log))
  res.end('成功')

app.listen('3344')