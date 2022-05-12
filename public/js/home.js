// const whiz = JSON.parse(sessionStorage.getItem("bruker"));
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
                //console.clear(error);
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
                //console.clear(error);
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

//Sjekker om brukeren eier grupper, dersom brukeren ikke har gjør det fjern overskriften "grupper du eier"
var ref = firebase.database().ref('/Bruker/' + user + '/Grupper eid');
ref.once("value")
    .then(function (snapshot) {
        var a = snapshot.exists();
        if (a == false) {
            document.getElementById("ownedHome").style.display = "none";
        }
    });

//-----------------------------------------------------------------------------------------------------------//
// - - - - - - - - - - - - - - H E R  K O M M E R  K O D E  F O R  I N N L E G G - - - - - - - - - - - - - - //
//-----------------------------------------------------------------------------------------------------------//
let klarForNy = false;

let lastKeys = {}; //Inneholder ALLE "siste" nøkler
let gruppeKeys = []; //Inneholder liste med objekter, som igjen inneholder sti til en gruppe, og nøkkel til siste innlegg fra gruppen
let userKeys = []; //Inneholder liste med objekter, som igjen inneholder til til en person, og nøkkel til siste innlegg fra brukeren
lastKeys.gruppeKeys = gruppeKeys;
lastKeys.userKeys = userKeys;
firebase.database().ref('Xbox gruppe/Innlegg').limitToLast(1).once('value', function (snapshot) {
    if (snapshot.exists()) {
        snapshot.forEach((childSnap) => {
            lastKeys.Xbox = childSnap.key;
        });
    }
});
firebase.database().ref('Playstation gruppe/Innlegg').limitToLast(1).once('value', function (snapshot) {
    if (snapshot.exists()) {
        snapshot.forEach((childSnap) => {
            lastKeys.Playstation = childSnap.key;
        });
    }
});
firebase.database().ref('Steam gruppe/Innlegg').limitToLast(1).once('value', function (snapshot) {
    if (snapshot.exists()) {
        snapshot.forEach((childSnap) => {
            lastKeys.Steam = childSnap.key;
        });
    }
});
firebase.database().ref('Switch gruppe/Innlegg').limitToLast(1).once('value', function (snapshot) {
    if (snapshot.exists()) {
        snapshot.forEach((childSnap) => {
            lastKeys.Switch = childSnap.key;
        });
    }
});

// - - - - - - - - - - - - - - - - - L E G G  U T  N Y E  I N N L E G G - - - - - - - - - - - - - - - - - //
firebase.database().ref('Bruker/' + whiz.Uid).once('value', (snapshot) => {
    var snapVal = snapshot.val();
    if (snapshot.child('Following').val() != null) {
        snapshot.child('Following').forEach(function (childVal) { //Et "following" objekt. Få tak i Uid -> childVal.child('Uid').val()
            //Legger til key til siste innlegg fra hver person som brukeren følger
            firebase.database().ref('Bruker/' + childVal.child('Uid').val() + '/Innlegg').limitToLast(1).once('value', function (snapshot) {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnap) => {
                        let userKeyObject = {};
                        userKeyObject.key = childSnap.key; //Nøkkelen til siste innlegg en bruker har lagt ut
                        userKeyObject.path = childVal.child('Uid').val(); //Nøkkel til brukeren som eier nøkkelen
                        lastKeys.userKeys.push(userKeyObject);
                    });
                }
            });
            //Legger på lytter etter nye innlegg
            let start = firebase.database().ref('Bruker/' + childVal.child('Uid').val() + '/Innlegg').push().key;
            firebase.database().ref('Bruker/' + childVal.child('Uid').val() + '/Innlegg').orderByKey().startAt(start).on('child_added', function (dataSnapshot) {
                leggUtInnlegg("bruker", childVal.child('Uid').val(), dataSnapshot.child('Brukernavn').val(), dataSnapshot.child('Navn').val(), dataSnapshot.key, true);
            });
        }); //Slutt på forEach
    } //Slutt på if

    //Legger de forskjellige plattformene inn i liste over brukerens grupper
    //De forskjellige lytterne har "orderByKey" og "startAt". Dette er gjort slik at bare NYE innlegg skal hentes
    if (snapshot.child('Grupper eid').val() != null) {
        snapshot.child('Grupper eid').forEach(function (childVal) {
            //Legger til key til siste innlegg fra hver gruppe som brukeren eier
            firebase.database().ref('Grupper/' + childVal.key + '/Innlegg').limitToLast(1).once('value', function (snapshot) {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnap) => {
                        let groupKeyObject = {};
                        groupKeyObject.key = childSnap.key;
                        groupKeyObject.path = childVal.key;
                        lastKeys.gruppeKeys.push(groupKeyObject);
                        //lastKeys.gruppeKeys.push(childSnap.key);
                    });
                }
            });
            let start = firebase.database().ref('Grupper/' + childVal.key + '/Innlegg').push().key;
            firebase.database().ref("Grupper/" + childVal.key + "/Innlegg").orderByKey().startAt(start).on('child_added', function (dataSnapshot) {
                leggUtInnlegg("egendefinert", childVal.key, dataSnapshot.child("Brukernavn").val(), dataSnapshot.child("Navn").val(), dataSnapshot.key, true);
            });
        });
    }

    if (snapshot.child('Grupper').val() != null) {
        snapshot.child('Grupper').forEach(function (childVal) {
            //Legger til key til siste innlegg fra hver gruppe som brukeren er medlem av
            firebase.database().ref('Grupper/' + childVal.key + '/Innlegg').limitToLast(1).once('value', function (snapshot) {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnap) => {
                        let groupKeyObject = {};
                        groupKeyObject.key = childSnap.key;
                        groupKeyObject.path = childVal.key;
                        lastKeys.gruppeKeys.push(groupKeyObject);
                        //lastKeys.gruppeKeys.push(childSnap.key);
                    });
                }
            });
            let start = firebase.database().ref('Grupper/' + childVal.key + "/Innlegg").push().key;
            firebase.database().ref("Grupper/" + childVal.key + "/Innlegg").orderByKey().startAt(start).on('child_added', function (dataSnapshot) {
                leggUtInnlegg("egendefinert", childVal.key, dataSnapshot.child("Brukernavn").val(), dataSnapshot.child("Navn").val(), dataSnapshot.key, true);
            });
        });
    }

});

