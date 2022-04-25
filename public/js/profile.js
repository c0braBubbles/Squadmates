var uid;
/*
function lagreBrukerEndringer() {
	uid = firebase.auth().currentUser.uid;
	var inpBio = document.getElementById("bioTextfield");
	const con = firebase.database().ref('Bruker').child(uid);
	con.update({
		"Biografi":inpBio.value
	}).then(() => {
		location.reload();
	});
}*/

var b_bio = document.getElementById("userBio");
var biografi;


// legger til antall følgere på skjermen 
if (whiz.Followers != null) {
	document.getElementById("followCount").innerHTML = Object.keys(whiz.Followers).length;
}


firebase.auth().onAuthStateChanged((user) => {
	if (user != null) {
		uid = user.uid;
		//console.log(uid);

		var userId = firebase.auth().currentUser.uid;
		return firebase.database().ref('/Bruker/' + uid).once('value').then((snapshot) => {
			biografi = snapshot.child("Biografi").val();
			var username = snapshot.child("Brukernavn").val();
			var name = snapshot.child("Navn").val();

			//Plattformer
			/* Discord */
			if (snapshot.child("Discord").val() != null) {
				document.getElementById('discordType').value = snapshot.child('Discord').val();
				document.getElementById('discordCheck').checked = true;
				document.getElementById('discordText').innerHTML = snapshot.child('Discord').val();
				document.getElementById('discordBox').style.display = "block";

			}
			/* Steam */
			if (snapshot.child('Steam').val() != null) {
				document.getElementById('steamType').value = snapshot.child('Steam').val();
				document.getElementById('steamCheck').checked = true;
				document.getElementById('steamText').innerHTML = snapshot.child('Steam').val();
				if (snapshot.child('Steamlink').val() != null) {
					document.getElementById('steamLink').value = snapshot.child('Steamlink').val();
				}
				document.getElementById('steamBox').style.display = "block";
			}
			/* Xbox */
			if (snapshot.child('Xbox').val() != null) {
				document.getElementById('xboxType').value = snapshot.child('Xbox').val();
				document.getElementById('xboxCheck').checked = true;
				document.getElementById('xboxText').innerHTML = snapshot.child('Xbox').val();
				document.getElementById('xboxBox').style.display = "block";
			}
			/* Playstation */
			if (snapshot.child('Playstation').val() != null) {
				document.getElementById('psType').value = snapshot.child('Playstation').val();
				document.getElementById('psCheck').checked = true;
				document.getElementById('psText').innerHTML = snapshot.child('Playstation').val();
				document.getElementById('psBox').style.display = "block";
			}
			/* Switch */
			if (snapshot.child('Switch').val() != null) {
				document.getElementById('switchType').value = snapshot.child('Switch').val();
				document.getElementById('switchCheck').checked = true;
				document.getElementById('switchText').innerHTML = snapshot.child('Switch').val();
				document.getElementById('switchBox').style.display = "block";
			}

			//Henting av profilbilde
			var storage = firebase.storage();
			var storageRef = storage.ref();
			var pictureStorage = storageRef.child("user/" + uid + "/profile.jpg");

			pictureStorage.getDownloadURL()
				.then((pictureURL) => {
					document.getElementById("pictureMyProfile").src = pictureURL; //Profilbilde på min profil
					document.getElementById("pictureEditProfile").src = pictureURL; //Profilbilde på rediger profil
					console.log("Profilbilde funnet");
					$(".loader-wrapper").fadeOut("slow");
				})
				.catch((error) => {
					console.log("brukeren har ingen profilbilde")
					document.getElementById("pictureMyProfile").src = "img/blank-profile-circle.png"; //Default profilbilde på min profil dersom ikke bilde er funnet
					document.getElementById("pictureEditProfile").src = "img/blank-profile-circle.png"; //Default profilbilde på rediger profil dersom ikke bilde er funnet
					$(".loader-wrapper").fadeOut("slow");
				});

			document.getElementById("editUserName").innerHTML = username; //Brukernavn rediger profil
			document.getElementById("editRealName").innerHTML = name; //Ekte navn rediger profil  

			document.getElementById("userBio").innerHTML = biografi;
			document.getElementById("userName").innerHTML = username; //Brukernavn min profil
			document.getElementById("userRealName").innerHTML = name; //Ekte navn min profil
		}).then(() => { localStorage.setItem("Biografi", biografi); }); //Legger biografien inn i localstorage


	} else {
		// User is signed out
		console.log("ingen bruker er innlogget")
		window.location = "/";
	}
});


