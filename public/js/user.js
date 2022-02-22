var uid;
firebase.auth().onAuthStateChanged((user) => {
	if (user != null) {
		uid = user.uid;
		//console.log(uid);

		var userId = firebase.auth().currentUser.uid;
		return firebase.database().ref('/Bruker/' + uid).once('value').then((snapshot) => {
			var username = snapshot.child("Brukernavn").val();
			var name = snapshot.child("Navn").val();
			document.getElementById("usernameHeader").innerHTML = username; //Brukernavn i header
			document.getElementById("usernameHeaderMobil").innerHTML = username; //Brukernavn i mobil header
			document.getElementById("userName").innerHTML = username; //Brukernavn min profil
			document.getElementById("userRealName").innerHTML = name; //Ekte navn min profil
			document.getElementById("editUserName").innerHTML = username; //Brukernavn min profil
			document.getElementById("editRealName").innerHTML = name; //Ekte navn min profil
			console.log(uid + ": " + username + " er innlogget")
		});

	} else {
		// User is signed out
		console.log("ingen bruker er innlogget")
		window.location = "/";
	}
});