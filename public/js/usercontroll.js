// BRUKER DENNE TIL Å SJEKKE OM BRUKER ER LOGGET INN OG FOR Å HENTE UID OG ÅPNE PROFILSIDE
var ulest = 0;
const f_bruker = JSON.parse(sessionStorage.getItem("bruker"));
var notificationBubble = document.getElementById('ulestSamtale');

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
                });
            }
        });
        //Oppdaterer hvor mange samtaler en ikke har sett
        /*firebase.database().ref('Samtale').on('child_added', function(snapshot) {
            var info = snapshot.val();
            if (snapshot.exists()) {
                if (info.Bruker2ID == user.uid && info.Sett == 0) {
                    notificationBubble.style.display = "inline-block";
                    ulest++;
                    notificationBubble.innerHTML = ulest;
                }
            }
        });*/

    } else {
        window.location = "/";
    }
});

//Oppdaterer hvor mange samtaler en ikke har sett
var notificationBubble = document.getElementById('ulestSamtale');
/*firebase.database().ref('Samtale').on('child_added', function(snapshot) {
    var info = snapshot.val();
    if (snapshot.exists()) {
        if (info.Bruker2ID == f_bruker.Uid && info.Sett > 0) {
            notificationBubble.style.display = "inline-block";
            ulest++;
            notificationBubble.innerHTML = ulest;
        }
    }
});*/

//Oppdaterer hvor mange samtaler en ikke har sett
firebase.database().ref('Samtale').on('child_added', function(snapshot) {
    var info = snapshot.val();
    if (snapshot.exists()) {
        if (info.Bruker2ID == f_bruker.Uid && info.Sett == 0) {
            notificationBubble.style.display = "inline-block";
            ulest++;
            notificationBubble.innerHTML = ulest;
        }
    }
});



//Dersom en samtale blir sett
firebase.database().ref('Samtale').on('child_changed', (data) => {
    if (data.val().Bruker2ID == f_bruker.Uid && data.val().Sett == 1) {
        console.log(data.val().Bruker2ID + " " + data.val().Sett);
        ulest--;
        notificationBubble.innerHTML = ulest;
        if (ulest < 1) {
            notificationBubble.style.display = "none";
        } else {
            notificationBubble.style.display = "inline-block";
        }
    }
});

document.getElementById("logutBtn").onclick = function() {
    firebase.auth().signOut().then(() => {
        window.location = '/'; 
    }).catch((error) => {
        alert(error); // mest sannsynlig forekommer ikke denne
    })
}
