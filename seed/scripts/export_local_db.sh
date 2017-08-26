#!/bin/bash
mongoexport --db songs --collection songs --out songs.json

$SHELL