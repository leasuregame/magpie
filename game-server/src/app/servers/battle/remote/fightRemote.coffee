table = require '../../../manager/table'
Battle = require '../../../battle/battle'
battleLog = require '../../../battle/battle_log'
Player = require '../../../battle/player'
VirtualPlayer = require '../../../battle/virtual_player'
async = require 'async'
playerManager = require '../../../manager/playerManager'
taskRate = require '../../../../config/data/taskRate'
cardConfig = require '../../../../config/data/card'
_ = require 'underscore'

exports.pve = (args, callback) ->
  pid = args.pid
  taskId = args.taskId
  table = args.table
  taskData = table.getTableItem table, taskId
  cardIds = taskData.cards.split('#')

  playerEntity = null
  async.waterfall([
    (cb) ->
      playerManager.getPlayerInfo {pid: pid}, cb
    
    (_playerEntity, cb) ->
      playerEntity = _playerEntity
      attacker = new Player(playerEntity)
      defender = new VirtualPlayer(taskData)

      battleLog.clear()
      battle = new Battle(attacker, defender)
      battle.process()

      cb(null,  battleLog.reports())
    ],
    (err, bl) ->
      if err
        return callback(err, null)
      
      if bl.winner is 'own'
        rewardCards(bl)

      addCardsToPlayer(playerEntity, bl.cards)
      playerEntity.save()

      callback(null, bl)
  )

rewardCards = (battleLog, cardIds, count) ->
  cd = taskRate.card_drop
  
  for i in [1..count]
    id = randomValue cardIds
    star = randomValue [1,2], _.values(cd.star)
    level = randomValue [1,2,3,4,5], _.vlues(cd.level)

    battleLog.addCard {
      id: id
      star: star
      lv: level
    }

randomValue = (values, rates) ->
  if rates?
    _rates = []
    _r = 0
    for r in rates
      _rates.push _r += r

    rd = _.random(0, 100)
    for r, i in _rates
      if rd <= r
        return values[i]
  else
    return values[_.random(0, values.length -1)]

  # default
  values[0]

addCardsToPlayer = (player, cards) ->
  for card in cards
    player.addCard(
      tableId: card.id
      lv: card.lv
      star: card.star
      type: cardConfig.TYPE.MONSTER
      )