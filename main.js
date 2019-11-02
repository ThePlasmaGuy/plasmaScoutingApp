const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const md5File = require('md5-file');
const mustache = require('mustache');
const bodyParser = require('body-parser');
const createHTML = require("./lib/createHTML.js"); // Form Generation
const searchDB = require("./lib/searchDB.js"); // Database Search Tools


// Configuration Values
const port = 80; // Live Application Port
const apiPort = 81; // API Port
const debug = true;


// Container Variables
var dbArray = []; // Local Scouting Database
var scoutIDs = []; // Local Scout Information


// Helper Functions
function isValidScoutID(id) { // Check a given ScoutID against valid IDs
	for(var i = 0; i < scoutIDs.length; i++) {
		if(scoutIDs[i].id == id) {
			return true;
			break;
		}
	}
}

function getScoutName(id) { // Get Scout Name from a ScoutID
	for(var i = 0; i < scoutIDs.length; i++) {
		if(scoutIDs[i].id == id) {
			return scoutIDs[i].name;
			break;
		}
	}
	return null;
}

function randomValueHex(len) { // Generate a Random Hex Value of a given length
	return crypto
		.randomBytes(Math.ceil(len / 2))
		.toString('hex')
		.slice(0, len)
}


// Import Static Data
var formConfig = JSON.parse(fs.readFileSync('inputs.json', 'utf8')); // Scouting Form Configuration Data


// Generate ScoutIDs
if (fs.existsSync("./json/scouts.json")) { // If Scout Identification Exists, Load to Local
	scoutIDs = JSON.parse(fs.readFileSync('./json/scouts.json', 'utf8'));
} else {
	scoutIDs = [{"id": "000000", "name": "Administrator"}];
	fs.outputFileSync("./json/scouts.json", "[{\n    \"id\": \"000000\",\n    \"name\": \"Administrator\"\n  }\n]");
}


// Generate Database
if (fs.existsSync("./db/db.json")) { // If Database Exists, Load to Local Database
	dbArray = JSON.parse(fs.readFileSync('./db/db.json'));
} else { // Else, Create New Database
	fs.outputFileSync("./db/db.json", "{}");
}


// Generate Form
var formData = createHTML.generateHTML([true, formConfig]); // Generate Form HTML
fs.outputFileSync("./html/form.html", formData); // Write to Disk


// Check Form against Database
const formHash = md5File.sync('./html/form.html');  // Unique Form Instance Identifier

var matchedFormIdentity = true;

for(var i = 0; i < dbArray.length; i++) {
	if(dbArray[i].hash === formHash.toString()) { // Check Form identity against current Data Entry
		matchedFormIdentity = true; // Form Matches Data Entry
	} else {
		matchedFormIdentity = false; // Data Entry does not match loaded Form 
		break;
	}
}

if(matchedFormIdentity != true) { // If Form is not a complete match for all Data Entries, throw ERROR
	throw "ERROR: The database contains data from a form with a different hash than the form found!";
}


// Log Static Data [DEBUG]
if(debug === true) {
	console.log("Current Scouting Form: " + formData);
	console.log("Form Identity: " + formHash);
	console.log("Registered Scouts: " + JSON.stringify(scoutIDs));
}


// Initialize Express Instances
var app = new express(); // Live Application
var api = new express(); // API

app.use(bodyParser.json()); // Install Incoming Request Parsing Middleware
app.use(bodyParser.urlencoded({
	extended: true
}));


// API Endpoints
api.get('/', function(req, res) {
	if(isValidScoutID(req.query.scoutID) === true) {
		res.send(formData);
	} else {
		res.send('INVALID SCOUT ID');
	}
})


// Will refactor
//
//
//
//
//
//
var html = "<!DOCTYPE html><html><head><style></style><title>Scouting App</title></head><body><form id='mainForm' action='/submit' method='POST'>" + formData + "<input type='submit' id='submit' value='Submit'/></form><script type='text/javascript'>document.getElementById('mainForm').setAttribute('action', window.location.href)</script></body></html>";
//
//
//
//
//
//
//


// Application Endpoints
app.get('/', function(req, res) { 
	if(isValidScoutID(req.query.scoutID) === true) {
		res.send(html);
		console.log("new client with IP " + req.ip + ", Scout ID " + req.query.scoutID + ", Name " + getScoutName(req.query.scoutID));
	} else if(!req.query.scoutID) {
		res.sendFile(path.join(__dirname + '/html/login.html'));
	} else {
		res.sendFile(path.join(__dirname + '/html/loginIncorrect.html'));
	}
});

