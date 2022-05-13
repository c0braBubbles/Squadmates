document.getElementById("btnDDown").onclick = function () {
    document.getElementById("navmobile2").style.height = "0";
}

const whiz = JSON.parse(sessionStorage.getItem("bruker"));
let spill = [];
let spillBilde = [];


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
    let resultList = document.getElementById("gameResults");
    resultList.innerHTML = ``;

    let inp = document.getElementById("gameInput").value.toUpperCase();
    let searchword = inp.split(' ').join('-').toLowerCase();

    if(inp == "") {
        return;
    }

    fetch("https://api.rawg.io/api/games?key=8d8b50415fd74e3baf7e69ac2f959516&search=" + searchword, {
        "method": "GET",
    }).then(response => response.json()).then(data => {
        // document.write(data.results);
        if(data.results == undefined) {
            alert("Fant ikke spillet ditt");
        }

        for(let i = 0; i < data.results.length; i++) {
            let game = data.results[i].name;
            let image = data.results[i].background_image;
            resultList.innerHTML += `<div class="input-group mx-3 w-75 d-flex mx-auto">
                                        <div class="input-group-text bg-dark border-dark">
                                            <input class="form-check-input mt-0" id="st${game}" type="checkbox" onclick="checkGame('${game}', '${image}', this.id)" value="${game}" aria-label="@Gamertag">
                                        </div>
                                        <img src="${image}" alt="spillbilde" width="42" style="object-fit: cover;">
                                        <input type="text" class="form-control bg-dark border-dark text-light" aria-label="@Gamertag" value="${game}" readonly><br>
                                    </div><br>`;
        }
    }).catch(err => {
        console.log(err);
    });
}


function checkGame(game, image, id) {
    let box = document.getElementById(id);

    if (box.checked == true) {
        spill.push(game);
        spillBilde.push(image);
        sessionStorage.setItem("spill", spill);
        sessionStorage.setItem("spillBilde", spillBilde);
    } else {
        spill.splice(spill.indexOf('game'), 1);
        spillBilde.splice(spill.indexOf('game', 1));
        sessionStorage.setItem("spill", spill);
        sessionStorage.setItem("spillBilde", spillBilde);
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


let url_string = window.location.href.split('/');
let page = url_string[url_string.length - 1];
let nav_btn = [
    document.getElementById("nav_home"),
    document.getElementById("nav_grupper"),
    document.getElementById("nav_friends"),
    document.getElementById("nav_mld")
];
console.log(page);

switch (page) {
    case "home#loaded":
        changeNavColor(0)
        break;
    case "allgroups":
        changeNavColor(1);
        break;
    case "friends":
        changeNavColor(2);
        break;
    case "chat":
        changeNavColor(3);
        break;
    default:
        break;
}

function changeNavColor(nmb) {
    for (let i = 0; i < nav_btn.length; i++) {
        if (i == nmb) {
            nav_btn[i].style.color = "#fff";
        } else if (i != nmb) {
            nav_btn[i].style.color = "rgba(255, 255, 255, 0.55)";
        }
    }
}
