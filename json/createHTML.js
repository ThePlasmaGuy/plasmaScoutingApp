const fs = require('fs');

var catLevel = 0;

var positions = [];

var jsonData = JSON.parse(fs.readFileSync('inputs.json', 'utf8'));
var html = [];
var headings = [
	["<h1>", "</h1>"],
	["<h2>", "</h2>"],
	["<h3>", "</h3>"],
	["<h4>", "</h4>"],
	["<h5>", "</h5>"],
	["<h6>", "</h6>"]
];

var completed = false;

var prevObj = {};

function eachRecursive(obj) {
	catLevel++;
	for (var k in obj) {
		if (typeof obj[k] == "object" && obj[k] !== null) {
			//catLevel = catLevel - 1;
			if (!obj[k].type) {
				eachRecursive(obj[k]);
			} else {
				html += obj[k].name;
				console.log(obj[k].id);
				if (obj[k].type === "int") {
					html += "<input type='number' max='" + obj[k].max + "' min='" + obj[k].min + "' id='" + obj[k].id + "'/><br/>";
				} else if (obj[k].type === "dropdown") {
					html += "<select" + " id='" + obj[k].id + "'>";
					for (var i = 0; i < obj[k].options.length; i++) {
						html += "<option value='" + obj[k].options[i].value + "'>" + obj[k].options[i].optionName + "</option>";
					}
					html += "</select><br/>";
				}
			}
		} else {
			if (!obj.type && obj.name) {
				html += obj.name + "<br/>";
				console.log(catLevel);
			} else if (obj.type && obj !== prevObj) {
				console.log(obj);
				html += obj.name + "<br>";
			}
			prevObj = obj;
		}
	}
}

eachRecursive(jsonData);


for (var i = 0; i < html.length; i++) {
	fs.writeFileSync("index.html", html);
}
