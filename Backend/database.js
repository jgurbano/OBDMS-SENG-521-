var CouchDB = require('node-couchdb');

/* Setting up database */
var database = new CouchDB({
	host: 'localhost',
	protocol: 'http',
	port: 5984
});
var databaseName = 'seng521';
var loginDocument = '001';
var usersnames = {
	"user1": {
		"username": "driver1",
		"name": "Driver1",
		"role": "driver",
		"password": "password"
	},
	"user2": {
		"username": "manager1",
		"name": "Manager1",
		"role": "manager",
		"password": "password"
	}
};

/**
 *	Check if database exists, if not create database and add users
 */
database.listDatabases().then(function(data){
	if (!data.includes(databaseName)){
		//create database
		database.createDatabase(databaseName).then(function(){
			systemStatus("Created database: " + databaseName);
			// add users
			database.insert(databaseName, {
				_id: loginDocument,
				usersnames
			}).then((data, headers, status) => {
				systemStatus("Added users");
			}, err => {
				systemStatus("Error in creating users document");
			})
		}, err => {
			systemStatus("Couldn't create database: " + databaseName);
			systemStatus("Error: " + err);
		});
	}
}, err => {
	console.log("Error has occured while listing databases");
});

function systemStatus(message){
	console.log("----> " + message);
}