var gammeltPassordInput = document.getElementById('inputPasswordOld');
var nyttPassordInput = document.getElementById('inputPasswordNew');
var gjentaNyttPassordInput = document.getElementById('inputPasswordNewVerify');

var endrePassordKnapp = document.getElementById('confirmNewPassword');
var slettBrukerKnapp = document.getElementById('deleteUserBtn');

function reautentiser(oldPassword) {
    var user = firebase.auth().currentUser;
    return firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
    //return user.reauthenticateWithCredential(cred);
}

endrePassordKnapp.onclick = function() {
    var user = firebase.auth().currentUser;
    var p_gammelt = gammeltPassordInput.value;
    var p_nytt = nyttPassordInput.value;
    var p_gjentaNytt = gjentaNyttPassordInput.value;
    
    var credential = reautentiser(p_gammelt);
    user.reauthenticateWithCredential(credential).then(() => {
        //Reautentisert
        if (p_nytt === p_gjentaNytt) {
            user.updatePassword(p_nytt).then(() => {
                window.alert("Passord byttet");
                gammeltPassordInput.value = "";
                nyttPassordInput.value = "";
                gjentaNyttPassordInput.value = "";
            }).catch((error) => {
                window.alert(error.message);
            });
        } else {
            window.alert("Nytt passord og Gjenta passord samsvarer ikke");
        }
    }).catch((error) => {
        //En error skjedde, feil passord?
        window.alert(error.message);
    });
}
//Bruker pr nå en prompt for å skrive inn passord, skal senere bruke modalen som er laget for dette
slettBrukerKnapp.onclick = function() {
    var user = firebase.auth().currentUser;
    var deletePrompt = prompt("Skriv inn passord");
    
    if (deletePrompt != null || deletePrompt != "") {
        var credential = reautentiser(deletePrompt);
        user.reauthenticateWithCredential(credential).then(() => {
            user.delete().then(() => {
                //Bruker slettet, så skal resten av brukerinfo slettes inni her
                // 1. Resterende info - Realtime database
                // 2. Evt profilbilde - Storeage database
                // Skal Samtaler/Innlegg/Grupper slettes? 
                window.location = "/";
            }).catch((error) => {
                window.alert("Det skjedde en error: " + error.message);
                console.log("Det skjedde en error: " + error.message);
            })
        }).catch((error) => {
            window.alert(error.message);
        })
    } else {
        window.alert("Bruker kansellerte");
    }
}