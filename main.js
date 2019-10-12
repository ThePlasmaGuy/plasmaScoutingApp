const fs = require('fs');
const createHTML = require("./lib/createHTML.js");
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const md5File = require('md5-file');
const crypto = require('crypto');
const port = 80;
const apiPort = 81;
const debug = true;

var jsonData = JSON.parse(fs.readFileSync('inputs.json', 'utf8'));

var app = new express();

var apiApp = new express();

var dbArray = [];

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
if (debug === true) {
  console.log(rawHtml);
}
apiApp.get('/', function(req, res) {
  res.send(rawHtml);
})

apiApp.listen(apiPort);


fs.writeFileSync("./html/form.html", rawHtml);

const hash = md5File.sync('./html/form.html');
console.log("Hash of form is " + hash);

try {
  if (fs.existsSync("./db/db.json")) {
    dbArray = JSON.parse(fs.readFileSync('./db/db.json'));
  }
} catch {
  fs.writeFileSync("./db/db.json", "");
}

var sameHash0 = true;
for (var i = 0; i < dbArray.length; i++) {
  if (dbArray[i].hash === hash.toString()) {
    sameHash0 = true;
  } else {
    sameHash0 = false;
    break;
  }
}
if (sameHash0 === true) {

} else {
  throw "ERROR: The database contains data from a form with a different hash than the form found!";
}



var html = "<form id='mainForm' action='/submit' method='POST'>" + rawHtml + "<input type='submit' id='submit' value='Submit'/></form>";


app.get('/', function(req, res) {
  res.send(html);
  console.log("new client with IP " + req.ip);
});


app.get('/analysis', function(req, res) {
  var database = JSON.parse(fs.readFileSync('./db/db.json'));
  if (req.query.team) {
    if (req.query.match) {
      console.log("TEAM: " + req.query.team + ", MATCH: " + req.query.match);
      var responseString = "";
      for (var i = 0; i < database.length; i++) {
        if (database[i].data.teamNumber == req.query.team && database[i].data.matchNumber == req.query.match) {
          responseString += JSON.stringify(database[i].data) + "<br>";
        }
      }
      if (responseString === "") {
        responseString = "No data found matching request";
      }
      res.send(responseString);
    } else {
      console.log("TEAM: " + req.query.team);
      var responseString = "";
      for (var i = 0; i < database.length; i++) {
        if (database[i].data.teamNumber == req.query.team) {
          responseString += JSON.stringify(database[i].data) + "<br>";
        }
      }
      if (responseString === "") {
        responseString = "No data found matching request";
      }
      res.send(responseString);
    }
  } else if (req.query.match) {
    console.log("MATCH: " + req.query.match);
    var responseString = "";
    for (var i = 0; i < database.length; i++) {
      if (database[i].data.matchNumber == req.query.match) {
        responseString += JSON.stringify(database[i].data) + "<br>";
      }
    }
    if (responseString === "") {
      responseString = "No data found matching request";
    }
    res.send(responseString);
  }
});

app.get('/submit', function(req, res) {
  if (debug === true) {
    console.log(req.query.data);
  }
  var getData = JSON.parse(req.query.data);
  dbArray = [];
  try {
    if (fs.existsSync("./db/db.json")) {
      dbArray = JSON.parse(fs.readFileSync('./db/db.json'));
    }
  } catch {
    fs.writeFileSync("./db/db.json", "");
  }
  var sameHash = true;
  for (var i = 0; i < dbArray.length; i++) {
    if (dbArray[i].hash === getData.hash && getData.hash === hash) {
      sameHash = true;
    } else {
      sameHash = false;
      break;
    }
  }
  if (sameHash === true) {
    dbArray.push({
      "hash": hash,
      "ip": req.ip,
      "uuid": getData.uuid,
      "data": getData.data
    });
    res.send('Form Submitted!');
  } else {
    console.log("Client attempted submitting file with incorrect hash. Does client have wrong file? has the form been accidentally updated?")
    res.send('ERROR: Incorrect Hash! Do you have the correct form.html?');
  }

  fs.writeFileSync("./db/db.json", JSON.stringify(dbArray));
});

app.post('/submit', function(req, res) {

  if (debug === true) {
    console.log(req.body);
  }
  dbArray = [];
  try {
    if (fs.existsSync("./db/db.json")) {
      dbArray = JSON.parse(fs.readFileSync('./db/db.json'));
    }
  } catch {
    fs.writeFileSync("./db/db.json", "");
  }
  var sameHash = true;
  for (var i = 0; i < dbArray.length; i++) {
    if (dbArray[i].hash === hash.toString()) {
      sameHash = true;
    } else {
      sameHash = false;
      break;
    }
  }
  if (sameHash === true) {
    dbArray.push({
      "hash": hash,
      "ip": req.ip,
      "uuid": randomValueHex(256),
      "data": req.body
    });
    res.sendFile(path.join(__dirname + '/html/submit.html'));
  } else {
    console.log("Client attempted submitting file with incorrect hash. Does client have wrong file? has the form been accidentally updated?")
    res.sendFile(path.join(__dirname + '/html/error.html'));
  }

  fs.writeFileSync("./db/db.json", JSON.stringify(dbArray));

});

console.log("listening on port " + port);
app.listen(port);