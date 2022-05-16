const whiz = JSON.parse(sessionStorage.getItem("bruker"));

//var aktiv = localStorage.getItem("aktivSamtale");



/* TODO:

1. Metode - lagSamtale -> Oppretter en "samtale" mellom to personer, dersom de ikke har en samtale fra før av
2. Metode - samtale -> Kan mulig kombineres med LagSamtale, skal føre brukeren til chatten
3. Metode - hentSamtale -> Skal hente meldinger som har evt har blitt sendt tidligere i samtalen, og vise dem fram
4. Metode - skrivMelding -> Skal sende meldinger fra bruker opp i databasen

*/


/* Henter samtaler fra firebase, fyller inn front-end slik at brukeren får opp sine samtaler */
var chatListLeft = document.getElementById('chat-list-left');
var chatListTop = document.getElementById('chat-list-top');
var listCount = 0;
let name_tab_search = [];
firebase.database().ref('Samtale').on('child_added', function(snapshot) {
    var message = snapshot.val();
    var samtaleKey = snapshot.key;
    let listID = "listNmr" + listCount;
    //Dersom du er bruker som startet samtalen
    if (message.Bruker1ID == whiz.Uid) {
        firebase.database().ref("Bruker/"+message.Bruker2ID).once('value').then((snapshot) => {
            var guest = snapshot.val();
            name_tab_search.push(guest.Brukernavn);

            firebase.storage().ref("user/"+snapshot.key+"/profile.jpg").getDownloadURL().then((pictureURL) => {
                chatListLeft.innerHTML +=`<li id="${listID}" class="list-group-item d-flex justify-content-between align-items-center"
                                        style="color:white; background-color: #111;" onclick="openChat(\`` + samtaleKey + `\`)">` + 
                                        `<img src="`+ pictureURL +`" alt="..." class="rounded-circle display-pic">` +
                                        `<h3>` + guest.Brukernavn + `</h3>` +
                                        `<span class="badge bg-primary rounded-pill" id="`+ samtaleKey +`">` + 0 + `</span>` +
                                    `</li>`;    
            }).catch((error) => {
                chatListLeft.innerHTML +=`<li id="${listID}" class="list-group-item d-flex justify-content-between align-items-center"
                                        style="color:white; background-color:#111" onclick="openChat(\`` + samtaleKey + `\`)">` + 
                                        `<img src="img/blank-profile-circle.png" alt="..." class="rounded-circle display-pic">` +
                                        `<h3>` + guest.Brukernavn + `</h3>` +
                                        `<span class="badge bg-primary rounded-pill" id="`+ samtaleKey +`">` + 0 + `</span>` + 
                                    `</li>`;
            });
            chatListTop.innerHTML +=`<li class="person-list-item-border">` +
                                        `<a class="dropdown-item text-light" href="#" style="display:inline;">` + guest.Brukernavn + `</a>` + 
                                        `<a href="#">` +
                                            `<img src="img/chat-fill.svg" alt="..." style="filter:invert(100%); width:25px; height:25px; float:right; display:inline; margin-right:1em;" onclick="openChat(\`` + samtaleKey + `\`)">` +
                                        `</a>` +
                                    `</li>`;
        });
        listCount += 1; 
      //Dersom du er bruker n2, altså en annen startet samtale med deg  
    } else if (message.Bruker2ID == whiz.Uid) {
        firebase.database().ref("Bruker/"+message.Bruker1ID).once('value').then((snapshot) => {
            var guest = snapshot.val();
            firebase.storage().ref("user/"+snapshot.key+"/profile.jpg").getDownloadURL().then((pictureURL) => {
                chatListLeft.innerHTML += `<li id="${listID}" class="list-group-item d-flex justify-content-between align-items-center"
                                    style="color:white; background-color:#111;" onclick="openChat(\`` + samtaleKey + `\`)">` +
                                    `<img src="` + pictureURL + `" alt="..." class="rounded-circle display-pic">` +
                                    `<h3>` + guest.Brukernavn + `</h3>` +
                                    `<span class="badge bg-primary rounded-pill" id="`+ samtaleKey +`">` + 0 + `</span>` +
                                    `</li>`;
            }).catch((error) => {
                chatListLeft.innerHTML += `<li id="${listID}" class="list-group-item d-flex justify-content-between align-items-center"
                                    style="color:white; background-color:#111" onclick="openChat(\`` + samtaleKey + `\`)">` +
                                    `<img src="img/blank-profile-circle.png" alt="..." class="rounded-circle display-pic">` +
                                    `<h3>` + guest.Brukernavn + `</h3>` +
                                    `<span class="badge bg-primary rounded-pill" id="`+ samtaleKey +`">` + 0 + `</span>` +
                                    `</li>`;
            });
            chatListTop.innerHTML +=`<li class="person-list-item-border">` + 
                                        `<a class="dropdown-item text-light" href="#" style="display:inline;">` + guest.Brukernavn + `</a>` +
                                        `<a href="#">` +
                                            `<img src="img/chat-fill.svg" alt="..." style="filter:invert(100%); width:25px; height:25px; float:right; display:inline; margin-right:1em;" onclick="openChat(\`` + samtaleKey + `\`)">` +
                                        `</a>` +
                                    `</li>`;
        });
        listCount += 1; 
    }
    /*Henter meldinger når brukeren er inne i en samtale
    Viser også frem hvor mange usette meldinger brukeren har
    */
    setTimeout(() => {
        var ikkeSett = 0;
        firebase.database().ref('Samtale/'+samtaleKey+'/Melding/').on('child_added', function (snapshot) {
            var data = snapshot.val();
            if (data.Bruker != whiz.Uid && data.Sett == 0) {
                ikkeSett++;
                document.getElementById(samtaleKey).innerHTML = ikkeSett;
            }
            if (data.SamtaleID == aktivSamtale) {
                ikkeSett = 0;
                document.getElementById(samtaleKey).innerHTML = ikkeSett;
                if (data.Bruker == whiz.Uid) { //Du sendte meldingen
                    meldinger.innerHTML += `<div class="send-bubble">${data.Melding}</div>`;
                } else { //Du fikk meldingen tilsendt
                    meldinger.innerHTML += `<div class="rec-bubble">${data.Melding}</div>`;
                    firebase.database().ref('Samtale/'+aktivSamtale+'/Melding').child(snapshot.key).update({
                        "Sett": 1
                    }).then(() => {
                        firebase.database().ref('Samtale').child(aktivSamtale).update({
                            "NyttFra": 0
                        });
                    })
                    
                }
            }
        });
    }, 1500);
});

setTimeout(() => {
    $(".loader-wrapper").fadeOut("slow");
}, 2000);



document.getElementById("form1").onkeyup = function() {
    var input, filter, li, a, b, c, i, txtValue;
    input = document.getElementById("form1");
    filter = input.value.toUpperCase();
    li = chatListLeft.getElementsByTagName("li");

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("h3")[0];
        b = li[i].getElementsByTagName("img")[0]; 
        c = li[i].getElementsByTagName("span")[0];

        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
            a.style.display = "none";
            b.style.display = "none"; 
            c.style.display = "none";
        }
    }
}
