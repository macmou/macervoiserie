var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');

// Configuration
let dev_db_url = 'mongodb://Macmou:Boiteacom17!@ds123029.mlab.com:23029/cervoiserie';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

// Models
var Villles = mongoose.model('Villles', {
    id: String,
    ville: String,
    avatar: String,
    image: String,
    favoris: String
});
var Pays = mongoose.model('Pays', {
    pays: String,
    plu: String,
    favoris: String
});
var Bieres = mongoose.model('Bieres', {
    nom: String,
    marque: String,
    volume: Number,
    degret: String,
    favoris: String,
    plu: String,
    description: String,
    image: String,
    rating: String,
    pays: String
});
var Commentaires = mongoose.model('Commentaires', {
    ladescription: String,
    lenote: String,
    auteur: String,
    pseudo: String,
    letype: String,
    laref: String
});

var Users = mongoose.model('Users', {
    email: String,
    pseudo: String
});

var Events = mongoose.model('Events', {
    date: String,
    auteur: String,
    title: String,
    description: String,
    nbr_like: Number
});

var Scores = mongoose.model('Scores', {
    user: String,
    nom: String,
    score: Number
});



    // Get events
    app.get('/api/events', function(req, res) {
 
        // use mongoose to get all reviews in the database
        Events.find(function(err, events) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(events); // return all reviews in JSON format
        });
    });
 
    // Get villes
    app.get('/api/villles', function(req, res) {
 
        // use mongoose to get all villes in the database
        Villles.find(function(err, villles) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(villles); // return all reviews in JSON format
        });
    });

    // Get users
    app.get('/api/users', function(req, res) {
 
        console.log("fetching users");
 
        // use mongoose to get all villes in the database
        Users.find(function(err, users) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(users); // return all reviews in JSON format
        });
    });
 
    // Get pays
    app.get('/api/pays', function(req, res) {
 
        console.log("fetching pays");
 
        // use mongoose to get all villes in the database
        Pays.find(function(err, pays) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(pays); // return all reviews in JSON format
        });
    });

    // Post bières
    app.post('/api/bieres', function(req, res) {

        Bieres.find({"pays":req.body.params.pays},function(err, bieres) {
            if (err)
                res.send(err)
 
            res.json(bieres); 
        });
    });

    // Get bières
    app.get('/api/bieres', function(req, res) {

        Bieres.find(function(err, bieres) {
            if (err)
                res.send(err)
 
            res.json(bieres);
        });
    });

    // Get commentaires
    app.get('/api/commentaires', function(req, res) {
 
        // use mongoose to get all reviews in the database
        Commentaires.find(function(err, commentaires) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(commentaires); // return all reviews in JSON format
        });
    });

    // Get scores
    app.get('/api/scores', function(req, res) {
 
        // use mongoose to get all reviews in the database
        Scores.find(function(err, scores) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(scores); // return all reviews in JSON format
        });
    });

    // add score
    app.post('/api/scores', function(req, res) {
 
        // create a review, information comes from request from Ionic
        Scores.create({
            user : req.body.user,
            nom : req.body.nom,
            score : req.body.score
        }, function(err, review) {
            if (err)
                res.send(err);
 
            // get and return all the reviews after you create another
            Scores.find(function(err, scores) {
                if (err)
                    res.send(err)
                res.json(scores);
            });
        });
 
    });

    // update scores
    app.put('/api/scores', function(req, res) {

        Scores.findOneAndUpdate(
            { user : req.body.user }, 
            { $set: { score:req.body.score } }, 
            function (err, post) {
                if (err)
                res.send(err);
 
                Scores.find(function(err, scores) {
                    if (err)
                        res.send(err)
                    res.json(scores);
                });
          });
    });

    // update commantaire
    app.put('/api/commentaires', function(req, res) {

        Commentaires.findOneAndUpdate(
            { _id : req.body._id }, 
            { $set: { lenote:req.body.manote,ladescription:req.body.madescription } }, 
            function (err, post) {
                if (err)
                res.send(err);
 
                Commentaires.find(function(err, commentaires) {
                    if (err)
                        res.send(err)
                    res.json(commentaires);
                });
          });
 
    });

    // add commentaires
    app.post('/api/commentaires', function(req, res) {
 
        // create a review, information comes from request from Ionic
        Commentaires.create({
            ladescription: req.body.madescription,
            lenote: req.body.manote,
            auteur: req.body.auteur,
            pseudo: req.body.pseudo,
            letype: req.body.montype,
            laref: req.body.maref
        }, function(err, review) {
            if (err)
                res.send(err);
 
            // get and return all the reviews after you create another
            Commentaires.find(function(err, commentaires) {
                if (err)
                    res.send(err)
                res.json(commentaires);
            });
        });
 
    });

    // update bieres
    app.put('/api/bieres', function(req, res) {

        Bieres.findOneAndUpdate(
            { _id : req.body._id }, 
            { $set: { favoris:req.body.favoris }}, 
            function (err, post) {
                if (err)
                res.send(err);
 
                Bieres.find(function(err, bieres) {
                    if (err)
                        res.send(err)
                    res.json(bieres);
                });
          });
    });

    // update pays
    app.put('/api/pays', function(req, res) {

        Pays.findOneAndUpdate(
            { pays : req.body.pays }, 
            { $set: { favoris:req.body.favoris }}, 
            function (err, post) {
                if (err)
                res.send(err);
 
                Pays.find(function(err, pays) {
                    if (err)
                        res.send(err)
                    res.json(pays);
                });
          });
    });

    // update ville
    app.put('/api/villles', function(req, res) {

        Villles.findOneAndUpdate(
            { _id : req.body._id }, 
            { $set: { favoris:req.body.favoris } }, 
            function (err, post) {
                if (err)
                res.send(err);
 
                Villles.find(function(err, villles) {
                    if (err)
                        res.send(err)
                    res.json(villles);
                });
          });
    });


// listen (start app with node server.js) ======================================
let port = 8080;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});