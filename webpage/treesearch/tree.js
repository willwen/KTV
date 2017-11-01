var maxLevel = 0;

function reformat(data) {
    var artists = {
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
            elements: [
            ]

        }
        for (var j = 0; j < artist.songs.length; j++) {
            child.elements.push({
                name: artist.songs[j].cn_char,
                icon: artist["_id"]+".png",
                linkTo: "/song?id=" + artist.songs[j]["file_name"] + "&title=" + artist.songs[j].cn_char + "&artist=" + artist["_id"]
            })
        }
        songs.push(child)
        artists.elements.push({
            name: artist["_id"],
            icon: artist["_id"]+".png",
            child: songs[i],
        })
    }
    return artists

}

$(document).ready(function() {
    // db.songs.aggregate({$sort:{artist:-1}},{$group: {_id:"$artist", songs: {$push: "$$ROOT"}}})
    $.get("/artists", function(data) {
        artists = reformat(data)
        createTree($("#root"), artists, 1);
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
        var collapseDiv = $("<div></div>", { "id": id });
        //create a div to hold all nodes in a level
        var levelContainer = $("<div></div>", { "class": level + "_level level" });

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
        anchor.attr("href", "#");
        anchor.click(function() {
            //hide all panels BELOW this level
            for (var i = level + 1; i <= maxLevel; i++) {
                $("." + i + "_level").each(function() {
                    $(this).parent().collapse({ toggle: false })
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
            $(this).css("background-color", "#d9edf7");
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
    var icon = $("<img></img>", { "class": "icon " + iconLevel, "src": element.icon });
    iconDiv.append(icon);

    return iconDiv;
}

function createTextLabel(element) {
    return $("<div></div>", { "class": "textLabel nowrap" }).text(element.name);
}