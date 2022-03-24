const whiz = JSON.parse(sessionStorage.getItem("bruker"));
var user = whiz.Uid;

firebase.database().ref('/Bruker/' + user).once('value').then((snapshot) => {

    //Plattformer
    /* Steam */
    if (snapshot.child('Steam').val() != null) {
        document.getElementById('steamGroup').style.display = "block";
    }
    /* Xbox */
    if (snapshot.child('Xbox').val() != null) {
        document.getElementById('xboxGroup').style.display = "block";
    }
    /* Playstation */
    if (snapshot.child('Playstation').val() != null) {
        document.getElementById('psGroup').style.display = "block";
    }
    /* Switch */
    if (snapshot.child('Switch').val() != null) {
        document.getElementById('switchGroup').style.display = "block";
    }
})

//Antall medlemmer på platformkort
var xboxCount = 0;
firebase.database().ref('/Xbox gruppe/Medlemmer').on('child_added', function (snapshot) {
    xboxCount++;
    document.getElementById("xboxMembers").innerHTML = xboxCount + " Medlemmer";
})

var psCount = 0;
firebase.database().ref('/Playstation gruppe/Medlemmer').on('child_added', function (snapshot) {
    psCount++;
    document.getElementById("psMembers").innerHTML = psCount + " Medlemmer";
})

var switchCount = 0;
firebase.database().ref('/Switch gruppe/Medlemmer').on('child_added', function (snapshot) {
    switchCount++;
    document.getElementById("switchMembers").innerHTML = switchCount + " Medlemmer";
})

var steamCount = 0;
firebase.database().ref('/Steam gruppe/Medlemmer').on('child_added', function (snapshot) {
    steamCount++;
    document.getElementById("steamMembers").innerHTML = steamCount + " Medlemmer";
})

$(document).on("click", ".browse", function () {
    var file = $(this).parents().find(".file");
    file.trigger("click");
});

/* ---------- Kode for Opprett ny gruppe begynner her ----------*/
document.getElementById("newGroup_btn").onclick = function () {
    document.getElementById("superDiv").style.display = "none";
    document.getElementById("subDiv").style.display = "block";
}

//Setter valgt bilde som preview for forsidebilde
$('input[type="file"]').change(function (e) {
    var fileName = e.target.files[0].name;
    $("#file").val(fileName);

    var reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById("preview").src = e.target.result;
    };
    reader.readAsDataURL(this.files[0]);
});
/* ---------- Kode for Opprett ny gruppe slutter her ----------*/


//Oppretting av ny gruppe
var fil = {};
document.getElementById("formFile").onchange = function (e) {
    fil = e.target.files[0];
    console.log(fil);
}

document.getElementById("grpCreate").onclick = function () {
    var groupName = document.getElementById("grpName").value;
    var groupAbout = document.getElementById("grpAbout").value;
    var discord = null;
    var pc = null;
    var ps = null;
    var xbox = null;
    var nintendo = null;
    var id = Date.now();

    //Henter navn fra databasen slik at vi kan unngå grupper med samme navn
    var name;
    firebase.database().ref('/Grupper').on('child_added', function (snapshot) {
        name = snapshot.child("Navn").val();
    })

    if (document.getElementById("discordCheck").checked) {
        if (document.getElementById("discordform").value != "") { discord = document.getElementById("discordform").value; }
    }
    if (document.getElementById("pcCheck").checked) {
        pc = "yes";
    }
    if (document.getElementById("psCheck").checked) {
        ps = "yes";
    }
    if (document.getElementById("xboxCheck").checked) {
        xbox = "yes";
    }
    if (document.getElementById("switchCheck").checked) {
        nintendo = "yes";
    }
    if (groupName != name && groupName != "") {
        var pushkey = firebase.database().ref('/Grupper').push().key;
        firebase.database().ref('/Grupper').child(pushkey).set({
            Eier: user,
            Navn: groupName,
            Om: groupAbout,
            Discord: discord,
            Pc: pc,
            Ps: ps,
            Xbox: xbox,
            Switch: nintendo,
            BildeID: id
        }).then(() => { //Opplasting av forsidebilde
            firebase.database().ref('/Bruker/' + user + '/Grupper eid/').child(pushkey).set({
                Key: pushkey
            })
            if (fil instanceof File) {
                firebase.storage().ref("grupper/" + (user + id) + "/gruppe.jpg").put(fil).then(() => {
                    window.location.href = "/allgroups";
                });
            } else {
                window.location.href = "/allgroups";
            }
        })
    } else {
        alert("Ugyldig gruppenavn! (Enten er navnefeltet tomt, eller så finnes det allerede en gruppe med dette navnet)");
    }
}

