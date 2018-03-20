import ReactDOM from 'react-dom';
import PageNavbar from "../SharedReactComponents/PageNavbar.jsx";
import axios from 'axios';
const uuidv4 = require('uuid/v4');
// import {Collapse} from 'reactstrap'
import AnchorHover from './AnchorHover.jsx'


export default class MainContainer extends React.Component {
	constructor(){
		super();
		this.state={
			searchCategories : {},
			maxLevel: 0
		};
		this.getData = this.getData.bind(this);
		
		this.formatArtists = this.formatArtists.bind(this);
		this.formatLanguages = this.formatLanguages.bind(this);

		this.createTree = this.createTree.bind(this);
	}

	componentWillMount(){
	  	this.getData();
	}

	getData(){
		var getArtistPromise = axios.get("artists")
		var getLanguagesPromise = axios.get("language")

		Promise.all([getArtistPromise, getLanguagesPromise]).then((values)=>{
			let artistsData = this.formatArtists(values[0].data);
			let languagesData = this.formatLanguages(values[1].data);
			this.setState({
					searchCategories : {
							elements:  [ 
		         				{
		         					name: "All Artists", 
		         					icon: "Artist.png", 
		         					child: artistsData 
		         				},
		         				{	
		         					name: "Language",
		         					icon: "Language.png",
		         					child: languagesData
		         				}
		    				]
						}
				});
			this.getMaxLevel(this.state.searchCategories);

		})

	}
	getMaxLevel(root){
		if(root == null)
			return 0;
		var queue = []
		var maxLevel = 1;
		queue.push(root)
		queue.push(null)
		while (queue.length > 0){
			var node = queue.shift();
			if(node == null){
				maxLevel++;
				//if next element is also null
				if(queue[0]==null){
					this.setState({
						maxLevel: maxLevel
					})
					// console.log(maxLevel)
					return maxLevel
				}
				continue
			}
			if(node.elements){
				node.elements.forEach((element, i)=>{
					if(element.child)
						queue.push(element.child)
				})
				queue.push(null)
				
			}

		}

	}

	formatLanguages(data) {
	    var languages = {
	        id: "allLanguages",
	        elements: []
	    }
	    var artists = []
	    for (var i = 0; i < data.length; i++) {
	        var language = data[i]
	        var languageID = uuidv4()
	        var artistID = uuidv4();

	        var child = {
	            id: artistID,
	            parentId: languageID,
	            elements: []

	        }
	        for (var j = 0; j < language.artist.length; j++) {
	            child.elements.push({
	                name: language.artist[j]["cn_char"],
	                icon: language.artist[j]["artist_pinyin"] + ".png",
	                linkTo: "/song?id=" + language.artist[j]["file_name"],
	            })
	        }
	        artists.push(child)
	        languages.elements.push({
	            name: language["_id"],
	            icon: language["_id"] + ".png",
	            child: artists[i],
	        })
	    }
	    return languages

	}


	//called when a user clicks on a new song
	formatArtists(data){
		var artists = {
	        id: "allArtists",
	        elements: []
	    }
	    var songs = []
	    for (var i = 0; i < data.length; i++) {
	        var artist = data[i]
	        var artistID = uuidv4()
	        var songID = uuidv4();

	        var child = {
	            id: songID,
	            parentId: artistID,
	            elements: []

	        }
	        for (var j = 0; j < artist.songs.length; j++) {
	            child.elements.push({
	                name: artist.songs[j].cn_char,
	                icon: artist.songs[j]["artist_pinyin"] + ".png",
	                linkTo: "/song?id=" + artist.songs[j]["file_name"]
	            })
	        }
	        songs.push(child)
	        artists.elements.push({
	            name: artist["_id"],
	            icon: artist.songs[0]["artist_pinyin"] + ".png",
	            child: songs[i],
	        })
	    }

		console.log(artists)
		return artists
	}



	//using BFS, create nodes and append them to root.
 	createTree(searchCategories) {
 		//axios hasnt given the list of artists yet
 		if(searchCategories.elements == null){
 			return null
 		}
 		var domLevels = []
 		var root = searchCategories;
 		var level = 1;
	    var queue = [];
	    queue.push(root);
	    queue.push(null); //null keeps track of level
	    
	    while (queue.length != 0) {
	        var node = queue.shift();
	        if (!node) {
	            //either hit a new level or queue is entirely empty
	            level++;
	            queue.push(null);
	            if (!queue[0])
	                break;
	            else
	                continue;
	        }

	        var id = node.id;
	        var elements = node.elements;


	       	domLevels.push((
	        	<div key = {"outer div" + id} id = {id} name = {id} className = {node.id ? "collapse": ""}>
		        	<div className = {level + "_level level"}>
		        		{
		        			elements.map((element, index) => {
								var anchorAttributes = {}
								anchorAttributes["className"] = "item"
								//if this element just needs to link to a dashboard
								if (element.linkTo) {
								    anchorAttributes["href"] = element.linkTo;
								} else if (element.child) {
								    anchorAttributes["href"] = "#";
						       }
							    //attatch and ID if it has one
							    if (element.id)
							        anchorAttributes["id"] = element.id;

						    	if (element.child)
					                queue.push(element.child);

							    return (
							    	<AnchorHover
							    		level={level}
							    		child = {element.child}
							    		maxLevel = {this.state.maxLevel}
							    		key = {"anchor level_" + level + "_index_" + index} 
							    		{...anchorAttributes}
										image = {(<div>
								    		<img 
								    			className={"icon childLevelIcon"}
								    			src={element.icon}
							    			/>
							    		</div>)}
							    		textLabel = {
							    			(<div className="textLabel nowrap"
							    				>
							    				{element.name}
							    				</div>)	
							    		}/>
							    	);
							})
		        		}
					</div>
	        	</div>));
	    }
	    
	    return domLevels;

	}

	
	render() {
		return (
			<div>
			  	<PageNavbar/>
		      <div className="container offset-navbar">
		      	{this.createTree(this.state.searchCategories)}
			  </div>
			</div>
		);
	}


	// //create a link to either a dashboard location, or to trigger a collapse on a previous state and expand its child row.
	// createAnchor(element, level) {


	//     } else if (element.child) {
	//         anchorAttributes["href"] = "#";
	//         anchorAttributes["onClick"] = function() {

	//         }
	//     }
	//     //attatch and ID if it has one
	//     if (element.id)
	//         anchorAttributes["id"] = element.id;

	//     return (<a {...anchorAttributes}></a>);
	// }

	// //returns a div that wraps an img (icon)
	// createIcon(element, level) {
	//     var iconDiv = (<div></div>);
	//     // if (level == 1) //css makes these icons at this level slightly larger
	//     //     var iconLevel = "topLevelIcon";
	//     // else
	//     var iconLevel = "childLevelIcon";
	//     var icon = (<img className={"icon " + iconLevel} src={element.icon}></img>);
	//     iconDiv.append(icon);
	//     return iconDiv;
	// }

}

ReactDOM.render(
  <MainContainer/>,
  document.getElementById('content')
);