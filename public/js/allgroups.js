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

        //Antall medlemmer på platformkort
        var xboxCount = 0;
        firebase.database().ref('/Xbox gruppe/Medlemmer').on('child_added', function (snapshot) {
            xboxCount++;
            document.getElementById("xboxMembers").innerHTML = xboxCount + " Medlemmer";
        })

        var psCount = 0;
        firebase.database().ref('/Playstation gruppe/Medlemmer').on('child_added', function (snapshot) {
            psCount++;
            document.getElementById("psMembers").innerHTML = psCount + " Medlemmer";
        })

        var switchCount = 0;
        firebase.database().ref('/Switch gruppe/Medlemmer').on('child_added', function (snapshot) {
            switchCount++;
            document.getElementById("switchMembers").innerHTML = switchCount + " Medlemmer";
        })

        var steamCount = 0;
        firebase.database().ref('/Steam gruppe/Medlemmer').on('child_added', function (snapshot) {
            steamCount++;
            document.getElementById("steamMembers").innerHTML = steamCount + " Medlemmer";
        })