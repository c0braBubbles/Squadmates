document.getElementById("btnDDown").onclick = function () {
    document.getElementById("navmobile2").style.height = "0";
}

const whiz = JSON.parse(sessionStorage.getItem("bruker"));
let spill = [];


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
    let inp = document.getElementById("gameInput").value.toUpperCase();
    let resultList = document.getElementById("gameResults"); 

    if (i == 10) {
        return;
    } else {
        fetch("https://api.rawg.io/api/games?key=04fe2e746e1346738846b6ea6554a96b" + "&page=" + i, {
            "method": "GET",
        }).then(response => response.json()).then(data => {
            for (let j = 0; j < data.results.length; j++) {
                let game = data.results[j].name;
                let image = data.results[j].background_image;
                // para.innerHTML += game + "<br>";

                if (game.toUpperCase().indexOf(inp) > -1) {
                    resultList.innerHTML += `<div class="input-group mx-3 w-75 d-flex mx-auto">
                                                <div class="input-group-text bg-dark border-dark">
                                                    <input class="form-check-input mt-0" id="st${game}" type="checkbox" onclick="checkGame('${game}', '${image}', this.id)" value="${game}" aria-label="@Gamertag">
                                                </div>
                                                <img src="${image}" alt="spillbilde" width="42">
                                                <input type="text" class="form-control bg-dark border-dark text-light" aria-label="@Gamertag" value="${game}" readonly><br>
                                            </div><br>`;
                }

                if (j == data.results.length - 1) {
                    i += 1;
                    gameSearch(i);
                }
            }
        }).catch(err => {
            console.log(err);
            // para.innerHTML = err;
            // return;
        });
    }
}


function checkGame(game, image, id) {
    let box = document.getElementById(id); 

    if(box.checked == true) {
        spill.push(game); 
        sessionStorage.setItem("spill", spill);
    } else {
        spill.splice(spill.indexOf('game'), 1);
        sessionStorage.setItem("spill", spill);
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
