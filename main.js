const fs = require('fs');
const createHTML = require("./lib/createHTML.js");
const searchDB = require("./lib/searchDB.js");
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const md5File = require('md5-file');
const crypto = require('crypto');
const readlineSync = require('readline-sync');
const port = 80;
const apiPort = 81;
const debug = true;

var jsonData = JSON.parse(fs.readFileSync('./json/inputs.json', 'utf8'));
var css = fs.readFileSync("./style.css");

var rawHtml = createHTML.generateHTML(jsonData);

console.log("HTML: " + createHTML.generateHTML(jsonData) + "\n\n");

var scoutIDs = JSON.parse(fs.readFileSync('./json/scouts.json', 'utf8'));

console.log("Scouts:");
for(var i = 0; i < scoutIDs.length; i++) {
	if(scoutIDs[i].separate === true) {
		console.log("Name " + scoutIDs[i].name + ", ID " + scoutIDs[i].id + ", Separate=TRUE");
	} else {
		console.log("Name " + scoutIDs[i].name + ", ID " + scoutIDs[i].id + ", Separate=FALSE");
	}
}
console.log("\n\n");


var app = new express();

var apiApp = new express();

var dbArray = [];

function randomValueHex(len) {
	return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
apiApp.get('/', function(req, res) {
	if(searchDB.isValidScoutID(req.query.scoutID) === true) {
		res.send(rawHtml);
	} else {
		res.send('INVALID SCOUT ID');
	}
})

apiApp.listen(apiPort);

fs.writeFileSync("./html/form.html", rawHtml);

const hash = md5File.sync('./html/form.html');
console.log("Hash of form is " + hash);

if(!fs.existsSync("./db/")) {
	console.log("\n\n./db/ director does not exist, creating directory.\n\n");
	fs.mkdirSync("./db/");
}

try {
	if(fs.existsSync("./db/db.json")) {
		dbArray = JSON.parse(fs.readFileSync('./db/db.json'));
	}
} catch {
	fs.writeFileSync("./db/db.json", "");
}

var sameHash0 = true;
var files = fs.readdirSync("./db")
for(var i in files) {
	try {
		var testFile = JSON.parse(fs.readFileSync("./db/" + files[i]));
		console.log("Checking hashes of file " + files[i]);
		for(var j = 0; j < testFile.length; j++) {
			console.log("Hash of entry " + j + " of " + files[i] + " is " + testFile[j].hash);
			if(testFile[j].hash !== hash.toString()) {
				sameHash0 = false;
			}
		}
		console.log("\n");
	} catch {
		fs.unlinkSync("./db/" + files[i]);
	}
}
console.log("\n");
if(sameHash0 === false) {
	var delDB = readlineSync.question("Database contains mismatching hashes. Delete files with incorrect hashes? (Y/N): ");
	if(delDB === "Y") {
		for(var i in files) {
			try {
				var testFile = JSON.parse(fs.readFileSync("./db/" + files[i]));
				console.log("Checking hashes of file " + files[i]);
				for(var j = 0; j < testFile.length; j++) {
					console.log("Hash of entry " + j + " of " + files[i] + " is " + testFile[j].hash);
					if(testFile[j].hash !== hash.toString()) {
						fs.unlinkSync("./db/" + files[i]);
						break;
					}
				}
				console.log("\n");
			} catch {
				fs.unlinkSync("./db/" + files[i]);
			}
		}
	} else {
		throw "ERROR: The database contains data from a form with a different hash than the form found!";
	}
}

var html = "<!DOCTYPE html><html><head><style>" + css + "</style><title>Scouting App</title></head><body><form id='mainForm' action='/submit' method='POST'>" + rawHtml + "<input type='submit' id='submit' value='Submit'/></form><script type='text/javascript'>document.getElementById('mainForm').setAttribute('action', window.location.href)</script></body></html>";

app.get('/', function(req, res) {
	if(searchDB.isValidScoutID(req.query.scoutID) === true) {
		res.send(html);
		console.log("new client with IP " + req.ip + ", Scout ID " + req.query.scoutID + ", Name " + searchDB.getScoutName(req.query.scoutID) + ", page /");
	} else if(!req.query.scoutID) {
		res.sendFile(path.join(__dirname + '/html/login.html'));
	} else {
		res.sendFile(path.join(__dirname + '/html/loginIncorrect.html'));
	}
});

app.get('/verify', function(req, res) {
	if(searchDB.isValidScoutID(req.query.scoutID) === true) {
		res.send('VALID');
		console.log("new Electron client with IP " + req.ip + ", Scout ID " + req.query.scoutID + ", Name " + searchDB.getScoutName(req.query.scoutID));
	} else {
		res.send('INVALID');
	}
});


app.get('/analysis', function(req, res) {
	if(searchDB.isValidScoutID(req.query.scoutID) === true) {
		var rawHtmlNonRequire = createHTML.generateAnalysisHTML(JSON.parse(fs.readFileSync("./json/inputs.json")));

		var nonRequireHTML = "<!DOCTYPE html><html><head><style>" + css + "</style><title>Scouting App</title></head><body><form id='mainForm' action='/submitAnalysis' method='POST'>" + rawHtmlNonRequire + "<input type='submit' id='submit' value='Submit'/></form><script type='text/javascript'>document.getElementById('mainForm').setAttribute('action', window.location.href)</script></body></html>";
		res.send(nonRequireHTML);
		console.log("new client with IP " + req.ip + ", Scout ID " + req.query.scoutID + ", Name " + searchDB.getScoutName(req.query.scoutID) + ", page /analysis");
		//
	} else if(!req.query.scoutID) {
		res.sendFile(path.join(__dirname + '/html/login.html'));
	} else {
		res.sendFile(path.join(__dirname + '/html/loginIncorrect.html'));
	}
});

app.post('/analysis', function(req, res) {
	try {
		res.send(searchDB.searchDB(JSON.parse(fs.readFileSync("./db/db.json")), req.body));
	} catch {
		res.send("ERROR");
	}
});


app.get('/download', function(req, res) {
	if(searchDB.isValidScoutID(req.query.scoutID) === true) {
		console.log("new client with IP " + req.ip + ", Scout ID " + req.query.scoutID + ", Name " + searchDB.getScoutName(req.query.scoutID) + ", page /download");
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
	if(searchDB.isValidScoutID(req.query.scoutID) === true) {
		console.log("new client with IP " + req.ip + ", Scout ID " + req.query.scoutID + ", Name " + searchDB.getScoutName(req.query.scoutID) + ", page /downloadExcel");
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
	if(searchDB.isValidScoutID(req.query.scoutID) === true) {
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
			dbPushObj.scoutID = req.query.scoutID;
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
		dbNewObj.scoutID = req.query.scoutID;
		var separateUser = false;
		for(var i = 0; i < scoutIDs.length; i++) {
			if(scoutIDs[i].id == req.query.scoutID) {
				if(scoutIDs[i].separate === true) {
					separateUser = true;
				}
				break;
			}
		}
		if(separateUser === false) {
			dbArray.push(dbNewObj);
		} else {
			console.log("User \"" + searchDB.getScoutName(req.query.scoutID) + "\" has the \"SEPARATE\" flag set to TRUE, submission will be saved to ./db/db" + req.query.scoutID + ".json instead of regular database.");
			var separateJSON = [];
			try {
				separateJSON = JSON.parse(fs.readFileSync("./db/db" + req.query.scoutID + ".json"));
				separateJSON.push(dbNewObj);
				fs.writeFileSync("./db/db" + req.query.scoutID + ".json", JSON.stringify(separateJSON));
			} catch {
				fs.writeFileSync("./db/db" + req.query.scoutID + ".json", JSON.stringify([dbNewObj]));
			}
		}
		res.sendFile(path.join(__dirname + '/html/submit.html'));
	} else {
		console.log("Client attempted submitting file with incorrect hash. Does client have wrong file? has the form been accidentally updated?");
		res.sendFile(path.join(__dirname + '/html/error.html'));
	}

	fs.writeFileSync("./db/db.json", JSON.stringify(dbArray));

});

console.log("listening on port " + port + "\n\n\n\n\n");
app.listen(port);