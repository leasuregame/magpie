-- ----------------------------
-- Table structure for player
-- ----------------------------
DROP TABLE IF EXISTS `player`;
CREATE TABLE IF NOT EXISTS `player` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uniqueId` VARCHAR(128) NOT NULL,
  `created` DATETIME NOT NULL,
  `userId` INT(10) UNSIGNED NOT NULL,
  `areaId` SMALLINT(5) UNSIGNED NOT NULL,
  `name` VARCHAR(50) COLLATE utf8_unicode_ci NOT NULL,
  `power` VARCHAR(100) COLLATE utf8_unicode_ci DEFAULT '',
  `lv` SMALLINT(5) UNSIGNED DEFAULT '0',
  `vip` SMALLINT(2) UNSIGNED DEFAULT '0',
  `vipBox` VARCHAR(50) COLLATE utf8_unicode_ci DEFAULT '',
  `cash` INT(10) UNSIGNED DEFAULT '0', 
  `exp` INT(10) UNSIGNED DEFAULT '0',
  `money` INT(10) UNSIGNED DEFAULT '0',
  `gold`INT(10) UNSIGNED DEFAULT '0',
  `skillPoint` INT(10) UNSIGNED DEFAULT '0',
  `lineUp` VARCHAR(1000) COLLATE utf8_unicode_ci DEFAULT '',
  `ability` INT(10) UNSIGNED DEFAULT '0',
  `task` TEXT COLLATE utf8_unicode_ci,
  `pass` TEXT COLLATE utf8_unicode_ci,
  `passLayer` SMALLINT(5) DEFAULT '0',
  `dailyGift` TEXT COLLATE utf8_unicode_ci, -- 每日奖励
  `fragments` INT(5) UNSIGNED DEFAULT '0', -- 卡牌碎片数
  `energy` INT(10) UNSIGNED DEFAULT '0',  -- 活力值
  `elixir` INT(10) UNSIGNED DEFAULT '0',  -- 仙丹数
  `spiritor` VARCHAR(100) COLLATE utf8_unicode_ci DEFAULT '',
  `spiritPool` VARCHAR(100) COLLATE utf8_unicode_ci DEFAULT '',
  `signIn` TEXT COLLATE utf8_unicode_ci,
  `achievement` TEXT COLLATE utf8_unicode_ci,
  `cardBook` TEXT COLLATE utf8_unicode_ci,
  `friendsCount` SMALLINT(3) UNSIGNED DEFAULT '20',-- 好友上限
  `rowFragmentCount` SMALLINT(3) UNSIGNED DEFAULT '0',-- 普通抽卡魂次数
  `highFragmentCount` SMALLINT(3) UNSIGNED DEFAULT '0',-- 高级抽卡魂次数
  `highDrawCardCount` SMALLINT(3) UNSIGNED DEFAULT '0',-- 高级抽卡次数
  `cardsCount` SMALLINT(5) UNSIGNED DEFAULT '0', -- 卡牌数量上限
  `resetDate` VARCHAR(20) COLLATE utf8_unicode_ci DEFAULT '',
  `firstTime` VARCHAR(5000) COLLATE utf8_unicode_ci DEFAULT '',
  `levelReward` VARCHAR(100) COLLATE utf8_unicode_ci DEFAULT '',
  `teachingStep` SMALLINT(3) DEFAULT '0',
  `exchangeCards` VARCHAR(50) DEFAULT '',
  `activities` TEXT,
  `initRate` VARCHAR(100) DEFAULT '{}',
  `speaker` INT(3) DEFAULT '0',
  `honor` INT(10) DEFAULT '0',
  `superHonor` INT(10) DEFAULT '0',
  `cd` VARCHAR(100) DEFAULT '{}',
  `plan` VARCHAR(100) DEFAULT '{"buy": false, "flag": 0}',
  `useCardCount` VARCHAR(100) DEFAULT '{"star4": 10, "star5": 1, "star6": 3}',
  `pill` INT(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_NAME` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- alter table player add column `honor` INT(10) DEFAULT '0';
