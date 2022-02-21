var userID;
var msg;
const auth = firebase.auth();
var userForm = document.getElementById("bForm"); 

var inpEpost = document.getElementById("inp_epost"); 
var inpBnavn = document.getElementById("inp_bnavn"); 
var inpNavn = document.getElementById("inp_navn"); 
var inpAge = document.getElementById("inp_alder"); 
var inpPassword = document.getElementById("inp_passord"); 
var inpPassword2 = document.getElementById("inp_passord2"); 


/*firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
        // Bruker logget inn
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
    }
});*/


document.getElementById("regBtn").onclick = function() {
    if(inpPassword.value.length < 6) {
        alert("Passordet er for kort. Minimum 6 tegn"); 
    } else if(inpPassword.value != inpPassword2.value) {
        alert("Passordfeltene samsvarer ikke"); 
    } else if(inpBnavn.value.length > 10) {
        alert("Brukernavnet er for langt");
    } else {
        auth.createUserWithEmailAndPassword(inpEpost.value, inpPassword.value).then(cred => {
            var userID = firebase.auth().currentUser.uid; 
            console.log(userID);
            msg = firebase.database().ref('Bruker').child(userID); 
            msg.set({
                "Brukernavn": inpBnavn.value, 
                "Alder": inpAge.value
            });
            // window.location = "/home";
            setTimeout(function () {
                window.location = "/home";
            }, 5000);
        });
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

    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            // Bruker logget inn
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
        }
    });
    // analytics.logEvent('bruker_login', { epost: emailInp })
}
