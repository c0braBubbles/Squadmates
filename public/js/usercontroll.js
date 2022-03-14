// BRUKER DENNE TIL Å SJEKKE OM BRUKER ER LOGGET INN OG FOR Å HENTE UID OG ÅPNE PROFILSIDE

//const f_bruker = JSON.parse(sessionStorage.getItem("bruker"));

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

            pictureStorage.getDownloadURL().then((pictureURL) => {
                document.getElementById("pictureHeader").src = pictureURL; //Profilbilde på header
                document.getElementById("pictureMobileHeader").src = pictureURL; //Profilbilde på mobil header
                //console.log("Profilbilde funnet");
            }).catch((error) => {
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


var ulest = 0;
localStorage.setItem("Nytt", ulest);
var notificationBubble = document.getElementById('ulestSamtale');
var notificationBubbleSmall = document.getElementById('ulestSamtaleLiten')
// NYTT FRA  NYTT FRA  NYTT FRA  NYTT FRA
/*
firebase.database().ref('Samtale').on('child_added', function(snapshot) {
    if (snapshot.exists()) {
        var info = snapshot.val();
        if (info.Bruker1ID == f_bruker.Uid || info.Bruker2ID == f_bruker.Uid) {
            if (info.NyttFra != f_bruker.Uid && info.NyttFra != 0) {
                ulest++;
                var temp_LS = localStorage.getItem("Nytt")+1;
                localStorage.setItem("Nytt", temp_LS);
                //notificationBubble.innerHTML = "!";
                notificationBubble.style.display = "inline-block";
                notificationBubbleSmall.style.display = "inline-block";
            }
        }
    }
});

firebase.database().ref('Samtale').on('child_changed', (data) => {
    var info = data.val();
    if (info.Bruker1ID == f_bruker.Uid || info.Bruker2ID == f_bruker.Uid) { //En samtale hvor du er medlem
        if (info.NyttFra != f_bruker.Uid && info.NyttFra != 0) { //Du har noe usett i den samtalen
            ulest++;
            var temp_LS = localStorage.getItem("Nytt")+1;
            localStorage.setItem("Nytt", temp_LS);
        }
        var tempCount = localStorage.getItem("Nytt");
        if (tempCount > 0) {
            //notificationBubble.innerHTML = "!";
            notificationBubble.style.display ="inline-block";
            notificationBubbleSmall.style.display = "inline-block";
        } else {
            //notificationBubble.innerHTML = "";
            notificationBubble.style.display = "none";
            notificationBubbleSmall.style.display = "none";
        }
    }
});
*/
document.getElementById("logutBtn").onclick = function() {
    firebase.auth().signOut().then(() => {
        window.location = '/'; 
    }).catch((error) => {
        alert(error); // mest sannsynlig forekommer ikke denne
    })
}
