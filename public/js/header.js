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
			console.log(uid + ": " + username + " er innlogget")

			//Henting av profilbilde
			var storage = firebase.storage();
			var storageRef = storage.ref();
			var pictureStorage = storageRef.child("user/" + uid + "/profile.jpg");

			pictureStorage.getDownloadURL()
				.then((pictureURL) => {
					document.getElementById("pictureHeader").src = pictureURL; //Profilbilde på min header
					document.getElementById("pictureMobileHeader").src = pictureURL; //Profilbilde på mobil header
					//console.log("Profilbilde funnet");
				})
				.catch((error) => {
					document.getElementById("pictureHeader").src = "img/blank-profile-circle.png"; //Default profilbilde dersom ikke bilde er funnet
					document.getElementById("pictureMobileHeader").src = "img/blank-profile-circle.png"; //Default profilbilde mobil dersom ikke bilde er funnet
					//console.log("brukeren har ingen profilbilde")
				});
		});

	} else {
		// User is signed out
		console.log("ingen bruker er innlogget")
		window.location = "/";
	}
}); 