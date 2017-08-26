#!/bin/bash
mongo songs --eval 'seed.songs.drop()'
mongo songs --eval 'seed.songs.find({})'
$SHELL