const fs = require('fs');
const createHTML = require("./createHTML.js");
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


var dbTemplate = {};

var jsonData = JSON.parse(fs.readFileSync('inputs.json', 'utf8'));

var completed = false;






var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


var html = "<form id='mainForm' action='/submit' method='POST'>" + createHTML.generateHTML(jsonData) + "<input type='submit' id='submit' value='Submit'/></form>";
fs.writeFileSync("form.html", html);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/form.html'));
});


app.get('/analysis', function(req, res) {
  res.sendFile(path.join(__dirname + '/form.html'));
});


app.post('/submit', function(req, res) {

  console.log(req.body);
	var dbArray = [];
  try {
    if (fs.existsSync("./db.json")) {
      dbArray = JSON.parse(fs.readFileSync('./db.json'));
    }
  } catch {
    fs.writeFileSync("./db.json", "");
  }
	dbArray.push(req.body);
	fs.writeFileSync("./db.json", JSON.stringify(dbArray));
	res.sendFile(path.join(__dirname + '/submit.html'));
});

app.listen(80);
