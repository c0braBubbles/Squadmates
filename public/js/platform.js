var userID;
var list;
var count = 0;
var countMembers;
var collections;

//Sjekker hvilken platform gruppe som ble klikket på
var url = window.location.href;
var split = url.split('/');
var platform = (split[split.length - 1]);
console.log(platform);


//Henter UID til innlogget bruker
const whiz = JSON.parse(sessionStorage.getItem("bruker"));
var user = whiz.Uid;


//Sjekker platformerns liste for medlemmer
firebase.database().ref('/' + platform + ' gruppe/Medlemmer').on('child_added', function (snapshot) {
    userID = snapshot.child("BrukerID").val();
    count++;
    countMembers = document.getElementById("membercountPlatform");
    countMembers.innerHTML = count;


    //Bruker UID fra platform gruppens medlemmer for å hente div annen info fra denne brukeren fra bruker tabellen
    firebase.database().ref('/Bruker/' + userID).once('value').then((snapshot) => {
        var name = snapshot.child("Brukernavn").val();
        var uid = snapshot.key;

        //Henting av profilbilde, bruker uid fra keyen til hver enkeltbruker profil
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var pictureStorage = storageRef.child("user/" + uid + "/profile.jpg");

        pictureStorage.getDownloadURL()
            .then((pictureURL) => { //Dersom brukeren har profilbilde
                $(".loader-wrapper" + platform).fadeOut("slow");
                list = document.getElementById("medlemslistePlatform");
                // $(list).append('<a href="#" class="list-group-item text-light border-dark" style="background: #111;">' +
                // '<img class="rounded-circle m-3" width="50" height="50" style="object-fit: cover" src=' + pictureURL + 'alt="Profilbilde">'
                // + name + '</a>');
                $(list).append(`<a href="#" class="list-group-item text-light border-dark" style="background: #111;" onclick="showProfile('${name}', '${uid}')">
                                    <img class="rounded-circle m-3" width="50" height="50" style="object-fit: cover" src="${pictureURL}" alt="Profilbilde">
                                ${name}</a>`);
            })
            .catch((error) => { //Dersom brukeren ikke har profilbilde
                $(".loader-wrapper" + platform).fadeOut("slow");
                list = document.getElementById("medlemslistePlatform");
                $(list).append('<a href="#" class="list-group-item text-light border-dark" style="background: #111;">' +
                    '<img class="rounded-circle m-3" width="50" height="50" style="object-fit: cover" src="img/blank-profile-circle.png" alt="Profilbilde">'
                    + name + '</a>');
            });
    })
});


var fil = {};
document.getElementById("choosePlatformPic").onchange = function (e) {
    fil = e.target.files[0];
    console.log(fil);
}

//Opplasting av innlegg
document.getElementById("upload").onclick = function () {
    var titleInp = document.getElementById("tittelPlatform").value;
    var descInp = document.getElementById("beskrivelsePlatform").value;
    var id = Date.now(); //Unik ID for bilde

    //Sjekker tidspunkt på opplasting av innlegget 
    var datetime = new Date().toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
    datetime = datetime.split('/').join('.');

    //Tittel må være fyllt ut for å laste opp innlegget
    if (titleInp != "") {
        firebase.database().ref('/' + platform + ' gruppe/Innlegg').push({
            Eier: user,
            Tittel: titleInp,
            Beskrivelse: descInp,
            Tidspunkt: datetime,
            ID: id
        }).then(() => { //Opplasting av bilde
            if (fil instanceof File) {
                firebase.storage().ref("innlegg/" + (user + "picture" + id) + "/innlegg.jpg").put(fil).then(() => {
                    location.reload();
                });
            } else { location.reload(); }
        })
    } else {
        alert("Innlegget må ha en tittel");
    }
}

