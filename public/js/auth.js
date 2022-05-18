var userID;
var msg;
const auth = firebase.auth();
var userForm = document.getElementById("bForm"); 

var inpEpost = document.getElementById("inp_epost"); 
var inpBnavn = document.getElementById("inp_bnavn"); 
var inpNavn = document.getElementById("inp_navn"); 
var inpPassword = document.getElementById("inp_passord"); 
var inpPassword2 = document.getElementById("inp_passord2"); 


// denne skal bli kommentert tilbake. Auto-loggin/husk meg funksjon
// firebase.auth().onAuthStateChanged(function(user) {
//     if(user) {
//         // Bruker logget inn
//         window.location = "/home";
//         var user = firebase.auth().currentUser; 

//         if(user != null) {
//             // trenger ingenting her heller
//         }
//     }

//     else {
//         /* Ingen bruker logget inn. Linja nedenfor er 
//         kommentert ut så nettstedet ikke kræsjer og 
//         kun refreshet. Ingen logget inn, ingenting skjer*/
//         // window.location = "/";
//     }
// });


document.getElementById("regBtn").onclick = function() {
    let state = checkPassword(inpPassword); 
    if(state === true && inpBnavn.value.length < 10 && inpPassword.value == inpPassword2.value) {
        auth.createUserWithEmailAndPassword(inpEpost.value, inpPassword.value).then(cred => {
            var userID = firebase.auth().currentUser.uid; 
            msg = firebase.database().ref('Bruker').child(userID); 
            msg.set({
                "Brukernavn":   inpBnavn.value, 
                "Navn":         inpNavn.value
            }).then(() => {
                window.location = "/home";
            });
        });
    } else {
        document.getElementById("outputTxt").style.display = "block";
    }
}
function checkPassword(passInp) {
    let lowerCaseLetters = /[a-z]/g;
    let upperCaseLetters = /[A-Z]/g; 
    let numbers = /[0-9]/g; 

    if(
        passInp.value.match(lowerCaseLetters) &&
        passInp.value.match(upperCaseLetters) &&
        passInp.value.match(numbers) && 
        passInp.value.length >= 8
    ) {
        return true; 
    } else {
        return false;
    }
}


document.getElementById("loginBtn").onclick = function() {
    var epost = document.getElementById("login").value; 
    var passord = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(epost, passord).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("Error : " + errorMessage);
    });

    firebase.auth().onAuthStateChanged((user) => {
        if(user != null) {
            var uid = user.uid; 
    
            var userId = firebase.auth().currentUser.uid;
            return firebase.database().ref('/Bruker/' + uid).once('value').then((snapshot) => {
                var whiz = snapshot.val();
                $.post("/", {
                    bruker: whiz
                }, function (data, status) {
                    console.log(data);
                });
                window.location = "/home";
            });
        } else {
            // window.location = "/";
        }
    });
}


document.getElementById("sendEmail").onclick = function() {
    let inp_email = document.getElementById("inp_epost2").value;
    var formsheet = document.getElementById("bForm2");
    formsheet.style.color = "#fff";

    firebase.auth().sendPasswordResetEmail(inp_email).then(() => {
        // window.location.reload();
        formsheet.innerHTML = `
            En epost er sendt til ${inp_email}. <br>
            Følg lenken for å endre passord, returner hit, <br>
            og last inn siden på nytt ved å trykke 
            <a href="/">her</a>
        `;
    })
    .catch((error) => {
        // console.log("failed epost til: " + inp_email);
        var errorCode = error.code;
        var errorMessage = error.message;
        formsheet.innerHTML = `
            Noe gikk galt. <br>
            Errorcode: ${errorCode} <br>
            Errormelding: ${errorMessage} <br>
            <a href="/">Prøv på nytt</a>
        `;
    });
}
