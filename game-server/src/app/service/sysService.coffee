async = require 'async'
configData = require '../../config/data'
utility = require '../common/utility'
_ = require 'underscore'

SYSTEM = -1

module.exports = (app) ->
  new Service(app)

class Service
  constructor: (@app) ->

    ###
      receiver 消息接受玩家ID
      rewards  奖励数据 格式 {
        title: 标题
        sender: 发送人
        content: 消息内容
        validate: 有效期
        rewards: {
          gold: 魔石
          money
          enegy
          exliir
          fragments
          honor
          superHonor
          skillPoint
          pill
          cardArray
        }
      }
    ###
  sendRewards: (receiver, rewards, cb) ->
    if not cb
      cb = () ->

    if not rewards or rewards.length <= 0
      return

    for reward in rewards
      @sendReward(receiver, reward)

    cb()

  sendReward: (receiver, reward) ->
    data = genMessageData(reward)

    async.waterfall [
      (cb) =>
        @app.get('dao').message.create data: {
          options: data.options
          sender: SYSTEM
          receiver: receiver
          content: data.content
          type: configData.message.MESSAGETYPE.SYSTEM
          status: configData.message.MESSAGESTATUS.UNHANDLED
          validDate: data.validDate
        }, cb
      (msg, cb) =>
        sendMessage(@app, receiver, msg, null, cb)
    ], (err, res) ->
      if err
        logger.error(err)

  sendSysMessage: (receiver, title, content) ->
    receiver = [receiver] if not _.isArray(receiver)
    async.each receiver, (playerId) =>
      @app.get('dao').message.create data: {
        options:
          title: title
          sender: 'YY小仙'
          rewards: {}
        sender: SYSTEM
        receiver: playerId
        content: content
        type: configData.message.MESSAGETYPE.SYSTEM
        status: configData.message.MESSAGESTATUS.UNHANDLED
        validDate: utility.dateFormat(new Date(), 'yyyy-MM-dd')
      }, (err, res) =>
        sendMessage(@app, playerId, res?.toJson()) if not err

genMessageData = (reward) ->
  return {
  options:
    title: reward.title or '大神奖励'
    sender: 'YY小仙'
    rewards: reward.rewards
  content: reward.content
  validDate: reward.validDate
  }

checkSystemOptions = (options, cb) ->
  isObject = _.isObject(options)
  hasRightProperties = _.has(options, 'title') and _.has(options, 'sender') and _.has(options, 'rewards')
  isAcceptLength = JSON.stringify(options).length <= 1024 if isObject

  rewardTypes = ['gold', 'money', 'spirit', 'skillPoint', 'energy',
                 'fragments', 'elixir', 'superHonor', 'powerValue', 'cardArray'
                 'speaker', 'honor', 'pill']
  wrongKeys = _.keys(options.rewards).filter (k) -> k not in rewardTypes
  hasRightRewards = wrongKeys.length == 0 if isObject and hasRightProperties

  if isObject and hasRightProperties and hasRightRewards and isAcceptLength
    cb()
  else
    cb({code: 501, msg: '消息奖励内容格式不正确'})

sendMessage = (app, target, msg, data, next) ->
  callback = (err, res) ->
    if err
      code = 500
    else
      code = 200
    next(null, {code: code, msg: data if data}) if next?

  if target?
    app.get('messageService').pushByPids target, {
      route: 'onMessage',
      msg: msg.toJson?() or msg
    }, callback
  else
    app.get('messageService').pushMessage {route: 'onMessage', msg: msg.toJson?() or msg}, callback