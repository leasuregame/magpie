drop database if exists magpie;
create database magpie;
use magpie;

-- define create user procedure
drop procedure if exists createUser;
delimiter $$
create procedure createUser(username varchar(50), pw varchar(50))
begin
IF (SELECT EXISTS(SELECT 1 FROM `mysql`.`user` WHERE `user` = username)) = 0 THEN
    begin
    set @sql = CONCAT('CREATE USER ', username, '@\'localhost\' IDENTIFIED BY \'', pw, '\'');
    prepare stmt from @sql;
    execute stmt;
    deallocate prepare stmt;
    end;
END IF;
end;

-- grant permission to dev for database magpie
GRANT ALL PRIVILEGES ON magpie.* to dev@localhost IDENTIFIED BY "1";


CREATE PROCEDURE `exchangeRankings` (p1 int, p2 int, r1 int, r2 int, isWin int)
BEGIN
DECLARE succ int;
START TRANSACTION;
SET succ = 0;
UPDATE `rank` set `ranking` = r2 where `playerId` = p1 and `ranking` = r1;
IF ROW_COUNT() > 0 THEN
	UPDATE `rank` set `ranking` = r1 where `playerId` = p2 and `ranking` = r2;
	IF ROW_COUNT() > 0 THEN
		SET succ = 1;
		COMMIT;
		SELECT succ;
	ELSE
		ROLLBACK;
		SELECT succ;
	END IF;
ELSE
	ROLLBACK;
	SELECT succ;
END IF;
END $$
delimiter ;

call createUser('dev', '1');

