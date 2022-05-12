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
                    /*----- Xbox emblem -----*/
                    '<svg xmlns="http://www.w3.org/2000/svg"' +
                    'width="40" height="40" fill="currentColor" class="bi bi-xbox"' +
                    'viewBox="0 0 16 16">' +
                    '<path fill-rule="evenodd"' +
                    'd="M7.202 15.967a7.987 7.987 0 0 1-3.552-1.26c-.898-.585-1.101-.826-1.101-1.306 0-.965 1.062-2.656 2.879-4.583C6.459 7.723 7.897 6.44 8.052 6.475c.302.068 2.718 2.423 3.622 3.531 1.43 1.753 2.088 3.189 1.754 3.829-.254.486-1.83 1.437-2.987 1.802-.954.301-2.207.429-3.239.33Zm-5.866-3.57C.589 11.253.212 10.127.03 8.497c-.06-.539-.038-.846.137-1.95.218-1.377 1.002-2.97 1.945-3.95.401-.417.437-.427.926-.263.595.2 1.23.638 2.213 1.528l.574.519-.313.385C4.056 6.553 2.52 9.086 1.94 10.653c-.315.852-.442 1.707-.306 2.063.091.24.007.15-.3-.319Zm13.101.195c.074-.36-.019-1.02-.238-1.687-.473-1.443-2.055-4.128-3.508-5.953l-.457-.575.494-.454c.646-.593 1.095-.948 1.58-1.25.381-.237.927-.448 1.161-.448.145 0 .654.528 1.065 1.104a8.372 8.372 0 0 1 1.343 3.102c.153.728.166 2.286.024 3.012a9.495 9.495 0 0 1-.6 1.893c-.179.393-.624 1.156-.82 1.404-.1.128-.1.127-.043-.148ZM7.335 1.952c-.67-.34-1.704-.705-2.276-.803a4.171 4.171 0 0 0-.759-.043c-.471.024-.45 0 .306-.358A7.778 7.778 0 0 1 6.47.128c.8-.169 2.306-.17 3.094-.005.85.18 1.853.552 2.418.9l.168.103-.385-.02c-.766-.038-1.88.27-3.078.853-.361.176-.676.316-.699.312a12.246 12.246 0 0 1-.654-.319Z" />' +
                    '</svg>' +
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
                    /*----- PS Emblem -----*/
                    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"' +
                    'class="bi bi-playstation" viewBox="0 0 16 16">' +
                    '<path d="M15.858 11.451c-.313.395-1.079.676-1.079.676l-5.696 2.046v-1.509l4.192-1.493c.476-.17.549-.412.162-.538-.386-.127-1.085-.09-1.56.08l-2.794.984v-1.566l.161-.054s.807-.286 1.942-.412c1.135-.125 2.525.017 3.616.43 1.23.39 1.368.962 1.056 1.356ZM9.625 8.883v-3.86c0-.453-.083-.87-.508-.988-.326-.105-.528.198-.528.65v9.664l-2.606-.827V2c1.108.206 2.722.692 3.59.985 2.207.757 2.955 1.7 2.955 3.825 0 2.071-1.278 2.856-2.903 2.072Zm-8.424 3.625C-.061 12.15-.271 11.41.304 10.984c.532-.394 1.436-.69 1.436-.69l3.737-1.33v1.515l-2.69.963c-.474.17-.547.411-.161.538.386.126 1.085.09 1.56-.08l1.29-.469v1.356l-.257.043a8.454 8.454 0 0 1-4.018-.323Z" />' +
                    '</svg>' +
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
                    '</svg ></button ></li> </ul></div>' +
                    '<div class="text-light">' +
                '</div></div></div>'
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
                    /*----- Steam emblem -----*/
                    '<svg xmlns="http://www.w3.org/2000/svg"' +
                    'width="40" height="40" fill="currentColor" class="bi bi-steam"' +
                    'viewBox="0 0 16 16">' +
                    '<path d="M.329 10.333A8.01 8.01 0 0 0 7.99 16C12.414 16 16 12.418 16 8s-3.586-8-8.009-8A8.006 8.006 0 0 0 0 7.468l.003.006 4.304 1.769A2.198 2.198 0 0 1 5.62 8.88l1.96-2.844-.001-.04a3.046 3.046 0 0 1 3.042-3.043 3.046 3.046 0 0 1 3.042 3.043 3.047 3.047 0 0 1-3.111 3.044l-2.804 2a2.223 2.223 0 0 1-3.075 2.11 2.217 2.217 0 0 1-1.312-1.568L.33 10.333Z" />' +
					'<path d="M4.868 12.683a1.715 1.715 0 0 0 1.318-3.165 1.705 1.705 0 0 0-1.263-.02l1.023.424a1.261 1.261 0 1 1-.97 2.33l-.99-.41a1.7 1.7 0 0 0 .882.84Zm3.726-6.687a2.03 2.03 0 0 0 2.027 2.029 2.03 2.03 0 0 0 2.027-2.029 2.03 2.03 0 0 0-2.027-2.027 2.03 2.03 0 0 0-2.027 2.027Zm2.03-1.527a1.524 1.524 0 1 1-.002 3.048 1.524 1.524 0 0 1 .002-3.048Z" />' +
                    '</svg>' +
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
                     /*----- Switch emblem -----*/
                     '<svg xmlns="http://www.w3.org/2000/svg"' +
                     'width="40" height="40" fill="currentColor" class="bi bi-nintendo-switch"' +
                     'viewBox="0 0 16 16">' +
                     '<path d="M9.34 8.005c0-4.38.01-7.972.023-7.982C9.373.01 10.036 0 10.831 0c1.153 0 1.51.01 1.743.05 1.73.298 3.045 1.6 3.373 3.326.046.242.053.809.053 4.61 0 4.06.005 4.537-.123 4.976-.022.076-.048.15-.08.242a4.136 4.136 0 0 1-3.426 2.767c-.317.033-2.889.046-2.978.013-.05-.02-.053-.752-.053-7.979Zm4.675.269a1.621 1.621 0 0 0-1.113-1.034 1.609 1.609 0 0 0-1.938 1.073 1.9 1.9 0 0 0-.014.935 1.632 1.632 0 0 0 1.952 1.107c.51-.136.908-.504 1.11-1.028.11-.285.113-.742.003-1.053ZM3.71 3.317c-.208.04-.526.199-.695.348-.348.301-.52.729-.494 1.232.013.262.03.332.136.544.155.321.39.556.712.715.222.11.278.123.567.133.261.01.354 0 .53-.06.719-.242 1.153-.94 1.03-1.656-.142-.852-.95-1.422-1.786-1.256Z"/>' +
                     '<path d="M3.425.053a4.136 4.136 0 0 0-3.28 3.015C0 3.628-.01 3.956.005 8.3c.01 3.99.014 4.082.08 4.39.368 1.66 1.548 2.844 3.224 3.235.22.05.497.06 2.29.07 1.856.012 2.048.009 2.097-.04.05-.05.053-.69.053-7.94 0-5.374-.01-7.906-.033-7.952-.033-.06-.09-.063-2.03-.06-1.578.004-2.052.014-2.26.05Zm3 14.665-1.35-.016c-1.242-.013-1.375-.02-1.623-.083a2.81 2.81 0 0 1-2.08-2.167c-.074-.335-.074-8.579-.004-8.907a2.845 2.845 0 0 1 1.716-2.05c.438-.176.64-.196 2.058-.2l1.282-.003v13.426Z"/>' +
                     '</svg>' +
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