SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for User
-- ----------------------------
CREATE TABLE IF NOT EXISTS `user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `from` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `password` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `loginCount` smallint(6) unsigned DEFAULT '0',
  `lastLoginTime` bigint(20) unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_ACCOUNT_NAME` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=32209 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
