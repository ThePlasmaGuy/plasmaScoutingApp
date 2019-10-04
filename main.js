const fs = require('fs');
const createHTML = require("./lib/createHTML.js");
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const md5File = require('md5-file');
const crypto = require('crypto');
const port = 80;
const apiPort = 81;

var jsonData = JSON.parse(fs.readFileSync('inputs.json', 'utf8'));

var app = new express();

var apiApp = new express();


function randomValueHex(len) {
	return crypto
		.randomBytes(Math.ceil(len / 2))
		.toString('hex') // convert to hexadecimal format
		.slice(0, len) // return required number of characters
}



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var rawHtml = createHTML.generateHTML(jsonData);
console.log(rawHtml);
apiApp.get('/', function(req, res) {
	res.send(rawHtml);
})

apiApp.listen(apiPort);


fs.writeFileSync("./html/form.html", rawHtml);

const hash = md5File.sync('./html/form.html');
console.log("Hash of form is " + hash);

var html = "<form id='mainForm' action='/submit' method='POST'>" + rawHtml + "<input type='submit' id='submit' value='Submit'/></form>";


app.get('/', function(req, res) {
	res.send(html);
	console.log("new client with IP " + req.ip);
});


app.get('/analysis', function(req, res) {
	res.sendFile(path.join(__dirname + '/html/form.html'));
});


app.post('/submit', function(req, res) {

	console.log(req.body);
	var dbArray = [];
	try {
		if(fs.existsSync("./db/db.json")) {
			dbArray = JSON.parse(fs.readFileSync('./db/db.json'));
		}
	} catch {
		fs.writeFileSync("./db/db.json", "");
	}
	dbArray.push({
		"hash": hash,
		"ip": req.ip,
		"uuid": randomValueHex(256),
		"data": req.body
	});
	fs.writeFileSync("./db/db.json", JSON.stringify(dbArray));
	res.sendFile(path.join(__dirname + '/html/submit.html'));
});

console.log("listening on port " + port);
app.listen(port);