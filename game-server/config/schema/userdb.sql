SET FOREIGN_KEY_CHECKS=0;

-- -------------------------
-- Table structure for user
-- -------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `createTime` BIGINT(20) UNSIGNED NOT NULL,
  `account` VARCHAR(60) COLLATE utf8_unicode_ci NOT NULL,
  `password` VARCHAR(50) COLLATE utf8_unicode_ci DEFAULT '',
  `name` VARCHAR(50) COLLATE utf8_unicode_ci DEFAULT '',
  `loginCount` SMALLINT(5) UNSIGNED DEFAULT '0',
  `lastLoginTime` BIGINT(20) UNSIGNED DEFAULT '0',
  `lastLoginDevice` VARCHAR(50) COLLATE utf8_unicode_ci DEFAULT '',
  `lastLoginArea` INT,
  `roles` VARCHAR(100) COLLATE utf8_unicode_ci DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_ACCOUNT` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `upgradeVersion`;
CREATE TABLE IF NOT EXISTS `upgradeVersion` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `version` VARCHAR(50),
  `path1` VARCHAR(500),
  `path2` VARCHAR(500),
  `text` VARCHAR(1000),
  `created` DateTime,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;