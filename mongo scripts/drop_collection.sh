#!/bin/bash
mongo songs --eval 'db.songs.drop()'
mongo songs --eval 'db.songs.find({})'
$SHELL