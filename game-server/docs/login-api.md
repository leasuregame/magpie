# 多平台登陆接口

游戏服务器支持多平台游戏客户端登陆，没个平台对应一个单独的接口

 - AppStore: connector.userHandler.login
 - 同步推: connector.userHandler.loginTB
 - pp助手: connector.userHandler.loginPP
 - yy平台: connector.userHandler.loginYY
 - 91助手: connector.userHandler.login91

每个接口所需要传入的参数不同，返回值都一样的

### AppStore 登陆

```js
pomelo.request('conenctor.userHandler.login', {
  account: 'testUser',
  password: '*****',
  areaId: 1
}, function(err, result) {
  console.log(result.code, result.msg.player, result.msg.user);
})
```

### 同步推登陆

```js
pomelo.request('conenctor.userHandler.loginTB', {
  nickName: 'testUser',
  userId: 123123123,
  sessionId: 'aisdfdsyfi239e423eji232i4u32847132u4',
  areaId: 1
}, function(err, result) {
  console.log(result.code, result.msg.player, result.msg.user);
})
```

### pp助手登陆

```js
pomelo.request('conenctor.userHandler.loginPP', {
  token: 'iasudfas78r892348923iyu327891432hu1423'
  areaId: 1
}, function(err, result) {
  console.log(result.code, result.msg.player, result.msg.user);
})
```

### yy平台登陆

```js
pomelo.request('conenctor.userHandler.loginYY', {
  signid: '18923hjsjkar89ehuiuf7asd6afdfasudfkas',
  account: 'testacc',
  time: 1341234124314,
  appid: 'IYYDS',
  serverid: '',
  areaId: 1
}, function(err, result) {
  console.log(result.code, result.msg.player, result.msg.user);
})
```

### 91助手登陆

```js
pomelo.request('conenctor.userHandler.login91', {
  sessionid: 'iasudfas78r892348923iyu327891432hu1423'
  uin: 12312312431,
  appid: 113216,
  areaId: 1
}, function(err, result) {
  console.log(result.code, result.msg.player, result.msg.user);
})
```

## 返回值

返回值包含了两个字段 code 和 msg
code=200为登陆成功
其他情况则登陆失败，msg为失败原因

msg中包含了两个字段 player 和 user. player为null时表示用户还没创建游戏角色。需要调用connector.playerHandler.createPlayer创建玩家信息

.eg

```js
{
  code: 200/501/500,
  msg: { // error message if error occur
    player: {
      id: 1,
      uniqueId: "6bb428d1-5bc9-11e3-905b-f574a23385c4",
      createTime: 122312135152,
      userId: 1,
      areaId: 1,
      name: 'arthur',
      power: {
              time: 0,
              value: 150
          },
      lv: 1,
      vip: 0,
      vipBox: [],
      cash: 0,
      exp: 0,
      money: 0,
      gold: 0,
      lineUp: {12:-1},
      ability: 0,
      task: {
              id: 1,
              progress: 0,
              hasWin: false,
              mark: [],
              hasFragment: -1
          },
      pass: {
          canReset: false,
          hasMystical: false,
          layer: 0,
          mark: []
      },
      dailyGift: {},
      skillPoint: 0,
      energy: 0,
      elixir: 0,
      spiritor: {
          lv: 1,
          spirit: 890,
          ability: 300
      },
      spiritPool: {
          lv: 1,
          exp: 0,
          collectCount: 15
      },
      cards: [],
      rank: {
          ranking: 123
      },
      friends: [],
      signIn: {
          months: {},
          flag: 0
      },
      friendsCount: 20,
      firstTime: {           // 第一次抽卡数据，若不是第一次，则没有这个节点返回
          lowLuckyCard: 1,       // 第一次普通抽卡，1 为 true, 0 为 false
          highLuckyCard: 1       // 第一次高级抽卡，1 为 true, 0 为 false
          highTenLuckCard: 1,    // 第一次高级十连抽，1 为 true，0 为 false
          recharge: 0            // 第一次充值标记位
          firstRechargeBox: 1/0    // 是否可以领取首冲礼包，1 为可领， 0 为不可领
      },
      exchangeCards: [], // 可兑换的卡牌id列表
      version: '1.2.0',
      serverTime: 12345678915
    },
    user: {
      account: 'test@163.com',
      name: 'test'
      createTime: 1397187034496,
      id: 126,
      lastLoginArea: 1,
      lastLoginDevice: '',
      lastLoginTime: 1397187034555,
      loginCount: 12,
      roles: [1,2,3]
    }
  }
}
```
