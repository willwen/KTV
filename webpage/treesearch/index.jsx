import ReactDOM from 'react-dom';
import PageNavbar from "../SharedReactComponents/PageNavbar.jsx";
import axios from 'axios';
const uuidv4 = require('uuid/v4');
import {Collapse} from 'react-bootstrap'



export default class MainContainer extends React.Component {
	constructor(){
		super();
		this.state={
			elements : {
			},
			maxLevel: 0
		};
		this.getArtists = this.getArtists.bind(this);
		this.handleArtists = this.handleArtists.bind(this);
		this.createTree = this.createTree.bind(this);
		
	}
	componentWillMount(){
	  	this.getArtists()
	}
	componentDidMount(){
		

	}
	componentWillUnmount(){
		
	}

	
	getArtists(id, title, artist){
		axios.get("artists")
			.then((response)=>this.handleArtists(response["data"]))
			.catch(error => console.log(error));
	}
	//called when a user clicks on a new song
	handleArtists(data){
		var elements = {
	        artists: []
	    }
	    for (var i = 0; i < data.length; i++) {
	        let artistInfo = data[i]
	        let artistName = artistInfo["_id"]
	        let artistIcon = artistInfo["_id"]+".png"
	        let artistID = uuidv4()
	        let songsID = uuidv4();
	        let artistSongs = artistInfo["songs"]

	        var songsByArtist = { //child div, has a parent of an artist, is an array of songs
	            id: songsID, //selfID
	            parentId: artistID, //parent ID
	            songs: [ //the list of songs by this artist
	            ]

	        }
	        for (var j = 0; j < artistSongs.length; j++) {
	        	let songTitle = artistSongs[j]["cn_char"];
	            songsByArtist.songs.push({
	                name: songTitle,
	                icon: artistIcon,
	                linkTo: "/song?id=" + artistSongs[j]["file_name"] + "&title=" + songTitle + "&artist=" + artistName
	            })
	        }

	        elements.artists.push({
	            name: artistName,
	            icon: artistIcon,
	            child: songsByArtist,
	        })
	    }
		this.setState({
			elements: elements
		});
		console.log(elements)
	}



	//using BFS, create nodes and append them to root.
 	createTree() {
 		//axios hasnt given the list of artists yet
 		if(this.state.elements.id == null){
 			return null
 		}
 		var rootNode = (<div></div>);
 		var root = this.state.elements;
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

	        var collapseDivAttrs = {}
	        collapseDivAttrs[id] = id
	        //create a div to hold all nodes in a level
	        var levelContainer = (<div className = {level + "_level level"}></div>);

	        // if (node.id) {
	        //     collapseDiv.addClass("collapse");
	        // }

	        //create a div with unique ID to be toggled with collapse()
	        var collapseDiv = (<Collapse {...collapseDivAttrs}></Collapse>);

	        elements.forEach(function(element) {
	            var anchor = createAnchor(element, level);
	            var iconDiv = createIcon(element, level);
	            var textLabel = createTextLabel(element);

	            // if (element.child) {
	            //     queue.push(element.child);
	            //     //if this element has children, and a user hovers over this, show a bottom border to denote
	            //     // this element will expand its children if clicked.
	            //     anchor.hover(function() {
	            //         //when a mouse enters
	            //         $(this).css("border-bottom", "medium outset #9c8585")
	            //     }, function() {
	            //         //when a mouse leaves
	            //         $(this).css("border-bottom", "medium solid rgba(255,255,255,0)")
	            //     })
	            // }
	            anchor.append(iconDiv);
	            anchor.append(textLabel);
	            levelContainer.append(anchor);

	        });
	        let node =  React.findDOMNode(collapseDiv)
	        node.append(levelContainer)
	        rootNode.append(collapseDiv);
	    }
	    maxLevel = level;
	    return;

	}

	
	render() {
		return (
			<div>
			  	<PageNavbar/>
		      <div className="container navbar-offset">
		      	{this.createTree()}
			  </div>
			</div>
		);
	}


	//create a link to either a dashboard location, or to trigger a collapse on a previous state and expand its child row.
	createAnchor(element, level) {
	    //create element
	    var anchorAttributes = {}
	    anchorAttributes["className"] = "item"
	    //if this element just needs to link to a dashboard
	    if (element.linkTo) {
	        anchorAttributes["href"] = element.linkTo;
	    } else if (element.child) {
	        anchorAttributes["href"] = "#";
	        anchorAttributes["onClick"] = function() {
	            //hide all panels BELOW this level
	            // for (var i = level + 1; i <= this.state.maxLevel; i++) {
	            //     $("." + i + "_level").each(function() {
	            //         $(this).parent().collapse({ toggle: false })
	            //         $(this).parent().collapse("hide");
	            //     })
	            // }
	            //show this node's children
	            // $("#" + element.child.id).collapse("show");

	            //clear all highlight color at or below this level
	            // for (var i = level; i <= maxLevel; i++) {
	            //     $("." + i + "_level").each(function() {
	            //         $(this).children().each(function() {
	            //             $(this).css("background-color", "")
	            //         })
	            //     })
	            // }
	            //highlight myself
	            // $(this).css("background-color", "#00000080");
	        }
	    }
	    //attatch and ID if it has one
	    if (element.id)
	        anchorAttributes["id"] = element.id;

	    return (<a {...anchorAttributes}></a>);
	}

	//returns a div that wraps an img (icon)
	createIcon(element, level) {
	    var iconDiv = (<div></div>);
	    // if (level == 1) //css makes these icons at this level slightly larger
	    //     var iconLevel = "topLevelIcon";
	    // else
	    var iconLevel = "childLevelIcon";
	    var icon = (<img className={"icon " + iconLevel} src={element.icon}></img>);
	    iconDiv.append(icon);
	    return iconDiv;
	}

	createTextLabel(element) {
    	return (<div className="textLabel nowrap">{element.name}</div>)
	}

}

ReactDOM.render(
  <MainContainer/>,
  document.getElementById('content')
);