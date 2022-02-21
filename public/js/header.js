const auth = firebase.auth();

var uid;
var username;
var displayusername;

firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/firebase.User
		uid = user.uid;
		// ...
		console.log(uid);
		displayusername = getUsername(uid);
		console.log(displayusername);
		//document.getElementById("usernameHeader").innerHTML = displayusername;
		//document.getElementById("usernameHeaderMobil").innerHTML = displayusername;
	} else {
		// User is signed out
		// ...

	}

});

function getUsername(uid) {
	var ref_users = firebase.database().ref().child('Bruker'); // Referanse og funksjon for når brukere blir lagt til
	ref_users.on("child_added", function (snapshot) {
		var message = snapshot.val();
		//if (uid === message.Brukernavn) {
		username = message.Brukernavn;
		//console.log(username);
		return username;
	});
}