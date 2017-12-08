var maxLevel = 0;

function reformatArtists(data) {
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
    return artists

}

function reformatLanguages(data) {
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

$(document).ready(function() {
    // db.songs.aggregate({$sort:{artist:-1}},{$group: {_id:"$artist", songs: {$push: "$$ROOT"}}})
    $.when(
        $.get("/language"),
        $.get("/artists")
        ).done((langaugesResp, artistsResp)=>{
            // console.log(langaugesResp[0])
            var languages = reformatLanguages(langaugesResp[0])
            var artists = reformatArtists(artistsResp[0])
            var searchCategories = { elements: 
                [ {name: "Language", icon: "Language.png", child: languages},
                 {name: "All Artists", icon: "Artist.png", child: artists }
                ]}
            createTree($("#root"), searchCategories, 1);
        })
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//using BFS, create nodes and append them to root.
function createTree(rootNode, root, level) {
    var queue = [];
    queue.push(root);
    queue.push(null); //null keeps track of level
    var level = 1;
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

        //create a div with unique ID to be toggled with collapse()
        var collapseDiv = $("<div></div>", { "id": id , "name" : id});
        //create a div to hold all nodes in a level
        var levelContainer = $("<div></div>", { "class": level + "_level level " });

        if (node.id) {
            collapseDiv.addClass("collapse");
        }

        elements.forEach(function(element) {
            var anchor = createAnchor(element, level);
            var iconDiv = createIcon(element, level);
            var textLabel = createTextLabel(element);

            if (element.child) {
                queue.push(element.child);
                //if this element has children, and a user hovers over this, show a bottom border to denote
                // this element will expand its children if clicked.
                anchor.hover(function() {
                    //when a mouse enters
                    $(this).css("border-bottom", "medium outset #9c8585")
                }, function() {
                    //when a mouse leaves
                    $(this).css("border-bottom", "medium solid rgba(255,255,255,0)")
                })
                // anchor.attr("href", "#" + element.child.id )
            }
            anchor.append(iconDiv);
            anchor.append(textLabel);
            levelContainer.append(anchor);

        });
        collapseDiv.append(levelContainer)
        rootNode.append(collapseDiv);
    }
    maxLevel = level;
    return;

}

//create a link to either a dashboard location, or to trigger a collapse on a previous state and expand its child row.
function createAnchor(element, level) {
    //create element
    var anchor = $("<a></a>");
    anchor.addClass("item");
    //if this element just needs to link to a dashboard
    if (element.linkTo) {
        anchor.attr("href", element.linkTo);
    } else if (element.child) {
        anchor.attr("href", "#bottom");
        anchor.click(function() {
            //hide all panels BELOW this level
            for (var i = level + 1; i <= maxLevel; i++) {
                $("." + i + "_level").each(function() {
                    // $(this).parent().collapse({ toggle: false })
                    $(this).parent().collapse("hide");
                })
            }
            //show this node's children
            $("#" + element.child.id).collapse("show");

            //clear all highlight color at or below this level
            for (var i = level; i <= maxLevel; i++) {
                $("." + i + "_level").each(function() {
                    $(this).children().each(function() {
                        $(this).css("background-color", "")
                    })
                })
            }
            //highlight myself
            $(this).css("background-color", "#00000080");
        })
    }
    //attatch and ID if it has one
    if (element.id)
        anchor.attr("id", element.id);
    return anchor;
}

//returns a div that wraps an img (icon)
function createIcon(element, level) {
    var iconDiv = $("<div></div>");
    // if (level == 1) //css makes these icons at this level slightly larger
    //     var iconLevel = "topLevelIcon";
    // else
    var iconLevel = "childLevelIcon";
    var icon = $("<img></img>", { "class": "img-fluid icon " + iconLevel, "src": element.icon });
    iconDiv.append(icon);

    return iconDiv;
}

function createTextLabel(element) {
    return $("<div></div>", { "class": "textLabel" }).text(element.name);
}