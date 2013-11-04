-- ----------------------------
-- Table structure for player
-- ----------------------------
DROP TABLE IF EXISTS `player`;
CREATE TABLE IF NOT EXISTS `player` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `createTime` BIGINT(20) UNSIGNED NOT NULL,
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
  `task` VARCHAR(100) COLLATE utf8_unicode_ci DEFAULT '',
  `pass` VARCHAR(500) COLLATE utf8_unicode_ci DEFAULT '',
  `passLayer` SMALLINT(5) DEFAULT '0',
  `dailyGift` VARCHAR(300) COLLATE utf8_unicode_ci DEFAULT '', -- 每日奖励
  `fragments` INT(5) UNSIGNED DEFAULT '0', -- 卡牌碎片数
  `energy` INT(10) UNSIGNED DEFAULT '0',  -- 活力值
  `elixir` INT(10) UNSIGNED DEFAULT '0',  -- 仙丹数
  `elixirPerLv` TEXT COLLATE utf8_unicode_ci,
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_NAME` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for friend
-- ----------------------------
DROP TABLE IF EXISTS `friend`;
CREATE TABLE IF NOT EXISTS `friend` (
  `playerId` INT(10) UNSIGNED NOT NULL,
  `friendId` INT(10) UNSIGNED NOT NULL,
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
  `skillInc` FLOAT(5,1) UNSIGNED DEFAULT '0',
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
  `winCount` INT(10) UNSIGNED DEFAULT '0',
  `loseCount` INT(10) UNSIGNED DEFAULT '0',
  `winningStreak` INT(10) UNSIGNED DEFAULT '0',
  `recentChallenger` VARCHAR(100)  COLLATE utf8_unicode_ci DEFAULT '',
  `historyRanking` INT(10) UNSIGNED DEFAULT '0',
  `gotRewards` VARCHAR(100) COLLATE utf8_unicode_ci DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;