var express = require('express');
var webServer = express();
var path = require("path");
var webpagePath = path.join(__dirname, "../Frontend");
var database = require("./database");
var session = require("express-session");
var bodyParser = require("body-parser");



/* Webpage is hosted at 8080 */

webServer.use(session({
	secret: "no34123123secret",
	resave: false,
	saveUninitialized: true
}));

webServer.use(bodyParser.json());
webServer.use(bodyParser.urlencoded({ extended: true}));

/**
 * Middleware to check if user is logged in before returning response
 */
webServer.use(function(req, res, next){
	// Add contidion to check if user is logged in
	if (req.session.validUser || req.path == "/authenticate" || req.session.redirected || true){
		req.session.redirected = false;
		next();
	} else {
		req.session.redirected = true;
		res.redirect('/');
	}
});

webServer.use(express.static(webpagePath));

webServer.get('/', function(req, res){
	if (req.session && req.session.validUser){
		res.redirect('/main');
	}
	res.sendFile(webpagePath + "/login.html");
});

webServer.get('/main', function(req, res){
	res.sendFile(webpagePath + "/main.html");
})

/**
 * Check if username and password are valid
 */
webServer.post('/authenticate', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	
	var success = function(req, res){
		req.session.validUser = true;
		res.redirect('/');
	}
	
	var failure = function(res){
		res.sendStatus(401);
	}

	// authenticate username & password with database
	// if successful redirect to main.html
	// if not send back failed
	database.checkForUser(username, password, success, failure, req, res);
	});
	
	
/**
 * Get data and write to database
 * Expected format of json data
 *{
 *		time: <time stamp>,
 *		unit: <what rasp pi unit/car it came from>,
 *		codes: {
 *			<code id>: <code description>,
 *			...
 *		}
 *}
 */
webServer.put('/uploadData', function(req, res){
	var success = function(res){
		res.sendStatus(200);
	}
	
	var failure = function(res, message){
		res.status(400);
		res.send(message);
	}
	
	database.updateData(req.body, success, failure, res);
});

webServer.listen(8080, function(){
	systemStatus('server is listening at 8080');
});

function systemStatus(message){
	console.log("----> " + message);
}