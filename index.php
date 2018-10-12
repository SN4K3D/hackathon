<!doctype html>
<html lang="fr">
<?php include('html/inc/head.php'); ?>
  <body>
    <?php include('html/inc/accueil.php'); ?>
    <?php include('html/inc/wallofpictures.php'); ?>
    <?php include('html/inc/map.php'); ?>
    <?php include('html/inc/navright.php'); ?>
    <?php include('html/inc/overlay.php'); ?>
    <?php include('html/inc/footer.php'); ?>

    <!--BOUTON HAUT DE PAGE -->
    <div id="UpPage"><img src="media/icons/hautdepage.png" width="40" height="40"></div>

    <!--Script de la page d'accueil : insta et Map-->
    <script type="text/javascript" src="./javascript/noty.js"></script>
    <script type="text/javascript" src="./javascript/mapFilter.js"></script>
    <script type="text/javascript" src="./javascript/apiInsta.js"></script>
    <script type="text/javascript" src="./javascript/home.js"></script>
    <script type="text/javascript" src="./javascript/apiNotif.js"></script>
    <script type="text/javascript" src="./javascript/mapControl.js"></script>
    <script>
        $( document ).ready(() => {
            hashtag = "dsfdgdghfghfgf";
            idInsta = [];
            map.removeLayer(photoLayer);
            photoLayer = L.photo.cluster({spiderfyDistanceMultiplier: 1.6}).on('click', function (evt) {
                evt.layer.bindPopup(L.Util.template('<img src="{url}"/><img src="img/logoInsta.png" style="display: inline-block; height: 40px !important; width: 40px !important;"><span><b>Photo de {username}</b></span><span style="float:right;"><img id="imgLike" src="img/instaLike.png"/></span><b style="float: right; line-height:28px;">{likes}</b><p>{caption}</p><br><br>', evt.layer.photo), {
                    className: 'leaflet-popup-photo',
                    minWidth: 400
                });
            });
        });
    </script>
  </body>

</html>