-- alter table player add column `superHonor` INT(10) DEFAULT '0';
-- alter table player add column `kneelCount` INT(5) DEFAULT '0';
-- alter table player add column `cd` VARCHAR(100) DEFAULT '{}';

-- ----------------------------
-- Table structure for greeting
-- ----------------------------
DROP TABLE IF EXISTS `greeting`;
CREATE TABLE IF NOT EXISTS `greeting` (
  `id` BIGINT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `playerId` INT(10) UNSIGNED,
  `playerName` VARCHAR(50) COLLATE utf8_unicode_ci DEFAULT '',
  `content` VARCHAR(500) COLLATE utf8_unicode_ci DEFAULT '',
  `created` DATETIME,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for goldCard
-- ----------------------------
DROP TABLE IF EXISTS `goldCard`;
CREATE TABLE IF NOT EXISTS `goldCard` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `orderId` BIGINT(20) UNSIGNED,
  `orderNo` VARCHAR(128) COLLATE utf8_unicode_ci DEFAULT '',
  `playerId` INT(10) UNSIGNED NOT NULL,
  `type` VARCHAR(128) COLLATE utf8_unicode_ci DEFAULT '',
  `flag` VARCHAR(15) COLLATE utf8_unicode_ci DEFAULT '0',
  `created` Date,
  `validDate` Date,
  `status` INT(2) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for friend
-- ----------------------------
DROP TABLE IF EXISTS `friend`;
CREATE TABLE IF NOT EXISTS `friend` (
  `playerId` INT(10) UNSIGNED NOT NULL,
  `friendId` INT(10) UNSIGNED NOT NULL,
  `giveCount` INT(10) UNSIGNED DEFAULT '0',
  `receiveCount` INT(10) UNSIGNED DEFAULT '0',
  `friendGiveCount` INT(10) UNSIGNED DEFAULT '0',
  `friendReceiveCount` INT(10) UNSIGNED DEFAULT '0',
  PRIMARY KEY (`playerId`, `friendId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE IF NOT EXISTS `message` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `msgId` BIGINT(20) UNSIGNED,
  `sender` BIGINT(20),
  `receiver` BIGINT(20),
  `type` SMALLINT(2) UNSIGNED DEFAULT '0',
  `options` TEXT COLLATE utf8_unicode_ci,
  `content` TEXT COLLATE utf8_unicode_ci,
  `status` SMALLINT(2) UNSIGNED DEFAULT '0',
  `createTime` BIGINT(20) UNSIGNED NOT NULL,
  `validDate` DATETIME,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for card
-- ----------------------------
DROP TABLE IF EXISTS `card`;
CREATE TABLE IF NOT EXISTS `card` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `createTime` BIGINT(20) UNSIGNED NOT NULL,
  `playerId` INT(10) UNSIGNED NOT NULL,
  `tableId` INT(10) UNSIGNED NOT NULL,
  `star` SMALLINT(2) UNSIGNED DEFAULT '1',
  `lv` SMALLINT(5) UNSIGNED DEFAULT '1',
  `exp` INT(10) UNSIGNED DEFAULT '0',
  `skillLv` TINYINT(3) UNSIGNED DEFAULT '1',
  `factor` INT(5) UNSIGNED DEFAULT '0',
  `skillPoint` INT(10) UNSIGNED DEFAULT '0',  -- 消耗的技能点
  `elixirHp` INT(10) UNSIGNED DEFAULT '0',  -- 消耗的仙丹数
  `elixirAtk` INT(10) UNSIGNED DEFAULT '0',  -- 消耗的仙丹数
  `elixirHpCrit` INT(10) UNSIGNED DEFAULT '0',
  `elixirAtkCrit` INT(10) UNSIGNED DEFAULT '0',
  `passiveSkills` TEXT COLLATE utf8_unicode_ci,
  `useCardsCounts` SMALLINT(2) DEFAULT '0', -- 进阶消耗卡牌数
  `psGroupCount` INT(2) DEFAULT '3', -- 被动技能组合的数量
  `potentialLv` INT(2) DEFAULT '0', -- 潜能等级
  `pill` INT(10) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------
-- Table structure for battleLog
-- --------------------------------
DROP TABLE IF EXISTS `battleLog`;
CREATE TABLE IF NOT EXISTS `battleLog` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `createTime` BIGINT(20) UNSIGNED NOT NULL,
  `type` VARCHAR(20) COLLATE utf8_unicode_ci DEFAULT '',
  `own` INT(10) UNSIGNED NOT NULL,
  `enemy` INT(10) UNSIGNED DEFAULT '0',
  `battleLog` TEXT COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ---------------------------------
-- Table structure for rank
-- ---------------------------------
DROP TABLE IF EXISTS `rank`;
CREATE TABLE IF NOT EXISTS `rank` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `createTime` BIGINT(20) UNSIGNED NOT NULL,
  `playerId` INT(10) UNSIGNED NOT NULL,
  `ranking` INT(10) UNSIGNED DEFAULT '0',   -- 排名
  `challengeCount` BIGINT(20) UNSIGNED DEFAULT '0',
  `startCount` BIGINT(20) UNSIGNED DEFAULT '0',
  `winCount` INT(10) UNSIGNED DEFAULT '0',
  `loseCount` INT(10) UNSIGNED DEFAULT '0',
  `winStreakCount` INT(10) UNSIGNED DEFAULT '0',
  `winningStreak` INT(10) UNSIGNED DEFAULT '0',
  `recentChallenger` TEXT COLLATE utf8_unicode_ci,
  `historyRanking` INT(10) UNSIGNED DEFAULT '0',
  `gotRewards` VARCHAR(100) COLLATE utf8_unicode_ci DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `onlineUser`;
CREATE TABLE IF NOT EXISTS `onlineUser` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `createTime` BIGINT(20) UNSIGNED NOT NULL,
  `qty` INT(10) UNSIGNED DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `lvDistribution`;
CREATE TABLE IF NOT EXISTS `lvDistribution` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `createTime` Date,
  `lv` INT(10) UNSIGNED DEFAULT '0',
  `qty` INT(10) UNSIGNED DEFAULT '0',
  `playerCreateDate` Date,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `buyRecord`;
CREATE TABLE IF NOT EXISTS `buyRecord` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `createTime` BIGINT(20) UNSIGNED NOT NULL,
  `playerId` INT(10) UNSIGNED NOT NULL,
  `receiptData` TEXT COLLATE utf8_unicode_ci,
  `verifyResult` TEXT,
  `qty` INT(10) UNSIGNED DEFAULT '0',
  `productId` VARCHAR(50) COLLATE utf8_unicode_ci DEFAULT '',
  `purchaseDate` DATETIME,
  `amount` INT(5) UNSIGNED DEFAULT '0',
  `isVerify` BOOLEAN DEFAULT '0',
  `status` INT(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `tbOrder`;
CREATE TABLE IF NOT EXISTS `tbOrder` (
  `tradeNo` VARCHAR(128) NOT NULL COLLATE utf8_unicode_ci,
  `tborderNo` VARCHAR(128), 
  `playerId` INT(10) UNSIGNED NOT NULL,
  `amount` INT(5) UNSIGNED,
  `partner` VARCHAR(128) COLLATE utf8_unicode_ci,
  `paydes` VARCHAR(100) COLLATE utf8_unicode_ci,
  `status` INT(4),
  `created` DATETIME,
  PRIMARY KEY (`tradeNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `elixirOfRank`;
CREATE TABLE IF NOT EXISTS `elixirOfRank` (
  `playerId` INT(10) UNSIGNED,
  `week` INT(8),
  `name` VARCHAR(50) COLLATE utf8_unicode_ci,
  `elixir` INT(10) UNSIGNED DEFAULT '0',
  `got` SMALLINT(2) DEFAULT '0',
  PRIMARY KEY(`playerId`, `week`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ---------------------------------------------------------
-- Boss 相关表
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `boss`;
CREATE TABLE IF NOT EXISTS `boss` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tableId` INT(10) NOT NULL,
  `playerId` INT(10) UNSIGNED NOT NULL,
  `atkCount` INT(3),
  `finder` VARCHAR(50) COLLATE utf8_unicode_ci,
  `killer` VARCHAR(50) COLLATE utf8_unicode_ci,
  `hp` VARCHAR(500),
  `status` SMALLINT(2) UNSIGNED DEFAULT '1',
  `createTime` BIGINT(20),
  `deathTime` BIGINT(20),
  PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `bossAttack`;
CREATE TABLE IF NOT EXISTS `bossAttack` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `bossId` BIGINT(20) NOT NULL,
  `playerId` INT(10) UNSIGNED NOT NULL,
  `damage` INT(10) DEFAULT '0',
  `money` INT(10) DEFAULT '0',
  `honor` INT(5) DEFAULT '0',
  `moneyAdd` INT(10) DEFAULT '0',
  `honorAdd` INT(5) DEFAULT '0',
  `battleLogId` BIGINT(20),
  PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `damageOfRank`;
CREATE TABLE IF NOT EXISTS `damageOfRank` (
  `playerId` INT(10) UNSIGNED,
  `week` INT(8),
  `name` VARCHAR(50) COLLATE utf8_unicode_ci,
  `damage` INT(10) UNSIGNED DEFAULT '0',
  `kneelCount` INT(5) DEFAULT '0',
  `got` SMALLINT(2) DEFAULT '0',
  PRIMARY KEY(`playerId`, `week`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `bossFriendReward`;
CREATE TABLE IF NOT EXISTS `bossFriendReward` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `playerId` INT(10) UNSIGNED NOT NULL,
  `friendName` VARCHAR(50) COLLATE utf8_unicode_ci,
  `money` INT(10) DEFAULT '0',
  `honor` INT(5) DEFAULT '0',
  `got` SMALLINT(2) DEFAULT '0',
  `created` DATETIME,
  PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `worldCup`;
CREATE TABLE IF NOT EXISTS `worldCup` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `playerId` INT(10) UNSIGNED NOT NULL,
  `gameDate` Date,
  `answer` VARCHAR(250) DEFAULT '',
  `got` SMALLINT(2) DEFAULT '0',
  `bingo` SMALLINT(2) DEFAULT '0',
  `created` DATETIME,
  PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ---------------------------------------------------------
-- 后台充值记录
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `backendRecharge`;
CREATE TABLE `backendRecharge` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `playerId` INT(10) UNSIGNED NOT NULL,
  `type` TINYINT(2) UNSIGNED DEFAULT '1' ,
  `productId` VARCHAR(50) COLLATE utf8_unicode_ci DEFAULT '',
  `qty` INT(10) UNSIGNED DEFAULT '0',
  `amount` INT(5) UNSIGNED DEFAULT '1' ,
  `gain` INT(7) UNSIGNED DEFAULT '1' ,
  `createTime` DATETIME,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ---------------------------------------------------------
-- 数据收集相关表
-- ---------------------------------------------------------

-- ---------------------------------------------------------
-- 用于统计等级流失率
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `playerDailyLvRecord`;
CREATE TABLE `playerDailyLvRecord` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `playerId` INT(10) UNSIGNED NOT NULL,
  `recordDate` DATE DEFAULT NULL ,
  `playerLv` SMALLINT(5) UNSIGNED DEFAULT '0',
  `loginCount` SMALLINT(6) UNSIGNED DEFAULT '1' ,
  `createTime` DATETIME,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ---------------------------------------------------------
-- 用于统计玩家资源消费
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `playerConsumptionRecord`;
CREATE TABLE `playerConsumptionRecord` (
  `id`  int(20) UNSIGNED NOT NULL AUTO_INCREMENT ,
  `playerId`  int(20) UNSIGNED NOT NULL,
  `resourceType`  smallint(6) UNSIGNED DEFAULT NULL ,
  `expense`  smallint(6) UNSIGNED DEFAULT NULL ,
  `source`  tinyint(4) UNSIGNED DEFAULT NULL ,
  `createTime`  DATETIME,
  PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
