SET FOREIGN_KEY_CHECKS=0;

-- -------------------------
-- Table structure for user
-- -------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `create_time` BIGINT(20) UNSIGNED NOT NULL,
  `account` VARCHAR(50) COLLATE utf8_unicode_ci NOT NULL,
  `password` VARCHAR(50) COLLATE utf8_unicode_ci DEFAULT '',
  `name` VARCHAR(50) COLLATE utf8_unicode_ci DEFAULT '',
  `login_count` SMALLINT(5) UNSIGNED DEFAULT '0',
  `last_login_time` BIGINT(20) UNSIGNED DEFAULT '0',
  `last_login_device` VARCHAR(50) COLLATE utf8_unicode_ci DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_ACCOUNT` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- ----------------------------
-- Table structure for players
-- ----------------------------
DROP TABLE IF EXISTS `players`;
CREATE TABLE IF NOT EXISTS `players` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `create_time` BIGINT(20) UNSIGNED NOT NULL,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `area_id` SMALLINT(5) UNSIGNED NOT NULL,
  `name` VARCHAR(50) COLLATE utf8_unicode_ci DEFAULT NOT NULL,
  `power` SMALLINT(5) UNSIGNED DEFAULT '0',
  `lv` SMALLINT(5) UNSIGNED DEFAULT '0',
  `exp` INT(10) UNSIGNED DEFAULT '0',
  `money` INT(10) UNSIGNED DEFAULT '0',
  `gold`INT(10) UNSIGNED DEFAULT '0',
  `formation` VARCHAR(300) COLLATE utf8_unicode_ci DEFAULT '',
  `ability` INT(10) UNSIGNED DEFAULT '0',
  `task` VARCHAR(100) COLLATE utf8_unicode_ci DEFAULT '',
  `task_mark` TINYINT(1) DEFAULT '0',
  `pass` SMALLINT(5) UNSIGNED DEFAULT '0',
  `pass_mark` BLOB(20),
  PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- ----------------------------
-- Table structure for card
-- ----------------------------
DROP TABLE IF EXISTS `card`;
CREATE TABLE IF NOT EXISTS `card` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `create_time` BIGINT(20) UNSIGNED NOT NULL,
	`players_id` INT(10) UNSIGNED NOT NULL,
	`table_id` SMALLINT(5) UNSIGNED NOT NULL,
	`lv` SMALLINT(5) UNSIGNED DEFAULT '0',
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
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`create_time` BIGINT(20) UNSIGNED NOT NULL,
	`own` INT(10) UNSIGNED NOT NULL,
	`enemy` INT(10) UNSIGNED DEFAULT '0',
	`battle_log` VARCHAR(5000) COLLATE utf8_unicode_ci NOT NULL,
	PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------
-- Table structure for passive_skill
-- --------------------------------
DROP TABLE IF EXISTS `passive_skill`;
CREATE TABLE IF NOT EXISTS `passive_skill` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `create_time` BIGINT(20) UNSIGNED NOT NULL,
	`card_id` INT(10) UNSIGNED NOT NULL,
  `table_id` SMALLINT(5) UNSIGNED NOT NULL,
	`value` TINYINT(3) UNSIGNED DEFAULT '0',
	PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;