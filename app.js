// Imports
var path = require('path'); 
var express = require('express'); 


var app = express();
app.set('view engine', 'ejs'); 
app.set('views', path.resolve(__dirname, 'views')); 


/* Henting av sidene når brukeren forespør en av de tre hovedsidene */
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/home', function(req, res) {
    res.render('home');
});

app.get('/myprofile', function(req, res) {
    res.render('myprofile');
});

app.get('/chat', function(req, res) {
    res.render('chat');
});

app.get('/editprofile', function(req, res) {
    res.render('editprofile');
});

app.get('/othersprofile', function(req, res) {
    res.render('othersprofile');
});

app.get('/friends', function(req, res) {
    res.render('friends');
    
app.get('/allgroups', function(req, res) {
    res.render('allgroups');
});

app.get('/group', function(req, res) {
    res.render('group');
});

app.get('/spill', function(req, res) {
    res.render('spill');
})

app.get('/new-group', function(req, res) {
    res.render('new-group');
});

// Gjør mappen public synlig, så app-en kan ta bruk av:
app.use(express.static(path.resolve(__dirname, 'public')));
//Avgjør hvilken port programmet skal "lytte" på:
app.listen(process.env.PORT || 3000);
console.log("Lytter på port 3000");
