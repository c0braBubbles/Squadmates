const whiz = JSON.parse(sessionStorage.getItem("bruker"));
var user = whiz.Uid;
console.log(user);


        firebase.database().ref('/Bruker/' + user).once('value').then((snapshot) => {

            //Plattformer
            /* Steam */
            if (snapshot.child('Steam').val() != null) {
                document.getElementById('steamGroup').style.display = "block";
            }
            /* Xbox */
            if (snapshot.child('Xbox').val() != null) {
                document.getElementById('xboxGroup').style.display = "block";
            }
            /* Playstation */
            if (snapshot.child('Playstation').val() != null) {
                document.getElementById('psGroup').style.display = "block";
            }
            /* Switch */
            if (snapshot.child('Switch').val() != null) {
                document.getElementById('switchGroup').style.display = "block";
            }
        })