// BRUKER DENNE TIL Å SJEKKE OM BRUKER ER LOGGET INN OG FOR Å HENTE UID OG ÅPNE PROFILSIDE

firebase.auth().onAuthStateChanged((user) => {
    if (user != null) {
        var uid = user.uid;

        firebase.database().ref('/Bruker/' + uid).once('value').then((snapshot) => {
            var whuz = snapshot.val();
            whuz.Uid = uid;
            sessionStorage.setItem("bruker", JSON.stringify(whuz));

            document.getElementById("usernameHeader").innerHTML = whuz.Brukernavn; //Brukernavn i header
            document.getElementById("usernameHeaderMobil").innerHTML = whuz.Brukernavn; //Brukernavn i mobil header

            //Henting av profilbilde
            var storage = firebase.storage();
            var storageRef = storage.ref();
            var pictureStorage = storageRef.child("user/" + uid + "/profile.jpg");

            pictureStorage.getDownloadURL()
                .then((pictureURL) => {
                    document.getElementById("pictureHeader").src = pictureURL; //Profilbilde på header
                    document.getElementById("pictureMobileHeader").src = pictureURL; //Profilbilde på mobil header
                    //console.log("Profilbilde funnet");
                })
                .catch((error) => {
                    document.getElementById("pictureHeader").src = "img/blank-profile-circle.png"; //Default profilbilde dersom ikke bilde er funnet
                    document.getElementById("pictureMobileHeader").src = "img/blank-profile-circle.png"; //Default profilbilde mobil dersom ikke bilde er funnet
                    //console.log("brukeren har ingen profilbilde");
                });

            // templating for når man åpner min profil: 
            document.getElementById("myProf").onclick = function () {
                window.open(uid, '_self');
                $.post("/openUid", {
                    uid: uid
                }, function (data, status) {
                    console.log(data);
                }
                );
            }
            document.getElementById("myProf2").onclick = function () {
                window.open(uid, '_self');
                $.post("/openUid", {
                    uid: uid
                }, function (data, status) {
                    console.log(data);
                }
                );
            }
        });

    } else {
        window.location = "/";
    }
});