//Henting av gruppekort "Mine innlegg" for grupper du "eier/har selv laget"
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

        //Antall medlemmer på gruppekort
        var groupCount = 1;
        firebase.database().ref('/Grupper/' + key + '/Medlemmer').on('child_added', function (snapshot) {
            groupCount++;
        })
        if (owner == user) {
            $(document.getElementById("myGroups")).append(
                '<div class="col-lg-4 pt-2" onclick="getGroup(\'' + groupKey + '\')">' + //getGroup ligger i allgroups.ejs
                '<div class="card rounded-3 chromahover">' +
                '<img class="card-img-top" id="' + imgid + '" src="" alt="Card image cap"' +
                'style="height: 12rem; object-fit: cover">' +
                '<div class="card-img-overlay"> <i class="fas fa-crown text-warning"></i></div>' +
                '<div class="card-body">' +
                '<h5 class="card-title">' + name + '</h5>' +
                '<br>' +
                '<p class="card-text"><small class="text-muted" id="' + countid + '"></small></p></div></div></div>'
            )
        }
        pictureStorage.getDownloadURL()
            .then((pictureURL) => { //Har Forsidebilde
                document.getElementById(imgid).src = pictureURL;
            })
            .catch((error) => { //Har ikke Forsidebilde
                console.clear(error);
                document.getElementById(imgid).src = "img/Amin.jpg";
            }).then(() => {
                if (groupCount == 1) {
                    document.getElementById(countid).innerHTML = groupCount + " Medlem";
                } else {
                    document.getElementById(countid).innerHTML = groupCount + " Medlemmer";
                }
            });

    })

})

//Henting av gruppekort "Mine innlegg" for grupper du er medlem av
firebase.database().ref('/Bruker/' + user + '/Grupper').on('child_added', function (snapshot) {
    var key = snapshot.child("Key").val();

    firebase.database().ref('/Grupper/' + key).once('value').then((snapshot) => {
        var name = snapshot.child("Navn").val();
        var owner = snapshot.child("Eier").val();
        var id = snapshot.child("BildeID").val();
        var picid = "image" + snapshot.child("BildeID").val();
        var countid = "count" + snapshot.child("BildeID").val();
        var groupKey = snapshot.key;

        //Antall medlemmer på gruppekort
        var groupCount = 1;
        firebase.database().ref('/Grupper/' + key + '/Medlemmer').on('child_added', function (snapshot) {
            groupCount++;
        })

        $(document.getElementById("myMemberGroups")).append(
            '<div class="col-lg-4 pt-2" onclick="getGroup(\'' + groupKey + '\')">' + //getGroup ligger i allgroups.ejs
            '<div class="card rounded-3 chromahover">' +
            '<img class="card-img-top" id="' + picid + '" src="" alt="Card image cap"' +
            'style="height: 12rem; object-fit: cover">' +
            '<div class="card-body">' +
            '<h5 class="card-title">' + name + '</h5>' +
            '<br>' +
            '<p class="card-text"><small class="text-muted" id="' + countid + '"></small></p></div></div></div>'
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
                document.getElementById(picid).src = "img/Amin.jpg"
            }).then(() => {
                if (groupCount == 1) {
                    document.getElementById(countid).innerHTML = groupCount + " Medlem";
                } else {
                    document.getElementById(countid).innerHTML = groupCount + " Medlemmer";
                }
            });
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

        //Antall medlemmer på gruppekort
        var groupCount = 1;
        firebase.database().ref('/Grupper/' + key + '/Medlemmer').on('child_added', function (snapshot) {
            groupCount++;
        })

        $(document.getElementById("myFavorites")).append(
            '<div class="col-lg-4 pt-2" onclick="getGroup(\'' + groupKey + '\')">' + //getGroup ligger i allgroups.ejs
            '<div class="card rounded-3 chromahover">' +
            '<img class="card-img-top" src="" id="' + picid + '" alt="Card image cap"' +
            'style="height: 12rem; object-fit: cover">' +
            '<div class="card-body">' +
            '<h5 class="card-title">' + name + '</h5>' +
            '<br>' +
            '<p class="card-text"><small class="text-muted" id="' + countid + '">Medlemmer</small></p></div></div></div>'
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
            }).then(() => {
                if (groupCount == 1) {
                    document.getElementById(countid).innerHTML = groupCount + " Medlem";
                } else {
                    document.getElementById(countid).innerHTML = groupCount + " Medlemmer";
                }
            });
    })
})


//Sjekker om brukeren har favoritter, dersom brukeren ikke har favoriter fjern favoritter card group
var ref = firebase.database().ref('/Bruker/' + user + '/Favoritt grupper');
ref.once("value")
    .then(function (snapshot) {
        var a = snapshot.exists();
        if (a == false) {
            document.getElementById("favoritecardGroup").style.display = "none";
        }
    });

//Sjekker om brukeren eier grupper, dersom brukeren ikke har gjør det fjern overskriten "grupper du eier"
var ref = firebase.database().ref('/Bruker/' + user + '/Grupper eid');
ref.once("value")
    .then(function (snapshot) {
        var a = snapshot.exists();
        if (a == false) {
            document.getElementById("myOwnedGroups").style.display = "none";
        }
    });

//Sjekker om brukeren er medlem av noen grupper, hvis ikke fjern overskriften "Grupper du er medlem av"
var ref = firebase.database().ref('/Bruker/' + user + '/Grupper');
ref.once("value")
    .then(function (snapshot) {
        var a = snapshot.exists();
        if (a == false) {
            document.getElementById("groupMembers").style.display = "none";
        }
    });

setTimeout(() => {
    $(".loader-wrapper").fadeOut("slow");
}, 2000);