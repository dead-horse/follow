# /bin/sh

nohup node index.js& 
sleep 1
ps -ef | grep index.js
