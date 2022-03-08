const whiz = JSON.parse(sessionStorage.getItem("bruker"));
var user = whiz.Uid;
console.log(user);


firebase.database().ref('/Bruker/' + user).once('value').then((snapshot) => {

    //Plattformer
    /* Steam */
    if (snapshot.child('Steam').val() != null) {
        document.getElementById('steamGroup').style.display = "block";
    }
    /* Xbox */
    if (snapshot.child('Xbox').val() != null) {
        document.getElementById('xboxGroup').style.display = "block";
    }
    /* Playstation */
    if (snapshot.child('Playstation').val() != null) {
        document.getElementById('psGroup').style.display = "block";
    }
    /* Switch */
    if (snapshot.child('Switch').val() != null) {
        document.getElementById('switchGroup').style.display = "block";
    }
})

//Antall medlemmer på platformkort
var xboxCount = 0;
firebase.database().ref('/Xbox gruppe/Medlemmer').on('child_added', function (snapshot) {
    xboxCount++;
    document.getElementById("xboxMembers").innerHTML = xboxCount + " Medlemmer";
})

var psCount = 0;
firebase.database().ref('/Playstation gruppe/Medlemmer').on('child_added', function (snapshot) {
    psCount++;
    document.getElementById("psMembers").innerHTML = psCount + " Medlemmer";
})

var switchCount = 0;
firebase.database().ref('/Switch gruppe/Medlemmer').on('child_added', function (snapshot) {
    switchCount++;
    document.getElementById("switchMembers").innerHTML = switchCount + " Medlemmer";
})

var steamCount = 0;
firebase.database().ref('/Steam gruppe/Medlemmer').on('child_added', function (snapshot) {
    steamCount++;
    document.getElementById("steamMembers").innerHTML = steamCount + " Medlemmer";
})

$(document).on("click", ".browse", function () {
    var file = $(this).parents().find(".file");
    file.trigger("click");
});

/* ---------- Kode for Opprett ny gruppe begynner her ----------*/
document.getElementById("newGroup_btn").onclick = function () {
    document.getElementById("superDiv").style.display = "none";
    document.getElementById("subDiv").style.display = "block";
}

//Setter valgt bilde som preview for forsidebilde
$('input[type="file"]').change(function (e) {
    var fileName = e.target.files[0].name;
    $("#file").val(fileName);

    var reader = new FileReader();
    reader.onload = function (e) {
        // get loaded data and render thumbnail.
        document.getElementById("preview").src = e.target.result;
    };
    // read the image file as a data URL.
    reader.readAsDataURL(this.files[0]);
});
/* ---------- Kode for Opprett ny gruppe slutter her ----------*/


//Oppretting av ny gruppe
var fil = {};
document.getElementById("formFile").onchange = function (e) {
    fil = e.target.files[0];
    console.log(fil);
}

document.getElementById("grpCreate").onclick = function () {
    var groupName = document.getElementById("grpName").value;
    var groupAbout = document.getElementById("grpAbout").value;
    var discord = null;
    var pc = null;
    var ps = null;
    var xbox = null;
    var nintendo = null;
    var id = Date.now();

    //Henter navn fra databasen slik at vi kan unngå grupper med samme navn
    var name;
    firebase.database().ref('/Grupper').on('child_added', function (snapshot) {
        name = snapshot.child("Navn").val();
    })

    if (document.getElementById("discordCheck").checked) {
        if (document.getElementById("discordform").value != "") { discord = document.getElementById("discordform").value; }
    }
    if (document.getElementById("pcCheck").checked) {
        pc = "yes";
    }
    if (document.getElementById("psCheck").checked) {
        ps = "yes";
    }
    if (document.getElementById("xboxCheck").checked) {
        xbox = "yes";
    }
    if (document.getElementById("switchCheck").checked) {
        nintendo = "yes";
    }
    if (groupName != name && groupName != "") {
        firebase.database().ref('/Grupper').push({
            Eier: user,
            Navn: groupName,
            Om: groupAbout,
            Discord: discord,
            Pc: pc,
            Ps: ps,
            Xbox: xbox,
            Switch: nintendo,
            BildeID: id
        }).then(() => { //Opplasting av forsidebilde
            if (fil instanceof File) {
                firebase.storage().ref("grupper/" + (user + id) + "/gruppe.jpg").put(fil).then(() => {
                    location.reload();
                });
            } else {
                location.reload();
            }
        })
    } else {
        alert("Ugyldig gruppenavn! (Enten er navnefeltet tomt, eller så finnes det allerede en gruppe med dette navnet)");
    }
}

//Henting av gruppekort "Mine innlegg" for grupper du "eier/har selv laget"
firebase.database().ref('/Grupper').on('child_added', function (snapshot) {
    var name = snapshot.child("Navn").val();
    var about = snapshot.child("Om").val();
    var owner = snapshot.child("Eier").val();
    var id = snapshot.child("BildeID").val();
    var groupKey = snapshot.key;

    //Henting av forsidebilde
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var pictureStorage = storageRef.child("grupper/" + (user + id) + "/gruppe.jpg");

    pictureStorage.getDownloadURL()
        .then((pictureURL) => { //Har Forsidebilde
            if (owner == user) {
                $(document.getElementById("myGroups")).append(
                    '<div class="col-lg-4 pt-2" onclick="getGroup(\'' + groupKey + '\')">' + //getGroup ligger i allgroups.ejs
                    '<div class="card rounded-3 chromahover">' +
                    '<img class="card-img-top" src="' + pictureURL + '" alt="Card image cap"' +
                    'style="height: 12rem; object-fit: cover">' +
                    '<div class="card-img-overlay"> <i class="fas fa-crown text-warning"></i></div>'+
                    '<div class="card-body">' +
                    '<h5 class="card-title">' + name + '</h5>' +
                    '<br>' +
                    '<p class="card-text"><small class="text-muted">Antall medlemmer</small></p></div></div></div>'
                )
            }
        })
        .catch((error) => { //Har ikke Forsidebilde
            if (owner == user) {
                $(document.getElementById("myGroups")).append(
                    '<div class="col-lg-4 pt-2" onclick="getGroup(\'' + groupKey + '\')">' + //getGroup ligger i allgroups.ejs
                    '<div class="card rounded-3 chromahover">' +
                    '<img class="card-img-top" src="img/Amin.jpg" alt="Card image cap"' +
                    'style="height: 12rem; object-fit: cover">' +
                    '<div class="card-img-overlay"> <i class="fas fa-crown text-warning"></i></div>'+
                    '<div class="card-body">' +
                    '<h5 class="card-title">' + name + '</h5>' +
                    '<br>' +
                    '<p class="card-text"><small class="text-muted">Antall medlemmer</small></p></div></div></div>'
                )
            }
        });
})
