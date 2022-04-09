document.getElementById("btnDDown").onclick = function () {
    document.getElementById("navmobile2").style.height = "0";
}

const whiz = JSON.parse(sessionStorage.getItem("bruker"));


function showProfile(name, uid2) {
    // console.log(name + ", " + uid2);
    if (name == whiz.Brukernavn) {
        alert("du trykket på deg selv din nisse");
        window.open(whiz.Uid, '_self');
        $.post("/openUid", {
            uid: whiz.Uid
        }, function (data, status) {
            console.log(data);
        });
    }
    else if (name != whiz.Brukernavn) {
        window.open(name, '_self');
        $.post("/showProfile", {
            profilename: name,
            profUid: uid2
        }, function (data, status) {
            console.log(data);
        });
    }
}


function gameSearch(i) {
    // console.log(i);
    let inp = document.getElementById("input").value.toUpperCase();
    let para = document.getElementById("demo");

    if (i == 4) {
        console.log("ferdig");
        return;
    } else {
        fetch("https://api.rawg.io/api/games?key=04fe2e746e1346738846b6ea6554a96b" + "&page=" + i, {
            "method": "GET",
        }).then(response => response.json()).then(data => {
            for (let j = 0; j < data.results.length; j++) {
                let game = data.results[j].name;
                // para.innerHTML += game + "<br>";

                if (game.toUpperCase().indexOf(inp) > -1) {
                    para.innerHTML += game + "<br>";
                }

                if (j == data.results.length - 1) {
                    i += 1;
                    search(i);
                }
            }
        }).catch(err => {
            para.innerHTML = err;
            // return;
        });
    }
}


function logout() {
    firebase.auth().signOut().then(() => {
        // trenger ingenting her
        window.location = "/";
    }).catch((error) => {
        alert(error); // mest sannsynlig vil ingen error forekomme
    });
}
