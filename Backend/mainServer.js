var express = require('express');
var webServer = express();
var path = require("path");
var webpagePath = path.join(__dirname, "../Frontend");
var database = require("./database");
var session = require("express-session");



/* Webpage is hosted at 8080 */

webServer.use(session({
	secret: "no34123123secret",
	resave: false,
	saveUninitialized: true
}));

/**
 * Middleware to check if user is logged in before returning response
 */
webServer.use(function(req, res, next){
	var redirected = req.query.redirected;
	// Add contidion to check if user is logged in
	if (req.session.validUser || req.path == "/authenticate" || req.session.redirected){
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
webServer.get('/authenticate', function(req, res){
	var username = req.query.username;
	var password = req.query.password;
	
	var success = function(req, res){
		req.session.validUser = true;
		res.sendStatus(200);
	}
	
	var failure = function(res){
		res.sendStatus(404);
	}

	// authenticate username & password with database
	// if successful redirect to main.html
	// if not send back failed
	database.checkForUser(username, password, success, failure, req, res);
	});
	
webServer.post('/uploadData', function(req, res){
	console.log(req.file);
	res.sendStatus(200);
});

webServer.listen(8080, function(){
	systemStatus('server is listening at 8080');
});

function systemStatus(message){
	console.log("----> " + message);
}