//Henting av innlegg
firebase.database().ref('/' + platform + ' gruppe/Innlegg').on('child_added', function (snapshot) {
    var owner = snapshot.child("Eier").val();
    var title = snapshot.child("Tittel").val();
    var description = snapshot.child("Beskrivelse").val();
    var time = snapshot.child("Tidspunkt").val();
    var picid = "picture" + snapshot.child("ID").val();
    var deleteid = "delete" + snapshot.child("ID").val();
    var reportid = "report" + snapshot.child("ID").val();
    var commentid = "comment" + snapshot.child("ID").val();
    var commentfieldid = "commentfield" + snapshot.child("ID").val();
    var commentpostid = "commentpost" + snapshot.child("ID").val();
    var commentboxid = "commentbox" + snapshot.child("ID").val();
    var commentviewbtnid = "commentviewbtn" + snapshot.child("ID").val();
    var commentsectionid = "commentsection" + snapshot.child("ID").val();
    var postKey = snapshot.key;

    //Henter brukernavn til innleggets eier
    firebase.database().ref('/Bruker/' + owner).once('value').then((snapshot) => {
        var username = snapshot.child("Brukernavn").val();
        var realname = snapshot.child("Navn").val();

        //Henting av profilbilde, bruker uid fra keyen til hver enkeltbruker profil
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var pictureStorage = storageRef.child("user/" + owner + "/profile.jpg");

        pictureStorage.getDownloadURL()
            .then((pictureURL) => { //Dersom brukeren har profilbilde
                var posts = document.getElementById("postCol");
                $(posts).append(
                    //Innlegg
                    '<div class="card gedf-card mx-auto mb-5" style="background: #111;">' +
                    //Innlegg header
                    '<div class="card-header" style="background: #111;">' +
                    '<div class="d-flex justify-content-between align-items-center">' +
                    '<div class="mr-2">' +
                    /*----- Profilbilde -----*/
                    '<img class="rounded-circle m-3" style="object-fit: cover;" width="50" height="50" src=' + pictureURL + ' alt=""> </div> ' +
                    '<div class= "ml-2">' +
                    '<div class="h5 m-0 text-light">' + username + '</div>' +
                    '<div class="h7 text-light">' + realname + '</div> </div>' +
                    '<div class="dropdown ms-auto">' +
                    '<button class="btn dropdown-toggle text-light" type="button"' +
                    'style="background: #111;" id="dropdownMenu2"' +
                    'data-bs-toggle="dropdown" aria-expanded="false"></button >' +
                    '<ul class="dropdown-menu bg-dark" aria-labelledby="dropdownMenu2">' +
                    /*----- Slett innlegg knapp -----*/
                    '<li><button class="dropdown-item text-light bg-dark" type="button" id="' + deleteid + owner + '">Slett innlegg <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
                    '<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /> </svg></button></li>' +
                    /*----- Rapporter innlegg knapp -----*/
                    '<li><button class="dropdown-item bg-dark text-light" type="button" id="' + reportid + owner + '" > Rapporter innlegg <svg xmlns = "http://www.w3.org/2000/svg" width = "16" height = "16" fill = "currentColor" class= "bi bi-flag-fill" viewBox = "0 0 16 16" >' +
                    '<path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />' +
                    '</svg ></button ></li> </ul></div ></div></div>' +
                    //Innlegg body
                    '<div class="card-body text-light" style="background: #111;">' +
                    '<div class="text-muted h7 mb-2">' +
                    '<i class="fa fa-clock-o"></i> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16"> <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" /> <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" /> </svg>' +
                    ' ' + time + '</div>' +
                    /*----- Innlegs tittel -----*/
                    '<h5 class="card-title text-light">' + title + '</h5>' +
                    '<p class="card-text">' +
                    /*----- Innlegs beskrivelse -----*/
                    ' ' + description + '</p>' +
                    //Innleggsbilde
                    '<img class="card-img m-0" style="height: 350px; object-fit: cover;" src="" alt="ingen bilde" id="' + picid + owner + '">' +
                    '<div class="container d-flex">' +
                    /*----- Se kommentarer -----*/
                    '<button class="link-secondary ms-auto btn-sm" id="' + commentviewbtnid + owner + '">Ingen kommentarer</button>' +
                    '</div>' +
                    //Innlegg footer
                    '<div class="card-footer d-flex" style="background: #111;">' +
                    '<button type="button" class="btn-dark w-50 mx-auto"' +
                    'style="background: #111;" id="' + commentid + owner + '">Kommenter ' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"' +
                    'fill="currentColor" class="bi bi-chat-square-text-fill"' +
                    'viewBox="0 0 16 16">' +
                    '<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" /> ' +
                    '</svg>' +
                    '</button>' +
                    '<button type="button" class="btn-dark w-50 mx-auto" onclick="startSamtale(\'' + owner + '\')"' +
                    'style="background: #111;">Send melding ' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"' +
                    'fill="currentColor" class="bi bi-chat-fill" viewBox="0 0 16 16">' +
                    '<path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z" />' +
                    '</svg>' +
                    '</button>' +
                    '</div>' +
                    /*----- Kommentarfelt -----*/
                    '<hr> <div class="input-group mb-3" id = "' + commentboxid + owner + '"> </div>' +
                    '<div class="list-group w-100 mx-auto border-dark" id="' + commentsectionid + owner + '"> </div>' +
                    '</div>' +
                    '</div>'
                );
            })
            .catch((error) => { //Dersom brukeren ikke har profilbilde
                var posts = document.getElementById("postCol");
                $(posts).append(
                    //Innlegg
                    '<div class="card gedf-card mx-auto mb-5" style="background: #111;">' +
                    //Innlegg header
                    '<div class="card-header" style="background: #111;">' +
                    '<div class="d-flex justify-content-between align-items-center">' +
                    '<div class="mr-2">' +
                    /*----- Profilbilde -----*/
                    '<img class="rounded-circle m-3" style="object-fit: cover;" width="50" height="50" src="img/blank-profile-circle.png" alt=""> </div> ' +
                    '<div class= "ml-2">' +
                    '<div class="h5 m-0 text-light">' + username + '</div>' +
                    '<div class="h7 text-light">' + realname + '</div> </div>' +
                    '<div class="dropdown ms-auto">' +
                    '<button class="btn dropdown-toggle text-light" type="button"' +
                    'style="background: #111;" id="dropdownMenu2"' +
                    'data-bs-toggle="dropdown" aria-expanded="false"></button >' +
                    '<ul class="dropdown-menu bg-dark" aria-labelledby="dropdownMenu2">' +
                    '<li><button class="dropdown-item text-light bg-dark"' +
                    /*----- Slett innlegg knapp -----*/
                    'type="button" id="' + deleteid + owner + '">Slett innlegg <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
                    '<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /> </svg></button></li>' +
                    '<li><button class="dropdown-item bg-dark text-light"' +
                    /*----- Rapporter innlegg knapp -----*/
                    'type="button" id="' + reportid + owner + '"> Rapporter innlegg <svg xmlns = "http://www.w3.org/2000/svg" width = "16" height = "16" fill = "currentColor" class= "bi bi-flag-fill" viewBox = "0 0 16 16" >' +
                    '<path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />' +
                    '</svg ></button ></li> </ul></div ></div></div>' +
                    //Innlegg body
                    '<div class="card-body text-light" style="background: #111;">' +
                    '<div class="text-muted h7 mb-2">' +
                    '<i class="fa fa-clock-o"></i> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16"> <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" /> <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" /> </svg>' +
                    ' ' + time + '</div>' +
                    /*----- Innlegs tittel -----*/
                    '<h5 class="card-title text-light">' + title + '</h5>' +
                    '<p class="card-text">' +
                    /*----- Innlegs beskrivelse -----*/
                    ' ' + description + '</p>' +
                    //Innleggsbilde
                    '<img class="card-img m-0" style="height: 350px; object-fit: cover;" src="" alt="ingen bilde" id="' + picid + owner + '">' +
                    '<div class="container d-flex">' +
                    /*----- Se kommentarer -----*/
                    '<button class="link-secondary ms-auto btn-sm" id="' + commentviewbtnid + owner + '">Ingen kommentarer</button>' +
                    '</div>' +
                    //Innlegg footer
                    '<div class="card-footer d-flex" style="background: #111;">' +
                    '<button type="button" class="btn-dark w-50 mx-auto" style="background: #111;" id="' + commentid + owner + '">Kommenter ' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"' +
                    'fill="currentColor" class="bi bi-chat-square-text-fill"' +
                    'viewBox="0 0 16 16">' +
                    '<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" /> ' +
                    '</svg>' +
                    '</button>' +
                    '<button type="button" class="btn-dark w-50 mx-auto" onclick="startSamtale(\'' + owner + '\')"' +
                    'style="background: #111;">Send melding ' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"' +
                    'fill="currentColor" class="bi bi-chat-fill" viewBox="0 0 16 16">' +
                    '<path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z" />' +
                    '</svg>' +
                    '</button>' +
                    '</div>' +
                    /*----- Kommentarfelt -----*/
                    '<hr> <div class="input-group mb-3" id = "' + commentboxid + owner + '"> </div>' +
                    '<div class="list-group w-100 mx-auto border-dark" id="' + commentsectionid + owner + '"> </div>' +
                    '</div>' +
                    '</div>'
                );
            }).then(() => {
                //Sjekker antall kommentarer
                var commentSize = 0;
                firebase.database().ref('/' + platform + ' gruppe/Innlegg/' + postKey + '/Kommentarer').on('child_added', function (snapshot) {
                    commentSize++;
                    document.getElementById(commentviewbtnid + owner).innerHTML = commentSize + " Kommentarer";
                })

                //Viser slett innlegg knapp om det er ditt innlegg, ellers så vises rapporter
                if (owner == user) {
                    document.getElementById(reportid + owner).style.display = "none";
                } else {
                    document.getElementById(deleteid + owner).style.display = "none";
                }

                //Rapporter innlegg
                document.getElementById(reportid + owner).onclick = function () {
                    firebase.database().ref('/' + platform + ' gruppe/Rapporterte Innlegg').push({
                        Eier: owner,
                        Rapporterer: user,
                        InnleggsID: postKey
                    })
                    alert("Innlegget til " + username + " er rapportert");
                }

                //Slett innlegg
                document.getElementById(deleteid + owner).onclick = function () {
                    firebase.database().ref('/' + platform + ' gruppe/Innlegg/' + postKey).remove();
                    alert("Innlegget ditt er nå slettet");
                    location.reload();
                }

                //Append kommentar input og knapp
                document.getElementById(commentid + owner).onclick = function () {
                    this.disabled = true;
                    var cmntBox = document.getElementById(commentboxid + owner);
                    $(cmntBox).append(
                        '<input type="text" class="form-control border-dark text-light" placeholder="Skriv en kommentar... "' +
                        'aria-label="Recipients username" aria-describedby="button-addon2" style="background-color:rgb(60, 64, 67, 0.90)" ' +
                        'id="' + commentfieldid + owner + '"> <button class="btn btn-primary" type="button" id="' + commentpostid + owner + '">Publiser</button>'
                    ).ready(function () {
                        //Legg ut kommentar med tidspunkt
                        var datetimeCmt = new Date().toLocaleDateString("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                        });
                        datetimeCmt = datetimeCmt.split('/').join('.');
                        document.getElementById(commentpostid + owner).onclick = function () {
                            var commentInput = document.getElementById(commentfieldid + owner);
                            var comment = commentInput.value;
                            if (commentInput != "") {
                                firebase.database().ref('/' + platform + ' gruppe/Innlegg/' + postKey).child("Kommentarer").push({
                                    Bruker: user,
                                    Kommentar: comment,
                                    Tidspunkt: datetimeCmt
                                })
                            }
                            document.getElementById(commentfieldid + owner).value = null;
                        }
                    });
                }

                //Se kommentarfelt
                document.getElementById(commentviewbtnid + owner).onclick = function () {
                    this.disabled = true;
                    var cmntSection = document.getElementById(commentsectionid + owner);
                    //Sjekker kommentarer tabellen for kommentarer
                    firebase.database().ref('/' + platform + ' gruppe/Innlegg/' + postKey + '/Kommentarer').on('child_added', function (snapshot) {
                        var comment = snapshot.child("Kommentar").val();
                        var user = snapshot.child("Bruker").val();
                        var datetime = snapshot.child("Tidspunkt").val();
                        //Henter brukernavnet fra bruker tabellen
                        firebase.database().ref('/Bruker/' + user).once('value').then((snapshot) => {
                            var username = snapshot.child("Brukernavn").val();
                            //Henting av profilbilde
                            var storage = firebase.storage();
                            var storageRef = storage.ref();
                            var pictureStorage = storageRef.child("user/" + user + "/profile.jpg");

                            pictureStorage.getDownloadURL()
                                .then((pictureURL) => { //Har profilbilde
                                    $(cmntSection).append(
                                        '<a href="#" class="list-group-item text-light border-dark mb-0 rounded-3" style="background: #111;"> <div class = "w-100 d-flex"> <img class = "rounded-circle m-1" width="35" height="35"' +
                                        'src="' + pictureURL + '" alt="Profilbilde" style="object-fit: cover;"> <strong class = "my-auto mx-1">' + username + '</strong> <text class="text-muted ms-auto my-auto">' + datetime + ' </text> </div><text style="padding-left: 50px;">' + comment + '</text></a>'
                                    )
                                })
                                .catch((error) => { //Har ikke profilbilde
                                    $(cmntSection).append(
                                        '<a href="#" class="list-group-item text-light border-dark mb-0 rounded-3" style="background: #111;"> <div class = "w-100 d-flex"> <img class="rounded-circle m-1" width="35" height="35"' +
                                        'src="img/blank-profile-circle.png" alt="Profilbilde" style="object-fit: cover;"> <strong class = "my-auto mx-1">' + username + '</strong> <text class="text-muted ms-auto my-auto">' + datetime + ' </text></div> <text style="padding-left: 50px;">' + comment + '</text></a>'
                                    )
                                });
                        })
                    })
                }

                //Henting av Innleggsbilde, skjer etter at et innlegg er appendet til siden
                var storage = firebase.storage();
                var storageRef = storage.ref();
                var pictureStorage = storageRef.child("innlegg/" + (owner + picid) + "/innlegg.jpg");

                pictureStorage.getDownloadURL()
                    .then((pictureURL) => {
                        document.getElementById(picid + owner).src = pictureURL; //Setter bilde på innlegget
                        //console.log("Bilde funnet");
                    })
                    .catch((error) => {
                        document.getElementById(picid + owner).style.display = "none"; //Fjerne img tag dersom det ikke finnes noe bilde
                    });
            })
    })
});

