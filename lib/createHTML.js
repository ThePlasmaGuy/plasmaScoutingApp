var headings = [
	["<h1>", "</h1>"],
	["<h2>", "</h2>"],
	["<h3>", "</h3>"],
	["<h4>", "</h4>"],
	["<h5>", "</h5>"],
	["<h6>", "</h6>"]
];

var catLevel = 0;

var objIDs = [];

var positions = [];

var prevobj = {};
var html = "";

function createHTML(obj) {
	if(obj[0] === true) {
		catLevel++;
		for(var k in obj[1]) {
			if(typeof obj[1][k] == "object" && obj[1][k] !== null) {
				//catLevel = catLevel - 1;
				if(!obj[1][k].type) {
					createHTML([true, obj[1][k]]);
				} else {

					var required = "required";
					if(obj[1][k].required === false) {
						required = "";
					}
					for(var m = 0; m < objIDs.length; m++) {
						if(objIDs[m] === obj[1][k].id) {
							throw "ERROR: Duplicate ID in inputs.json \"" + obj[1][k].id + "\"";
						}
					}
					objIDs.push(obj[1][k].id);
					if(obj[1][k].type === "int") {
						html += obj[1][k].name + "<input type='number' class='int' max='" + obj[1][k].max + "' min='" + obj[1][k].min + "' id='" + obj[1][k].id + "' name='" + obj[1][k].id + "' " + required + "/><br/>";
					} else if(obj[1][k].type === "dropdown") {
						html += obj[1][k].name + "<select class='dropdown' id='" + obj[1][k].id + "' name='" + obj[1][k].id + "' " + required + ">";
						for(var i = 0; i < obj[1][k].options.length; i++) {
							html += "<option value='" + obj[1][k].options[i].value + "'>" + obj[1][k].options[i].optionName + "</option>";
						}
						html += "</select><br/>";
					} else if(obj[1][k].type === "string") {
						html += obj[1][k].name + "<input type='text' class='string' max='" + obj[1][k].max + "' min='" + obj[1][k].min + "' id='" + obj[1][k].id + "' name='" + obj[1][k].id + "' " + required + "/><br/>";
					} else if(obj[1][k].type === "longString") {
						html += obj[1][k].name + "<textarea class='longString' maxlength='" + obj[1][k].max + "' minlength='" + obj[1][k].min + "' id='" + obj[1][k].id + "' name='" + obj[1][k].id + "' " + required + "></textarea><br/>";
					} else if(obj[1][k].type === "checkbox") {
						html += "<input type='checkbox' id='" + obj[1][k].id + "' name='" + obj[1][k].id + "'/>" + obj[1][k].name + "<br/>";
					}
				}
			} else {
				if(!obj[1].type && obj[1].name) {
					html += "<b>" + obj[1].name + "</b><br/>";
					//console.log(catLevel);
				} else if(obj[1].type && obj[1] !== prevobj) {
					//console.log(obj[1]);
					html += "<b>" + obj[1].name + "</b><br>";
				}
				prevobj = obj[1];
			}
		}
	} else if(obj[0] === false) {
		catLevel++;
		for(var k in obj[1]) {
			if(typeof obj[1][k] == "object" && obj[1][k] !== null) {
				//catLevel = catLevel - 1;
				if(!obj[1][k].type) {
					createHTML([false, obj[1][k]]);
				} else {
					for(var m = 0; m < objIDs.length; m++) {
						if(objIDs[m] === obj[1][k].id) {
							throw "ERROR: Duplicate ID in inputs.json \"" + obj[1][k].id + "\"";
						}
					}
					objIDs.push(obj[1][k].id);
					//console.log(obj[1][k].id);
					if(obj[1][k].type === "int") {
						html += obj[1][k].name + "<input type='text' class='int' id='" + obj[1][k].id + "' name='" + obj[1][k].id + "' " + "/><br/>";
					} else if(obj[1][k].type === "dropdown") {
						html += obj[1][k].name + "<select class='select' id='" + obj[1][k].id + "' name='" + obj[1][k].id + "' " + ">";
						html += "<option value='' selected='selected'></option>";
						for(var i = 0; i < obj[1][k].options.length; i++) {
							html += "<option value='" + obj[1][k].options[i].value + "'>" + obj[1][k].options[i].optionName + "</option>";
						}
						html += "</select><br/>";
					} else if(obj[1][k].type === "string") {
						html += obj[1][k].name + "<input class='string' type='text' id='" + obj[1][k].id + "' name='" + obj[1][k].id + "' " + "/><br/>";
					} else if(obj[1][k].type === "longString") {
						html += obj[1][k].name + "<textarea class='longString' maxlength='" + obj[1][k].max + "' minlength='" + obj[1][k].min + "' id='" + obj[1][k].id + "' name='" + obj[1][k].id + "' " + "></textarea><br/>";
					} else if(obj[1][k].type === "checkbox") {
						html += "<input type='checkbox' id='" + obj[1][k].id + "' name='" + obj[1][k].id + "'/>" + obj[1][k].name + "<br/>";
					}
				}
			} else {
				if(!obj[1].type && obj[1].name) {
					html += "<b>" + obj[1].name + "</b><br/>";
					//console.log(catLevel);
				} else if(obj[1].type && obj[1] !== prevobj) {
					//console.log(obj[1]);
					html += "<b>" + obj[1].name + "</b><br>";
				}
				prevobj = obj[1];
			}
		}
	} else {
		return "error"
	}
	//console.log(html);
}


module.exports = {
	generateHTML: function(obj) {
		createHTML(obj);
		var returnHTML = JSON.parse(JSON.stringify(html));
		html = "";
		objIDs = [];
		return returnHTML;
	}
}