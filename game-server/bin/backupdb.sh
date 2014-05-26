curTime=`date "+%Y-%m-%d_%H:%M:%S"`
filepath="/data/mysql-backup/dbbackup_$curTime.tar.gz"
echo $filepath

sudo -i

innobackupex --user=root --password=leasure:GAME --defaults-file=/etc/mysql/my.cnf --stream=tar /data/mysql-backup | gzip -> $filepath