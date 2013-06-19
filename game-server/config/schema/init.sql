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
end $$
delimiter ;

call createUser('dev', '1');

-- grant permission to dev for database magpie
GRANT ALL PRIVILEGES ON magpie.* to dev@localhost IDENTIFIED BY "1";