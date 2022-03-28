const whiz = JSON.parse(sessionStorage.getItem("bruker"));
var user = whiz.Uid;

//Loading, her er det ikke noe dynamisk innhold som "MÅ" eksistere, derfor timeout
setTimeout(() => {
    $(".loader-wrapper").fadeOut("slow");
}, 1200);

//Henting av grupper "Grupper du eier" for grupper du "eier/har selv laget"
firebase.database().ref('/Bruker/' + user + '/Grupper eid').on('child_added', function (snapshot) {
    var key = snapshot.child("Key").val();

    firebase.database().ref('/Grupper/' + key).once('value').then((snapshot) => {
        var name = snapshot.child("Navn").val();
        var owner = snapshot.child("Eier").val();
        var id = snapshot.child("BildeID").val();
        var imgid = "image" + snapshot.child("BildeID").val();
        var countid = "count" + snapshot.child("BildeID").val();
        var groupKey = snapshot.key;

        //Henting av forsidebilde
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var pictureStorage = storageRef.child("grupper/" + (user + id) + "/gruppe.jpg");

        if (owner == user) {
            $(document.getElementById("grpOwned")).append(
                '<div class="col-lg-6 pt-2" style="height: 13rem;" onclick="getGroup(\'' + groupKey + '\')">' + //getGroup ligger i allgroups.ejs
                '<div class="card rounded-3 chromahover h-100">' +
                '<img class="card-img-top h-50" id="' + imgid + '" src="" alt="Card image cap"' +
                'style= "object-fit: cover">' +
                '<div class="card-img-overlay"> <i class="fas fa-crown text-warning"></i></div>' +
                '<div class="card-body">' +
                '<h5 class="card-title">' + name + '</h5></div></div></div>'
            )
        }
        pictureStorage.getDownloadURL()
            .then((pictureURL) => { //Har Forsidebilde
                document.getElementById(imgid).src = pictureURL;
            })
            .catch((error) => { //Har ikke Forsidebilde
                console.clear(error);
                document.getElementById(imgid).src = "img/Amin.jpg";
            })
    })
})

//Henting av gruppekort "Mine favoritter" for grupper som er merket som favoritter
firebase.database().ref('/Bruker/' + user + '/Favoritt grupper').on('child_added', function (snapshot) {
    var key = snapshot.child("Key").val();

    firebase.database().ref('/Grupper/' + key).once('value').then((snapshot) => {
        var name = snapshot.child("Navn").val();
        var owner = snapshot.child("Eier").val();
        var id = snapshot.child("BildeID").val();
        var picid = "imageFav" + snapshot.child("BildeID").val();
        var countid = "countFav" + snapshot.child("BildeID").val();
        var groupKey = snapshot.key;

        $(document.getElementById("grpFavs")).append(
            '<div class="col-lg-6 pt-2" style="height: 13rem;" onclick="getGroup(\'' + groupKey + '\')">' + //getGroup ligger i allgroups.ejs
            '<div class="card rounded-3 chromahover h-100">' +
            '<img class="card-img-top h-50" id="' + picid + '" src="" alt="Card image cap"' +
            'style="object-fit: cover">' +
            '<div class="card-body">' +
            '<h5 class="card-title">' + name + '</h5></div></div></div>'
        )

        //Henting av forsidebilde
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var pictureStorage = storageRef.child("grupper/" + (owner + id) + "/gruppe.jpg");

        pictureStorage.getDownloadURL()
            .then((pictureURL) => { //Har Forsidebilde
                document.getElementById(picid).src = pictureURL;
            })
            .catch((error) => { //Har ikke Forsidebilde
                console.clear(error);
                document.getElementById(picid).src = "img/Amin.jpg";
            })
    })
})

//Sjekker om brukeren har favoritter, dersom brukeren ikke har favoriter fjern favoritter card group
var ref = firebase.database().ref('/Bruker/' + user + '/Favoritt grupper');
ref.once("value")
    .then(function (snapshot) {
        var a = snapshot.exists();
        if (a == false) {
            document.getElementById("favsHome").style.display = "none";
        }
    });

//Sjekker om brukeren eier grupper, dersom brukeren ikke har gjør det fjern overskriten "grupper du eier"
var ref = firebase.database().ref('/Bruker/' + user + '/Grupper eid');
ref.once("value")
    .then(function (snapshot) {
        var a = snapshot.exists();
        if (a == false) {
            document.getElementById("ownedHome").style.display = "none";
        }
    });