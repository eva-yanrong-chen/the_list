var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public")); //Tells express to take everything from public folder and use them in view

var connection = mysql.createConnection( {
    host    : 'localhost', 
    user    : 'root',
    database: 'join_us'
});

//A route
app.get("/", function(req, res) {
    //Find count of users in DB
    var q = "SELECT COUNT(*) AS count FROM users";
    connection.query(q, function(err, result){
        if (err) throw err;
        var count = result[0].count;
        //Respond with that count
        //res.send("we have " + count + " users in our db");
        res.render("home", {data: count});
    });
});

app.post("/register", function(req, res) {

    var email = req.body.email;

    var q = "SELECT COUNT(*) AS count FROM users WHERE email LIKE '" + email + "'";
    connection.query(q, function(err, result) {
            if (err) throw err;
            var count = result[0].count;

            if (count == 0) {
                var person = {
                    email: req.body.email
                };

                connection.query('INSERT INTO users SET ?', person, function(err, result){
                    if (err) throw err;
                    res.redirect("/");
                })
            } else {
                //res.redirect("/");
                res.redirect("/repeat");
            }
    }); 
});

app.get("/repeat", function(req, res) {
    res.render("repeat");
});

//Starting server
app.listen(3000, function() {
    console.log('App is listening on port 3000.');
});