firebase.database().ref('Bruker/' + whiz.Uid + '/Xbox').once('value', (snapshot) => {
    if (snapshot.exists()) {
        let start = firebase.database().ref('Xbox gruppe/Innlegg').push().key;
        firebase.database().ref('Xbox gruppe/Innlegg').orderByKey().startAt(start).on('child_added', function (dataSnapshot) {
            leggUtInnlegg("platform", "Xbox", dataSnapshot.child("Brukernavn").val(), dataSnapshot.child("Navn").val(), dataSnapshot.key, true);
        });
    }
});

firebase.database().ref('Bruker/' + whiz.Uid + '/Playstation').once('value', (snapshot) => {
    if (snapshot.exists()) {
        let start = firebase.database().ref('Playstation gruppe/Innlegg').push().key;
        firebase.database().ref('Playstation gruppe/Innlegg').orderByKey().startAt(start).on('child_added', function (dataSnapshot) {
            leggUtInnlegg("platform", "Playstation", dataSnapshot.child("Brukernavn").val(), dataSnapshot.child("Navn").val(), dataSnapshot.key, true);

        });
    }
});

firebase.database().ref('Bruker/' + whiz.Uid + '/Steam').once('value', (snapshot) => {
    if (snapshot.exists()) {
        let start = firebase.database().ref('Steam gruppe/Innlegg').push().key;
        firebase.database().ref('Steam gruppe/Innlegg').orderByKey().startAt(start).on('child_added', function (dataSnapshot) {
            leggUtInnlegg("platform", "Steam", dataSnapshot.child("Brukernavn").val(), dataSnapshot.child("Navn").val(), dataSnapshot.key, true);
        });
    }
});

firebase.database().ref('Bruker/' + whiz.Uid + '/Switch').once('value', (snapshot) => {
    if (snapshot.exists()) {
        let start = firebase.database().ref('Switch gruppe/Innlegg').push().key;
        firebase.database().ref('Switch gruppe/Innlegg').orderByKey().startAt(start).on('child_added', function (dataSnapshot) {
            leggUtInnlegg("platform", "Switch", dataSnapshot.child("Brukernavn").val(), dataSnapshot.child("Navn").val(), dataSnapshot.key, true);
        });
    }
})


// - - - - - - - - - - - - - - - - L E G G  U T  G A M L E  I N N L E G G - - - - - - - - - - - - - - - - //
setTimeout(() => {
    leggUtGammelt();
    klarForNy = true;
}, 1000);

