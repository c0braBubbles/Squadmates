var gammeltPassordInput = document.getElementById('inputPasswordOld');
var nyttPassordInput = document.getElementById('inputPasswordNew');
var gjentaNyttPassordInput = document.getElementById('inputPasswordNewVerify');
var passordBekreftSlettInput = document.getElementById('inputPasswordNewVerifySlett');

var endrePassordKnapp = document.getElementById('confirmNewPassword');
var slettBrukerKnapp = document.getElementById('deleteUserBtn');
var bekreftSlett = document.getElementById('confirmDeleteUser');

function reautentiser(oldPassword) {
    var user = firebase.auth().currentUser;
    return firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
}

endrePassordKnapp.onclick = function () {
    var user = firebase.auth().currentUser;
    var p_gammelt = gammeltPassordInput.value;
    var p_nytt = nyttPassordInput.value;
    var p_gjentaNytt = gjentaNyttPassordInput.value;

    var credential = reautentiser(p_gammelt);
    user.reauthenticateWithCredential(credential).then(() => {
        //Reautentisert
        let state = checkPassword(p_nytt); 

        if (state === true && p_nytt === p_gjentaNytt) {
            user.updatePassword(p_nytt).then(() => {
                window.alert("Passord byttet");
                gammeltPassordInput.value = "";
                nyttPassordInput.value = "";
                gjentaNyttPassordInput.value = "";
                window.location.reload();
            }).catch((error) => {
                window.alert(error.message);
            });
        } else {
            window.alert("Nytt passord fyller ikke kravene, eller passordfeltene samsvarer ikke");
        }
    }).catch((error) => {
        //En error skjedde, feil passord?
        window.alert(error.message);
    });
}


function checkPassword(passInp) {
    let lowerCaseLetters = /[a-z]/g;
    let upperCaseLetters = /[A-Z]/g; 
    let numbers = /[0-9]/g; 

    if(
        passInp.match(lowerCaseLetters) &&
        passInp.match(upperCaseLetters) &&
        passInp.match(numbers) && 
        passInp.length >= 8
    ) {
        return true; 
    } else {
        return false;
    }
}


/* Metoden sletter brukeren
    1. Sjekker om riktig passord er skrevet inn: JA -> fortsett til punkt 2. NEI -> 
    2. Hent info om hvilke grupper brukeren eier -> Slett disse gruppen
    3. Deretter: Hent info om hvilke grupper brukeren er medlem av -> Slett brukeren som medlem
    4. Deretter: Slett resterende bruker-info - Realtime database
        5. Slett brukerens profilbilde, dersom en har det - Storage
        6. Deretter: Slett brukeren sin login-info - Authentication 
*/
bekreftSlett.onclick = function () {
    var user = firebase.auth().currentUser;
    const whiz = JSON.parse(sessionStorage.getItem("bruker"));
    //var deletePrompt = prompt("Skriv inn passord");
    var confirmPassword = passordBekreftSlettInput.value;

    if (confirmPassword != null || confirmPassword != "") {
        var credential = reautentiser(confirmPassword);
        user.reauthenticateWithCredential(credential).then(() => {
            firebase.database().ref("Bruker/" + whiz.Uid + "/Grupper").once('value', (snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach(function (childSnap) {
                        firebase.database().ref("Grupper/" + childSnap.key+"/Medlemmer/"+whiz.Uid).remove().catch((error) => {
                        });
                    });
                }
            }).then(() => {
                //Sletter brukeren fra eventuelle plattformer en er medlem av
                firebase.database().ref("Xbox gruppe/Medlemmer/"+whiz.Uid).remove();
                firebase.database().ref("Playstation gruppe/Medlemmer/"+whiz.Uid).remove();
                firebase.database().ref("Steam gruppe/Medlemmer/"+whiz.Uid).remove();
                firebase.database().ref("Switch gruppe/Medlemmer/"+whiz.Uid).remove();
            }).then(()=> {

                //Sletter brukeren sine innlegg
                firebase.database().ref('Bruker/' + whiz.Uid + '/Mine innlegg').once('value', (snapshot) => {
                    if (snapshot.exists()) {
                        snapshot.forEach((innleggReferanse) => {
                            let path = innleggReferanse.child("Path").val();
                            if (path == "Xbox" || path == "Playstation" || path == "Steam" || path == "Switch") { //Fra platform
                                firebase.database().ref(path + ' gruppe/Innlegg/' + innleggReferanse.key).once('value', (snapshot) => {
                                    let picID = "picture" + snapshot.child('ID').val();
                                    let owner = snapshot.child('Eier').val();
                                    firebase.storage().ref('innlegg/' + (owner + picID) + '/innlegg.jpg').delete();
                                    firebase.database().ref(path + ' gruppe/Innlegg/' + innleggReferanse.key).remove();
                                });
                            } else if (path == "Bruker") { //Fra bruker
                                firebase.database().ref('Bruker/' + whiz.Uid + '/Innlegg/' + innleggReferanse.key).once('value', (snapshot) => {
                                    let picID = "picture" + snapshot.child('ID').val();
                                    let owner = snapshot.child('Eier').val();
                                    firebase.storage().ref('innlegg/' + (owner + picID) + '/innlegg.jpg').delete();
                                    firebase.database().ref('Bruker/' + whiz.Uid + '/Innlegg/' + innleggReferanse.key).remove();
                                })
                            } else { //Fra egendefinert gruppe
                                firebase.database().ref('Grupper/' + path + '/Innlegg/' + innleggReferanse.key).once('value', (snapshot) => {
                                    let picID = "picture" + snapshot.child('ID').val();
                                    let owner = snapshot.child('Eier').val();
                                    firebase.storage().ref('innlegg/' + (owner + picID) + '/innlegg.jpg').delete();
                                    firebase.database().ref('Grupper/' + path + '/Innlegg/' + innleggReferanse.key).remove();
                                })
                            }
                        })
                    }
                }).then(() => {
                    //Sletter resterende bruker info -> Realtime database
                    firebase.database().ref("Bruker/" + whiz.Uid).remove().then(() => {
                        //Sletter eventuelt profilbilde brukeren har -> Storage 
                        firebase.storage().ref("user/" + whiz.Uid + "/profile.jpg").delete().catch((error) => {
                            //Error -> Brukeren har ikke profilbilde
                        }).then(() => {
                            //Sletter auth-info til slutt -> Authentication
                            user.delete().then(() => {
                                //Bruker slettet
                                window.location = "/";
                            }).catch((error) => {
                            });
                        });
                    });
                });


                

            });
        }).catch((error) => {
            window.alert(error.message);
        })
    } else {
        window.alert("Bruker kansellerte");
    }
}


