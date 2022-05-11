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
    if(inpPassword.value.length < 6) {
        alert("Passordet er for kort. Minimum 6 tegn"); 
    } else if(inpPassword.value != inpPassword2.value) {
        alert("Passordfeltene samsvarer ikke"); 
    } else if(inpBnavn.value.length > 10) {
        alert("Brukernavnet er for langt");
    } else {
        auth.createUserWithEmailAndPassword(inpEpost.value, inpPassword.value).then(cred => {
            var userID = firebase.auth().currentUser.uid; 
            msg = firebase.database().ref('Bruker').child(userID); 
            msg.set({
                "Brukernavn":   inpBnavn.value, 
                "Alder":        inpAge.value, 
                "Navn":         inpNavn.value
            }).then(() => {
                window.location = "/home";
            });
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
    });*/
    firebase.auth().onAuthStateChanged((user) => {
        if(user != null) {
            var uid = user.uid; 
            console.log(uid);
    
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
    // analytics.logEvent('bruker_login', { epost: emailInp })
}


document.getElementById("sendEmail").onclick = function() {
    let inp_email = document.getElementById("inp_epost").value;
    Email.send({
        Host: "smtp.gmail.com",
        Username: "sender@email_address.com",
        Password: "Enter your password",
        To: inp_email,
        From: "mats.engesund@gmail.com",
        Subject: "Sending Email using javascript",
        Body: "Well that was easy!!",
      }).then(function (message) {
          alert("mail sent successfully")
    });
}
