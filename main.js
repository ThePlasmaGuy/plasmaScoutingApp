const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const md5File = require('md5-file');
const mustache = require('mustache');
const bodyParser = require('body-parser');
const readlineSync = require('readline-sync');
const createHTML = require("./lib/createHTML.js"); // Form Generation
const searchDB = require("./lib/searchDB.js"); // Database Search Tools


// Configuration Values
const port = 80; // Live Application Port
const apiPort = 81; // API Port
const debug = true;


// Container Variables
var dbArray = []; // Local Scouting Database


// Helper Functions
function randomValueHex(len) { // Generate a Random Hex Value of a given length
	return crypto
		.randomBytes(Math.ceil(len / 2))
		.toString('hex')
		.slice(0, len)
}

function getInputObjects(formConfig) { // Get Array of Input Objects in a given Form Configuration
	var inputObjects = []

	for (const category of formConfig) { // Pull Input Objects in a given Category
		if (category.type) { // Category is Item, Add to Array
			inputObjects.push(category);
			continue;
		}

		if (category.categories) { // Category contains Sub-categories, recurse
			inputObjects.push(...getInputObjects(category.categories));
		} else {
			inputObjects.push(...category.items); // Add Category Input Items to Array
		}
	}

	return inputObjects; // Return compiled array
} 

function checkDuplicateItems(formConfig) { // Check a given Form Configuration for duplicate information
	var duplicateItemExists = false; // Whether a duplicate item ID has been found in the provided form
	var scannedIDs = []; // Array of IDs of Scanned Form Items
	var inputObjects = getInputObjects(formConfig); // Simplified list of Form Items from formConfig

	for (inputObject of inputObjects) { // Loop through Form Items
		if (scannedIDs.includes(inputObject.id)) { // If ID in Array of Scanned Items, Duplicate Found
			if (debug === true) console.log('Duplicate Item: ' + JSON.stringify(inputObject)); // Log Duplicate Item to Console if Debug Enabled
			
			duplicateItemExists = true;
			break;
		} else { // Duplicate not found, add ID to scannedIDs
			scannedIDs.push(inputObject.id);
		}
	}

	return duplicateItemExists;
}


// Debug Logging
console.log('Loading Resources...' + (debug ? '\n[DEBUG MODE ENABLED]\n\n' : '\n\n'));


// Import Static Data
var formConfig = JSON.parse(fs.readFileSync('./json/inputs.json', 'utf8')); // Scouting Form Configuration Data
var templateMetadata = fs.readFileSync('./html/templates/meta.html', 'utf8');; // Template Metadata
var scoutIDs = JSON.parse(fs.readFileSync('./json/scouts.json', 'utf8')); // IDs of Registered Scouts


// Log Scout Information
if (debug) {
	console.log('Registered Scouts:')
	for (scout of scoutIDs) {
		console.log(`[${scout.id}] ${scout.name}` + (scout.seperate ? ' - Data Seperated' : '')); // Show Seperation if Enabled
	}
	console.log('\n')
}


// Generate Match Form
if (checkDuplicateItems(formConfig)) throw Error("[FORM] ERROR: Matching Form IDs found in inputs.json!"); // If Duplicate Item IDs exist in form, throw Error
var formData = createHTML.generateHTML(true, formConfig); // Generate Form HTML
var analysisFormData = createHTML.generateHTML(false, formConfig) // Generate Analysis Form HTML (No Options Required -> requireAnswer = false)
fs.outputFileSync("./html/matchForm.html", formData); // Write to Disk


// Generate Database
if (fs.existsSync("./db/db.json")) { // If Database Exists, Load to Local Database
	dbArray = JSON.parse(fs.readFileSync('./db/db.json'));
} else { // Else, Create New Database
	fs.outputFileSync("./db/db.json", "[]");
}


// Check Form against Database
const formHash = md5File.sync('./html/matchForm.html');  // Unique Form Instance Identifier

if (debug) console.log(`[FORM] Match Form Hash: ${formHash}`);

var dataFiles = fs.readdirSync("./db"); // Get Files in Data Directory
var deleteMismatchedData = null; // Whether to delete data files that do not match

