const fs = require('fs');

var catLevel = 0;

var positions = [];

var data = JSON.parse(fs.readFileSync('inputs.json', 'utf8'));
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
			console.log(obj[k]);
			//catLevel = catLevel - 1;
			eachRecursive(obj[k]);
		} else {
			if (obj.name && obj !== prevObj) {
				html += obj.name + "<br/>";
				console.log(catLevel);
				if (obj.type) {
					//console.log(obj);
				}
			}
			prevObj = obj;
		}
	}
}
eachRecursive(data);


for (var i = 0; i < html.length; i++) {
	fs.writeFileSync("form.html", html);
}