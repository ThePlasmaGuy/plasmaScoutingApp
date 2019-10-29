const fs = require('fs');
const createHTML = require("./lib/createHTML.js");
const searchDB = require("./lib/searchDB.js");
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const md5File = require('md5-file');
const crypto = require('crypto');
const port = 80;
const apiPort = 81;
const debug = true;



var jsonData = JSON.parse(fs.readFileSync('inputs.json', 'utf8'));
var css = fs.readFileSync("./style.css");

var rawHtml = createHTML.generateHTML([true, jsonData]);

console.log("HTML: " + createHTML.generateHTML([true, jsonData]));

var scoutIDs = JSON.parse(fs.readFileSync('./json/scouts.json', 'utf8'));

console.log(scoutIDs)

function isValidScoutID(id) {
	for(var i = 0; i < scoutIDs.length; i++) {
		if(scoutIDs[i].id == id) {
			return true;
			break;
		}
	}
}

function getScoutName(id) {
	for(var i = 0; i < scoutIDs.length; i++) {
		if(scoutIDs[i].id == id) {
			return scoutIDs[i].name;
			break;
		}
	}
	return null;
}

var app = new express();

var apiApp = new express();

var dbArray = [];

function randomValueHex(len) {
	return crypto
		.randomBytes(Math.ceil(len / 2))
		.toString('hex')
		.slice(0, len)
}




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));




if(debug === true) {
	console.log(rawHtml);
}
apiApp.get('/', function(req, res) {
	if(isValidScoutID(req.query.scoutID) === true) {
		res.send(rawHtml);
	} else {
		res.send('INVALID SCOUT ID');
	}
})

apiApp.listen(apiPort);


fs.writeFileSync("./html/form.html", rawHtml);

const hash = md5File.sync('./html/form.html');
console.log("Hash of form is " + hash);

try {
	if(fs.existsSync("./db/db.json")) {
		dbArray = JSON.parse(fs.readFileSync('./db/db.json'));
	}
} catch {
	fs.writeFileSync("./db/db.json", "");
}

var sameHash0 = true;
for(var i = 0; i < dbArray.length; i++) {
	if(dbArray[i].hash === hash.toString()) {
		sameHash0 = true;
	} else {
		sameHash0 = false;
		break;
	}
}
if(sameHash0 === true) {

} else {
	throw "ERROR: The database contains data from a form with a different hash than the form found!";
}



var html = "<!DOCTYPE html><html><head><style>" + css + "</style><title>Scouting App</title></head><body><form id='mainForm' action='/submit' method='POST'>" + rawHtml + "<input type='submit' id='submit' value='Submit'/></form><script type='text/javascript'>document.getElementById('mainForm').setAttribute('action', window.location.href)</script></body></html>";




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

		var nonRequireHTML = "<!DOCTYPE html><html><head><style>" + css + "</style><title>Scouting App</title></head><body><form id='mainForm' action='/submitAnalysis' method='POST'>" + rawHtmlNonRequire + "<input type='submit' id='submit' value='Submit'/></form><script type='text/javascript'>document.getElementById('mainForm').setAttribute('action', window.location.href)</script></body></html>";
		res.send(nonRequireHTML);
		//
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
			if(dbArray[i].hash === getData.hash && getData.hash === hash) {
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
				"hash": hash,
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
		if(dbArray[i].hash === hash.toString()) {
			sameHash = true;
		} else {
			sameHash = false;
			break;
		}
	}
	if(sameHash === true) {
		var dbNewObj = {
			"hash": hash,
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

console.log("listening on port " + port);
app.listen(port);