
document.getElementById("btnDDown").onclick = function() {
    document.getElementById("navmobile2").style.height = "0";
}

// eksempler på hvordan bruke whiz
const whiz = JSON.parse(sessionStorage.getItem("bruker")); 
document.getElementById("posts-tab").innerHTML = whiz.Brukernavn;
document.getElementById("testBtn").onclick = function() {
    console.log(whiz);
}

// function logout() {
//     firebase.auth().signOut().then(() => {
//         // trenger ingenting her
//         window.location = "/";
//     }).catch((error) => {
//         alert(error); // mest sannsynlig vil ingen error forekomme
//     });
// }