document.getElementById("editp_btn").onclick = function () {
	document.getElementById("superDiv").style.display = "none";
	document.getElementById("subDiv").style.display = "block";

	var biografi = localStorage.getItem("Biografi");
	document.getElementById("bioTextfield").innerHTML = biografi;
}

var fil = {};

document.getElementById("uploadProfilePic").onchange = function (e) {
	fil = e.target.files[0];
	var fileType = fil["type"];
	console.log(fileType);
	if (fileType == "image/jpeg" || fileType == "image/png" || fileType == "image/gif") {
		var tmppath = URL.createObjectURL(e.target.files[0]); //Midlertidig bilde
		document.getElementById("pictureEditProfile").src = tmppath; //Setter midlertidig bilde før man evt. laster opp til DB
	} else {
		alert("Filen du valgte støttes ikke, velg et bilde med filtype .jpeg eller .png")
	}
}


document.getElementById("save_profile_changes_btn").onclick = function () {
	var uid = firebase.auth().currentUser.uid;
	var inpBio = document.getElementById("bioTextfield");
	let bruker = {};
	bruker.Biografi = inpBio.value;
	/* Dersom boksene er checked, sjekk om de også er fylt inn med noe, dersom ja -> legg inn i objektet */
	//Discord -- Discord -- Discord -- Discord -- Discord -- Discord
	if (document.getElementById("discordCheck").checked) {
		if (document.getElementById("discordType").value != "") { bruker.Discord = document.getElementById("discordType").value; }
	}
	//Steam -- Steam -- Steam -- Steam -- Steam -- Steam -- Steam --
	if (document.getElementById("steamCheck").checked) {
		if (document.getElementById("steamType").value != "") { bruker.Steam = document.getElementById("steamType").value; steamMedlem(uid); }
		if (document.getElementById("steamLink").value != "") {
			const regex = /(?:https?:\/\/)?steamcommunity\.com\/(?:profiles|id)\/[a-zA-Z0-9]+/;
			if (document.getElementById("steamLink").value.match(regex)) {
				bruker.Steamlink = document.getElementById("steamLink").value;
			} else { bruker.Steamlink = null; }
		}
	} else { bruker.Steam = null; bruker.Steamlink = null; }
	//Xbox -- Xbox -- Xbox -- Xbox -- Xbox -- Xbox -- Xbox -- Xbox -
	if (document.getElementById("xboxCheck").checked) {
		if (document.getElementById("xboxType").value != "") { bruker.Xbox = document.getElementById("xboxType").value; xboxMedlem(uid); }
	} else { bruker.Xbox = null }
	//-- Playstation -- Playstation -- Playstation -- Playstation --
	if (document.getElementById("psCheck").checked) {
		if (document.getElementById("psType").value != "") { bruker.Playstation = document.getElementById("psType").value; psMedlem(uid); }
	} else { bruker.Playstation = null; }
	//-- Switch -- Switch -- Switch -- Switch -- Switch -- Switch --
	if (document.getElementById("switchCheck").checked) {
		if (document.getElementById("switchType").value != "") { bruker.Switch = document.getElementById("switchType").value; switchMedlem(uid); }
	} else { bruker.Switch = null }

	const con = firebase.database().ref('Bruker').child(uid);
	con.update(bruker).then(() => {
		var fileType = fil["type"];
		if (fil instanceof File) {
			if (fileType == "image/jpeg" || fileType == "image/png" || fileType == "image/gif") {
				firebase.storage().ref("user/" + uid + "/profile.jpg").put(fil).then(() => {
					location.reload();
				});
			}
			else {
				location.reload();
			}
		} else {
			location.reload();
		}

	});

}

//Funksjoner for å legge brukere som medlemmer i platform grupper
function psMedlem(uid) {
	firebase.database().ref('/Playstation gruppe/Medlemmer').child(uid).set({
		BrukerID: uid
	});
}

