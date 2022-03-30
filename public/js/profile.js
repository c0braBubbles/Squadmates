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
	if (fileType == "image/jpeg" || "image/png") {
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
			if (fileType == "image/jpeg" || "image/png") {
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