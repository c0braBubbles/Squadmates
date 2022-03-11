//Henter UID til innlogget bruker
const whiz = JSON.parse(sessionStorage.getItem("bruker"));
var user = whiz.Uid;

//Sjekker hvilken gruppe som ble klikket på
var url = window.location.href;
var split = url.split('/');
var key = (split[split.length - 1]);
console.log(key);


/* ------------ Henter statisk gruppedata, forsidebilde tittel og beskrivelse ------------ */
firebase.database().ref('/Grupper/' + key).once('value').then((snapshot) => {
    var name = snapshot.child("Navn").val();
    var about = snapshot.child("Om").val();
    var owner = snapshot.child("Eier").val();
    var id = snapshot.child("BildeID").val();

    var discord = snapshot.child("Discord").val();
    var xbox = snapshot.child("Xbox").val();
    var ps = snapshot.child("Ps").val();
    var nintendo = snapshot.child("Switch").val();
    var pc = snapshot.child("Pc").val();


    //Tittel og om gruppen
    var groupName = document.getElementById("groupName");
    var groupAbout = document.getElementById("groupAbout");
    groupName.innerHTML = name;
    groupAbout.innerHTML = about;
    //Henting av forsidebilde
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var pictureStorage = storageRef.child("grupper/" + (owner + id) + "/gruppe.jpg");

    pictureStorage.getDownloadURL()
        .then((pictureURL) => {
            var headerPic = document.getElementById("headerGroup");
            headerPic.src = pictureURL;
                $(".loader-wrapper").fadeOut("slow");
        })
        .catch((error) => {
            var headerPic = document.getElementById("headerGroup");
            headerPic.src = "img/Amin.jpg";
                $(".loader-wrapper").fadeOut("slow");
        });

    //Platformer på "om" siden
    if (xbox != null) {
        $(document.getElementById("platformsGroup")).append(
            '<a class="list-group-item text-light border-dark" style="background: #111;">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"' +
            'fill="currentColor" class="bi bi-xbox m-3" viewBox="0 0 16 16">' +
            '<path d="M7.202 15.967a7.987 7.987 0 0 1-3.552-1.26c-.898-.585-1.101-.826-1.101-1.306 0-.965 1.062-2.656 2.879-4.583C6.459 7.723 7.897 6.44 8.052 6.475c.302.068 2.718 2.423 3.622 3.531 1.43 1.753 2.088 3.189 1.754 3.829-.254.486-1.83 1.437-2.987 1.802-.954.301-2.207.429-3.239.33Zm-5.866-3.57C.589 11.253.212 10.127.03 8.497c-.06-.539-.038-.846.137-1.95.218-1.377 1.002-2.97 1.945-3.95.401-.417.437-.427.926-.263.595.2 1.23.638 2.213 1.528l.574.519-.313.385C4.056 6.553 2.52 9.086 1.94 10.653c-.315.852-.442 1.707-.306 2.063.091.24.007.15-.3-.319Zm13.101.195c.074-.36-.019-1.02-.238-1.687-.473-1.443-2.055-4.128-3.508-5.953l-.457-.575.494-.454c.646-.593 1.095-.948 1.58-1.25.381-.237.927-.448 1.161-.448.145 0 .654.528 1.065 1.104a8.372 8.372 0 0 1 1.343 3.102c.153.728.166 2.286.024 3.012a9.495 9.495 0 0 1-.6 1.893c-.179.393-.624 1.156-.82 1.404-.1.128-.1.127-.043-.148ZM7.335 1.952c-.67-.34-1.704-.705-2.276-.803a4.171 4.171 0 0 0-.759-.043c-.471.024-.45 0 .306-.358A7.778 7.778 0 0 1 6.47.128c.8-.169 2.306-.17 3.094-.005.85.18 1.853.552 2.418.9l.168.103-.385-.02c-.766-.038-1.88.27-3.078.853-.361.176-.676.316-.699.312a12.246 12.246 0 0 1-.654-.319Z" />' +
            '</svg> Xbox</a>')
    }
    if (ps != null) {
        $(document.getElementById("platformsGroup")).append(
            '<a class="list-group-item text-light border-dark" style="background: #111;">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"' +
            'fill="currentColor" class="bi bi-playstation m-3" viewBox="0 0 16 16">' +
            '<path d="M15.858 11.451c-.313.395-1.079.676-1.079.676l-5.696 2.046v-1.509l4.192-1.493c.476-.17.549-.412.162-.538-.386-.127-1.085-.09-1.56.08l-2.794.984v-1.566l.161-.054s.807-.286 1.942-.412c1.135-.125 2.525.017 3.616.43 1.23.39 1.368.962 1.056 1.356ZM9.625 8.883v-3.86c0-.453-.083-.87-.508-.988-.326-.105-.528.198-.528.65v9.664l-2.606-.827V2c1.108.206 2.722.692 3.59.985 2.207.757 2.955 1.7 2.955 3.825 0 2.071-1.278 2.856-2.903 2.072Zm-8.424 3.625C-.061 12.15-.271 11.41.304 10.984c.532-.394 1.436-.69 1.436-.69l3.737-1.33v1.515l-2.69.963c-.474.17-.547.411-.161.538.386.126 1.085.09 1.56-.08l1.29-.469v1.356l-.257.043a8.454 8.454 0 0 1-4.018-.323Z" />' +
            '</svg> Playstation </a>')
    }
    if (nintendo != null) {
        $(document.getElementById("platformsGroup")).append(
            '<a class="list-group-item text-light border-dark" style="background: #111;">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-nintendo-switch m-3" viewBox="0 0 16 16">' +
            '<path d="M9.34 8.005c0-4.38.01-7.972.023-7.982C9.373.01 10.036 0 10.831 0c1.153 0 1.51.01 1.743.05 1.73.298 3.045 1.6 3.373 3.326.046.242.053.809.053 4.61 0 4.06.005 4.537-.123 4.976-.022.076-.048.15-.08.242a4.136 4.136 0 0 1-3.426 2.767c-.317.033-2.889.046-2.978.013-.05-.02-.053-.752-.053-7.979Zm4.675.269a1.621 1.621 0 0 0-1.113-1.034 1.609 1.609 0 0 0-1.938 1.073 1.9 1.9 0 0 0-.014.935 1.632 1.632 0 0 0 1.952 1.107c.51-.136.908-.504 1.11-1.028.11-.285.113-.742.003-1.053ZM3.71 3.317c-.208.04-.526.199-.695.348-.348.301-.52.729-.494 1.232.013.262.03.332.136.544.155.321.39.556.712.715.222.11.278.123.567.133.261.01.354 0 .53-.06.719-.242 1.153-.94 1.03-1.656-.142-.852-.95-1.422-1.786-1.256Z" />' +
            '<path d="M3.425.053a4.136 4.136 0 0 0-3.28 3.015C0 3.628-.01 3.956.005 8.3c.01 3.99.014 4.082.08 4.39.368 1.66 1.548 2.844 3.224 3.235.22.05.497.06 2.29.07 1.856.012 2.048.009 2.097-.04.05-.05.053-.69.053-7.94 0-5.374-.01-7.906-.033-7.952-.033-.06-.09-.063-2.03-.06-1.578.004-2.052.014-2.26.05Zm3 14.665-1.35-.016c-1.242-.013-1.375-.02-1.623-.083a2.81 2.81 0 0 1-2.08-2.167c-.074-.335-.074-8.579-.004-8.907a2.845 2.845 0 0 1 1.716-2.05c.438-.176.64-.196 2.058-.2l1.282-.003v13.426Z" />' +
            '</svg> Nintendo Switch</a>')
    }
    if (pc != null) {
        $(document.getElementById("platformsGroup")).append(
            '<a class="list-group-item text-light border-dark" style="background: #111;">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"' +
            'fill="currentColor" class="bi bi-pc-display m-3" viewBox="0 0 16 16">' +
            '<path d="M8 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V1Zm1 13.5a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0Zm2 0a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0ZM9.5 1a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5ZM9 3.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5ZM1.5 2A1.5 1.5 0 0 0 0 3.5v7A1.5 1.5 0 0 0 1.5 12H6v2h-.5a.5.5 0 0 0 0 1H7v-4H1.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5H7V2H1.5Z" />' +
            '</svg> PC </a>')
    }
    if (discord != null) {
        $(document.getElementById("discordcolGroup")).append(
            '<a href="' + discord + '" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center bg-gradient text-light mt-2 rounded-3"' +
            'style="background-color:#5865F2;">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-discord" viewBox="0 0 16 16">' +
            '<path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />' +
            '</svg> Discord Server ' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"' +
            'fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">' +
            '<path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z" />' +
            '<path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" /> </svg> </a>'
        )
    }
    //Info om gruppens eier
    firebase.database().ref('/Bruker/' + owner).once('value').then((snapshot) => {
        var name = snapshot.child("Brukernavn").val();
        document.getElementById("ownernameGroup").innerHTML = name;
        //Henting av profilbilde til gruppens eier
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var pictureStorage = storageRef.child("user/" + owner + "/profile.jpg");
        pictureStorage.getDownloadURL()
            .then((pictureURL) => { //Dersom brukeren har profilbilde
                document.getElementById("ownerpicGroup").src = pictureURL;
            })
            .catch((error) => { //Dersom brukeren ikke har profilbilde
                document.getElementById("ownerpicGroup").src = "img/blank-profile-circle.png";
            });
    })

    //hvis innlogget bruker er eier, fjern bli medlem og forlat gruppe knapp
    if (owner == user) {
        document.getElementById("joinGroupBtn").style.display = "none";
        document.getElementById("leaveGroupBtn").style.display = "none";
    }
    //hvis innlogget bruker ikke er eier, fjern rediger gruppe knapp
    if (owner != user) {
        document.getElementById("editGroupBtn").style.display = "none";
    }
    firebase.database().ref('/Bruker/' + user + '/Grupper/' + key).once('value').then((snapshot) => {
        var medlem = snapshot.child("Key").val();
        //hvis innlogget bruker er medlem, fjern bli med i gruppe knapp
        if (medlem != null) {
            document.getElementById("joinGroupBtn").style.display = "none";
        } else {
            //hvis innlogget bruker ikke er medlem, fjern forlat gruppe knapp og favoritt knapper
            document.getElementById("leaveGroupBtn").style.display = "none";
            document.getElementById("addfavoriteGroupBtn").style.display = "none";
            document.getElementById("removefavoriteGroupBtn").style.display = "none";
        }
    })
    //Hvis denne gruppen er favoritt fjern den hvite favoritt knappen og legg til den gule
    firebase.database().ref('/Bruker/' + user + '/Favoritt grupper/' + key).once('value').then((snapshot) => {
        var favoritt = snapshot.child("Key").val();
        if (favoritt != null) {
            document.getElementById("addfavoriteGroupBtn").style.display = "none";
        } else {
            document.getElementById("removefavoriteGroupBtn").style.display = "none";
        }
    })

    //Forlat gruppe knapp
    document.getElementById("leaveGroupBtn").onclick = function () {
        firebase.database().ref('/Grupper/' + key + '/Medlemmer/' + user).remove(); //Fjerner bruker fra medlemmer i gruppen i databasen
        firebase.database().ref('/Bruker/' + user + '/Grupper/' + key).remove(); //Fjerner gruppen fra grupper tabellen under bruker i databasen
        firebase.database().ref('/Bruker/' + user + '/Favoritt grupper/' + key).remove(); //Fjerner gruppen fra favoritter dersom man forlater gruppen
        //location.reload();
    }
    //Bli med i gruppe knapp
    document.getElementById("joinGroupBtn").onclick = function () {
        firebase.database().ref('/Grupper/' + key + '/Medlemmer').child(user).set({
            BrukerID: user
        })
        firebase.database().ref('/Bruker/' + user + '/Grupper/').child(key).set({
            Key: key
        })
    }
    //Legg til gruppe som favoritt knapp (hvit stjerne)
    document.getElementById("addfavoriteGroupBtn").onclick = function () {
        firebase.database().ref('/Bruker/' + user + '/Favoritt grupper/').child(key).set({
            Key: key
        })
        location.reload();
    }
    //Fjern gruppe som favoritt knapp (gul stjerne)
    document.getElementById("removefavoriteGroupBtn").onclick = function () {
        firebase.database().ref('/Bruker/' + user + '/Favoritt grupper/').child(key).remove();
        location.reload();
    }
})