function xboxMedlem(uid) {
	firebase.database().ref('/Xbox gruppe/Medlemmer').child(uid).set({
		BrukerID: uid
	});
}

function steamMedlem(uid) {
	firebase.database().ref('/Steam gruppe/Medlemmer').child(uid).set({
		BrukerID: uid
	});
}

function switchMedlem(uid) {
	firebase.database().ref('/Switch gruppe/Medlemmer').child(uid).set({
		BrukerID: uid
	});
} 
/*
setTimeout(() => {
    $(".loader-wrapper").fadeOut("slow");
}, 2000);
*/

// - - - - - - - - - - - - - - - M I N E  I N N L E G G - - - - - - - - - - - - - - - //

firebase.database().ref('Bruker/' + whiz.Uid + '/Mine innlegg').once('value', function(snapshot) {
	if (snapshot.exists()) {
		snapshot.forEach((childSnap) => { //childSnap = et objekt i "Mine innlegg"
			let path = childSnap.child("Path").val();
			if (path == "Xbox" || path == "Playstation" || path == "Steam" || path == "Switch") {
				firebase.database().ref(path + ' gruppe/Innlegg/' + childSnap.key).once('value', function(innleggInfo) {
					//----Legg ut innlegg----//
					leggUt(path, childSnap.key);
				}) 
			} else if (path == "Bruker") {
				firebase.database().ref(path + '/' + whiz.Uid + '/Innlegg/' + childSnap.key).once('value', function(innleggInfo) {
					//----Legg ut innlegg----//
					leggUt(path, childSnap.key);
				})
			} else {
				firebase.database().ref('Grupper/' + path + '/Innlegg/' + childSnap.key).once('value', function(innleggInfo) {
					//----Legg ut innlegg----//
					leggUt(path, childSnap.key);
				})
			}
			
		});
	}
});

