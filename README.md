# KTV (Karaoke God)
## Chinese Song Karaoke Web App


## Developers

### Directory Structure:
TimePickerTool - serparate web app that helps to manually time pick lyrics for songs
data - mongodb data store
dist - webpack output directory (transpiled react code that is used in production)
favicons - favicon used for main webpage
images - artist, song, album image resources
seed - dockerfile
seed/scripts - mongodb shell scripts to start, import, and export the JSON database KTV uses.
songs - lyrics, timestamps for each song
webpage - html, react, css, javascript code
Jenkinfile - \[In Progress\] support Jenkins CICD
futurefeatures.txt - a list of enhancements I plan to develop/fix
insertSong.js - a script that song object into mongodb
package.json - node dependencies :)
sever.js - main server app, handles routes, queries to DB
webpack.config.js - webpack configuration that transpiles react to javascript.

### How to install on local dev environment:
1) Install Git, Node.js, Mongodb
2) ``` git clone "https://github.com/willwen/KTV.git" ```
3) ``` cd $KTV/KTV/ ```
4) ```npm install ```
5) the mongodb can be local or remote (heroku's mlab server)
	In server.js , we see:
	```
	var mongoURL = "mongodb://localhost:27017/songs"
	var mongoURL = "mongodb://readonly:readonly@ds127872.mlab.com:27872/heroku_0kfm3lp6"
	```
	Choose one link.
	
	If you chose localhost:
	
		add Mongodb executables to your System Path (Windows: computer , properties, advanced system settings, environment variables...). 
		``` cd seed/scripts/ ```
		``` ./mongod --dbpath ../../data/ ``` - Keep this terminal running for the duration of your development
		
	Import the songs.json file:
  		``` mongoimport --db songs --collection songs --file songs.json```
		
6) ```PORT=8080 node server.js ```
7) In web browser, go to localhost:8080

8) Now you need to start webpack , which compiles all ES6 and JSX code (aka React) to bundle.js
	in $KTV, run:
	npm run webpack

	It will say webpack is watching the files.
9)If you want to do react development (aka mess with the code in webpage/)
``` npm run webpack ```
It will detect any file changes in webpage/* and generate a dist/bundle.js file, which is what index.html uses
