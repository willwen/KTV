import ReactDOM from 'react-dom';
import PageNavbar from "../SharedReactComponents/PageNavbar.jsx";
import axios from 'axios';
const uuidv4 = require('uuid/v4');
import {Collapse} from 'react-bootstrap'
import AnchorHover from './AnchorHover.jsx'


export default class MainContainer extends React.Component {
	constructor(){
		super();
		this.state={
			searchCategories : {}
		};
		this.getArtists = this.getArtists.bind(this);
		this.handleArtists = this.handleArtists.bind(this);
		this.createTree = this.createTree.bind(this);
		this.getLanguages = this.getLanguages.bind(this);
		// this.createAnchor = this.createAnchor.bind(this);
		// this.createIcon = this.createIcon.bind(this);
		// this.createTextLabel = this.createTextLabel.bind(this);


	}
	componentWillMount(){
	  	this.getArtists();
	}
	componentDidMount(){
		

	}
	componentWillUnmount(){
		
	}

	getLanguages(){
		// axios.get("language")
		// 	.then((response)=>this.handleArtists(response["data"]))
		// 	.catch(error => console.log(error));
	}
	
	getArtists(){
		axios.get("artists")
			.then((response)=>this.handleArtists(response["data"]))
			.catch(error => console.log(error));
	}
	//called when a user clicks on a new song
	handleArtists(data){
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
	    //{name: "Language", icon: "Language.png", child: languages},
		this.setState({
			searchCategories : {
					elements:  [ 
         				{
         					name: "All Artists", 
         					icon: "Artist.png", 
         					child: artists 
         				}
    				]
				}
		});
		console.log(artists)
	}



	//using BFS, create nodes and append them to root.
 	createTree(searchCategories) {
 		//axios hasnt given the list of artists yet
 		if(this.state.searchCategories.elements == null){
 			return null
 		}
 		var domLevels = []
 		var maxLevel = 1;
 		var root = this.state.searchCategories;
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
	        	<Collapse id = {id}>
		        	<div className = {level + "_level level"}>
		        		{
		        			elements.map(function(element, index) {
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
							    		key = {"level_" + level + "_index_" + index} 
							    		{...anchorAttributes}
										image = {(<div>
								    		<img className={"icon childLevelIcon"} src={element.icon}></img>
							    		</div>)}
							    		textLabel = {
							    			(<div className="textLabel nowrap">{element.name}</div>)	
							    		}/>
							    	);
							})
		        		}
					</div>
	        	</Collapse>));
	    }
	    maxLevel = level;
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
	//             //hide all panels BELOW this level
	//             // for (var i = level + 1; i <= this.state.maxLevel; i++) {
	//             //     $("." + i + "_level").each(function() {
	//             //         $(this).parent().collapse({ toggle: false })
	//             //         $(this).parent().collapse("hide");
	//             //     })
	//             // }
	//             //show this node's children
	//             // $("#" + element.child.id).collapse("show");

	//             //clear all highlight color at or below this level
	//             // for (var i = level; i <= maxLevel; i++) {
	//             //     $("." + i + "_level").each(function() {
	//             //         $(this).children().each(function() {
	//             //             $(this).css("background-color", "")
	//             //         })
	//             //     })
	//             // }
	//             //highlight myself
	//             // $(this).css("background-color", "#00000080");
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