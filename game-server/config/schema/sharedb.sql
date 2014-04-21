DROP TABLE IF EXISTS `cdkey`;
CREATE TABLE IF NOT EXISTS `cdkey` (
  `code` VARCHAR(128) NOT NULL COLLATE utf8_unicode_ci,
  `playerId` INT(10) UNSIGNED,
  `activate` SMALLINT(1) DEFAULT '0',
  `startDate` DATE,
  `endDate` DATE,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;