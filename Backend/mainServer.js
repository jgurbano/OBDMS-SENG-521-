var express = require('express');
var webServer = express();
var path = require("path");
var webpagePath = path.join(__dirname, "../Frontend");

/* Webpage is hosted at 8080 */

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