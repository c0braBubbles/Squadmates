// BRUKER DENNE TIL Å SJEKKE OM BRUKER ER LOGGET INN OG FOR Å HENTE UID OG ÅPNE PROFILSIDE

firebase.auth().onAuthStateChanged((user) => {
    if (user != null) {
        var uid = user.uid;

        firebase.database().ref('/Bruker/' + uid).once('value').then((snapshot) => {
            var whuz = snapshot.val(); //skal egt være const
            whuz.Uid = uid;
            sessionStorage.setItem("bruker", JSON.stringify(whuz));

            document.getElementById("usernameHeader").innerHTML = whuz.Brukernavn; //Brukernavn i header
			document.getElementById("usernameHeaderMobil").innerHTML = whuz.Brukernavn; //Brukernavn i mobil header

            // templating for når man åpner min profil: 
            document.getElementById("myProf").onclick = function() {
                window.open(uid, '_self');
                $.post("/openUid", {
                        uid: uid
                    }, function (data, status) {
                        console.log(data);
                    }
                );
            }
            document.getElementById("myProf2").onclick = function() {
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



