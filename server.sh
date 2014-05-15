#!/bin/sh

epdc-app  -start_epdc 0 1
sudo python /home/PL_web-app/kill_port.py
sudo /root/.nvm/versions/node/v4.8.4/bin/node /home/PL_web-app/server.js  > /home/PL_web-app/src/logs/webapplication.log 2>&1
