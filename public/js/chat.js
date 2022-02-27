var form_msg_input = document.getElementById("msg_input"); /* Her skriver du melding (input) */ 
var msg_board = document.getElementById("msg_board"); /* Her havner meldingen i front-end (output) */
var msg_btn = document.getElementById("msg_btn"); /* Knappen til input-felt for melding, trengs nok ikke senere */
var msg_input_field = document.getElementById("msg_inp");

var uid = "P8PlzF4FYFXVqDFa43W8EfNBHLt2";
var uid2 = "2lsL6nGeqKeF4u506e9KvY7M9iG3";

function lagSamtale(dinUid, andreUid) {
    var finnesSamtale = false;
    firebase.database().ref("samtale").push({
        "bruker1_uid":dinUid,
        "bruker2_uid":andreUid
    });
}


/* Eksempel fra Give&Get: legger en melding på meldingsbrettet */
//chatWindow.innerHTML += `<div id='bobler' class='msg-line'><p class='sender-bubble'>${data.beskjeden}</p></div>`;