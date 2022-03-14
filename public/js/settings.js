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
bekreftSlett.onclick = function() {
    var user = firebase.auth().currentUser;
    const whiz = JSON.parse(sessionStorage.getItem("bruker"));
    //var deletePrompt = prompt("Skriv inn passord");
    var confirmPassword = passordBekreftSlettInput.value;
    
    if (confirmPassword != null || confirmPassword != "") {
        var credential = reautentiser(confirmPassword);
        user.reauthenticateWithCredential(credential).then(() => {
            //Sletter resterende bruker info -> Realtime database
            firebase.database().ref("Bruker/"+whiz.Uid).remove().then(() => {
                //Sletter eventuelt profilbilde brukeren har -> Storage 
                firebase.storage().ref("user/"+whiz.Uid+"/profile.jpg").delete().catch((error) => {
                    //Error -> Brukeren har ikke profilbilde
                    console.log(error.message);
                }).then(() => {
                    //Sletter auth-info til slutt -> Authentication
                    user.delete().then(() => {
                        //Bruker slettet
                        window.location = "/";
                    }).catch((error) => {
                        console.log(error.message);
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