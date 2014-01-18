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
  `lineUp` VARCHAR(300) COLLATE utf8_unicode_ci DEFAULT '',
  `ability` INT(10) UNSIGNED DEFAULT '0',
  `task` VARCHAR(1000) COLLATE utf8_unicode_ci DEFAULT '',
  `pass` VARCHAR(1000) COLLATE utf8_unicode_ci DEFAULT '',
  `passLayer` SMALLINT(5) DEFAULT '0',
  `dailyGift` VARCHAR(1000) COLLATE utf8_unicode_ci DEFAULT '', -- 每日奖励
  `fragments` INT(5) UNSIGNED DEFAULT '0', -- 卡牌碎片数
  `energy` INT(10) UNSIGNED DEFAULT '0',  -- 活力值
  `elixir` INT(10) UNSIGNED DEFAULT '0',  -- 仙丹数
  `spiritor` VARCHAR(100) COLLATE utf8_unicode_ci DEFAULT '',
  `spiritPool` VARCHAR(100) COLLATE utf8_unicode_ci DEFAULT '',
  `signIn` VARCHAR(200) COLLATE utf8_unicode_ci DEFAULT '',
  `achievement` TEXT COLLATE utf8_unicode_ci,
  `cardBook` TEXT COLLATE utf8_unicode_ci,
  `friendsCount` SMALLINT(3) UNSIGNED DEFAULT '20',-- 好友上限
  `rowFragmentCount` SMALLINT(3) UNSIGNED DEFAULT '0',-- 普通抽卡魂次数
  `highFragmentCount` SMALLINT(3) UNSIGNED DEFAULT '0',-- 高级抽卡魂次数
  `highDrawCardCount` SMALLINT(3) UNSIGNED DEFAULT '0',-- 高级抽卡次数
  `cardsCount` SMALLINT(5) UNSIGNED DEFAULT '0', -- 卡牌数量上限
  `resetDate` VARCHAR(20) COLLATE utf8_unicode_ci DEFAULT '',
  `firstTime` VARCHAR(100) COLLATE utf8_unicode_ci DEFAULT '',
  `levelReward` VARCHAR(100) COLLATE utf8_unicode_ci DEFAULT '',
  `teachingStep` SMALLINT(3) DEFAULT '0',
  `exchangeCards` VARCHAR(50) DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_NAME` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for friend
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
  `options` VARCHAR(256) COLLATE utf8_unicode_ci DEFAULT '',
  `content` VARCHAR(512) COLLATE utf8_unicode_ci DEFAULT '',
  `status` SMALLINT(2) UNSIGNED DEFAULT '0',
  `createTime` BIGINT(20) UNSIGNED NOT NULL,
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
  `passiveSkills` VARCHAR(300) COLLATE utf8_unicode_ci DEFAULT '',
  `useCardsCounts` SMALLINT(2) DEFAULT '0', -- 进阶消耗卡牌数
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
  `battleLog` VARCHAR(5000) COLLATE utf8_unicode_ci NOT NULL,
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
  `recentChallenger` VARCHAR(100)  COLLATE utf8_unicode_ci DEFAULT '',
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
  `receiptData` VARCHAR(5000) COLLATE utf8_unicode_ci,
  `qty` INT(10) UNSIGNED DEFAULT '0',
  `productId` VARCHAR(50) COLLATE utf8_unicode_ci DEFAULT '',
  `purchaseDate` DATETIME,
  `isVerify` BOOLEAN DEFAULT '0',
  `status` INT(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `tbOrder` (
  `tradeNo` VARCHAR(128) NOT NULL COLLATE utf8_unicode_ci,
  `playerId` INT(10) UNSIGNED NOT NULL,
  `amount` INT(5) UNSIGNED,
  `partner` VARCHAR(128) COLLATE utf8_unicode_ci,
  `paydes` VARCHAR(100) COLLATE utf8_unicode_ci,
  `status` INT(4),
  `created` DATETIME,
  PRIMARY KEY (`tradeNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `cdkey` (
  `code` VARCHAR(128) NOT NULL COLLATE utf8_unicode_ci,
  `playerId` INT(10) UNSIGNED,
  `activate` SMALLINT(1) DEFAULT '0',
  `startDate` DATE,
  `endDate` DATE,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
