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
var listID = 0;
firebase.database().ref('Samtale').on('child_added', function(snapshot) {
    listID++;
    console.log(listID);
    var message = snapshot.val();
    var samtaleKey = snapshot.key;
    //Dersom du er bruker som startet samtalen
    if (message.Bruker1ID == whiz.Uid) {
        firebase.database().ref("Bruker/"+message.Bruker2ID).once('value').then((snapshot) => {
            var guest = snapshot.val();
            firebase.storage().ref("user/"+snapshot.key+"/profile.jpg").getDownloadURL().then((pictureURL) => { /*id="`+samtaleKey+`"*/ 
                chatListLeft.innerHTML +=`<li class="list-group-item d-flex justify-content-between align-items-center"
                                        style="color:white; background-color: #111;" onclick="openChat(\`` + samtaleKey + `\`)">` + 
                                        `<img src="`+ pictureURL +`" alt="..." class="rounded-circle display-pic">` +
                                        `<h3>` + guest.Brukernavn + `</h3>` +
                                        `<span class="badge bg-primary rounded-pill" id="`+ samtaleKey +`">` + 0 + `</span>` +
                                    `</li>`;    
            }).catch((error) => {
                chatListLeft.innerHTML +=`<li class="list-group-item d-flex justify-content-between align-items-center"
                                        style="color:white; background-color:#111" onclick="openChat(\`` + samtaleKey + `\`)">` + 
                                        `<img src="img/Gaal.jpg" alt="..." class="rounded-circle display-pic">` +
                                        `<h3>` + guest.Brukernavn + `</h3>` +
                                        `<span class="badge bg-primary rounded-pill" id="`+ samtaleKey +`">` + 0 + `</span>` + 
                                    `</li>`;
                console.log(error + " - Kunne ikke finne profilbilde");
            });
            /*chatListLeft.innerHTML +=`<li class="list-group-item d-flex justify-content-between align-items-center bg-dark"
                                        style="color:white;">` + 
                                        `<img src="img/Gaal.jpg" alt="..." class="rounded-circle display-pic">` +
                                        `<h3>` + guest.Brukernavn + `</h3>` +
                                        `<span class="badge bg-primary rounded-pill">` + 0 + `</span>` + 
                                    `</li>`;*/
            chatListTop.innerHTML +=`<li class="person-list-item-border">` +
                                        `<a class="dropdown-item text-light" href="#" style="display:inline;">` + guest.Brukernavn + `</a>` + 
                                        `<a href="#">` +
                                            `<img src="img/chat-fill.svg" alt="..." style="filter:invert(100%); width:25px; height:25px; float:right; display:inline; margin-right:1em;" onclick="openChat(\`` + samtaleKey + `\`)">` +
                                        `</a>` +
                                    `</li>`;
        });
      //Dersom du er bruker n2, altså en annen startet samtale med deg  
    } else if (message.Bruker2ID == whiz.Uid) {
        firebase.database().ref("Bruker/"+message.Bruker1ID).once('value').then((snapshot) => {
            var guest = snapshot.val();
            firebase.storage().ref("user/"+snapshot.key+"/profile.jpg").getDownloadURL().then((pictureURL) => {
                chatListLeft.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center"
                                    style="color:white; background-color:#111;" onclick="openChat(\`` + samtaleKey + `\`)">` +
                                    `<img src="` + pictureURL + `" alt="..." class="rounded-circle display-pic">` +
                                    `<h3>` + guest.Brukernavn + `</h3>` +
                                    `<span class="badge bg-primary rounded-pill" id="`+ samtaleKey +`">` + 0 + `</span>` +
                                    `</li>`;
            }).catch((error) => {
                chatListLeft.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center"
                                    style="color:white; background-color:#111" onclick="openChat(\`` + samtaleKey + `\`)">` +
                                    `<img src="img/Gaal.jpg" alt="..." class="rounded-circle display-pic">` +
                                    `<h3>` + guest.Brukernavn + `</h3>` +
                                    `<span class="badge bg-primary rounded-pill" id="`+ samtaleKey +`">` + 0 + `</span>` +
                                    `</li>`;
                console.log(error + " - Kunne ikke finne profilbilde");
            });
            /*chatListLeft.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center bg-dark"
                                    style="color:white;">` +
                                    `<img src="img/vigdis.jpg" alt="..." class="rounded-circle display-pic">` +
                                    `<h3>` + guest.Brukernavn + `</h3>` +
                                    `<span class="bagde bg-primary rounded-pill">` + 1 + `</span>` +
                                    `</li>`;*/
            chatListTop.innerHTML +=`<li class="person-list-item-border">` + 
                                        `<a class="dropdown-item text-light" href="#" style="display:inline;">` + guest.Brukernavn + `</a>` +
                                        `<a href="#">` +
                                            `<img src="img/chat-fill.svg" alt="..." style="filter:invert(100%); width:25px; height:25px; float:right; display:inline; margin-right:1em;" onclick="openChat(\`` + samtaleKey + `\`)">` +
                                        `</a>` +
                                    `</li>`;
        });
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
                if (data.Bruker == whiz.Uid) {
                    meldinger.innerHTML += `<div class="send-bubble">${data.Melding}</div>`;
                } else {
                    meldinger.innerHTML += `<div class="rec-bubble">${data.Melding}</div>`;
                    firebase.database().ref('Samtale/'+aktivSamtale+'/Melding').child(snapshot.key).update({
                        "Sett": 1
                    });
                }
            }
        });
    }, 1500);

});
/*
var aktivSamtale;
function openChat(samtaleUID) {
    var meldinger = document.getElementById('msg_board');
    meldinger.innerHTML = ``; //Fjerner alle meldinger, før de riktige meldingene blir lagt til
    aktivSamtale = samtaleUID;
    console.log(samtaleUID);
}*/

/*
firebase.database().ref("Melding/").on('child_added', function (snapshot) {
    var data = snapshot.val();
    if (data.SamtaleID == aktivSamtale) {
        if (data.Bruker == whiz.Uid) {
            meldinger.innerHTML += `<div class="send-bubble">${data.Melding}</div>`;
        } else {
            meldinger.innerHTML += `<div class="rec-bubble">${data.Melding}</div>`;
        }
    }
});
*/

/* Eksempel fra Give&Get: legger en melding på meldingsbrettet */
//chatWindow.innerHTML += `<div id='bobler' class='msg-line'><p class='sender-bubble'>${data.beskjeden}</p></div>`;