app.get('/verify', function(req, res) {
	if(isValidScoutID(req.query.scoutID) === true) {
		res.send('VALID');
		console.log("new Electron client with IP " + req.ip + ", Scout ID " + req.query.scoutID + ", Name " + getScoutName(req.query.scoutID));
	} else {
		res.send('INVALID');
	}
});


app.get('/analysis', function(req, res) {
	if(isValidScoutID(req.query.scoutID) === true) {
		var rawHtmlNonRequire = createHTML.generateHTML([false, JSON.parse(fs.readFileSync("./inputs.json"))]);

		//
		//
		//
		//
		//
		//
		//
		var nonRequireHTML = "<!DOCTYPE html><html><head><style></style><title>Scouting App</title></head><body><form id='mainForm' action='/submitAnalysis' method='POST'>" + rawHtmlNonRequire + "<input type='submit' id='submit' value='Submit'/></form><script type='text/javascript'>document.getElementById('mainForm').setAttribute('action', window.location.href)</script></body></html>";
		//
		//
		//
		//
		//
		//
		//
		//
		
		res.send(nonRequireHTML);
	} else if(!req.query.scoutID) {
		res.sendFile(path.join(__dirname + '/html/login.html'));
	} else {
		res.sendFile(path.join(__dirname + '/html/loginIncorrect.html'));
	}
});

app.post('/analysis', function(req, res) {
	res.send(searchDB.searchDB(JSON.parse(fs.readFileSync("./db/db.json")), req.body));
});

/*
app.get('/analysis', function(req, res) {

	if(isValidScoutID(req.query.scoutID) === true) {
		var database = JSON.parse(fs.readFileSync('./db/db.json'));
		if(req.query.team) {
			if(req.query.match) {
				console.log("TEAM: " + req.query.team + ", MATCH: " + req.query.match);
				var responseString = "";
				for(var i = 0; i < database.length; i++) {
					if(database[i].data.teamNumber == req.query.team && database[i].data.matchNumber == req.query.match) {
						responseString += "<pre class='prettyprint'>" + JSON.stringify(database[i].data, null, 4) + "</pre><br>";
					}
				}
				if(responseString == "") {
					responseString = "No data found matching request";
				}
				res.send(responseString);
			} else {
				console.log("TEAM: " + req.query.team);
				var responseString = "";
				for(var i = 0; i < database.length; i++) {
					if(database[i].data.teamNumber == req.query.team) {
						responseString += "<pre class='prettyprint'>" + JSON.stringify(database[i].data, null, 4) + "</pre><br>";
					}
				}
				if(responseString == "") {
					responseString = "No data found matching request";
				}
				res.send(responseString);
			}
		} else if(req.query.match) {
			console.log("MATCH: " + req.query.match);
			var responseString = "";
			for(var i = 0; i < database.length; i++) {
				if(database[i].data.matchNumber == req.query.match) {
					responseString += "<pre class='prettyprint'>" + JSON.stringify(database[i].data, null, 4) + "</pre><br>";
				}
			}
			if(responseString == "") {
				responseString = "No data found matching request";
			}
			res.send(responseString);
		} else {
			res.sendFile(path.join(__dirname + '/html/query.html'));
		}
	} else if(!req.query.scoutID) {
		res.sendFile(path.join(__dirname + '/html/login.html'));
	} else {
		res.sendFile(path.join(__dirname + '/html/loginIncorrect.html'));
	}
});
*/

app.get('/download', function(req, res) {
	if(isValidScoutID(req.query.scoutID) === true) {
		var jsonMain;
		try {
			jsonMain = JSON.parse(fs.readFileSync('./db/db.json'));
		} catch {
			jsonMain = undefined;
		}
		var json = [];
		var csv = "";
		if(jsonMain) {
			for(var k in jsonMain[0].data) {
				csv += k + ",";
			}
			csv = csv.substring(0, csv.length - 1);
			csv += "<br>";
			for(var i = 0; i < jsonMain.length; i++) {
				for(var k in jsonMain[i].data) {
					csv += eval("jsonMain[i].data." + k).split(",").join(" ") + ",";
				}
				csv = csv.substring(0, csv.length - 1);
				csv += "<br>";
			}
			res.send(csv.split("\"").join(" ").split("'").join(" "));
		} else {
			res.send("No data has been collected yet!");
		}
	} else if(!req.query.scoutID) {
		res.sendFile(path.join(__dirname + '/html/login.html'));
	} else {
		res.sendFile(path.join(__dirname + '/html/loginIncorrect.html'));
	}
});

