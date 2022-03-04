// Imports
var path = require('path'); 
var express = require('express'); 


var app = express();
app.set('view engine', 'ejs'); 
app.set('views', path.resolve(__dirname, 'views')); 
app.use(express.urlencoded({ extended: true }));


/* Henting av sidene når brukeren forespør en av de tre hovedsidene */
app.get('/', function(req, res) {
    res.render('index');
});

var bruker;
app.post('/', function(req, res) {
    bruker = req.body.bruker; 
});

app.get('/home', function(req, res) {
    res.render('home', {bruker: JSON.stringify(bruker)});
});

// app.get('/myprofile', function(req, res) {
//     res.render('myprofile');
// });

app.get('/chat', function(req, res) {
    res.render('chat');
});

app.get('/othersprofile', function(req, res) {
    res.render('othersprofile');
});

app.get('/friends', function(req, res) {
    res.render('friends');
});
    
app.get('/allgroups', function(req, res) {
    res.render('allgroups');
});

app.get('/group', function(req, res) {
    res.render('group');
});

app.get('/spill', function(req, res) {
    res.render('spill');
});

app.get('/settings', function(req, res) {
    res.render('settings');
});

app.get('/test', function(req, res) {
    res.render('test');
});

app.post('/openUid', function(req, res) {
    var uid = req.body.uid; 
    app.get('/' + uid, function(req, res) {
        res.render('myprofile');
    });
});

app.post('/showProfile', function(req, res) {
    var profName = req.body.profilename; 
    app.get('/' + profName, function(req, res) {
        res.render('othersprofile');
    })
});

app.get('/xbox', function(req, res) {
    res.render('xbox');
})

// Gjør mappen public synlig, så app-en kan ta bruk av:
app.use(express.static(path.resolve(__dirname, 'public')));
//Avgjør hvilken port programmet skal "lytte" på:
app.listen(process.env.PORT || 3000);
console.log("Lytter på port 3000");
