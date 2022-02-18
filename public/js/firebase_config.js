/*
    HUSK Å LINKE TIL SDK-EN I HTML FILA I TILLEGG TIL DENNE DU BRUKER DENNE
    
    SDK-SKRIPTET:
    <script src="https://www.gstatic.com/firebasejs/4.10.1/firebase.js"></script>
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDFCI3CT5AaJBpO02lO555bjHV-CIpKUS8",
    authDomain: "squadmates-5279d.firebaseapp.com",
    databaseURL: "https://squadmates-5279d-default-rtdb.firebaseio.com",
    projectId: "squadmates-5279d",
    storageBucket: "squadmates-5279d.appspot.com",
    messagingSenderId: "367286413852",
    appId: "1:367286413852:web:44ad61686f1de1ca474dd9",
    measurementId: "G-4VN6RD9BST"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
firebase.initializeApp(firebaseConfig);
