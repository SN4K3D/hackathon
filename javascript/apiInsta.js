const TIME_UPDATE_INSTA = 10000;
var hashtag = "code4marseille";


//Tous les icones chargés pour toutes les catégories
var idsInfos = [];

//Appeler API Back pour récupérer les icones de toutes les catégories
function ajaxInfos() {
    var UrlApi = "https://myprovence.code4marseille.fr/api/infos";

    fetch(UrlApi)
    .then(function (reponse) {
      return reponse.json();
    })
    .then(function (objetJson) {
      //Nombres de pages à charger
      var LastPage = objetJson['hydra:totalItems'] / 100;
      var NbPages = Math.ceil(LastPage);
      for (var page = 1; page < NbPages + 1; page++) {
        var url = UrlApi + '?page=' + page;
        fetch(url)
        .then(function (response) {
                      // SI ON VEUT GERER DU JSON
                      // ON VA TRANSFORMER LE RESULTAT EN OBJET JSON
                      return response.json();
                    })
        .then(function (objetJson) {
          var tableauInfo = objetJson["hydra:member"];
          console.log(tableauInfo);
          // BOUCLE POUR PARCOURIR LES INFOS UNE PAR UNE
          for (var index = 0; index < tableauInfo.length; index++) {
            var infoCourante = tableauInfo[index];
            if (infoCourante.latitude && infoCourante.longitude) {
              var id = infoCourante["@id"];
                  //Verification d'ajout d'image (live)
                  if (idsInfos.includes(id) == false) {
                    idsInfos.push(id);
                    var image = "";

                    var lien = id;

                    if (infoCourante.icon != null && infoCourante.description != null) {
                      if (infosFiltres.includes(infoCourante.icon)) {
                        var photo = [{
                          lat: infoCourante.latitude,
                          lng: infoCourante.longitude,
                          url: "media/mapiconsfavoris/" + infoCourante.icon + "favoris.png",
                          caption: infoCourante.description,
                          thumbnail: "media/mapiconsfavoris/" + infoCourante.icon + "favoris.png",
                          icon: infoCourante.icon,
                          lien: lien.replace('/api/infos/', 'https://myprovence.code4marseille.fr/info-public/'),
                          image: image,
                          title: infoCourante.title
                        }];
                        if (infoCourante.icon == "question") {
                          if (filtreQuestion) {
                            questionLayer.add(photo).addTo(map);
                          }
                        } else {
                          if (filtreIcon) {
                            iconLayer.add(photo).addTo(map);
                          }
                        }
                      }
                    }
                  }
                }
              }
            });
      }
    });
  }




//Id des photos du live insta !
var idInsta = [];

function ajaxMap(hashtag = "code4marseille")
{

    var UrlApi = "https://myprovence.code4marseille.fr/api/instas?tags=" + hashtag;

    fetch(UrlApi)
    .then(function (reponse) {
    return reponse.json();
    })
    .then(function (objetJson) {
      //Nombres de pages à charger
      var LastPage = objetJson['hydra:totalItems'] / 100;
      var NbPages = Math.ceil(LastPage);

      for (var page = 1; page < NbPages + 1; page++) {

        var url = UrlApi + '&page=' + page;
        fetch(url)
        .then(function (response) {
                      // SI ON VEUT GERER DU JSON
                      // ON VA TRANSFORMER LE RESULTAT EN OBJET JSON
                      return response.json();
                    })
        .then(function (objetJson) {
          var tableauInfo = objetJson["hydra:member"];
          var photos = [];
            // BOUCLE POUR PARCOURIR LES INFOS UNE PAR UNE
          for (var index = 0; index < tableauInfo.length; index++) {


            var infoCourante = tableauInfo[index];

            if (infoCourante.latitude && infoCourante.longitude) {
              var title = infoCourante.title;
              var likes = infoCourante.likes;
              var link = infoCourante.link;
              var latitude = infoCourante.latitude;
              var longitude = infoCourante.longitude;
              var description = infoCourante.caption;
              var publicationDate = infoCourante.publicationDate;
              var image = infoCourante.lowResolution;
              var id = infoCourante.id;
              var username = infoCourante.userUsername;
              if (filtreLive) {
                      //Verification d'ajout d'image (live)
                      if (idInsta.includes(id) == false) {
                        idInsta.push(id);
                          //Verification si image existe encore
                          var img = new Image();
                          img.myLat = String(latitude);
                          img.myLng = String(longitude);
                          img.myLink = link;
                          img.myDescription = description;
                          img.myLikes = likes;
                          img.myUsername = username;
                          img.onload = function () {
                            var photo = [{
                              lat: this.myLat,
                              lng: this.myLng,
                              url: this.src,
                              caption: "<a href='" + this.myLink + "'>" + this.myDescription + "</a>",
                              thumbnail: this.src,
                              likes: this.myLikes,
                              username: this.myUsername
                            }];
                            photoLayer.add(photo).addTo(map);
                          }
                          img.src = infoCourante.lowResolution;
                        }
                      }
                    }
            }
        });
      }
  });
}

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
                            "iteration": 1
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
                }
            }
        }

        bubbleSort(tab, "iteration");
        tab = tab.slice(0, nb);

        $( document ).ready(() => {
            for(var i = 0; i < tab.length; i++) {
                var hastagName = tab[i]['name'];
                var msg = "<b>#"+hastagName+"</b> is now a trend!";
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
            }
        });
    });
}


//On charge les icone de la carte et on lance l'intervale d'actualisation

ajaxInfos();
ajaxMap();

setInterval(function () {
    ajaxMap(hashtag);
    ajaxInfos();
    getNotification(2);
}, TIME_UPDATE_INSTA);
