var msg = firebase.database().ref().child('Bruker'); 
var userForm = document.getElementById("bForm"); 

var inpEpost = document.getElementById("inp_epost"); 
var inpBnavn = document.getElementById("inp_bnavn"); 
var inpNavn = document.getElementById("inp_navn"); 
var inpAge = document.getElementById("inp_alder"); 
var inpPassword = document.getElementById("inp_passord"); 
var inpPassword2 = document.getAnimations("inp_passord2"); 


firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
        // Bruker logget inn
        // document.getElementById("main-side").style.display = "block";
        // document.getElementById("login-side").style.display = "none";
        window.location = "/home";

        var user = firebase.auth().currentUser; 

        if(user != null) {
            // email_id = user.email; 

            // setUsername(email_id);
        }
    }

    else {
        // Ingen bruker logget inn
        // window.location = "/";
        // document.getElementById("main-side").style.display = "none"; 
        // document.getElementById("login-side").style.display = "block";
    }
});


userForm.onsubmit = function(evt) {
    evt.preventDefault(); 
    msg.push({
        "Epost": inpEpost.value, 
        "Brukernavn": inpBnavn.value, 
        "Navn": inpNavn.value, 
        "Alder": inpAge.value
    });
}

const auth = firebase.auth();

document.getElementById("regBtn").onclick = function() {
    /*if ( inpPassword2.value !== inpPassword ) {
        window.alert("Gjenta passord stemmer ikke med passordet du har skrevet inn!")
    } else if ( inpPassword.length < 6 ) {
        window.alert("Passordet er for kort!")
    } else if (document.getElementById('inputFirstname').value.length == 0 || document.getElementById('inputLastname').value.length == 0 ||
               email.length == 0 || brukernavn.length == 0) {
        window.alert("Vennligst fyll inn alle feltene")
    } else {*/
        auth.createUserWithEmailAndPassword(inpEpost.value, inpPassword.value).then(cred => {
            // userID = firebase.auth().currentUser.uid; 
            
                
                window.location = "/home";                                 
        });
    // }
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
    analytics.logEvent('bruker_login', { epost: emailInp })
}