let postBlockID;
function leggUtGammelt() {
    postBlockID = Date.now();
    $(document.getElementById("scrollPosts")).append(
        '<div class="col-lg-12" id="' + postBlockID + '"> </div>'
    );
    firebase.database().ref('Bruker/' + whiz.Uid).once('value', snapshot => {
        let dataSnapshot = snapshot.val();


        if (dataSnapshot.Xbox != null) {
            firebase.database().ref('Xbox gruppe/Innlegg/').orderByKey().endAt(lastKeys.Xbox).limitToLast(2).once('value', function (snapshot) {
                let innleggNr = 0;
                snapshot.forEach((childSnap) => {
                    //Legg til innlegg-keys i Bruker/tempFeed
                    firebase.database().ref('Bruker/' + whiz.Uid + '/TempFeed').child(childSnap.key).set({
                        "Gruppe": "Xbox gruppe"
                    });
                    innleggNr++;
                    //Setter "Siste nøkkel" til xbox, dvs den nøkkelen som tilhører det siste innlegget som skal hentes i neste omgang
                    if (innleggNr == 1) {
                        lastKeys.Xbox = childSnap.key.slice(0, -1);
                    }
                });
            });
        }
        if (dataSnapshot.Playstation != null) {
            firebase.database().ref('Playstation gruppe/Innlegg/').orderByKey().endAt(lastKeys.Playstation).limitToLast(2).once('value', function (snapshot) {
                let innleggNr = 0;
                snapshot.forEach((childSnap) => {
                    //Legg til innlegg-keys i Bruker/tempFeed
                    firebase.database().ref('Bruker/' + whiz.Uid + '/TempFeed').child(childSnap.key).set({
                        "Gruppe": "Playstation gruppe"
                    });
                    innleggNr++;
                    //Setter "Siste nøkkel" til playstation, dvs den nøkkelen som tilhører det siste innlegget som skal hentes i neste omgang
                    if (innleggNr == 1) {
                        lastKeys.Playstation = childSnap.key.slice(0, -1);
                    }
                });
            });
        }
        if (dataSnapshot.Steam != null) {
            firebase.database().ref('Steam gruppe/Innlegg/').orderByKey().endAt(lastKeys.Steam).limitToLast(2).once('value', function (snapshot) {
                let innleggNr = 0;
                snapshot.forEach((childSnap) => {
                    //Legg til innlegg-keys i Bruker/tempFeed
                    firebase.database().ref('Bruker/' + whiz.Uid + '/TempFeed').child(childSnap.key).set({
                        "Gruppe": "Steam gruppe"
                    });
                    innleggNr++;
                    //Setter "Siste nøkkel" til steam, dvs den nøkkelen som tilhører det siste innlegget som skal hentes i neste omgang
                    if (innleggNr == 1) {
                        lastKeys.Steam = childSnap.key.slice(0, -1);
                    }
                });
            });
        }
        if (dataSnapshot.Switch != null) {
            firebase.database().ref('Switch gruppe/Innlegg/').orderByKey().endAt(lastKeys.Switch).limitToLast(2).once('value', function (snapshot) {
                let innleggNr = 0;
                snapshot.forEach((childSnap) => {
                    //Legg til innlegg-keys i Bruker/tempFeed
                    firebase.database().ref('Bruker/' + whiz.Uid + '/TempFeed').child(childSnap.key).set({
                        "Gruppe": "Switch gruppe"
                    });
                    innleggNr++;
                    //Setter "Siste nøkkel" til switch, dvs den nøkkelen som tilhører det siste innlegget som skal hentes i neste omgang
                    if (innleggNr == 1) {
                        lastKeys.Switch = childSnap.key.slice(0, -1);
                    }
                });
            });
        }

        //Egendefinert gruppe
        for (let i in lastKeys.gruppeKeys) {
            console.log("barmen: " + lastKeys.gruppeKeys[i].path);
            firebase.database().ref('Grupper/' + lastKeys.gruppeKeys[i].path + '/Innlegg/').orderByKey().endAt(lastKeys.gruppeKeys[i].key).limitToLast(2).once('value', function (snapshot) {
                let innleggNr = 0;
                snapshot.forEach((childSnap) => {
                    firebase.database().ref('Bruker/' + whiz.Uid + '/TempFeed').child(childSnap.key).set({
                        "Gruppe": lastKeys.gruppeKeys[i].path
                    })
                    innleggNr++;
                    //Setter "Siste nøkkel" til egendefinert gruppe(r), dvs den nøkkelen som tilhører det siste innlegget som skal hentes i neste omgang
                    if (innleggNr == 1) {
                        lastKeys.gruppeKeys[i].key = childSnap.key.slice(0, -1);
                    }
                });
            });
        }

        //Bruker
        for (let i in lastKeys.userKeys) {
            firebase.database().ref('Bruker/' + lastKeys.userKeys[i].path + '/Innlegg/').orderByKey().endAt(lastKeys.userKeys[i].key).limitToLast(2).once('value', function (snapshot) {
                let innleggNr = 0;
                snapshot.forEach((childSnap) => {
                    firebase.database().ref('Bruker/' + whiz.Uid + '/TempFeed').child(childSnap.key).set({
                        "Gruppe": lastKeys.userKeys[i].path,
                        "FollowingInnlegg": "JA" //Legger til en ektra child slik at man kan skille mellom innlegg fra gruppe/bruker
                    })
                    innleggNr++;
                    //Setter "siste nøkkel" til bruker(e), dvs en nøkkelen som tilhører det siste innlegget som skal hentes i neste omgang
                    if (innleggNr == 1) {
                        lastKeys.userKeys[i].key = childSnap.key.slice(0, -1);
                    }
                });
            });
        }



    }).then(() => {
        //Tar litt tid før "TempFeed" er ferdig utfylt, venter derfor litt
        setTimeout(() => {
            firebase.database().ref('Bruker/' + whiz.Uid + '/TempFeed').once('value', function (snapshot) {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnap) => {
                        var childObject = childSnap.val();
                        console.log("Tempstack 2 " + ": " + childObject.Gruppe);
                        if (childObject.Gruppe == "Xbox gruppe" || childObject.Gruppe == "Playstation gruppe" ||
                            childObject.Gruppe == "Steam gruppe" || childObject.Gruppe == "Switch gruppe") {

                            firebase.database().ref(childObject.Gruppe + '/Innlegg/' + childSnap.key).once('value', function (snapshot) {
                                const gruppeType = childObject.Gruppe.split(' ');
                                leggUtInnlegg("platform", gruppeType[0], snapshot.child('Brukernavn').val(), snapshot.child('Navn').val(), snapshot.key, false, postBlockID);
                                //console.log(gruppeType[0] + " " + snapshot.child('Brukernavn').val() + " " + snapshot.child('Navn').val() + " " + snapshot.key);
                            });
                        } else if (childSnap.child('FollowingInnlegg').val() == "JA") {
                            firebase.database().ref('Bruker/' + childObject.Gruppe + '/Innlegg/' + childSnap.key).once('value', function (snapshot) {
                                leggUtInnlegg("bruker", childObject.Gruppe, snapshot.child('Brukernavn').val(), snapshot.child('Navn').val(), snapshot.key, false, postBlockID);
                            });

                        } else {
                            firebase.database().ref('Grupper/' + childObject.Gruppe + '/Innlegg/' + childSnap.key).once('value', function (snapshot) {
                                leggUtInnlegg("egendefinert", childObject.Gruppe, snapshot.child('Brukernavn').val(), snapshot.child('Navn').val(), snapshot.key, false, postBlockID);
                                //console.log(childObject.Gruppe + " " + snapshot.child('Brukernavn').val() + " " + snapshot.child('Navn').val() + " " + snapshot.key);
                            });
                        }

                    }); //Slutt på forEach-løkke
                }; //Slutt på if
            });
            setTimeout(() => {
                firebase.database().ref('Bruker/' + whiz.Uid + '/TempFeed').remove();
            }, 300);
        }, 500); //2000
    });
}






