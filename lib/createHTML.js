var headings = [
	["<h1>", "</h1>"],
	["<h2>", "</h2>"],
	["<h3>", "</h3>"],
	["<h4>", "</h4>"],
	["<h5>", "</h5>"],
	["<h6>", "</h6>"]
];


var objIDs = [];

var positions = [];

var prevobj = {};
var html = "";

module.exports = {
	generateHTML: function(obj) {
		function recur(obj, level) {
			html += "<div class=\"level" + level + "\">";
			for(var k in obj) {
				if(typeof obj[k] == "object" && obj[k] !== null) {
					if(!obj[k].type) {
						recur(obj[k], level++);
					} else {
						var required = "required";
						if(obj[k].required === false) {
							required = "";
						}
						if(!obj[k].id) {
							throw "ERROR: Item has no ID: inputs.json:\n" + JSON.stringify(obj[k], null, 3);
						}
						for(var m = 0; m < objIDs.length; m++) {
							if(objIDs[m] === obj[k].id) {
								throw "ERROR: Duplicate ID in inputs.json \"" + obj[k].id + "\"";
							}
						}
						objIDs.push(obj[k].id);
						if(obj[k].type === "int") {
							html += obj[k].name + "<input type='number' class='int' max='" + obj[k].max + "' min='" + obj[k].min + "' id='" + obj[k].id + "' name='" + obj[k].id + "' " + required + "/><br/>";
						} else if(obj[k].type === "dropdown") {
							html += obj[k].name + "<select class='dropdown' id='" + obj[k].id + "' name='" + obj[k].id + "' " + required + ">";
							for(var i = 0; i < obj[k].options.length; i++) {
								html += "<option value='" + obj[k].options[i].value + "'>" + obj[k].options[i].optionName + "</option>";
							}
							html += "</select><br/>";
						} else if(obj[k].type === "string") {
							html += obj[k].name + "<input type='text' class='string' max='" + obj[k].max + "' min='" + obj[k].min + "' id='" + obj[k].id + "' name='" + obj[k].id + "' " + required + "/><br/>";
						} else if(obj[k].type === "longString") {
							html += obj[k].name + "<textarea class='longString' maxlength='" + obj[k].max + "' minlength='" + obj[k].min + "' id='" + obj[k].id + "' name='" + obj[k].id + "' " + required + "></textarea><br/>";
						} else if(obj[k].type === "checkbox") {
							html += "<input type='checkbox' id='" + obj[k].id + "' name='" + obj[k].id + "'/>" + obj[k].name + "<br/>";
						}
					}
				} else {
					if(!obj.type && obj.name) {
						html += "<b>" + obj.name + "</b><br/>";
					} else if(obj.type && obj !== prevobj) {
						//console.log(obj);
						html += "<b>" + obj.name + "</b><br>";
					}
					prevobj = obj;
				}
			}
			html += "</div>";
		}
		recur(obj, 0);
		var returnHTML = JSON.parse(JSON.stringify(html));
		html = "";
		objIDs = [];
		return returnHTML;
	},
	generateAnalysisHTML: function(obj) {
		function recur(obj) {
			for(var k in obj) {
				if(typeof obj[k] == "object" && obj[k] !== null) {
					if(!obj[k].type) {
						recur(obj[k]);
					} else {
						for(var m = 0; m < objIDs.length; m++) {
							if(objIDs[m] === obj[k].id) {
								throw "ERROR: Duplicate ID in inputs.json \"" + obj[k].id + "\"";
							}
						}
						objIDs.push(obj[k].id);
						//console.log(obj[k].id);
						if(obj[k].type === "int") {
							html += obj[k].name + "<input type='text' class='int' id='" + obj[k].id + "' name='" + obj[k].id + "' " + "/><br/>";
						} else if(obj[k].type === "dropdown") {
							html += obj[k].name + "<select class='select' id='" + obj[k].id + "' name='" + obj[k].id + "' " + ">";
							html += "<option value='' selected='selected'></option>";
							for(var i = 0; i < obj[k].options.length; i++) {
								html += "<option value='" + obj[k].options[i].value + "'>" + obj[k].options[i].optionName + "</option>";
							}
							html += "</select><br/>";
						} else if(obj[k].type === "string") {
							html += obj[k].name + "<input class='string' type='text' id='" + obj[k].id + "' name='" + obj[k].id + "' " + "/><br/>";
						} else if(obj[k].type === "longString") {
							html += obj[k].name + "<textarea class='longString' maxlength='" + obj[k].max + "' minlength='" + obj[k].min + "' id='" + obj[k].id + "' name='" + obj[k].id + "' " + "></textarea><br/>";
						} else if(obj[k].type === "checkbox") {
							html += "<input type='checkbox' id='" + obj[k].id + "' name='" + obj[k].id + "'/>" + obj[k].name + "<br/>";
						}
					}
				} else {
					if(!obj.type && obj.name) {
						html += "<b>" + obj.name + "</b><br/>";
					} else if(obj.type && obj !== prevobj) {
						//console.log(obj);
						html += "<b>" + obj.name + "</b><br>";
					}
					prevobj = obj;
				}
			}
		}
		recur(obj);
		var returnHTML = JSON.parse(JSON.stringify(html));
		html = "";
		objIDs = [];
		return returnHTML;
	}
}