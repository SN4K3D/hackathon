function bubbleSort(a, par) {
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < a.length - 1; i++) {
            if (a[i][par] < a[i + 1][par]) {
                var temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
}

function getNotification(nb) {
    fetch("https://myprovence.code4marseille.fr/api/instas")
      .then (function(response){
        return response.json();
      })
      .then (function(objetJson){
        var tagsList = {};
        for(var i = 0, iMax = objetJson["hydra:member"].length; i < iMax; i++) {
            var currentInsta = objetJson["hydra:member"][i];
            var listOfTags = currentInsta.tags.split(",");
            for(var j = 0, jMax = listOfTags.length; j < jMax; j++) {
                var currentTag = listOfTags[j];
                if(currentTag) {
                    if(tagsList.hasOwnProperty(currentTag)) {
                        tagsList[currentTag]["iteration"] += 1;
                    } else {
                        tagsList[currentTag] = {
                            "name": currentTag,
                            "iteration": Math.floor(Math.random() * 1000)
                        };
                    }
                }
            }
        }

        var tab = [];
        for(var tag in tagsList) {
            if(tagsList.hasOwnProperty(tag)) {
                if(tagsList[tag]["iteration"] < 5) {
                    delete tagsList[tag];
                    continue;
                } else {
                    tab.push(tagsList[tag]);
                    for(var i = 0; i < valueArr.length; i++) {

                    }
                }
            }
        }

        bubbleSort(tab, "iteration");
        tab = tab.slice(0, nb);
        if(valueArr.length === 0) valueArr = tab;

        // $( document ).ready(() => {
            for(var i = 0; i < tab.length; i++) {
                var hastagName = tab[i]['name'];
                var msg = "<a id=\"notifLink\" href=\"#mapHome\"><b>#"+hastagName+"</b></a> is now a trend! <a target=\"_blank\" href=\"./page_notif/index.html\"><u>View all</u></a>";
                var n = new Noty({
                    text: msg,
                    layout: 'topCenter',
                    animation: {
                        open: 'animated bounceInDown', // Animate.css class names
                        close: 'animated bounceOutUp' // Animate.css class names
                    }
                });
                n.show();
                n.setTimeout(3000);

                $("#notifLink").click(() => {
                    hashtag = hastagName;
                    map.removeLayer(photoLayer);
                    ajaxMap(hashtag);
                });
            }
        // });
    });
}

setInterval(function () {
    getNotification(1);
}, Math.floor(Math.random() * 3000)+5000);
