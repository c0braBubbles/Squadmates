import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyDFCI3CT5AaJBpO02lO555bjHV-CIpKUS8",
    authDomain: "squadmates-5279d.firebaseapp.com",
    databaseURL: "https://squadmates-5279d-default-rtdb.firebaseio.com",
    projectId: "squadmates-5279d",
    storageBucket: "squadmates-5279d.appspot.com",
    messagingSenderId: "367286413852",
    appId: "1:367286413852:web:5d13213e32a33b65474dd9",
    measurementId: "G-SX3GD5KNCC"
};
      
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
firebase.initializeApp(firebaseConfig);


var msg = firebase.database().ref().child('Bruker'); 
var userForm = document.getElementById("bForm"); 

var inpEpost = document.getElementById("inp_epost"); 
var inpBnavn = document.getElementById("inp_bnavn"); 
var inpNavn = document.getElementById("inp_navn"); 
var inpAge = document.getElementById("inp_alder"); 
var inpPassword = document.getElementById("inp_passord"); 
var inpPassword2 = document.getAnimations("inp_passord2"); 

userForm.onsubmit = function(evt) {
    if(inpPassword.value == inpPassword2.value) {
        evt.preventDefault(); 
        msg.push({
            "Epost": inpEpost.value, 
            "Brukernavn": inpBnavn.value, 
            "Navn": inpNavn.value, 
            "Alder": inpAge.value
        });
    } 
    else {
        alert("Passordfeltene samsvarer ikke");
    }
}
