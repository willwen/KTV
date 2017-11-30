### Quick Fixes
- Add Snyk security test
	https://snyk.io/test/github/
- Elastic Beanstalk Configurations:
	- https://stackoverflow.com/questions/18908426/increasing-client-max-body-size-in-nginx-conf-on-aws-elastic-beanstalk
	- https://stackoverflow.com/questions/14693852/how-to-force-https-on-elastic-beanstalk

- move to DynamboDB
	- Store All Songs Locally , and parse locally.
	- Results list should highlight what text matched (regex)
	- refactor DB so treesearch can work better
- tripple dot 3 seconds on new line

### Medium Effort
- Audacity to detect lyric timings
- write treesearch in react
- Fix treefind bootstrap sizing

- Make a popup help box on load
- Add album image to bottom right
	- Add album images to treesearch
- Single tap lyric to show all langs
- Show English on the song titles
- remove scrollTo Dependency on jQuery
	- https://github.com/flyingant/react-scroll-to-component
### Larger Features
- See microphone freq side by side with song
- Add audacity instrumentals.
- Change jp, cn, spanish , for particular songs
	- need to refactor DB schema
- Should be able to disable canvas all together
	- and disable audio analyzer.
- Visualizer to work on a ios
https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/PlayingandSynthesizingSounds/PlayingandSynthesizingSounds.html

- Fix scrolling time back shouldnt break the text highlighting
	- Bug when they user changes time in the bottom player

- Firefox has weird audio bar
	- react-jplayer
- Ball that bounces on the words
	look at previously used karaoke formats


Notes:

Gradients:

  /* For browsers that do not support gradients */
  background: -webkit-linear-gradient(left right, #283048, #859398);
  /* For Safari 5.1 to 6.0 */
  background: -o-linear-gradient(left right, #283048, #859398);
   For Opera 11.1 to 12.0 
  background: -moz-linear-gradient(left right, #283048, #859398);
  /* For Firefox 3.6 to 15 */
  background: linear-gradient(to right, #283048, #859398);
  /* Standard syntax */
