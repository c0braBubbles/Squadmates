var uid;
firebase.auth().onAuthStateChanged((user) => {
	if (user != null) {
		uid = user.uid;
		//console.log(uid);

		var userId = firebase.auth().currentUser.uid;
		return firebase.database().ref('/Bruker/' + uid).once('value').then((snapshot) => {
			var username = snapshot.child("Brukernavn").val();
			document.getElementById("usernameHeader").innerHTML = username;
			document.getElementById("usernameHeaderMobil").innerHTML = username;
			console.log(uid + ": " + username + " er innlogget")
		});

	} else {
		// User is signed out
		console.log("ingen bruker er innlogget")
		window.location = "/";
	}
});