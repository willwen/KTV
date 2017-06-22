#!/bin/bash
read -s -p "Enter Password: " mypassword
mongoimport -h ds127872.mlab.com:27872 -d heroku_0kfm3lp6 -c songs -u admmin -p $mypassword --file songs.json

$SHELL