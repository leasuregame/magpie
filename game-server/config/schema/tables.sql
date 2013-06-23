SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for User
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `from` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `password` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `loginCount` smallint(6) UNSIGNED DEFAULT '0',
  `lastLoginTime` bigint(20) UNSIGNED DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_ACCOUNT_NAME` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- ----------------------------
-- Table structure for players
-- ----------------------------
DROP TABLE IF EXISTS `players`;
CREATE TABLE IF NOT EXISTS `players` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` VARCHAR(50) COLLATE utf8_unicode_ci DEFAULT '',
  `power` SMALLINT(6) UNSIGNED DEFAULT '0',
  `lv` TINYINT(3) UNSIGNED DEFAULT '0',
  `exp` INT(10) UNSIGNED DEFAULT '0',
  `money` INT(10) UNSIGNED DEFAULT '0',
  `ingot`INT(10) UNSIGNED DEFAULT '0',
  `formation` VARCHAR(300) COLLATE utf8_unicode_ci DEFAULT '',
  `ability` INT(10) UNSIGNED DEFAULT '0',
  `task` VARCHAR(100) COLLATE utf8_unicode_ci DEFAULT '',
  `task_mark` TINYINT(1) DEFAULT '0',
  `pass` SMALLINT(6) UNSIGNED DEFAULT '0',
  `pass_mark` BLOB(20),
  PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- ----------------------------
-- Table structure for card
-- ----------------------------
DROP TABLE IF EXISTS `card`;
CREATE TABLE IF NOT EXISTS `card` (
	`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
	`players_id` bigint(20) UNSIGNED NOT NULL,
	`table_id` SMALLINT(6) UNSIGNED NOT NULL,
	`lv` TINYINT(3) UNSIGNED DEFAULT '0',
	`skill_lv` TINYINT(3) UNSIGNED DEFAULT '0',
	`hp_addition` INT(10) UNSIGNED DEFAULT '0',
	`atk_addition` INT(10) UNSIGNED DEFAULT '0',
	PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------
-- Table structure for battle_log
-- --------------------------------
DROP TABLE IF EXISTS `battle_log`;
CREATE TABLE IF NOT EXISTS `battle_log` (
	`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
	`battle_time` bigint(20) UNSIGNED DEFAULT '0',
	`own` bigint(20) UNSIGNED NOT NULL,
	`enemy` bigint(20) UNSIGNED DEFAULT '0',
	`battle_log` VARCHAR(5000) COLLATE utf8_unicode_ci NOT NULL,
	PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------
-- Table structure for battle_log
-- --------------------------------
DROP TABLE IF EXISTS `passive_skill`;
CREATE TABLE IF NOT EXISTS `passive_skill` (
	`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
	`card_id` bigint(20) UNSIGNED NOT NULL,
	`enemy` bigint(20) UNSIGNED DEFAULT '0',
	`battle_log` VARCHAR(5000) COLLATE utf8_unicode_ci NOT NULL,
	PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;