for (dataFile of dataFiles) { // Iterate over each file in data directory
	if (debug) console.log(`[DATA] Checking Hash of ./db/${dataFile}`);
	var fileContents = JSON.parse(fs.readFileSync(`./db/${dataFile}`)); // Parse File Contents
	var discoveredHashes = [];
	
	for (entry of fileContents) { // Loop through Data Entries
		if (!(discoveredHashes.includes(entry.hash)) && debug) { // If Debug mode, check if hash has been logged
			discoveredHashes.push(entry.hash); // Push hash to discoveredHashes if not there
			console.log(`[DATA] Hash ${entry.hash} found in ${dataFile}` + (entry.hash !== formHash.toString() ? ' - Wrong Hash' : '')); // Log unique hash to console
		}
		if (entry.hash !== formHash.toString()) { // Check Entry against current Form
			if (deleteMismatchedData === null) {
				deleteMismatchedData = readlineSync.question(`\n[DATA] ./db/${dataFile} contains data with mismatching hashes.  Delete this file and other files with incorrect hashes? (Y/N)`);
				if (deleteMismatchedData.toLowerCase() === "y") {
					console.log(`[DATA] Removing ./db/${dataFile}`);
					deleteMismatchedData = true;

					fs.unlinkSync(`./db/${dataFile}`);
					
					if (dataFile == 'db.json') dbArray = []; // Reset dbArray if db.json was deleted due to bad data

				} else {
					throw Error(`[DATA] Please Remove ./db/${dataFile} to continue.`)
				} 
			} else if (deleteMismatchedData) {
				console.log(`[DATA] Deleting ${dataFile} (Mismatched Hashes)`)
				fs.unlinkSync(`./db/${dataFile}`);

				if (dataFile == 'db.json') dbArray = []; // Reset dbArray if db.json was deleted due to bad data
			} else {
				throw Error(`[DATA] ./db/${dataFile} contains mismatched hashes, please remove to continue.`)
			}

			break; // No need to check further data entries in this file
		}
	}
	if (debug) console.log("\n");
}




// Initialize Express Instances
var app = new express(); // Live Application
var api = new express(); // API

app.use(express.static(path.join(__dirname + '/html/include'))); // Serve static files from include directory
app.use(bodyParser.json()); // Install Incoming Request Parsing Middleware
app.use(bodyParser.urlencoded({
	extended: true
}));


// API Endpoints
api.get('/', function(req, res) {
	if(searchDB.isValidScoutID(req.query.scoutID) === true) {
		res.send(formData);
	} else {
		res.send('INVALID SCOUT ID');
	}
})


// Application Endpoints
app.get('/', function(req, res) { 
	if(searchDB.isValidScoutID(req.query.scoutID) === true) {
		formTemplate = fs.readFileSync('./html/templates/formTemplate.html', 'utf8'); // Form HTML Template
		page = mustache.render(formTemplate, {pageTitle: "Match", metadata: templateMetadata, formData: formData}); // Render HTML Template
		res.send(page); // Send Rendered HTML to Client

		if (debug === true) console.log("[/]: Scout \"" + searchDB.getScoutName(req.query.scoutID) +"\" (" + req.query.scoutID + ") has logged in at " + req.ip);
	} else if(!req.query.scoutID) {
		formTemplate = fs.readFileSync('./html/templates/login.html', 'utf8'); // Login HTML Template
		page = mustache.render(formTemplate, {pageTitle: "Login", metadata: templateMetadata}); // Render HTML Template
		res.send(page); // Send Rendered HTML to Client
	} else {
		formTemplate = fs.readFileSync('./html/templates/login.html', 'utf8'); // Login HTML Template
		page = mustache.render(formTemplate, {pageTitle: "Login", metadata: templateMetadata, error: '<p id="login-incorrect">Invalid Scout ID, Try Again</p>'}); // Render HTML Template
		res.send(page); // Send Rendered HTML to Client

		if (debug === true) console.log("[/] INVALID LOGIN: Attempted Login for " + req.query.scoutID + " at " + req.ip);
	}
});

app.get('/verify', function(req, res) {
	if(searchDB.isValidScoutID(req.query.scoutID) === true) {
		res.send('VALID');
		console.log("[ELECTRON] new Electron client with IP " + req.ip + ", Scout ID " + req.query.scoutID + ", Name " + searchDB.getScoutName(req.query.scoutID));
	} else {
		res.send('INVALID');
	}
});