/* ------------ Henter statisk gruppedata, SLUTT ------------ */


/* ------------ Opplasting av innlegg i gruppen ------------ */
var fil = {};
document.getElementById("chooseGroupPic").onchange = function (e) {
    fil = e.target.files[0];
    console.log(fil);
}

document.getElementById("upload").onclick = function () {
    var titleInp = document.getElementById("titleGroup").value;
    var descInp = document.getElementById("descriptionGroup").value;
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
        firebase.database().ref('/Grupper/' + key + '/Innlegg').push({
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
/* ------------ Opplasting av innlegg i gruppen ------------ */

/* ------------ Henting av innlegg fra database ------------ */
firebase.database().ref('/Grupper/' + key + '/Innlegg').on('child_added', function (snapshot) {
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
                firebase.database().ref('/Grupper/' + key + '/Innlegg/' + postKey + '/Kommentarer').on('child_added', function (snapshot) {
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
                    firebase.database().ref('/Grupper/' + key + '/Rapporterte Innlegg').push({
                        Eier: owner,
                        Rapporterer: user,
                        InnleggsID: postKey
                    })
                    alert("Innlegget til " + username + " er rapportert");
                }

                //Slett innlegg
                document.getElementById(deleteid + owner).onclick = function () {
                    firebase.database().ref('/Grupper/' + key + '/Innlegg/' + postKey).remove();
                    firebase.storage().ref("innlegg/" + (owner + picid) + "/innlegg.jpg").delete();
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
                                firebase.database().ref('/Grupper/' + key + '/Innlegg/' + postKey).child("Kommentarer").push({
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
                    firebase.database().ref('/Grupper/' + key + '/Innlegg/' + postKey + '/Kommentarer').on('child_added', function (snapshot) {
                        var comment = snapshot.child("Kommentar").val();
                        var cmtOwner = snapshot.child("Bruker").val();
                        var datetime = snapshot.child("Tidspunkt").val();
                        var cmtKey = snapshot.key;
                        var deletecommentid = cmtKey + "delete";
                        var reportcommentid = cmtKey + "report";
                        //Henter brukernavnet fra bruker tabellen
                        firebase.database().ref('/Bruker/' + cmtOwner).once('value').then((snapshot) => {
                            var username = snapshot.child("Brukernavn").val();
                            //Henting av profilbilde
                            var storage = firebase.storage();
                            var storageRef = storage.ref();
                            var pictureStorage = storageRef.child("user/" + cmtOwner + "/profile.jpg");

                            pictureStorage.getDownloadURL()
                                .then((pictureURL) => { //Har profilbilde
                                    $(cmntSection).append(
                                        '<a class="list-group-item text-light border-dark mb-0 rounded-3" style="background: #111;"> <div class = "w-100 d-flex"> <img class = "rounded-circle m-1" width="35" height="35"' +
                                        'src="' + pictureURL + '" alt="Profilbilde" style="object-fit: cover;"> <strong class = "my-auto mx-1">' + username + '</strong>' +
                                        '<div class="dropdown ms-auto my-auto"> <text class="text-muted">' + datetime + ' </text> <button class="btn dropdown-toggle text-light" type="button" style="background: #111;" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false"></button>' +
                                        '<ul class="dropdown-menu bg-dark ms-auto" aria-labelledby="dropdownMenu2"> <li><button class="dropdown-item text-light bg-dark"' +
                                        'type="button" id="' + deletecommentid + cmtOwner + '">Slett kommentar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
                                        '<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /></svg></button></li>' +
                                        '<li><button class="dropdown-item bg-dark text-light" type="button" id="' + reportcommentid + cmtOwner + '">Rapporter kommentar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"' +
                                        'class="bi bi-flag-fill" viewBox="0 0 16 16"> <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" /></svg></button>' +
                                        '</li></ul></div></div>' +
                                        '<text style="padding-left: 50px;">' + comment + '</text></a>'
                                    )
                                })
                                .catch((error) => { //Har ikke profilbilde
                                    $(cmntSection).append(
                                        '<a class="list-group-item text-light border-dark mb-0 rounded-3" style="background: #111;"> <div class = "w-100 d-flex"> <img class = "rounded-circle m-1" width="35" height="35"' +
                                        'src="img/blank-profile-circle.png" alt="Profilbilde" style="object-fit: cover;"> <strong class = "my-auto mx-1">' + username + '</strong>' +
                                        '<div class="dropdown ms-auto my-auto"> <text class="text-muted">' + datetime + ' </text> <button class="btn dropdown-toggle text-light" type="button" style="background: #111;" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false"></button>' +
                                        '<ul class="dropdown-menu bg-dark ms-auto" aria-labelledby="dropdownMenu2"> <li><button class="dropdown-item text-light bg-dark"' +
                                        'type="button" id="' + deletecommentid + cmtOwner + '">Slett kommentar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
                                        '<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /></svg></button></li>' +
                                        '<li><button class="dropdown-item bg-dark text-light" type="button" id="' + reportcommentid + cmtOwner + '">Rapporter kommentar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"' +
                                        'class="bi bi-flag-fill" viewBox="0 0 16 16"> <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" /></svg></button>' +
                                        '</li></ul></div></div>' +
                                        '<text style="padding-left: 50px;">' + comment + '</text></a>'
                                    )
                                }).then(() => {
                                    //Viser slett kommentar knapp om det er din kommentar, ellers så vises rapporter kommentar knappen
                                    if (cmtOwner == user) {
                                        document.getElementById(reportcommentid + cmtOwner).style.display = "none";
                                    } else {
                                        document.getElementById(deletecommentid + cmtOwner).style.display = "none";
                                    }

                                    //Slett kommentar funksjon
                                    document.getElementById(deletecommentid + cmtOwner).onclick = function () {
                                        if (cmtOwner == user) {
                                            firebase.database().ref('Grupper/'+ key +'/Innlegg/' + postKey + '/Kommentarer/' + cmtKey).remove();
                                            alert("kommentaren din er slettet");
                                            location.reload();
                                        }
                                    }

                                    //Rapporter kommentar funksjon
                                    document.getElementById(reportcommentid + cmtOwner).onclick = function () {
                                        firebase.database().ref('/Grupper/' + key + '/Rapporterte kommentarer').push({
                                            Eier: cmtOwner,
                                            Rapporterer: user,
                                            KommentarID: cmtKey,
                                            InnleggsID: postKey
                                        })
                                        alert("kommentaren til: " + username + " er rapportert");
                                    }
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
/* ------------ Henting av innlegg fra database SLUTT ------------ */

/* ------------ Sjekker gruppens medlemmer ------------ */
var userID;
var list;
var count = 0;
var countMembers;
var collections;

firebase.database().ref('Grupper/' + key + '/Medlemmer').on('child_added', function (snapshot) {
    var userID = snapshot.child("BrukerID").val();
    count++;
    countMembers = document.getElementById("membercountGroup");
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
                list = document.getElementById("memberlistGroup");
                $(list).append(`<a href="#" class="list-group-item text-light border-dark" style="background: #111;" onclick="showProfile('${name}', '${uid}')">
                                    <img class="rounded-circle m-3" width="50" height="50" style="object-fit: cover" src="${pictureURL}" alt="Profilbilde">
                                ${name}</a>`);
                
            })
            .catch((error) => { //Dersom brukeren ikke har profilbilde
                list = document.getElementById("memberlistGroup");
                $(list).append('<a href="#" class="list-group-item text-light border-dark" style="background: #111;">' +
                    '<img class="rounded-circle m-3" width="50" height="50" style="object-fit: cover" src="img/blank-profile-circle.png" alt="Profilbilde">'
                    + name + '</a>');
              
            });
    })
});
/* ------------ Sjekker gruppens medlemmer SLUTT ------------ */