app.get('/downloadExcel', function(req, res) {
	if(isValidScoutID(req.query.scoutID) === true) {
		var jsonMain;
		try {
			jsonMain = JSON.parse(fs.readFileSync('./db/db.json'));
		} catch {
			jsonMain = undefined;
		}
		var json = [];
		var csv = "";
		if(jsonMain) {
			for(var k in jsonMain[0].data) {
				csv += k + "&#9;";
			}
			csv = csv.substring(0, csv.length - 1);
			csv += "\n";
			for(var i = 0; i < jsonMain.length; i++) {
				for(var k in jsonMain[i].data) {
					csv += eval("jsonMain[i].data." + k).split(",").join(" ") + "&#9;";
				}
				csv = csv.substring(0, csv.length - 1);
				csv += "\n";
			}
			res.send("<textarea style='width:90%;height:90%' onclick='this.focus();this.select()'' readonly='readonly'>" + csv.split("\"").join(" ").split("'").join(" ") + "</textarea>");
		} else {
			res.send("No data has been collected yet!");
		}
	} else if(!req.query.scoutID) {
		res.sendFile(path.join(__dirname + '/html/login.html'));
	} else {
		res.sendFile(path.join(__dirname + '/html/loginIncorrect.html'));
	}
});

app.get('/submit', function(req, res) {
	if(isValidScoutID(req.query.scoutID) === true) {
		if(debug === true) {
			console.log(decodeURIComponent(req.query.data));
		}
		var getData = JSON.parse(decodeURIComponent(req.query.data));
		dbArray = [];
		try {
			if(fs.existsSync("./db/db.json")) {
				dbArray = JSON.parse(fs.readFileSync('./db/db.json'));
			}
		} catch {
			fs.writeFileSync("./db/db.json", "");
		}
		var sameHash = true;
		for(var i = 0; i < dbArray.length; i++) {
			if(dbArray[i].hash === getData.hash && getData.hash === formHash) {
				sameHash = true;
			} else {
				sameHash = false;
				break;
			}
		}
		var uuidFound = false;
		for(var i = 0; i < dbArray.length; i++) {
			if(dbArray[i].uuid === getData.uuid) {
				uuidFound = true;
			} else {
				uuidFound = false;
				break;
			}
		}
		if(sameHash === true && uuidFound === false) {
			var dbPushObj = {
				"hash": formHash,
				"ip": req.ip,
				"uuid": getData.uuid,
				"data": getData.data
			}
			dbPushObj.data.scoutID = req.query.scoutID;
			dbArray.push(dbPushObj);
			res.send('Form Submitted!');
		} else if(uuidFound === true) {
			res.send('Same UUID');
		} else {
			console.log("Client attempted submitting file with incorrect hash. Does client have wrong file? has the form been accidentally updated?");
			res.send('ERROR: Incorrect Hash! Do you have the correct form.html?');
		}

		fs.writeFileSync("./db/db.json", JSON.stringify(dbArray));
	} else {
		res.send('INVALID SCOUT ID');
	}
});

app.post('/', function(req, res) {

	if(debug === true) {
		console.log(req.body);
	}
	dbArray = [];
	try {
		if(fs.existsSync("./db/db.json")) {
			dbArray = JSON.parse(fs.readFileSync('./db/db.json'));
		}
	} catch {
		fs.writeFileSync("./db/db.json", "");
	}
	var sameHash = true;
	for(var i = 0; i < dbArray.length; i++) {
		if(dbArray[i].hash === formHash.toString()) {
			sameHash = true;
		} else {
			sameHash = false;
			break;
		}
	}
	if(sameHash === true) {
		var dbNewObj = {
			"hash": formHash,
			"ip": req.ip,
			"uuid": randomValueHex(256),
			"data": req.body
		}
		dbNewObj.data.scoutID = req.query.scoutID;
		dbArray.push(dbNewObj);
		res.sendFile(path.join(__dirname + '/html/submit.html'));
	} else {
		console.log("Client attempted submitting file with incorrect hash. Does client have wrong file? has the form been accidentally updated?");
		res.sendFile(path.join(__dirname + '/html/error.html'));
	}

	fs.writeFileSync("./db/db.json", JSON.stringify(dbArray));

});


// Open Express Instances
console.log("Application Live on Port " + port);
app.listen(port);
api.listen(apiPort);