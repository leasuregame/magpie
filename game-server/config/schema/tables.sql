SET FOREIGN_KEY_CHECKS=0;

-- -------------------------
-- Table structure for user
-- -------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `createTime` BIGINT(20) UNSIGNED NOT NULL,
  `account` VARCHAR(50) COLLATE utf8_unicode_ci NOT NULL,
  `password` VARCHAR(50) COLLATE utf8_unicode_ci DEFAULT '',
  `name` VARCHAR(50) COLLATE utf8_unicode_ci DEFAULT '',
  `loginCount` SMALLINT(5) UNSIGNED DEFAULT '0',
  `lastLoginTime` BIGINT(20) UNSIGNED DEFAULT '0',
  `lastLoginDevice` VARCHAR(50) COLLATE utf8_unicode_ci DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_ACCOUNT` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


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
  `power` SMALLINT(5) UNSIGNED DEFAULT '0',
  `lv` SMALLINT(5) UNSIGNED DEFAULT '0',
  `exp` INT(10) UNSIGNED DEFAULT '0',
  `money` INT(10) UNSIGNED DEFAULT '0',
  `gold`INT(10) UNSIGNED DEFAULT '0',
  `skillPoins` INT(10) UNSIGNED DEFAULT '0',
  `lineUp` VARCHAR(300) COLLATE utf8_unicode_ci DEFAULT '',
  `ability` INT(10) UNSIGNED DEFAULT '0',
  `task` VARCHAR(100) COLLATE utf8_unicode_ci DEFAULT '',
  `pass` SMALLINT(5) UNSIGNED DEFAULT '0',
  `passMark` BLOB(20),
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_NAME` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- ----------------------------
-- Table structure for card
-- ----------------------------
DROP TABLE IF EXISTS `card`;
CREATE TABLE IF NOT EXISTS `card` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `createTime` BIGINT(20) UNSIGNED NOT NULL,
	`playerId` INT(10) UNSIGNED NOT NULL,
	`tableId` SMALLINT(5) UNSIGNED NOT NULL,
  `star` SMALLINT(2) UNSIGNED DEFAULT '1',
	`lv` SMALLINT(5) UNSIGNED DEFAULT '0',
	`exp` INT(10) UNSIGNED DEFAULT '0',
	`skillLv` TINYINT(3) UNSIGNED DEFAULT '0',
	`hpAddition` INT(10) UNSIGNED DEFAULT '0',
	`atkAddition` INT(10) UNSIGNED DEFAULT '0',
  `type` SMALLINT(2) UNSIGNED DEFAULT '0',
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
-- Table structure for passiveSkill
-- ---------------------------------
DROP TABLE IF EXISTS `passiveSkill`;
CREATE TABLE IF NOT EXISTS `passiveSkill` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `createTime` BIGINT(20) UNSIGNED NOT NULL,
    `cardId` INT(10) UNSIGNED NOT NULL,
    `name` VARCHAR(20) COLLATE utf8_unicode_ci NOT NULL,
    `value` TINYINT(3) UNSIGNED DEFAULT '0',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;