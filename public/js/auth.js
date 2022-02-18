


var msg = firebase.database().ref().child('Bruker'); 
var userForm = document.getElementById("bForm"); 

var inpEpost = document.getElementById("inp_epost"); 
var inpBnavn = document.getElementById("inp_bnavn"); 
var inpNavn = document.getElementById("inp_navn"); 
var inpAge = document.getElementById("inp_alder"); 
var inpPassword = document.getElementById("inp_passord"); 
var inpPassword2 = document.getAnimations("inp_passord2"); 

userForm.onsubmit = function(evt) {
    evt.preventDefault(); 
    msg.push({
        "Epost": inpEpost.value, 
        "Brukernavn": inpBnavn.value, 
        "Navn": inpNavn.value, 
        "Alder": inpAge.value
    });
}


document.getElementById("loginBtn").onclick = function() {
    alert("det funker");
}
