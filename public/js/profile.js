var inpBio = document.getElementById("bio_textfield");

function lagreBrukerEndringer() {
    console.log(userID);
    const db = firebase.database.ref('Bruker/'+userID);
    db.push({
        "Biografi": bio_textfield
    });
}
