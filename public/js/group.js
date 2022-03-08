var key = localStorage.getItem("groupKey");
console.log(key);
firebase.database().ref('/Grupper/' + key).once('value').then((snapshot) => {
    var name = snapshot.child("Navn").val();
    var about = snapshot.child("Om").val();
    var owner = snapshot.child("Eier").val();
    var id = snapshot.child("BildeID").val();

    var groupName = document.getElementById("groupName");
    var groupAbout = document.getElementById("groupAbout");
    groupName.innerHTML = name;
    groupAbout.innerHTML = about;
})