// - - - - - - - - - - - - - - - - - L E G G  U T  I N N L E G G - - - - - - - - - - - - - - - - - //
function leggUt(path, innleggUID) {
	
	let IDs = {};
	let owner;
	let title;
	let description;
	let time;

	let gruppenavn = " -> ";
	let prependText;

	
	//Innlegg kommer fra Platform
	if (path == "Xbox" || path == "Playstation" || path == "Steam" || path == "Switch") {
		firebase.database().ref(path + ' gruppe/Innlegg/' + innleggUID).once('value', (snapshot) => {
			IDs.picID = "picture" + snapshot.child("ID").val();
			IDs.ppID = "profilep" + snapshot.child("ID").val();
            IDs.deleteID = "delete" + snapshot.child("ID").val();
            IDs.reportID = "report" + snapshot.child("ID").val();
            IDs.commentID = "comment" + snapshot.child("ID").val();
            IDs.commentFieldID = "commentfield" + snapshot.child("ID").val();
            IDs.commentPostID = "commentpost" + snapshot.child("ID").val();
            IDs.commentBoxID = "commentbox" + snapshot.child("ID").val();
            IDs.commentViewBtnID = "commentviewbtn" + snapshot.child("ID").val();
            IDs.commentSectionID = "commentsection" + snapshot.child("ID").val();
            owner = snapshot.child("Eier").val();
            title = snapshot.child("Tittel").val();
            description = snapshot.child("Beskrivelse").val();
            time = snapshot.child("Tidspunkt").val();
		});

	//Innlegg kommer fra bruker
	} else if (path == "Bruker") {
		firebase.database().ref('Bruker/' + whiz.Uid + '/Innlegg/' + innleggUID).once('value', (snapshot) => {
			IDs.picID = "picture" + snapshot.child("ID").val();
			IDs.ppID = "profilep" + snapshot.child("ID").val();
            IDs.deleteID = "delete" + snapshot.child("ID").val();
            IDs.reportID = "report" + snapshot.child("ID").val();
            IDs.commentID = "comment" + snapshot.child("ID").val();
            IDs.commentFieldID = "commentfield" + snapshot.child("ID").val();
            IDs.commentPostID = "commentpost" + snapshot.child("ID").val();
            IDs.commentBoxID = "commentbox" + snapshot.child("ID").val();
            IDs.commentViewBtnID = "commentviewbtn" + snapshot.child("ID").val();
            IDs.commentSectionID = "commentsection" + snapshot.child("ID").val();
            owner = snapshot.child("Eier").val();
            title = snapshot.child("Tittel").val();
            description = snapshot.child("Beskrivelse").val();
            time = snapshot.child("Tidspunkt").val();
		});

	//Innlegg kommer fra egendefinert gruppe
	} else {
		firebase.database().ref('Grupper/' + path + '/Innlegg/' + innleggUID).once('value', (snapshot) => {
			IDs.picID = "picture" + snapshot.child("ID").val();
			IDs.ppID = "profilep" + snapshot.child("ID").val();
            IDs.deleteID = "delete" + snapshot.child("ID").val();
            IDs.reportID = "report" + snapshot.child("ID").val();
            IDs.commentID = "comment" + snapshot.child("ID").val();
            IDs.commentFieldID = "commentfield" + snapshot.child("ID").val();
            IDs.commentPostID = "commentpost" + snapshot.child("ID").val();
            IDs.commentBoxID = "commentbox" + snapshot.child("ID").val();
            IDs.commentViewBtnID = "commentviewbtn" + snapshot.child("ID").val();
            IDs.commentSectionID = "commentsection" + snapshot.child("ID").val();
            owner = snapshot.child("Eier").val();
            title = snapshot.child("Tittel").val();
            description = snapshot.child("Beskrivelse").val();
            time = snapshot.child("Tidspunkt").val();
		});
		firebase.database().ref('Grupper/' + path).once('value', (snap) => {
			gruppenavn += snap.child('Navn').val();
		})

	}

	setTimeout(() => {

	switch(path) {

		case("Xbox"):
			prependText = 
				'<div class="card gedf-card mx-auto mb-5" style="background: #111;">' +
				//Innlegg header
				'<div class="card-header bg-success">' +
				'<div class="d-flex justify-content-between align-items-center">' +
				'<div class="mr-2">' +
				/*----- Profilbilde -----*/
				'<img class="rounded-circle m-3" style="object-fit: cover;" width="50" height="50" id="' + IDs.ppID + '" src=""> </div> ' +
				'<div class= "ml-2">' +
				'<div class="h5 m-0 text-light">' + whiz.Brukernavn + '</div>' +
				'<div class="h7 text-light">' + whiz.Navn + '</div> </div>' +
				'<div class="dropdown ms-auto">' +
				'<button class="btn dropdown-toggle text-light" type="button"' +
				'id="dropdownMenu2"' +
				'data-bs-toggle="dropdown" aria-expanded="false"></button >' +
				'<ul class="dropdown-menu bg-dark" aria-labelledby="dropdownMenu2">' +
				/*----- Slett innlegg knapp -----*/
				'<li><button class="dropdown-item text-light bg-dark" type="button" id="' + IDs.deleteID + owner + '">Slett innlegg <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
				'<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /> </svg></button></li>' +
				/*----- Rapporter innlegg knapp -----*/
				'<li><button class="dropdown-item bg-dark text-light" type="button" id="' + IDs.reportID + owner + '" > Rapporter innlegg <svg xmlns = "http://www.w3.org/2000/svg" width = "16" height = "16" fill = "currentColor" class= "bi bi-flag-fill" viewBox = "0 0 16 16" >' +
				'<path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />' +
				'</svg ></button ></li> </ul></div ></div></div>';
			break;
		case("Playstation"):
			prependText =
				'<div class="card gedf-card mx-auto mb-5" style="background: #111;">' +
				//Innlegg header
				'<div class="card-header bg-primary">' +
				'<div class="d-flex justify-content-between align-items-center">' +
				'<div class="mr-2">' +
				/*----- Profilbilde -----*/
				'<img class="rounded-circle m-3" style="object-fit: cover;" width="50" height="50" id="' + IDs.ppID + '" src=""> </div> ' +
				'<div class= "ml-2">' +
				'<div class="h5 m-0 text-light">' + whiz.Brukernavn + '</div>' +
				'<div class="h7 text-light">' + whiz.Navn + '</div> </div>' +
				'<div class="dropdown ms-auto">' +
				'<button class="btn dropdown-toggle text-light" type="button"' +
				'id="dropdownMenu2"' +
				'data-bs-toggle="dropdown" aria-expanded="false"></button >' +
				'<ul class="dropdown-menu bg-dark" aria-labelledby="dropdownMenu2">' +
				/*----- Slett innlegg knapp -----*/
				'<li><button class="dropdown-item text-light bg-dark" type="button" id="' + IDs.deleteID + owner + '">Slett innlegg <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
				'<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /> </svg></button></li>' +
				/*----- Rapporter innlegg knapp -----*/
				'<li><button class="dropdown-item bg-dark text-light" type="button" id="' + IDs.reportID + owner + '" > Rapporter innlegg <svg xmlns = "http://www.w3.org/2000/svg" width = "16" height = "16" fill = "currentColor" class= "bi bi-flag-fill" viewBox = "0 0 16 16" >' +
				'<path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />' +
				'</svg ></button ></li> </ul></div ></div></div>';
			break;
		case("Steam"):
			prependText =
				'<div class="card gedf-card mx-auto mb-5" style="background: #111;">' +
				//Innlegg header
				'<div class="card-header" style="background-color:#1b2838;">' +
				'<div class="d-flex justify-content-between align-items-center">' +
				'<div class="mr-2">' +
				/*----- Profilbilde -----*/
				'<img class="rounded-circle m-3" style="object-fit: cover;" width="50" height="50" id="' + IDs.ppID + '" src=""> </div> ' +
				'<div class= "ml-2">' +
				'<div class="h5 m-0 text-light">' + whiz.Brukernavn + '</div>' +
				'<div class="h7 text-light">' + whiz.Navn + '</div> </div>' +
				'<div class="dropdown ms-auto">' +
				'<button class="btn dropdown-toggle text-light" type="button"' +
				'id="dropdownMenu2"' +
				'data-bs-toggle="dropdown" aria-expanded="false"></button >' +
				'<ul class="dropdown-menu bg-dark" aria-labelledby="dropdownMenu2">' +
				/*----- Slett innlegg knapp -----*/
				'<li><button class="dropdown-item text-light bg-dark" type="button" id="' + IDs.deleteID + owner + '">Slett innlegg <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
				'<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /> </svg></button></li>' +
				/*----- Rapporter innlegg knapp -----*/
				'<li><button class="dropdown-item bg-dark text-light" type="button" id="' + IDs.reportID + owner + '" > Rapporter innlegg <svg xmlns = "http://www.w3.org/2000/svg" width = "16" height = "16" fill = "currentColor" class= "bi bi-flag-fill" viewBox = "0 0 16 16" >' +
				'<path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />' +
				'</svg ></button ></li> </ul></div ></div></div>';
			break;
		case("Switch"):
			prependText =
				'<div class="card gedf-card mx-auto mb-5" style="background: #111;">' +
				//Innlegg header
				'<div class="card-header bg-danger">' +
				'<div class="d-flex justify-content-between align-items-center">' +
				'<div class="mr-2">' +
				/*----- Profilbilde -----*/
				'<img class="rounded-circle m-3" style="object-fit: cover;" width="50" height="50" id="' + IDs.ppID + '" src=""> </div> ' +
				'<div class= "ml-2">' +
				'<div class="h5 m-0 text-light">' + whiz.Brukernavn + '</div>' +
				'<div class="h7 text-light">' + whiz.Navn + '</div> </div>' +
				'<div class="dropdown ms-auto">' +
				'<button class="btn dropdown-toggle text-light" type="button"' +
				'id="dropdownMenu2"' +
				'data-bs-toggle="dropdown" aria-expanded="false"></button >' +
				'<ul class="dropdown-menu bg-dark" aria-labelledby="dropdownMenu2">' +
				/*----- Slett innlegg knapp -----*/
				'<li><button class="dropdown-item text-light bg-dark" type="button" id="' + IDs.deleteID + owner + '">Slett innlegg <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
				'<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /> </svg></button></li>' +
				/*----- Rapporter innlegg knapp -----*/
				'<li><button class="dropdown-item bg-dark text-light" type="button" id="' + IDs.reportID + owner + '" > Rapporter innlegg <svg xmlns = "http://www.w3.org/2000/svg" width = "16" height = "16" fill = "currentColor" class= "bi bi-flag-fill" viewBox = "0 0 16 16" >' +
				'<path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />' +
				'</svg ></button ></li> </ul></div ></div></div>';
			break;
		case("Bruker"):
			prependText =
				'<div class="card gedf-card mx-auto mb-5" style="background: #111;">' +
                //Innlegg header
                '<div class="card-header" style="background: #111;">' +
                '<div class="d-flex justify-content-between align-items-center">' +
                '<div class="mr-2">' +
                /*----- Profilbilde -----*/
                '<img class="rounded-circle m-3" style="object-fit: cover;" width="50" height="50" id="' + IDs.ppID + '" src=""> </div> ' +
                '<div class= "ml-2">' +
                '<div class="h5 m-0 text-light">' + whiz.Brukernavn + '</div>' +
                '<div class="h7 text-light">' + whiz.Navn + '</div> </div>' +
                '<div class="dropdown ms-auto">' +
                '<button class="btn dropdown-toggle text-light" type="button"' +
                'style="background: #111;" id="dropdownMenu2"' +
                'data-bs-toggle="dropdown" aria-expanded="false"></button >' +
                '<ul class="dropdown-menu bg-dark" aria-labelledby="dropdownMenu2">' +
                /*----- Slett innlegg knapp -----*/
                '<li><button class="dropdown-item text-light bg-dark" type="button" id="' + IDs.deleteID + owner + '">Slett innlegg <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
                '<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /> </svg></button></li>' +
                /*----- Rapporter innlegg knapp -----*/
                '<li><button class="dropdown-item bg-dark text-light" type="button" id="' + IDs.reportID + owner + '" > Rapporter innlegg <svg xmlns = "http://www.w3.org/2000/svg" width = "16" height = "16" fill = "currentColor" class= "bi bi-flag-fill" viewBox = "0 0 16 16" >' +
                '<path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />' +
                '</svg ></button ></li> </ul></div ></div></div>';
			break;
		default:
			prependText =
			'<div class="card gedf-card mx-auto mb-5" style="background: #111;">' +
                //Innlegg header
                '<div class="card-header" style="background: #111;">' +
                '<div class="d-flex justify-content-between align-items-center">' +
                '<div class="mr-2">' +
                /*----- Profilbilde -----*/
                '<img class="rounded-circle m-3" style="object-fit: cover;" width="50" height="50" id="' + IDs.ppID + '" src=""> </div> ' +
                '<div class= "ml-2">' +
                '<div class="h5 m-0 text-light">' + whiz.Brukernavn+gruppenavn + '</div>' +
                '<div class="h7 text-light">' + whiz.Navn + '</div> </div>' +
                '<div class="dropdown ms-auto">' +
                '<button class="btn dropdown-toggle text-light" type="button"' +
                'style="background: #111;" id="dropdownMenu2"' +
                'data-bs-toggle="dropdown" aria-expanded="false"></button >' +
                '<ul class="dropdown-menu bg-dark" aria-labelledby="dropdownMenu2">' +
                /*----- Slett innlegg knapp -----*/
                '<li><button class="dropdown-item text-light bg-dark" type="button" id="' + IDs.deleteID + owner + '">Slett innlegg <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
                '<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /> </svg></button></li>' +
                /*----- Rapporter innlegg knapp -----*/
                '<li><button class="dropdown-item bg-dark text-light" type="button" id="' + IDs.reportID + owner + '" > Rapporter innlegg <svg xmlns = "http://www.w3.org/2000/svg" width = "16" height = "16" fill = "currentColor" class= "bi bi-flag-fill" viewBox = "0 0 16 16" >' +
                '<path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />' +
                '</svg ></button ></li> </ul></div ></div></div>';
			break;

	} //Slutt på Switch-setning

	prependText +=
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
		'<img class="card-img m-0" style="height: 350px; object-fit: cover;" src="" alt="ingen bilde" id="' + IDs.picID + owner + '">' +
		'<div class="container d-flex">' +
		/*----- Se kommentarer -----*/
		'<button class="link-secondary ms-auto btn-sm" id="' + IDs.commentViewBtnID + owner + '">Ingen kommentarer</button>' +
		'</div>' +
		//Innlegg footer
		'<div class="card-footer d-flex" style="background: #111;">' +
		'<button type="button" class="btn-dark w-50 mx-auto"' +
		'style="background: #111;" id="' + IDs.commentID + owner + '">Kommenter ' +
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
		'<hr> <div class="input-group mb-3" id = "' + IDs.commentBoxID + owner + '"> </div>' +
		'<div class="list-group w-100 mx-auto border-dark" id="' + IDs.commentSectionID + owner + '"> </div>' +
		'</div>' +
		'</div>';

	$(document.getElementById('myPosts')).prepend(prependText);

	//Setter profilbilde til innlegget
	firebase.storage().ref("user/" + owner + "/profile.jpg").getDownloadURL().then((profilbilde) => {
		document.getElementById(IDs.ppID).src = profilbilde;
	}).catch(() => {
		document.getElementById(IDs.ppID).src = "img/blank-profile-circle.png";
	});

	//Setter bilde til innlegget (Dersom det finnes et bilde)
	firebase.storage().ref("innlegg/" + owner + IDs.picID + "/innlegg.jpg").getDownloadURL().then((innleggBilde) => {
		document.getElementById(IDs.picID + owner).src = innleggBilde;
	}).catch((error) => {
		console.log(error.message);
		document.getElementById(IDs.picID + owner).style.display = "none";
	});

	//Setter riktig referansepunkter til databasen, forskjellig "sti" mellom egendefinerte grupper og "plattformer"
	let cmtRef;
	let deleteRef;
	let reportCmtRef;

	if (path == "Xbox" || path == "Playstation" || path == "Steam" || path == "Switch") {
		cmtRef = firebase.database().ref(path + " gruppe/Innlegg/" + innleggUID + "/Kommentarer");
		deleteRef = firebase.database().ref(path + " gruppe/Innlegg/" + innleggUID);
		reportCmtRef = firebase.database().ref(path + " gruppe/Rapporterte kommentarer");
	} else if (path == "Bruker") {
		cmtRef = firebase.database().ref("Bruker/" + whiz.Uid + "/Innlegg/" + innleggUID + "/Kommentarer");
		deleteRef = firebase.database().ref("Bruker/" + whiz.Uid + "/Innlegg/" + innleggUID);
		reportCmtRef = firebase.database().ref("Rapportert/Rapporterte kommentarer/" + whiz.Uid);
	} else {
		cmtRef = firebase.database().ref("Grupper/" + path + "/Innlegg/" + innleggUID + "/Kommentarer");
		deleteRef = firebase.database().ref("Grupper/" + path + "/Innlegg" + innleggUID);
		reportCmtRef = firebase.database().ref("Grupper/" + path + "/Rapporterte kommentarer");
	}

	//Viser antall kommentarer et innlegg har
	let commentsCounter = 0;
	cmtRef.on('child_added', function (snapshot) {
		commentsCounter++;
		document.getElementById(IDs.commentViewBtnID + owner).innerHTML = commentsCounter + " Kommentarer";
	});

	//Setter display:none på knappen for "rapporter innlegg"
	document.getElementById(IDs.reportID + owner).style.display = "none";

	//Slett et innlegg
	document.getElementById(IDs.deleteID + owner).onclick = function () {
		deleteRef.remove();
		firebase.storage().ref("innlegg/" + (owner + picid) + "/innlegg.jpg").delete();
		alert("Innlegget ditt er nå slettet");
		location.reload();
	}

	//Legg ut kommentar, input-felt og knapp appendes til innlegget
	document.getElementById(IDs.commentID + owner).onclick = function () {
		this.disabled = true;
		var cmtBox = document.getElementById(IDs.commentBoxID + owner);
		$(cmtBox).append(
			'<input type="text" class="form-control border-dark text-light" placeholder="Skriv en kommentar... "' +
			'aria-label="Recipients username" aria-describedby="button-addon2" style="background-color:rgb(60, 64, 67, 0.90)" ' +
			'id="' + IDs.commentFieldID + owner + '"> <button class="btn btn-primary" type="button" id="' + IDs.commentPostID + owner + '">Publiser</button>'
		).ready(function () {
			var dateTimeCmt = new Date().toLocaleDateString("en-GB", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit"
			});
			dateTimeCmt = dateTimeCmt.split('/').join('.');
			document.getElementById(IDs.commentPostID + owner).onclick = function () {
				var commentInput = document.getElementById(IDs.commentFieldID + owner);
				var comment = commentInput.value;
				if (comment.trim() != "") {
					cmtRef.push({
						Bruker: whiz.Uid,
						Kommentar: comment,
						Tidspunkt: dateTimeCmt,
						Brukernavn: whiz.Brukernavn
					});
				}
				commentInput.value = null;
			}
		})
	}

	//Se kommentarfelt
	document.getElementById(IDs.commentViewBtnID + owner).onclick = function () {
		this.disabled = true;
		var cmtSection = document.getElementById(IDs.commentSectionID + owner);
		//Sjekker "kommentarer" tabellen for kommentarer
		cmtRef.on('child_added', function (snapshot) {
			var dataSnapshot = snapshot.val();
			let deleteCommentID = snapshot.key + "delete";
			let reportCommentID = snapshot.key + "report";
			let ppID = snapshot.key + "profilep";

			$(cmtSection).prepend(
				'<a class="list-group-item text-light border-dark mb-0 rounded-3" style="background: #111;"> <div class = "w-100 d-flex"> <img class = "rounded-circle m-1" width="35" height="35"' +
				'src="" id="' + ppID + '" style="object-fit: cover;"> <strong class = "my-auto mx-1">' + dataSnapshot.Brukernavn + '</strong>' +
				'<div class="dropdown ms-auto my-auto"> <text class="text-muted">' + dataSnapshot.Tidspunkt + ' </text> <button class="btn dropdown-toggle text-light" type="button" style="background: #111;" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false"></button>' +
				'<ul class="dropdown-menu bg-dark ms-auto" aria-labelledby="dropdownMenu2"> <li><button class="dropdown-item text-light bg-dark"' +
				'type="button" id="' + deleteCommentID + dataSnapshot.Bruker + '">Slett kommentar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">' +
				'<path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" /></svg></button></li>' +
				'<li><button class="dropdown-item bg-dark text-light" type="button" id="' + reportCommentID + dataSnapshot.Bruker + '">Rapporter kommentar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"' +
				'class="bi bi-flag-fill" viewBox="0 0 16 16"> <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" /></svg></button>' +
				'</li></ul></div></div>' +
				'<text style="padding-left: 50px;">' + dataSnapshot.Kommentar + '</text></a>'
			)

			//Henting av (eventuelt)profilbilde til brukeren som eier kommentaren
			firebase.storage().ref("user/" + dataSnapshot.Bruker + "/profile.jpg").getDownloadURL().then((pictureURL) => {
				document.getElementById(ppID).src = pictureURL;
			}).catch((error) => {
				document.getElementById(ppID).src = "img/blank-profile-circle.png";
				console.log(error.message);
			}).then(() => {
				//Viser "slett kommentar"-knapp dersom kommentaren er din, ellers vises "rapporter kommentar"-knapp
				if (dataSnapshot.Bruker == whiz.Uid) {
					document.getElementById(reportCommentID + dataSnapshot.Bruker).style.display = "none";
				} else {
					document.getElementById(deleteCommentID + dataSnapshot.Bruker).style.display = "none";
				}

				//Funksjon for å slette kommentar
				document.getElementById(deleteCommentID + dataSnapshot.Bruker).onclick = function () {
					if (dataSnapshot.Bruker == whiz.Uid) {
						cmtRef.child(snapshot.key).remove();
						alert("Kommentaren din er slettet");
						location.reload();
					}
				}

				//Funksjon for å rapportere kommentar
				document.getElementById(reportCommentID + dataSnapshot.Bruker).onclick = function () {
					reportCmtRef.push({
						Eier: dataSnapshot.Bruker,
						Rapporterer: whiz.Uid,
						KommentarID: snapshot.key,
						InnleggsID: innleggUID
					});
					alert("Kommentaren til: " + dataSnapshot.Brukernavn + " er rapportert");
				}
			})

		});
	}


}, 500);

}

