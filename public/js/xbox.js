var userID;
var list;
var count = 0;
var countMembers

//Sjekker Xbox liste for medlemmer
firebase.database().ref('/Xbox gruppe/Medlemmer').on('child_added', function (snapshot) {
    userID = snapshot.child("BrukerID").val();
    count++;
    countMembers = document.getElementById("membercountXbox");
    countMembers.innerHTML = count;


    //Bruker UID fra xbox medlemmer for å hente div annen info fra denne brukeren fra bruker tabellen
    firebase.database().ref('/Bruker/' + userID).once('value').then((snapshot) => {
        var name = snapshot.child("Brukernavn").val();
        var uid = snapshot.key;

        //Henting av profilbilde, bruker uid fra keyen til hver enkeltbruker profil
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var pictureStorage = storageRef.child("user/" + uid + "/profile.jpg");

        pictureStorage.getDownloadURL()
            .then((pictureURL) => { //Dersom brukeren har profilbilde
                console.log(name + " har profilbilde");
                list = document.getElementById("medlemslisteXbox");
                $(list).append('<a href="#" class="list-group-item text-light border-dark" style="background: #111;">' +
                    '<img class="rounded-circle m-3" width="50" height="50" style="object-fit: cover" src=' + pictureURL + 'alt="Profilbilde">'
                    + name + '</a>');
            })
            .catch((error) => { //Dersom brukeren ikke har profilbilde
                console.log(name + " har ikke profilbilde");
                list = document.getElementById("medlemslisteXbox");
                $(list).append('<a href="#" class="list-group-item text-light border-dark" style="background: #111;">' +
                    '<img class="rounded-circle m-3" width="50" height="50" style="object-fit: cover" src="img/blank-profile-circle.png" alt="Profilbilde">'
                    + name + '</a>');
            });
    })
});