# KTV
Chinese Song Lyrics Database

How to install on local dev environment:

1) Install Node.js and Git
2) open up Git Bash, open in a directory where you want the project stored, let's call it $KTV
3) In Git Bash, type "git clone "https://github.com/willwen/KTV.git"
4) then "cd $KTV/KTV/"
5) do a "npm install"
6) Install Mongodb from https://www.mongodb.com/
7) add the Mongodb executables to your System Path (computer , properties, advanced system settings, environment variables...)
8) In Git Bash, run "mongod --dbpath data/". Keep this terminal running for the duration of your development
9) In another Git Bash terminal, import the songs.json file:
  first go to "mongo script" directory: "cd mongo\ script/"
  "mongoimport --db songs --collection songs --file songs.json"
  exit back to KTV: "cd .."
10) In index.js, uncomment out line 10: "var mongoURL = "mongodb://localhost:27017/songs", and comment out line 11.
11) Run node index.js
12) In web browser, go to localhost:8080

13) Now you need to start webpack , which compiles all ES6 and JSX code (aka React) to bundle.js
	in $KTV, run:
	npm run webpack

	It will say webpack is watching the files.