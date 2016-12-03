var express = require('express');
var webServer = express();
var path = require("path");
var webpagePath = path.join(__dirname, "../Frontend");
var database = require("./database");

/* Webpage is hosted at 8080 */

/**
 * Middleware to check if user is logged in before returning response
 */
webServer.use(function(req, res, next){
	var redirected = req.query.redirected;
	var logged = req.query.logged;
	// Add contidion to check if user is logged in
	if (logged || redirected){
		next();
	} else {
		res.redirect('/login?redirected=true');
	}
});

webServer.use(express.static(webpagePath));

webServer.get('/', function(req, res){
	res.redirect('/login');
});

webServer.get('/login', function(req, res){
	res.sendFile(webpagePath + "/login.html");
})

webServer.listen(8080, function(){
	systemStatus('server is listening at 8080');
});

function systemStatus(message){
	console.log("----> " + message);
}