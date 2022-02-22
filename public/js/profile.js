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



firebase.auth().onAuthStateChanged((user) => {
	if (user != null) {
		uid = user.uid;
		//console.log(uid);

		var userId = firebase.auth().currentUser.uid;
		return firebase.database().ref('/Bruker/' + uid).once('value').then((snapshot) => {
			biografi = snapshot.child("Biografi").val();
			var username = snapshot.child("Brukernavn").val();
			var name = snapshot.child("Navn").val();
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