app.get('/analysis', function(req, res) {
	if(searchDB.isValidScoutID(req.query.scoutID) === true) {
		formTemplate = fs.readFileSync('./html/templates/formTemplate.html', 'utf8'); // Form HTML Template
		page = mustache.render(formTemplate, {pageTitle: "Match", metadata: templateMetadata, formData: analysisFormData}); // Render HTML Template (w/ Analysis Form)
		res.send(page); // Send Rendered HTML to Client

		if (debug === true) console.log("[/analysis]: Scout \"" + searchDB.getScoutName(req.query.scoutID) +"\" (" + req.query.scoutID + ") has logged in at " + req.ip);
	} else if(!req.query.scoutID) {
		formTemplate = fs.readFileSync('./html/templates/login.html', 'utf8'); // Login HTML Template
		page = mustache.render(formTemplate, {pageTitle: "Login", metadata: templateMetadata}); // Render HTML Template
		res.send(page); // Send Rendered HTML to Client
	} else {
		formTemplate = fs.readFileSync('./html/templates/login.html', 'utf8'); // Login HTML Template
		page = mustache.render(formTemplate, {pageTitle: "Login", metadata: templateMetadata, error: '<p id="login-incorrect">Invalid Scout ID, Try Again</p>'}); // Render HTML Template
		res.send(page); // Send Rendered HTML to Client

		if (debug === true) console.log("[/analysis] INVALID LOGIN: Attempted Login for " + req.query.scoutID + " at " + req.ip);
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
		if (debug === true) console.log("[/download]: Scout \"" + searchDB.getScoutName(req.query.scoutID) +"\" (" + req.query.scoutID + ") has logged in at " + req.ip);
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
		formTemplate = fs.readFileSync('./html/templates/login.html', 'utf8'); // Login HTML Template
		page = mustache.render(formTemplate, {pageTitle: "Login", metadata: templateMetadata}); // Render HTML Template
		res.send(page); // Send Rendered HTML to Client
	} else {
		formTemplate = fs.readFileSync('./html/templates/login.html', 'utf8'); // Login HTML Template
		page = mustache.render(formTemplate, {pageTitle: "Login", metadata: templateMetadata, error: '<p id="login-incorrect">Invalid Scout ID, Try Again</p>'}); // Render HTML Template
		res.send(page); // Send Rendered HTML to Client

		if (debug === true) console.log("[/download] INVALID LOGIN: Attempted Login for " + req.query.scoutID + " at " + req.ip);
	}
});

app.get('/downloadExcel', function(req, res) {
	if(searchDB.isValidScoutID(req.query.scoutID) === true) {
		if (debug === true) console.log("[/downloadExcel]: Scout \"" + searchDB.getScoutName(req.query.scoutID) +"\" (" + req.query.scoutID + ") has logged in at " + req.ip);

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
		formTemplate = fs.readFileSync('./html/templates/login.html', 'utf8'); // Login HTML Template
		page = mustache.render(formTemplate, {pageTitle: "Login", metadata: templateMetadata}); // Render HTML Template
		res.send(page); // Send Rendered HTML to Client
	} else {
		formTemplate = fs.readFileSync('./html/templates/login.html', 'utf8'); // Login HTML Template
		page = mustache.render(formTemplate, {pageTitle: "Login", metadata: templateMetadata, error: '<p id="login-incorrect">Invalid Scout ID, Try Again</p>'}); // Render HTML Template
		res.send(page); // Send Rendered HTML to Client

		if (debug === true) console.log("[/downloadExcel] INVALID LOGIN: Attempted Login for " + req.query.scoutID + " at " + req.ip);
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
			fs.outputFileSync("./db/db.json", "[]");
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
			dbPushObj.scoutID = req.query.scoutID;
			dbArray.push(dbPushObj);
			res.send('Form Submitted!');
		} else if(uuidFound === true) {
			res.send('Same UUID');
		} else {
			console.log("[/submit] Client attempted submitting file with incorrect hash. Does client have wrong file? has the form been accidentally updated?");
			res.send('ERROR: Incorrect Hash! Do you have the correct matchForm.html?');
		}

		fs.outputFileSync("./db/db.json", JSON.stringify(dbArray));
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
		fs.outputFileSync("./db/db.json", "[]");
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
				fs.outputFileSync("./db/db" + req.query.scoutID + ".json", JSON.stringify(separateJSON));
			} catch {
				fs.outputFileSync("./db/db" + req.query.scoutID + ".json", JSON.stringify([dbNewObj]));
			}
		}
		
		console.log(`[DATA][/] New Data Submitted by Scout ${req.query.scoutID} (${searchDB.getScoutName(req.query.scoutID)})`);

		formTemplate = fs.readFileSync('./html/templates/submit.html', 'utf8'); // Login HTML Template
		page = mustache.render(formTemplate, {pageTitle: "Success", metadata: templateMetadata, submissionInfo: 'Successful', submissionMessage: 'Data has been successfully recorded!', back: '../'}); // Render HTML Template
		res.send(page); // Send Rendered HTML to Client
	} else {
		console.log("[/] Client attempted submitting file with incorrect hash. Does client have wrong file? has the form been accidentally updated?");

		formTemplate = fs.readFileSync('./html/templates/submit.html', 'utf8'); // Login HTML Template
		page = mustache.render(formTemplate, {pageTitle: "ERROR", metadata: templateMetadata, submissionInfo: 'Failed', submissionMessage: 'Hash Mismatch: Client Form does not match Server...', back: '../'}); // Render HTML Template
		res.send(page); // Send Rendered HTML to Client
	}

	fs.outputFileSync("./db/db.json", JSON.stringify(dbArray));

});


// Open Express Instances
console.log("Application Live on Port " + port);
app.listen(port);
api.listen(apiPort);
