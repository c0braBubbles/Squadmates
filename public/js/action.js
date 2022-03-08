document.getElementById("btnDDown").onclick = function() {
    document.getElementById("navmobile2").style.height = "0";
}

const whiz = JSON.parse(sessionStorage.getItem("bruker")); 


function showProfile(name, uid2) {
    if(name == whiz.Brukernavn) {
        alert("du trykket på deg selv din nisse");
        window.open(whiz.Uid, '_self');
        $.post("/openUid", {
            uid: whiz.Uid
        }, function (data, status) {
            console.log(data);
        });
    } 
    else if(name != whiz.Brukernavn) {
        window.open(name, '_self'); 
        $.post("/showProfile", {
            profilename: name, 
            profUid: uid2
        }, function (data, status) {
            console.log(data);
        });
    }
}

// function logout() {
//     firebase.auth().signOut().then(() => {
//         // trenger ingenting her
//         window.location = "/";
//     }).catch((error) => {
//         alert(error); // mest sannsynlig vil ingen error forekomme
//     });
// }
