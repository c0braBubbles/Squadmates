//Henter UID til innlogget bruker
const whiz = JSON.parse(sessionStorage.getItem("bruker"));
var user = whiz.Uid;

//Sjekker hvilken gruppe som ble klikket på
var url = window.location.href;
var split = url.split('/');
var key = (split[split.length - 1]);
console.log(key);


//Henter statisk gruppedata, forsidebilde tittel og beskrivelse
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
        })
        .catch((error) => {
            var headerPic = document.getElementById("headerGroup");
            headerPic.src = "img/Amin.jpg";
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
    //hvis innlogget bruker er eier, fjern bli medlem knapp
    if (owner == user) {
        document.getElementById("joinGroupBtn").style.display = "none";
    }
    //hvis innlogget bruker ikke er eier, fjern rediger gruppe knapp
    if (owner != user) {
        document.getElementById("editGroupBtn").style.display = "none";
    }

})
