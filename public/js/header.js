const auth = firebase.auth();

var uid;
var username = "";
var displayusername;

firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		// logget inn
		uid = user.uid;
		
		if(user != null) {
			getUsername(uid).then(() => {
				console.log(username);
			});
        }
	} else {
		// User is signed out
		window.location = "/";
	}
});

function getUsername(uid) {
	var ref_users = firebase.database().ref().child('Bruker'); // Referanse og funksjon for når brukere blir lagt til
	ref_users.on("child_added", function (snapshot) {
		var message = snapshot.val();
		if(uid == snapshot.key) {
			console.log(snapshot.key);
			username = message.Brukernavn;
		} 
	});
}
