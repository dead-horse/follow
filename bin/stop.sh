# /bin/sh

kill `cat server.pid`
sleep 1
ps -ef | grep index.js
