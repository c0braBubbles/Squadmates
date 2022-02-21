function lagreBrukerEndringer() {
    var uid = firebase.auth().currentUser.uid;
    var inpBio = document.getElementById("bio_textfield");
    const con = firebase.database().ref('Bruker').child(uid);
    con.update({
        "Biografi":inpBio.value
    }).then(() => {
        location.reload();
    });
}

