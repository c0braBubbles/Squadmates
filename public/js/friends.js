const whiz = JSON.parse(sessionStorage.getItem("bruker"));

if(whiz.Following != undefined) {
    for(let i = 0; i < Object.keys(whiz.Following).length; i++) {
        if(whiz.Following[i] == null) {
            i++;
        }

        var storage = firebase.storage();
        var storageRef = storage.ref();
        var pictureStorage = storageRef.child("user/" + whiz.Following[i].Uid + "/profile.jpg");


        pictureStorage.getDownloadURL().then((pictureURL) => {
            document.getElementById("friendsList").innerHTML += `<li class="list-group-item border-dark d-flex justify-content-between align-items-center"
                                                                    style="color: white; background: #111;">
                                                                    <a href="#"> <img onclick="showProfile('${whiz.Following[i].Brukernavn}', '${whiz.Following[i].Uid}')" src="${pictureURL}" alt=".." class="rounded-circle display-pic"
                                                                            style="height:50px; width:50px;"> </a>
                                                                    <h3>${whiz.Following[i].Brukernavn}</h3>
                                                                    <a href=""> <img src="img/chat-fill.svg" alt="..."
                                                                        style="filter:invert(100%); width:40px; height:40px;"> </a>
                                                                </li>`;
        }).catch((error) => {
            document.getElementById("friendsList").innerHTML += `<li class="list-group-item border-dark d-flex justify-content-between align-items-center"
                                                                    style="color: white; background: #111;">
                                                                    <a href="#"> <img onclick="showProfile('${whiz.Following[i].Brukernavn}', '${whiz.Following[i].Uid}')" src="img/blank-profile-circle.png" alt=".." class="rounded-circle display-pic"
                                                                            style="height:50px; width:50px;"> </a>
                                                                    <h3>${whiz.Following[i].Brukernavn}</h3>
                                                                    <a href=""> <img src="img/chat-fill.svg" alt="..."
                                                                        style="filter:invert(100%); width:40px; height:40px;"> </a>
                                                                </li>`;
        });
    }
}


// Kode for å kunne søke:
let nameTab_search = []; 
let countUser = 0; 

firebase.database().ref('/Bruker').on('child_added', function(snapshot) {
    let name = snapshot.child('Brukernavn').val();
    let userID = snapshot.key;
    let bio = snapshot.child('Biografi').val(); 
    let liID = 'list_item' + countUser; 
    let picID = 'picture' + countUser; 
    nameTab_search.push(name); 


    $(document.getElementById("ul_result")).append(
        `<li class="list-group-item person-list-item" id="${liID}" onclick="showProfile('${name}', '${userID}')">
            <div class="row">
                <div class="col-auto">
                    <a href="#"> 
                        <img src="" id="${picID}" alt="..." class="rounded-circle" style="width: 45px; height: 45px;"> 
                    </a>
                </div>
                <div class="col">
                    <h5 style="margin-bottom:0px; font-weight: bold;" class="text-light">${name}</h5>
                    <h6 class = "text-muted" style="margin-bottom:0px; overflow-x: hidden !important; height: 20px;">
                        ${bio}
                    </h6>
                </div>
            </div>
        </li>`
    );


    var storage = firebase.storage();
	var storageRef = storage.ref();
	var pictureStorage = storageRef.child("user/" + userID + "/profile.jpg");
    
    pictureStorage.getDownloadURL().then((pictureURL) => {
        document.getElementById(picID).src = pictureURL; 
    }).catch((error) => {
        document.getElementById(picID).src = 'img/Amin.jpg';
    });

    countUser += 1;
});


// Selve søkefunksjonen:
document.getElementById("btnSok").onclick = function() {
    let searchBox = document.getElementById("ul_result"); 
    let searchWord = document.getElementById("søkefeltbruker").value.toUpperCase();
    let txtValue; 

    if(searchWord.trim() == "") {
        return;
    }

    for(let i = 0; i < nameTab_search.length; i++) {
        txtValue = nameTab_search[i];
        if(txtValue.toUpperCase().indexOf(searchWord) > -1) {
            searchBox.style.display = "block"; 
            document.getElementById("list_item" + i).style.display = "inline";
        } else {
        }
    }
}