/* Funksjon for å "Legge ut" innlegg til front-end
Params
@sti: Et innparameter som sier noe om stien til innlegget. F.eks. Xbox, PS, Steam, Switch eller UID til en egendefinert gruppe
    Dersom det er en egendefinert gruppe, så er det Gruppen sin UID som blir passert inn
@brukernavn: Et innparameter som er brukernavnet som skal bli brukt til innlegget som prependes
@navn: Et innparameter som er det ekte navnet til brukeren, som skal bli brukt til innlegget som prependes
@innleggUID: Et innparameter som er UID til innlegget som skal prependes
@type: Et innparameter som sier noe om hvor innlegget kommer fra: platform || egendefinert gruppe || bruker

*/


//Trenger parameter: Brukernavn, navn, evt bilde?
function leggUtInnlegg(type, sti, brukernavn, navn, innleggUID, ny, blockID) {
    //Et innlegg har mange forskjellige ID'er så jeg oppretter et objekt som inneholder alle de forskjellige IDene
    let IDs = {};
    let owner;
    let title;
    let description;
    let time;
    let gruppenavn = "";

    var prependText;

    //Sjekker om det er et plattform innlegg eller fra en gruppe, henter og lager ID'er
    if (type == "platform") { //sti == "Xbox" || sti == "Playstation" || sti == "Steam" || sti == "Switch"
        firebase.database().ref(sti + " gruppe/Innlegg/" + innleggUID).once('value', (snapshot) => {
            IDs.picID = "picture" + snapshot.child("ID").val();
            IDs.ppID = "profilep" + snapshot.child("ID").val();
            IDs.deleteID = "delete" + snapshot.child("ID").val();
            IDs.reportID = "report" + snapshot.child("ID").val();
            IDs.commentID = "comment" + snapshot.child("ID").val();
            IDs.commentFieldID = "commentfield" + snapshot.child("ID").val();
            IDs.commentPostID = "commentpost" + snapshot.child("ID").val();
            IDs.commentBoxID = "commentbox" + snapshot.child("ID").val();
            IDs.commentViewBtnID = "commentviewbtn" + snapshot.child("ID").val();
            IDs.commentSectionID = "commentsection" + snapshot.child("ID").val();
            owner = snapshot.child("Eier").val();
            title = snapshot.child("Tittel").val();
            description = snapshot.child("Beskrivelse").val();
            time = snapshot.child("Tidspunkt").val();
        });
    } else if (type == "egendefinert") {
        firebase.database().ref("Grupper/" + sti + "/Innlegg/" + innleggUID).once('value', (snapshot) => {
            IDs.picID = "picture" + snapshot.child("ID").val();
            IDs.ppID = "profilep" + snapshot.child("ID").val();
            IDs.deleteID = "delete" + snapshot.child("ID").val();
            IDs.reportID = "report" + snapshot.child("ID").val();
            IDs.commentID = "comment" + snapshot.child("ID").val();
            IDs.commentFieldID = "commentfield" + snapshot.child("ID").val();
            IDs.commentPostID = "commentpost" + snapshot.child("ID").val();
            IDs.commentBoxID = "commentbox" + snapshot.child("ID").val();
            IDs.commentViewBtnID = "commentviewbtn" + snapshot.child("ID").val();
            IDs.commentSectionID = "commentsection" + snapshot.child("ID").val();
            owner = snapshot.child("Eier").val();
            title = snapshot.child("Tittel").val();
            description = snapshot.child("Beskrivelse").val();
            time = snapshot.child("Tidspunkt").val();
        });
        firebase.database().ref("Grupper/" + sti).once('value', (snap) => {
            gruppenavn = " -> " + snap.child('Navn').val();
        });
    } else if (type == "bruker") {
        firebase.database().ref("Bruker/" + sti + "/Innlegg/" + innleggUID).once('value', (snapshot) => {
            IDs.picID = "picture" + snapshot.child("ID").val();
            IDs.ppID = "profilep" + snapshot.child("ID").val();
            IDs.deleteID = "delete" + snapshot.child("ID").val();
            IDs.reportID = "report" + snapshot.child("ID").val();
            IDs.commentID = "comment" + snapshot.child("ID").val();
            IDs.commentFieldID = "commentfield" + snapshot.child("ID").val();
            IDs.commentPostID = "commentpost" + snapshot.child("ID").val();
            IDs.commentBoxID = "commentbox" + snapshot.child("ID").val();
            IDs.commentViewBtnID = "commentviewbtn" + snapshot.child("ID").val();
            IDs.commentSectionID = "commentsection" + snapshot.child("ID").val();
            owner = snapshot.child("Eier").val();
            title = snapshot.child("Tittel").val();
            description = snapshot.child("Beskrivelse").val();
            time = snapshot.child("Tidspunkt").val();
        });
    }

    setTimeout(() => {
        switch (sti) {
            case "Xbox":
                //Legg til Xbox-header i variabelen "prependText"
                prependText =
                    '<div class="card gedf-card mx-auto mb-5" style="background: #111;">' +
                    //Innlegg header
                    '<div class="card-header bg-success">' +
                    '<div class="d-flex justify-content-between align-items-center">' +
                    '<div class="mr-2">' +
                    /*----- Profilbilde -----*/
                    '<img class="rounded-circle m-3" style="object-fit: cover;" width="50" height="50" id="' + IDs.ppID + '" src=""> </div> ' +
                    '<div class= "ml-2">' +
                    '<div class="h5 m-0 text-light">' + brukernavn + '</div>' +
                    '<div class="h7 text-light">' + navn + '</div> </div>' +
                    '<div class="dropdown ms-auto">' +
                    '<button class="btn dropdown-toggle text-light" type="button"' +
                    'id="dropdownMenu2"' +
                    'data-bs-toggle="dropdown" aria-expanded="false"></button >' +
                    '<ul class="dropdown-menu bg-dark" aria-labelledby="dropdownMenu2">' +
                    /*----- Slett innlegg knapp -----*/
                    '<li><button class="dropdown-item text-light bg-dark" type="button" id="' + IDs.deleteID + owner + '">Slett innlegg <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
                    '<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /> </svg></button></li>' +
                    /*----- Rapporter innlegg knapp -----*/
                    '<li><button class="dropdown-item bg-dark text-light" type="button" id="' + IDs.reportID + owner + '" > Rapporter innlegg <svg xmlns = "http://www.w3.org/2000/svg" width = "16" height = "16" fill = "currentColor" class= "bi bi-flag-fill" viewBox = "0 0 16 16" >' +
                    '<path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />' +
                    '</svg ></button ></li> </ul></div ></div></div>';
                break;
            case "Playstation":
                //Legg til Playstation-header i variabelen "prependText"
                prependText =
                    '<div class="card gedf-card mx-auto mb-5" style="background: #111;">' +
                    //Innlegg header
                    '<div class="card-header bg-primary">' +
                    '<div class="d-flex justify-content-between align-items-center">' +
                    '<div class="mr-2">' +
                    /*----- Profilbilde -----*/
                    '<img class="rounded-circle m-3" style="object-fit: cover;" width="50" height="50" id="' + IDs.ppID + '" src=""> </div> ' +
                    '<div class= "ml-2">' +
                    '<div class="h5 m-0 text-light">' + brukernavn + '</div>' +
                    '<div class="h7 text-light">' + navn + '</div> </div>' +
                    '<div class="dropdown ms-auto">' +
                    '<button class="btn dropdown-toggle text-light" type="button"' +
                    'id="dropdownMenu2"' +
                    'data-bs-toggle="dropdown" aria-expanded="false"></button >' +
                    '<ul class="dropdown-menu bg-dark" aria-labelledby="dropdownMenu2">' +
                    /*----- Slett innlegg knapp -----*/
                    '<li><button class="dropdown-item text-light bg-dark" type="button" id="' + IDs.deleteID + owner + '">Slett innlegg <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
                    '<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /> </svg></button></li>' +
                    /*----- Rapporter innlegg knapp -----*/
                    '<li><button class="dropdown-item bg-dark text-light" type="button" id="' + IDs.reportID + owner + '" > Rapporter innlegg <svg xmlns = "http://www.w3.org/2000/svg" width = "16" height = "16" fill = "currentColor" class= "bi bi-flag-fill" viewBox = "0 0 16 16" >' +
                    '<path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />' +
                    '</svg ></button ></li> </ul></div ></div></div>';
                break;
            case "Steam":
                //Legg til Steam-header i variabelen "prependText"
                prependText =
                    '<div class="card gedf-card mx-auto mb-5" style="background: #111;">' +
                    //Innlegg header
                    '<div class="card-header" style="background-color:#1b2838;">' +
                    '<div class="d-flex justify-content-between align-items-center">' +
                    '<div class="mr-2">' +
                    /*----- Profilbilde -----*/
                    '<img class="rounded-circle m-3" style="object-fit: cover;" width="50" height="50" id="' + IDs.ppID + '" src=""> </div> ' +
                    '<div class= "ml-2">' +
                    '<div class="h5 m-0 text-light">' + brukernavn + '</div>' +
                    '<div class="h7 text-light">' + navn + '</div> </div>' +
                    '<div class="dropdown ms-auto">' +
                    '<button class="btn dropdown-toggle text-light" type="button"' +
                    'id="dropdownMenu2"' +
                    'data-bs-toggle="dropdown" aria-expanded="false"></button >' +
                    '<ul class="dropdown-menu bg-dark" aria-labelledby="dropdownMenu2">' +
                    /*----- Slett innlegg knapp -----*/
                    '<li><button class="dropdown-item text-light bg-dark" type="button" id="' + IDs.deleteID + owner + '">Slett innlegg <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
                    '<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /> </svg></button></li>' +
                    /*----- Rapporter innlegg knapp -----*/
                    '<li><button class="dropdown-item bg-dark text-light" type="button" id="' + IDs.reportID + owner + '" > Rapporter innlegg <svg xmlns = "http://www.w3.org/2000/svg" width = "16" height = "16" fill = "currentColor" class= "bi bi-flag-fill" viewBox = "0 0 16 16" >' +
                    '<path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />' +
                    '</svg ></button ></li> </ul></div ></div></div>';
                break;
            case "Switch":
                //Legg til Switch-header i variabelen "prependText"
                prependText =
                    '<div class="card gedf-card mx-auto mb-5" style="background: #111;">' +
                    //Innlegg header
                    '<div class="card-header bg-danger">' +
                    '<div class="d-flex justify-content-between align-items-center">' +
                    '<div class="mr-2">' +
                    /*----- Profilbilde -----*/
                    '<img class="rounded-circle m-3" style="object-fit: cover;" width="50" height="50" id="' + IDs.ppID + '" src=""> </div> ' +
                    '<div class= "ml-2">' +
                    '<div class="h5 m-0 text-light">' + brukernavn + '</div>' +
                    '<div class="h7 text-light">' + navn + '</div> </div>' +
                    '<div class="dropdown ms-auto">' +
                    '<button class="btn dropdown-toggle text-light" type="button"' +
                    'id="dropdownMenu2"' +
                    'data-bs-toggle="dropdown" aria-expanded="false"></button >' +
                    '<ul class="dropdown-menu bg-dark" aria-labelledby="dropdownMenu2">' +
                    /*----- Slett innlegg knapp -----*/
                    '<li><button class="dropdown-item text-light bg-dark" type="button" id="' + IDs.deleteID + owner + '">Slett innlegg <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
                    '<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /> </svg></button></li>' +
                    /*----- Rapporter innlegg knapp -----*/
                    '<li><button class="dropdown-item bg-dark text-light" type="button" id="' + IDs.reportID + owner + '" > Rapporter innlegg <svg xmlns = "http://www.w3.org/2000/svg" width = "16" height = "16" fill = "currentColor" class= "bi bi-flag-fill" viewBox = "0 0 16 16" >' +
                    '<path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />' +
                    '</svg ></button ></li> </ul></div ></div></div>';
                break;
            default:
                //Legg til Egendefinert-header i variabelen "prependText"
                prependText =
                    '<div class="card gedf-card mx-auto mb-5" style="background: #111;">' +
                    //Innlegg header
                    '<div class="card-header" style="background: #111;">' +
                    '<div class="d-flex justify-content-between align-items-center">' +
                    '<div class="mr-2">' +
                    /*----- Profilbilde -----*/
                    '<img class="rounded-circle m-3" style="object-fit: cover;" width="50" height="50" id="' + IDs.ppID + '" src=""> </div> ' +
                    '<div class= "ml-2">' +
                    '<div class="h5 m-0 text-light">' + brukernavn+gruppenavn + '</div>' +
                    '<div class="h7 text-light">' + navn + '</div> </div>' +
                    '<div class="dropdown ms-auto">' +
                    '<button class="btn dropdown-toggle text-light" type="button"' +
                    'style="background: #111;" id="dropdownMenu2"' +
                    'data-bs-toggle="dropdown" aria-expanded="false"></button >' +
                    '<ul class="dropdown-menu bg-dark" aria-labelledby="dropdownMenu2">' +
                    /*----- Slett innlegg knapp -----*/
                    '<li><button class="dropdown-item text-light bg-dark" type="button" id="' + IDs.deleteID + owner + '">Slett innlegg <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
                    '<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /> </svg></button></li>' +
                    /*----- Rapporter innlegg knapp -----*/
                    '<li><button class="dropdown-item bg-dark text-light" type="button" id="' + IDs.reportID + owner + '" > Rapporter innlegg <svg xmlns = "http://www.w3.org/2000/svg" width = "16" height = "16" fill = "currentColor" class= "bi bi-flag-fill" viewBox = "0 0 16 16" >' +
                    '<path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />' +
                    '</svg ></button ></li> </ul></div ></div></div>';
                break;

        }


        prependText +=
            //Innlegg body
            '<div class="card-body text-light" style="background: #111;">' +
            '<div class="text-muted h7 mb-2">' +
            '<i class="fa fa-clock-o"></i> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16"> <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" /> <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" /> </svg>' +
            ' ' + time + '</div>' +
            /*----- Innlegs tittel -----*/
            '<h5 class="card-title text-light">' + title + '</h5>' +
            '<p class="card-text">' +
            /*----- Innlegs beskrivelse -----*/
            ' ' + description + '</p>' +
            //Innleggsbilde
            '<img class="card-img m-0" style="height: 350px; object-fit: cover;" src="" alt="ingen bilde" id="' + IDs.picID + owner + '">' +
            '<div class="container d-flex">' +
            /*----- Se kommentarer -----*/
            '<button class="link-secondary ms-auto btn-sm" id="' + IDs.commentViewBtnID + owner + '">Ingen kommentarer</button>' +
            '</div>' +
            //Innlegg footer
            '<div class="card-footer d-flex" style="background: #111;">' +
            '<button type="button" class="btn-dark w-50 mx-auto"' +
            'style="background: #111;" id="' + IDs.commentID + owner + '">Kommenter ' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"' +
            'fill="currentColor" class="bi bi-chat-square-text-fill"' +
            'viewBox="0 0 16 16">' +
            '<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" /> ' +
            '</svg>' +
            '</button>' +
            '<button type="button" class="btn-dark w-50 mx-auto" onclick="startSamtale(\'' + owner + '\')"' +
            'style="background: #111;">Send melding ' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"' +
            'fill="currentColor" class="bi bi-chat-fill" viewBox="0 0 16 16">' +
            '<path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z" />' +
            '</svg>' +
            '</button>' +
            '</div>' +
            /*----- Kommentarfelt -----*/
            '<hr> <div class="input-group mb-3" id = "' + IDs.commentBoxID + owner + '"> </div>' +
            '<div class="list-group w-100 mx-auto border-dark" id="' + IDs.commentSectionID + owner + '"> </div>' +
            '</div>' +
            '</div>';


        if (ny) {
            $(document.getElementById('firstPosts')).prepend(prependText);
        } else if (!ny) {
            //Når det skal hentes flere "gamle" innlegg, så oppretter vi en ny div hvor innleggene som hentes skal ligge
            //Boksen blir appendet, slik av den havner UNDER forrige boks med innlegg, og inni boksen blir hver innlegg
            //prependet slik at nyere innlegg kommer øverst i boksen. 


            /*$(document.getElementById('scrollPosts')).append(
                '<div class="col-lg-12 bg-danger" id="' + blockID + '"> </div>'
            );*/
            $(document.getElementById(blockID)).prepend(prependText);
            //$(document.getElementById('scrollPosts')).prepend(prependText);
        }
        //Setter profilbilde til innlegget
        firebase.storage().ref("user/" + owner + "/profile.jpg").getDownloadURL().then((profilbilde) => {
            document.getElementById(IDs.ppID).src = profilbilde;
        }).catch(() => {
            document.getElementById(IDs.ppID).src = "img/blank-profile-circle.png";
        });

        //Setter bilde til innlegget (Dersom det finnes et bilde)
        firebase.storage().ref("innlegg/" + owner + IDs.picID + "/innlegg.jpg").getDownloadURL().then((innleggBilde) => {
            document.getElementById(IDs.picID + owner).src = innleggBilde;
        }).catch((error) => {
            console.log(error.message);
            document.getElementById(IDs.picID + owner).style.display = "none";
        });

        //Setter riktig referansepunkter til databasen, forskjellig "sti" mellom egendefinerte grupper og "plattformer"
        let cmtRef;
        let reportRef;
        let deleteRef;
        let reportCmtRef;
        if (type == "platform") {
            cmtRef = firebase.database().ref(sti + " gruppe/Innlegg/" + innleggUID + "/Kommentarer");
            reportRef = firebase.database().ref(sti + " gruppe/Rapporterte Innlegg");
            deleteRef = firebase.database().ref(sti + " gruppe/Innlegg/" + innleggUID);
            reportCmtRef = firebase.database().ref(sti + " gruppe/Rapporterte kommentarer");
        } else if (type == "egendefinert") {
            cmtRef = firebase.database().ref("Grupper/" + sti + "/Innlegg/" + innleggUID + "/Kommentarer");
            reportRef = firebase.database().ref("Grupper/" + sti + "/Rapporterte Innlegg");
            deleteRef = firebase.database().ref("Grupper/" + sti + "/Innlegg" + innleggUID);
            reportCmtRef = firebase.database().ref("Grupper/" + sti + "/Rapporterte kommentarer");
        } else if (type == "bruker") {
            cmtRef = firebase.database().ref("Bruker/" + sti + "/Innlegg/" + innleggUID + "/Kommentarer");
            reportRef = firebase.database().ref("Rapportert/Rapporterte Innlegg/" + sti); //skal rapporterte innlegg havne hos brukeren, eller i en egen tabell?
            deleteRef = firebase.database().ref("Bruker/" + sti + "/Innlegg/" + innleggUID);
            reportCmtRef = firebase.database().ref("Rapportert/Rapporterte kommentarer/" + sti); //Samme problemstilling som over
        }

        //Viser antall kommentarer et innlegg har
        let commentsCounter = 0;
        cmtRef.on('child_added', function (snapshot) {
            commentsCounter++;
            document.getElementById(IDs.commentViewBtnID + owner).innerHTML = commentsCounter + " Kommentarer";
        });

        if (owner == user) {
            document.getElementById(IDs.reportID + owner).style.display = "none";
        } else {
            document.getElementById(IDs.deleteID + owner).style.display = "none";
        }

        //Rapporter et innlegg
        document.getElementById(IDs.reportID + owner).onclick = function () {
            reportRef.push({
                Eier: owner,
                Rapporterer: user,
                InnleggsID: innleggUID
            });
            alert("Innlegget til " + brukernavn + " er rapportert");
        }

        //Slett et innlegg
        document.getElementById(IDs.deleteID + owner).onclick = function () {
            deleteRef.remove();
            firebase.storage().ref("innlegg/" + (owner + picid) + "/innlegg.jpg").delete();
            alert("Innlegget ditt er nå slettet");
            location.reload();
        }

        //Legg ut kommentar, input-felt og knapp appendes til innlegget
        document.getElementById(IDs.commentID + owner).onclick = function () {
            this.disabled = true;
            var cmtBox = document.getElementById(IDs.commentBoxID + owner);
            $(cmtBox).append(
                '<input type="text" class="form-control border-dark text-light" placeholder="Skriv en kommentar... "' +
                'aria-label="Recipients username" aria-describedby="button-addon2" style="background-color:rgb(60, 64, 67, 0.90)" ' +
                'id="' + IDs.commentFieldID + owner + '"> <button class="btn btn-primary" type="button" id="' + IDs.commentPostID + owner + '">Publiser</button>'
            ).ready(function () {
                var dateTimeCmt = new Date().toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                });
                dateTimeCmt = dateTimeCmt.split('/').join('.');
                document.getElementById(IDs.commentPostID + owner).onclick = function () {
                    var commentInput = document.getElementById(IDs.commentFieldID + owner);
                    var comment = commentInput.value;
                    if (comment.trim() != "") {
                        cmtRef.push({
                            Bruker: user,
                            Kommentar: comment,
                            Tidspunkt: dateTimeCmt,
                            Brukernavn: whiz.Brukernavn
                        });
                    }
                    commentInput.value = null;
                }
            })
        }

        //Se kommentarfelt
        document.getElementById(IDs.commentViewBtnID + owner).onclick = function () {
            this.disabled = true;
            var cmtSection = document.getElementById(IDs.commentSectionID + owner);
            //Sjekker "kommentarer" tabellen for kommentarer
            cmtRef.on('child_added', function (snapshot) {
                var dataSnapshot = snapshot.val();
                let deleteCommentID = snapshot.key + "delete";
                let reportCommentID = snapshot.key + "report";
                let ppID = snapshot.key + "profilep";

                $(cmtSection).prepend(
                    '<a class="list-group-item text-light border-dark mb-0 rounded-3" style="background: #111;"> <div class = "w-100 d-flex"> <img class = "rounded-circle m-1" width="35" height="35"' +
                    'src="" id="' + ppID + '" style="object-fit: cover;"> <strong class = "my-auto mx-1">' + dataSnapshot.Brukernavn + '</strong>' +
                    '<div class="dropdown ms-auto my-auto"> <text class="text-muted">' + dataSnapshot.Tidspunkt + ' </text> <button class="btn dropdown-toggle text-light" type="button" style="background: #111;" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false"></button>' +
                    '<ul class="dropdown-menu bg-dark ms-auto" aria-labelledby="dropdownMenu2"> <li><button class="dropdown-item text-light bg-dark"' +
                    'type="button" id="' + deleteCommentID + dataSnapshot.Bruker + '">Slett kommentar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
                    '<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /></svg></button></li>' +
                    '<li><button class="dropdown-item bg-dark text-light" type="button" id="' + reportCommentID + dataSnapshot.Bruker + '">Rapporter kommentar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"' +
                    'class="bi bi-flag-fill" viewBox="0 0 16 16"> <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" /></svg></button>' +
                    '</li></ul></div></div>' +
                    '<text style="padding-left: 50px;">' + dataSnapshot.Kommentar + '</text></a>'
                )

                //Henting av (eventuelt)profilbilde til brukeren som eier kommentaren
                firebase.storage().ref("user/" + dataSnapshot.Bruker + "/profile.jpg").getDownloadURL().then((pictureURL) => {
                    document.getElementById(ppID).src = pictureURL;
                }).catch((error) => {
                    document.getElementById(ppID).src = "img/blank-profile-circle.png";
                    console.log(error.message);
                }).then(() => {
                    //Viser "slett kommentar"-knapp dersom kommentaren er din, ellers vises "rapporter kommentar"-knapp
                    if (dataSnapshot.Bruker == user) {
                        document.getElementById(reportCommentID + dataSnapshot.Bruker).style.display = "none";
                    } else {
                        document.getElementById(deleteCommentID + dataSnapshot.Bruker).style.display = "none";
                    }

                    //Funksjon for å slette kommentar
                    document.getElementById(deleteCommentID + dataSnapshot.Bruker).onclick = function () {
                        if (dataSnapshot.Bruker == user) {
                            cmtRef.child(snapshot.key).remove();
                            alert("Kommentaren din er slettet");
                            location.reload();
                        }
                    }

                    //Funksjon for å rapportere kommentar
                    document.getElementById(reportCommentID + dataSnapshot.Bruker).onclick = function () {
                        reportCmtRef.push({
                            Eier: dataSnapshot.Bruker,
                            Rapporterer: user,
                            KommentarID: snapshot.key,
                            InnleggsID: innleggUID
                        });
                        alert("Kommentaren til: " + dataSnapshot.Brukernavn + " er rapportert");
                    }
                })

            });
        }



    }, 500);
}

