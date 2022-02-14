/*
    HUSK Å LINKE TIL SDK-EN I HTML FILA I TILLEGG TIL DENNE DU BRUKER DENNE
    
    SDK-SKRIPTET:
    <script src="https://www.gstatic.com/firebasejs/4.10.1/firebase.js"></script>
*/

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
