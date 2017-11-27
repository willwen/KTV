
# KTV (Karaoke God)
## [Chinese Song Karaoke Web App](https://ktvgod.me)

## Description
This is a website to learn and sing along to foreign songs, in lanaguages such as Chinese, Japanese, and Spanish.
Search results populate based on any metadata you type into the search bar, like artist name or song title. You can also  scroll through the list of songs that appears on the home page. Clicking on a song takes you to a visualization page, displaying PinYin, Chinese characters, and English. Users can choose to automate scrolling as the song plays, see the line numbers, and see the visualizer. To control the audio player, you can press space to play or pause the song, press - for volume down and press = for volume up. Enjoy singing foreign songs! :)

## How to Install Locally
1) Install Git, Node.js, Mongodb
2) ``` git clone "https://github.com/willwen/KTV.git" ```
3) ``` cd $KTV/KTV/ ```
4) ```npm install ```
5) The mongodb can be local or remote (heroku's mlab server).

	In server.js , we see:
	
	``` var mongoURL = "mongodb://localhost:27017/songs"```<br/>
	```var mongoURL = "mongodb://readonly:readonly@ds127872.mlab.com:27872/heroku_0kfm3lp6"```
	
	Choose one link.
	
	If you chose localhost:
		add Mongodb executables to your System Path (Windows: computer , properties, advanced system settings, environment variables...). <br/>		
	``` cd seed/scripts/ ``` <br/>
	``` ./mongod --dbpath ../../data/ ``` 
		- Keep this terminal running for the duration of your development
		
		
	Import the songs.json file:
  		``` mongoimport --db songs --collection songs --file songs.json```
		
6) Run ```npm run dev ```
7) In web browser, go to localhost:8080
8)If you want to do react development (aka mess with the code in webpage/)
``` npm run webpack ```
It will detect any file changes in webpage/* and generate a dist/bundle.js file, which is what index.html uses

## Authors
Will Wen


## Contributors
Sherry Mei <br/>
Eula Zhong <br/>
Siqin Li <br/>
See also the list of [contributors](https://github.com/willwen/KTV/contributors)

## License
Please look at LICENSE file for license details