var fil = {};
document.getElementById('chooseHomePic').onchange = function (e) {
    fil = e.target.files[0];
    let fileType = fil["type"];
    if (fileType != "image/jpeg" && fileType != "image/png") {
        alert("Filen du valgte støttes ikke, velg et bilde med filtype .jpeg eller .png")
    }
}

document.getElementById('uploadHome').onclick = function () {
    let innlegg = {};
    innlegg.Tittel = document.getElementById('titleHome').value;
    innlegg.Beskrivelse = document.getElementById('descriptionHome').value;
    innlegg.Eier = whiz.Uid;
    innlegg.Brukernavn = whiz.Brukernavn;
    innlegg.Navn = whiz.Navn;
    innlegg.Id = Date.now();

    var datetime = new Date().toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
    innlegg.Tidspunkt = datetime.split('/').join('.');

    if (innlegg.Tittel.trim() != "") {
        let pushKey = firebase.database().ref('Bruker/' + whiz.Uid + '/Innlegg').push().key;
        firebase.database().ref('Bruker/' + whiz.Uid + '/Innlegg').child(pushKey).set({
            "Tittel": innlegg.Tittel,
            "Beskrivelse": innlegg.Beskrivelse,
            "Eier": innlegg.Eier,
            "Brukernavn": innlegg.Brukernavn,
            "Navn": innlegg.Navn,
            "ID": innlegg.Id,
            "Tidspunkt": innlegg.Tidspunkt
        }).then(() => {
            let fileType = fil["type"];
            if (fil instanceof File) {
                if (fileType == "image/jpeg" || fileType == "image/png") {
                    firebase.storage().ref('innlegg/' + (whiz.Uid + 'picture' + innlegg.ID) + '/innlegg.jpg').put(fil).then(() => {
                        //document.getElementById('chooseHomePic').value = "";
                    });
                }
            }
            //Legger til innlegget i firebase, under "Mine innlegg" hos brukeren
            firebase.database().ref('Bruker/' + whiz.Uid + '/Mine innlegg').child(pushKey).set({
                "Path": "Bruker"
            });
            alert("Innlegg lagt ut!");
        });
    } else {
        alert("Innlegget må ha en tittel");
    }

};



//Sjekker om du når bunn av siden, JA -> Legg ut flere innlegg fra firebase realtime til front-end til brukeren

//Denne funker, men den fyrer noen ganger av to ganger på rappen -> fører til at vi får "duplicate" innlegg 
window.onscroll = function (ev) {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        //Legg ut flere innlegg
        if (klarForNy) {
            klarForNy = false;
            leggUtGammelt();
            setTimeout(() => {
                klarForNy = true;
            }, 2500);
        } else (
            console.log("IKKE KLAR ENDA")
        )

    }
};