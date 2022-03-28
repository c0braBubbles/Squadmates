const whiz = JSON.parse(sessionStorage.getItem("bruker"));

for(let i = 0; i < Object.keys(whiz.Followers).length; i++) {
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var pictureStorage = storageRef.child("user/" + whiz.Followers[i].Uid + "/profile.jpg");


    pictureStorage.getDownloadURL().then((pictureURL) => {
        document.getElementById("friendsList").innerHTML = `<li class="list-group-item border-dark d-flex justify-content-between align-items-center"
                                                                style="color: white; background: #111;">
                                                                <a href=""> <img src="${pictureURL}" alt=".." class="rounded-circle display-pic"
                                                                        style="height:50px; width:50px;"> </a>
                                                                <h3>${whiz.Followers[i].Brukernavn}</h3>
                                                                <a href=""> <img src="img/chat-fill.svg" alt="..."
                                                                    style="filter:invert(100%); width:40px; height:40px;"> </a>
                                                            </li>`;
    }).catch((error) => {
        document.getElementById("friendsList").innerHTML = `<li class="list-group-item border-dark d-flex justify-content-between align-items-center"
                                                                style="color: white; background: #111;">
                                                                <a href=""> <img src="img/blank-profile-circle.png" alt=".." class="rounded-circle display-pic"
                                                                        style="height:50px; width:50px;"> </a>
                                                                <h3>JonKanon352</h3>
                                                                <a href=""> <img src="img/chat-fill.svg" alt="..."
                                                                    style="filter:invert(100%); width:40px; height:40px;"> </a>
                                                            </li>`;
    });
}
