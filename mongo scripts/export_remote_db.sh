#!/bin/bash
read -s -p "Enter Password: " mypassword
mongoexport -h ds127872.mlab.com:27872 -d heroku_0kfm3lp6 -c songs -u admin -p $mypassword -o songs.json
$SHELL